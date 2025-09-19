import uploadOnCloudinary from "../config/cloudinary";
import Course from "../models/courseModel";

export const createCourse = async (req, res) => {
    try {
        const { title, category, description } = req.body;

        if (!title || !category) {
            return res.status(400).json({ message: "Title and category are required." });
        }

        const course = await Course.create({
            title,
            description,
            category,
            creator: req.userId,
        });

        return res.status(201).json(course);
    } catch (error) {
        return res.status(500).json({ message: `CreateCourse error: ${error.message}` });
    }
};

export const getPublishedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ ispublished: true });

        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: "No published courses found." });
        }

        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).json({ message: `Failed to get published courses: ${error.message}` });
    }
};

export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.userId;
        const courses = await Course.find({ creator: userId });

        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: "No courses found for this creator." });
        }

        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).json({ message: `Failed to get creator courses: ${error.message}` });
    }
};

export const editCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, subTitle, description, category, level, ispublished, price } = req.body;

        let thumbnail;

        if (req.file) {
            const uploaded = await uploadOnCloudinary(req.file.path);
            thumbnail = uploaded?.url;
        }

        let course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        const updateData = {
            ...(title && { title }),
            ...(subTitle && { subTitle }),
            ...(description && { description }),
            ...(category && { category }),
            ...(level && { level }),
            ...(typeof ispublished !== "undefined" && { ispublished }),
            ...(price && { price }),
            ...(thumbnail && { thumbnail }),
        };

        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

        return res.status(200).json(course);
    } catch (error) {
        return res.status(500).json({ message: `Failed to edit course: ${error.message}` });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        return res.status(200).json(course);
    } catch (error) {
        return res.status(500).json({ message: `Failed to get course by ID: ${error.message}` });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({ message: "Course deleted successfully." });
    } catch (error) {
        return res.status(500).json({ message: `Failed to delete course: ${error.message}` });
    }
};
