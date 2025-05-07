import mongoose from 'mongoose';


const candidateSchema = new mongoose.Schema({
  candidate_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone_number: {
    type: String,
    required: true,
    
  },
  position: {
    type: String,
  
  },
  department: {
    type: String,
  },
  resume: {
    type: String,
  },
  status: {
    type: String,
    enum: ['new', 'selected', 'rejected'],
    default: 'new'
  },
  experience: {
    type: Number,
  },
  date_of_joining: {
    type: Date,
  }
  
}, {
  timestamps: true
});


const Candidate = mongoose.model('Candidate', candidateSchema);
export default Candidate;
