import { NextFunction, Request, Response } from 'express';
import userModel, { IUser } from '../models/users_model';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Document } from 'mongoose';

const SALT_ROUNDS = 10;

type tTokens = {
    accessToken: string;
    refreshToken: string;
};

type tUser = Document<unknown, {}, IUser> & IUser & { _id: string };


const generateToken = (userId: string): tTokens | null => {
    const secret = process.env.TOKEN_SECRET;
    const accessExpires = process.env.TOKEN_EXPIRES;
    const refreshExpires = process.env.REFRESH_TOKEN_EXPIRES;

    if (!secret || !accessExpires || !refreshExpires) return null;

    const random = Math.random().toString();
    const payload: JwtPayload = { _id: userId, random };

    return {
        accessToken: jwt.sign(payload, secret, { expiresIn: accessExpires }),
        refreshToken: jwt.sign(payload, secret, { expiresIn: refreshExpires })
    };
};

const register = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password }: { email: string; password: string } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await userModel.create({ email, password: hashedPassword });

        return res.status(201).json({ message: 'User registered successfully.', user });
    } catch (err) {
        return res.status(500).json({ message: 'Error registering user.', error: err });
    }
};

const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password }: { email: string; password: string } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await userModel.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const tokens = generateToken(user._id);
        if (!tokens) {
            return res.status(500).json({ message: 'Token generation failed.' });
        }

        user.refreshToken = [...(user.refreshToken || []), tokens.refreshToken];
        await user.save();

        return res.status(200).json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            userId: user._id
        });
    } catch (err) {
        return res.status(500).json({ message: 'Error logging in.', error: err });
    }
};

const verifyRefreshToken = async (refreshToken: string): Promise<tUser> => {
    const secret = process.env.TOKEN_SECRET;
    if (!secret) throw new Error('Token secret is not defined.');

    const payload = jwt.verify(refreshToken, secret) as JwtPayload;
    const user = await userModel.findById(payload._id);

    if (!user || !user.refreshToken?.includes(refreshToken)) {
        throw new Error('Invalid refresh token.');
    }

    user.refreshToken = user.refreshToken.filter(token => token !== refreshToken);
    await user.save();

    return user;
};

const logout = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { refreshToken }: { refreshToken: string } = req.body;
        if (!refreshToken) return res.status(400).json({ message: 'Refresh token is required.' });

        await verifyRefreshToken(refreshToken);
        return res.status(200).json({ message: 'Logged out successfully.' });
    } catch (err) {
        return res.status(400).json({ message: 'Error during logout.', error: err.message });
    }
};

const refresh = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { refreshToken }: { refreshToken: string } = req.body;
        if (!refreshToken) return res.status(400).json({ message: 'Refresh token is required.' });

        const user = await verifyRefreshToken(refreshToken);
        const tokens = generateToken(user._id);

        if (!tokens) return res.status(500).json({ message: 'Token generation failed.' });

        user.refreshToken = [...(user.refreshToken || []), tokens.refreshToken];
        await user.save();

        return res.status(200).json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            userId: user._id
        });
    } catch (err) {
        return res.status(400).json({ message: 'Error refreshing token.', error: err.message });
    }
};

// Middleware to protect routes
const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authorization = req.header('Authorization');
    const token = authorization?.split(' ')[1];
    const secret = process.env.TOKEN_SECRET;

    if (!token || !secret) {
        res.status(401).json({ message: 'Access denied.' });
        return;
    }

    jwt.verify(token, secret, (err, payload) => {
        if (err) {
            res.status(401).json({ message: 'Invalid token.' });
            return;
        }
        req.params.userId = (payload as JwtPayload)._id;
        next();
    });
};

export default {
    register,
    login,
    refresh,
    logout,
    authMiddleware
};
