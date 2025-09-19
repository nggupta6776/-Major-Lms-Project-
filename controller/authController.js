import userModel from '../models/userModel.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import generateToken from '../config/token.js';
import SendMail from '../config/sendMail.js';

// SIGNUP
export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Validate role
        const validRoles = ["admin", "user", "student", "educator"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role provided." });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters." });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({ message: "User created successfully", user });

    } catch (error) {
        res.status(500).json({ message: `Signup error: ${error.message}` });
    }
};

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ message: "Login successful", user });

    } catch (error) {
        res.status(500).json({ message: `Login error: ${error.message}` });
    }
};

// LOGOUT
export const logout = (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: `Logout error: ${error.message}` });
    }
};

// SEND OTP
export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        user.resetotp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
        user.otpVerified = false;

        await user.save();

        await SendMail(email, otp);

        return res.status(200).json({ message: "OTP sent successfully" });

    } catch (error) {
        console.error("sendOTP error:", error);
        res.status(500).json({ message: `send otp error: ${error.message}` });
    }
};

// VERIFY OTP
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (
            user.resetotp !== otp ||
            !user.otpExpires ||
            user.otpExpires < Date.now()
        ) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.otpVerified = true;
        user.resetotp = undefined;
        user.otpExpires = undefined;

        await user.save();

        return res.status(200).json({ message: "OTP verified successfully" });

    } catch (error) {
        console.error("verifyOTP error:", error);
        res.status(500).json({ message: `verify otp error: ${error.message}` });
    }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user || !user.otpVerified) {
            return res.status(403).json({ message: "OTP verification is required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.otpVerified = false;

        await user.save();

        return res.status(200).json({ message: "Password reset successfully" });

    } catch (error) {
        console.error("resetPassword error:", error);
        res.status(500).json({ message: `reset password error: ${error.message}` });
    }
};

// GOOGLE AUTH
export const googleAuth = async (req, res) => {
    try {
        const { name, email, role } = req.body;

        if (!name || !email || !role) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const validRoles = ["admin", "user", "student", "educator"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role provided." });
        }

        let user = await userModel.findOne({ email });

        if (!user) {
            user = await userModel.create({
                name,
                email,
                role: role || 'student',
                password: '',
            });
        }

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ message: "Google signup successful", user });

    } catch (error) {
        console.error("GoogleAuth error:", error);
        res.status(500).json({ message: `GoogleAuth error: ${error.message}` });
    }
};
