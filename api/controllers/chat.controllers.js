const modelGemini = require('../config/gemini');
const createError = require('http-errors');
const ChatService = require('../services/chat.service');
const { model, generationConfig, safetySettings } = modelGemini();

class ChatControllers {
    handleChat = async (req, res, next) => {
        try {
            const userInput = req.body.userInput;
            const typeChat = req.body.typeChat;

            if (userInput.length <= 0) throw createError.BadRequest('Dữ liệu vào trống');
            const data = await ChatService.getData(typeChat);

            const parts = [...data.input, { text: `input: ${userInput}` }, { text: 'output: ' }];

            const result = await model.generateContent({
                contents: [{ role: 'user', parts }],
                generationConfig,
                safetySettings
            });

            const response = result.response;
            res.status(200).json({ response: response.text() });
        } catch (error) {
            console.log(error);
            next(error);
        }
    };
}

module.exports = new ChatControllers();
