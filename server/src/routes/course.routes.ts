import { Router } from 'express';
import { createCourse, getInstructorCourses } from '../controllers/course.controller.js';
import { addLesson } from '../controllers/lesson.controller.js';
import { protect } from '../middlewares/auth.middleware.js'; 
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

router.post('/', protect, authorizeRoles('INSTRUCTOR', 'ADMIN'), createCourse);

router.get('/my-courses', protect, authorizeRoles('INSTRUCTOR'), getInstructorCourses);

router.post('/:courseId/lessons', protect, authorizeRoles('INSTRUCTOR'), addLesson);

export default router;