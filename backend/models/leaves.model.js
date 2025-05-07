import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  leaveDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  document: {
    type: String, // e.g., Cloudinary URL or file path
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'rejected', 'approved'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Leave = mongoose.model('Leave', leaveSchema);
export default Leave;
