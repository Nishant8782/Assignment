import cloudinary from '../middlewares/cloudinary.js';
import Leave from '../models/leaves.model.js';
import fs from 'fs/promises';

// GET all leaves
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaves', error });
  }
};

// POST create new leave
export const createLeave = async (req, res) => {
    try {
      const {
        employeeName,
        designation,
        leaveDate,
        reason
      } = req.body;
  
      const documentFile = req.file;
  
      if (!documentFile || documentFile.mimetype !== 'application/pdf') {
        return res.status(400).json({ message: 'Please upload a valid PDF file.' });
      }
  
      const result = await cloudinary.uploader.upload(documentFile.path, {
        resource_type: 'raw', // Use raw for non-image files like PDF
        public_id: `leave-documents/${employeeName}-${Date.now()}`,
        access_control: [
          {
            access_type: 'anonymous',
          },
        ],
      });
  
      await fs.unlink(documentFile.path); // Remove local temp file
  
      const newLeave = new Leave({
        employeeName,
        designation,
        leaveDate,
        reason,
        document: result.secure_url
      });
  
      await newLeave.save();
  
      res.status(201).json({
        message: 'Leave request created successfully!',
        leave: newLeave
      });
    } catch (err) {
      console.error('Error creating leave:', err);
      res.status(500).json({ message: 'Failed to create leave.' });
    }
  };

// PATCH update leave status
export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'rejected', 'approved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedLeave = await Leave.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedLeave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    res.status(200).json(updatedLeave);
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error });
  }
};
