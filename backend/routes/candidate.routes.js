import express from 'express';
import {
  getAllCandidates,
  addCandidate,
  updateStatus,
  deleteCandidate,
  getSelectedCandidates,
  editCandidateProfile
} from '../controllers/candidate.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

import multer from 'multer';
import path from 'path';

const router = express.Router();
router.use(authMiddleware)

// Multer config
const storage = multer.diskStorage({
  destination: 'uploads/', // ⬅️ Add this line
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const fileFilter = (req, file, cb) => {
  if (path.extname(file.originalname).toLowerCase() === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });


router.get('/get-candidates', getAllCandidates);
router.post('/add-candidate',upload.single('resume'), addCandidate);
router.patch('/:id/status', updateStatus);
router.delete('/delete/:id', deleteCandidate);
router.get('/selected', getSelectedCandidates);
router.put('/:id/edit', editCandidateProfile);

export default router;
