import express from 'express';
import { randomUUID } from 'crypto';
import Job from '../models/Job.js';
import { sendApprovalEmail } from '../utils/email.js';

const router = express.Router();

// GET /api/jobs — public listing (active jobs only, newest first)
router.get('/', async (req, res) => {
  try {
    const { roleType, city, jobType, search } = req.query;
    const filter = { status: 'active' };

    if (roleType) filter.roleType = roleType;
    if (city) filter.city = new RegExp(city, 'i');
    if (jobType) filter.jobType = jobType;
    if (search) {
      filter.$or = [
        { jobTitle: new RegExp(search, 'i') },
        { schoolName: new RegExp(search, 'i') },
      ];
    }

    const jobs = await Job.find(filter)
      .select('jobTitle schoolName city roleType jobType salaryRange submittedAt')
      .sort({ submittedAt: -1 });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/jobs/:id — public job detail
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, status: 'active' });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/jobs — submit a new job (public)
router.post('/', async (req, res) => {
  try {
    const approveToken = randomUUID();
    const job = await Job.create({ ...req.body, approveToken, status: 'pending' });
    await sendApprovalEmail(job);
    res.status(201).json({ message: 'Job submitted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
