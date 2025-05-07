import Candidate from '../models/candidate.model.js';
import cloudinary from '../middlewares/cloudinary.js';
import fs from 'fs/promises';

// 1. Get all candidates
export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching candidates' });
  }
};




export const addCandidate = async (req, res) => {
  try {
    const {
      candidate_name,
      email,
      phone_number,
      position,
      experience
    } = req.body;

    const resumeFile = req.file;
    if (!resumeFile || resumeFile.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'Please upload a valid PDF file.' });
    }
    console.log('Uploaded file mimetype:', resumeFile.mimetype);

    const result = await cloudinary.uploader.upload(resumeFile.path, {
      resource_type: 'auto',
      public_id: `resumes/${candidate_name}-${Date.now()}`,
      access_control: [
        {
          access_type: 'anonymous',
        },
      ],
    });
    await fs.unlink(resumeFile.path);
    const resumeUrl = result.secure_url;

    const newCandidate = new Candidate({
      candidate_name,
      email,
      phone_number,
      position,
      experience,
      resume: resumeUrl,
    });

    await newCandidate.save();

    res.status(201).json({
      message: 'Candidate added successfully!',
      candidate: {
        _id: newCandidate._id,
        candidate_name,
        email,
        phone_number,
        position,
        experience,
        resume: resumeUrl,
      },
    });
  } catch (err) {
    console.error('Error adding candidate:', err);
    res.status(500).json({ message: 'Failed to add candidate.' });
  }
};




// 3. Change candidate status
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'selected', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const candidate = await Candidate.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.status(200).json({
      message: 'Status updated successfully',
      candidate
    });
  } catch (err) {
    res.status(400).json({ message: 'Error updating status' });
  }
};

// 4. Delete a candidate
export const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findByIdAndDelete(id);

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.status(200).json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting candidate' });
  }
};

// 5. Get candidates with status 'selected'
export const getSelectedCandidates = async (req, res) => {
  try {
    const selectedCandidates = await Candidate.find({ status: 'selected' });
    res.status(200).json(selectedCandidates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching selected candidates' });
  }
};

// 6. Edit candidate profile
export const editCandidateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullname,
      email,
      phonenumber,
      department,
      position,
      date_of_joining
    } = req.body;

    if (!fullname || !email || !phonenumber || !position) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Check for duplicate email
    if (email !== candidate.email) {
      const existingEmail = await Candidate.findOne({ email });
      if (existingEmail) {
        return res.status(409).json({ message: 'Email already in use' });
      }
    }

    // Check for duplicate phone
    if (phonenumber !== candidate.phone_number) {
      const existingPhone = await Candidate.findOne({ phone_number: phonenumber });
      if (existingPhone) {
        return res.status(409).json({ message: 'Phone number already in use' });
      }
    }

    candidate.candidate_name = fullname;
    candidate.email = email;
    candidate.phone_number = phonenumber;
    candidate.department = department || candidate.department;
    candidate.position = position;
    candidate.date_of_joining = date_of_joining || candidate.date_of_joining;

    await candidate.save();

    res.status(200).json({
      message: 'Candidate profile updated successfully',
      candidate
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating candidate profile' });
  }
};
