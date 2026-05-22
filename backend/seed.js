import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import Job from './models/Job.js';

dotenv.config();

const jobs = JSON.parse(readFileSync('./data/sampleJobs.json', 'utf-8'));

await mongoose.connect(process.env.MONGODB_URI);
console.log('Connected to MongoDB');

await Job.deleteMany({ status: 'active' });
console.log('Cleared existing active jobs');

await Job.insertMany(
  jobs.map((job) => ({
    ...job,
    submittedAt: new Date(),
    approvedAt: new Date(),
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  }))
);
console.log(`Seeded ${jobs.length} jobs`);

await mongoose.disconnect();
