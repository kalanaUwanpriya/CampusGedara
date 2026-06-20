import express from 'express';
import {
    getMaterials,
    getMaterialById,
    getMyMaterials,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    bookmarkMaterial,
    addComment,
    summarizeMaterial,
    rateMaterial,
} from '../controllers/studyMaterialController.js';

const router = express.Router();

router.route('/').get(getMaterials).post(createMaterial);
router.route('/user/:userId').get(getMyMaterials);
router.route('/material/:id').get(getMaterialById);
router.route('/:id').put(updateMaterial).delete(deleteMaterial);
router.route('/:id/summarize').post(summarizeMaterial);
router.route('/:id/rate').post(rateMaterial);
router.get('/:groupId', getMaterials);
router.delete('/:id', deleteMaterial);
router.route('/:id/bookmark').post(bookmarkMaterial);
router.route('/:id/comments').post(addComment);

export default router;
