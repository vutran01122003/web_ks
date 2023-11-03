const Post = require("../models/post.model");

class PostService {
    static createPost = async ({ data }) => {
        try {
            const { title, content, viewedFaculty, tags } = data;

            console.log({ title, content });
            if (!title || !content) {
                return {
                    code: 400,
                    status: "failed",
                    msg: "Thiếu trường cần thiết",
                };
            }

            const duplicate = await Post.findOne({
                title,
                content,
                viewedFaculty,
                tags,
            }).exec();

            if (duplicate) {
                return {
                    code: 409,
                    status: "failed",
                    msg: "Bài đăng đã bị trùng",
                };
            }

            const post = await Post.create({
                title,
                content,
                viewedFaculty,
                tags,
            });

            if (post) {
                return post;
            } else {
                return {
                    code: 400,
                    status: "failed",
                    msg: "Thêm bài đăng thất bại",
                };
            }
        } catch (error) {
            throw error;
        }
    };

    static getAllPost = async () => {
        try {
            const posts = await Post.find().lean().exec();

            return posts;
        } catch (error) {
            throw Error;
        }
    };

    static getPost = async ({ id }) => {
        console.log(id);
        const post = await Post.findById(id).lean().exec();

        return post;
    };

    static updatePost = async ({ data }) => {
        try {
            const { id, title, content, viewedFaculty, tags } = data;

            if (!id) {
                return {
                    code: 400,
                    status: "failed",
                    msg: "Không có trường id để cập nhật",
                };
            }

            const post = await Post.findByIdAndUpdate(
                { _id: id },
                {
                    title,
                    content,
                    viewedFaculty,
                    tags,
                },
                { new: true }
            )
                .lean()
                .exec();

            if (!post) {
                return {
                    code: 400,
                    status: failed,
                    msg: "Không có bài đăng cần cập nhật",
                };
            }

            return {
                code: 200,
                status: "success",
                msg: `Cập nhật thành công bài viết có id: ${id} với tên bài viết là: ${title}`,
                data: post,
            };
        } catch (error) {
            throw Error;
        }
    };

    static deletePost = async ({ id }) => {
        if (!id) {
            return {
                code: 400,
                status: "failed",
                msg: "Thiếu id không thể truy xuất được",
            };
        }

        const post = await Post.deleteOne(id);

        if (!post) {
            return {
                code: 400,
                status: "failed",
                msg: "Không có bài viết này",
            };
        }

        return {
            code: 200,
            status: "success",
            msg: `Xóa bài viết có id: ${JSON.stringify(id)}`,
        };
    };
}

module.exports = PostService;
