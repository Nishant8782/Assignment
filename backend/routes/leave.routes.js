import express from 'express';
import {
  getAllLeaves,
  createLeave,
  updateLeaveStatus
} from '../controllers/leave.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Multer setup
const storage = multer.diskStorage({
  destination: 'uploads/',
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

const router = express.Router();
router.use(authMiddleware);

router.get('/get-leaves', getAllLeaves);
router.post('/add-leave', upload.single('document'), createLeave);
router.patch('/:id/status', updateLeaveStatus);

export default router;
