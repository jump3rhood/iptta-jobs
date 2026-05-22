import express from 'express';
import Job from '../models/Job.js';

const router = express.Router();

// GET /api/approve/:token — one-click approve from email link
router.get('/:token', async (req, res) => {
  try {
    const job = await Job.findOne({ approveToken: req.params.token, status: 'pending' });
    if (!job) return res.status(404).send('Invalid or expired approval link.');

    job.status = 'active';
    job.approvedAt = new Date();
    job.expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // 60 days
    job.approveToken = null;
    await job.save();

    res.send('Job approved and is now live.');
  } catch (err) {
    res.status(500).send('Server error.');
  }
});

// GET /api/approve/:token/reject — one-click reject from email link
router.get('/:token/reject', async (req, res) => {
  try {
    const job = await Job.findOne({ approveToken: req.params.token, status: 'pending' });
    if (!job) return res.status(404).send('Invalid or expired link.');

    job.status = 'rejected';
    job.approveToken = null;
    await job.save();

    res.send('Job has been rejected.');
  } catch (err) {
    res.status(500).send('Server error.');
  }
});

export default router;
