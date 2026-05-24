import express from 'express'
import { randomUUID } from 'crypto'
import MagicLink from '../models/MagicLink.js'
import Job from '../models/Job.js'
import { sendApprovalEmail } from '../utils/email.js'

const router = express.Router()

// GET /api/magic/:token — validate link and return current state
router.get('/:token', async (req, res) => {
  try {
    const link = await MagicLink.findOne({ token: req.params.token })
    console.log(link)
    if (!link) return res.json({ valid: false, reason: 'not_found' })
    if (link.expiresAt < new Date())
      return res.json({ valid: false, reason: 'expired' })

    let job = null
    if (link.jobId) {
      job = await Job.findById(link.jobId)
    }

    res.json({
      valid: true,
      callerName: link.callerName,
      callerPhone: link.callerPhone,
      expiresAt: link.expiresAt,
      job,
    })
  } catch (err) {
    res.status(500).json({ valid: false, reason: 'server_error' })
  }
})

// POST /api/magic/:token — submit a new job (one per link)
router.post('/:token', async (req, res) => {
  try {
    const link = await MagicLink.findOne({ token: req.params.token })
    if (!link) return res.status(404).json({ message: 'Invalid link' })
    if (link.expiresAt < new Date())
      return res.status(400).json({ message: 'This link has expired.' })
    if (link.jobId)
      return res
        .status(400)
        .json({ message: 'A job has already been submitted with this link.' })

    const approveToken = randomUUID()
    const job = await Job.create({
      ...req.body,
      approveToken,
      status: 'pending',
    })
    await sendApprovalEmail(job)

    link.jobId = job._id
    await link.save()

    res
      .status(201)
      .json({ message: 'Job submitted successfully', jobId: job._id })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT /api/magic/:token — edit the submitted job within the 12h window
router.put('/:token', async (req, res) => {
  try {
    const link = await MagicLink.findOne({ token: req.params.token })
    if (!link) return res.status(404).json({ message: 'Invalid link' })
    if (link.expiresAt < new Date())
      return res
        .status(400)
        .json({ message: 'Edit window has closed (12 hours expired).' })
    if (!link.jobId)
      return res
        .status(400)
        .json({ message: 'No job has been submitted with this link yet.' })

    const job = await Job.findById(link.jobId)
    if (!job) return res.status(404).json({ message: 'Job not found.' })
    if (job.status !== 'pending')
      return res
        .status(400)
        .json({
          message: 'This job has already been reviewed and cannot be edited.',
        })

    const updated = await Job.findByIdAndUpdate(link.jobId, req.body, {
      new: true,
      runValidators: true,
    })
    res.json({ message: 'Job updated successfully', job: updated })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

export default router
