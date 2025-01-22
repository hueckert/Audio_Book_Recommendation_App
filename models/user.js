const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Fiction', 'Non-Fiction', 'Novel', 'Romance', "Children's book", "Biography", "Autobiography", "Mystery", "Art", "History", "Politics", "Thrillers", "Academic","Other"],
    },
    link: {
        type: String,
    },
    comment: {
        type: String,
        required: true
    },
    likes: {
        type: Array,
    }
});

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    books: [bookSchema],
});

const User = mongoose.model("User", userSchema);
module.exports = User;