const Chat = require("../models/chat.model");

class ChatService {
    static getData = async (chatType) => {
        try {
            const chat = await Chat.findOne({ type: chatType }).lean().exec();
            return {
                status: 201,
                msg: "Lấy dữ liệu thành công",
                input: chat.data
            };
        } catch (error) {
            return {
                status: 400,
                msg: "Lấy dữ liệu thất bại",
                data: error
            };
        }
    };
    static getType = async () => {
        try {
            const type = await Chat.find().lean().exec();
            return {
                status: 201,
                msg: "Lấy dữ liệu thành công",
                type
            };
        } catch (error) {
            return {
                status: 400,
                msg: "Lấy dữ liệu thất bại",
                data: error
            };
        }
    };
}

module.exports = ChatService;
