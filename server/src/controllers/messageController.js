const Message = require('../models/Message');

const sendMessage = async (req, res) => {
    try {
        const { receiver, text } = req.body;
        const message = new Message({
            sender: req.user._id,
            receiver,
            text
        });
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: req.params.userId },
                { sender: req.params.userId, receiver: req.user._id }
            ]
        }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { sendMessage, getMessages };
