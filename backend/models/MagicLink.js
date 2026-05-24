import mongoose from 'mongoose';

const magicLinkSchema = new mongoose.Schema({
  callerName:  { type: String, required: true },
  callerPhone: { type: String, required: true },
  token:       { type: String, required: true, unique: true },
  expiresAt:   { type: Date, required: true },
  jobId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Job', default: null },
  createdAt:   { type: Date, default: Date.now },
});

export default mongoose.model('MagicLink', magicLinkSchema);
