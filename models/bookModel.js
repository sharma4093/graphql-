import mongoose from "mongoose";


const booked_slot_schema = new mongoose.Schema({
    from_time: {
        type: Date,
        default: null,
        required: true
    },
    end_time: {
        type: Date,
        default: null,
        required: true
    }
}, { id: false });

const book_schema = new mongoose.Schema({
    book_name: {
        type: String,
        required: true,
    },
    author: { // auther of the book
        type: String,
        required: true,
        default: null
    },
    time_slot: {
        type: Number,
        default: null,
    },
    status: {
        type: String,
        enum: ["booked", "free", "prebooked"],
        default: "free",

    },
    booked_slots: {
        type: [booked_slot_schema],
        default: []
    }

}, { timestamps: true })


export const book_model = mongoose.model("Book", book_schema)   