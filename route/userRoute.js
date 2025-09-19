import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getCurrentUser, updateprofile } from "../controller/userController.js"
import upload from "../middleware/multer.js"

const userRouter = express.Router()

userRouter.get("/getcurrentuser",isAuth,getCurrentUser)
userRouter.post("/profile",isAuth,upload.single("photoUrl"),updateprofile)

export default userRouter