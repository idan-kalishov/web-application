const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

// Route Definitions
router.post("/", postController.addPost); 
router.get("/data", postController.getAllPosts);
router.get("/:post_id", postController.getPostById); 
router.get("/", postController.getPostsBySender); 
router.put("/:post_id", postController.updatePost); 

module.exports = router;
