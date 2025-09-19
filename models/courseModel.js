import mongoose from "mongoose"

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: string
    },
    description: {
        type: string
    },
    category: {
        type: String,
        required: true
    },
    level: {
        type: string,
        enum: ["Beginner", "Intermediate", "Advanced"]
    },
    price: {
        type: Number
    },
    thumbnail: {
        type: string
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    lectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture"
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    ispublished: {
        type: Boolean,
        default: false
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]

}, { timestamps: true })

const Course = mongoose.model("Course", courseSchema)

export default Course
