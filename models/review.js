const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,   // Capital N
        min: 1,
        max: 5,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now  // function reference
    },
    author :{
        type : Schema.Types.ObjectId,
        ref : "User",
    }
});

module.exports = mongoose.model("Review", reviewSchema);
