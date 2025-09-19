import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    //  FIXED: Make description optional or remove
    description: {
        type: String,
        required: false,   
        default: ""
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
    type: String,
    enum: ["admin", "user", "student","ecucator"],
    default: "user",
},


    photoUrl: {
        type: String,
        default: ""
    },

    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
    resetotp:{
        type:Date
    },
    otpExpires:{
        type:Date
    },
    isOtpVerifed:{
        type:Boolean,
        default:false
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;

