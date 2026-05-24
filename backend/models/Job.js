import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  // School Info
  schoolName:     { type: String, required: true },
  city:           { type: String, required: true },
  contactPerson:  { type: String, required: true },
  contactEmail:   { type: String, required: true },
  contactPhone:   { type: String, required: true },
  whatsappNumber: { type: String },

  // Job Details
  jobTitle:           { type: String, required: true },
  roleType:           { type: String, enum: ['kindergarten', 'primary', 'subject', 'montessori', 'other'], required: true },
  roleTypeOther:      { type: String },
  subject:            { type: String },
  jobType:            { type: String, enum: ['fulltime', 'parttime', 'substitute'], required: true },
  experienceRequired: { type: Number, min: 0, required: true },
  salaryMin:          { type: Number },
  salaryMax:          { type: Number },
  workingHoursFrom:   { type: String },
  workingHoursTo:     { type: String },
  workingDays:        { type: String },
  joiningDate:        { type: Date },
  description:        { type: String },
  certifications:     [{ type: String }],

  // System
  status:       { type: String, enum: ['pending', 'active', 'rejected', 'expired'], default: 'pending' },
  approveToken: { type: String },
  submittedAt:  { type: Date, default: Date.now },
  approvedAt:   { type: Date },
  expiresAt:    { type: Date },
});

export default mongoose.model('Job', jobSchema);
