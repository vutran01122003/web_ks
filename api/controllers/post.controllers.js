const PostService = require("../services/post.service");

class PostControllers {
    createPost = async (req, res, next) => {
        try {
            const post = await PostService.createPost({ data: req.body });

            res.status(201).json(post);
        } catch (error) {
            next(error);
        }
    };
    getAllPost = async (req, res, next) => {
        try {
            const posts = await PostService.getAllPost();

            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    };
    getPost = async (req, res, next) => {
        try {
            const post = await PostService.getPost({ id: req.params.id });

            res.status(200).json(post);
        } catch (error) {
            next(error);
        }
    };
    updatePost = async (req, res, next) => {
        try {
            const post = await PostService.updatePost({ data: req.body });

            res.status(200).json(post);
        } catch (error) {
            next(error);
        }
    };
    deletePost = async (req, res, next) => {
        const post = await PostService.deletePost({ id: req.body });

        res.status(200).json(post);
    };
}

module.exports = new PostControllers();
