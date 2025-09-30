import { Router } from 'express';

import {
    addComment,
    deleteComment,
    updateComment,
} from "../controllers/comment.controller.js"


import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file


router.route('/add/:videoId').post(addComment)
router.route('/update/:commentId').patch(updateComment)
router.route('/delete/:commentId').delete(deleteComment)




export default router