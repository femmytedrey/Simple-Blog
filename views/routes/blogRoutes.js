const express = require("express");
const blogController = require('../../controllers/blogController')

const router = express.Router();

router.get("/", blogController.blog_index);

//postId
router.post("/", blogController.blog_create_post);

router.get("/create", blogController.blog_create_get);

//singleId
router.get("/:id", blogController.blog_details);

//deleteBlog
router.delete("/:id", blogController.blog_delete);

module.exports = router;
