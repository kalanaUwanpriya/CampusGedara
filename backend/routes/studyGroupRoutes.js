import express from 'express';
import {
    getStudyGroups,
    createStudyGroup,
    updateStudyGroup,
    deleteStudyGroup,
} from '../controllers/studyGroupController.js';

const router = express.Router();

router.route('/').get(getStudyGroups).post(createStudyGroup);
router.route('/:id').put(updateStudyGroup).delete(deleteStudyGroup);

export default router;
