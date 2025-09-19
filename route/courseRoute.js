import express from "express"
import { createCourse, getCreatorCourses, getpublishedcourses } from "../controller/courseController.js"
import { isAuth } from "../middleware/authMiddleware.js"
import upload from "../middleware/multer.js"

const courseRouter = express.Router()

courseRouter.post("/create",isAuth, createCourse)
courseRouter.get("/getpublished",getpublishedcourses)
courseRouter.get("/getcreator",isAuth,getCreatorCourses)
courseRouter.post("/editcourse/:courseId", isAuth, upload.single("thumbnail"), editCourse)
courseRouter.get("/getcourse/:courseId", isAuth, getCourseById)
courseRouter.delete("/deletecourse/:courseId", isAuth, deleteCourse)
