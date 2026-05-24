import { useState } from 'react';
import { useJobs } from '../context/JobsContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const CERTIFICATIONS = [
  'Montessori Certification',
  'B.Ed',
  'D.El.Ed',
  'CTET/STET',
  'NTT',
  'ECCEd',
];

const initialForm = {
  schoolName: '', city: '', contactPerson: '', contactEmail: '',
  contactPhone: '', whatsappNumber: '',
  jobTitle: '', roleType: '', subject: '', jobType: '', experienceRequired: '',
  salaryRange: '', workingHours: '', workingDays: '', joiningDate: '',
  description: '', certifications: [],
};

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-widest mb-1.5">
        {label} {required && <span className="text-brand-rose">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full px-3 py-2.5 bg-white border border-brand-blush rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:border-brand-rose transition-colors placeholder-brand-muted/40';

function SectionHeader({ num, title }) {
  return (
    <h2 className="font-display italic font-medium text-lg text-brand-dark mb-4 flex items-center gap-3">
      <span className="w-7 h-7 rounded-full bg-brand-rose text-white text-xs font-bold font-sans not-italic flex items-center justify-center flex-shrink-0 shadow-sm">
        {num}
      </span>
      {title}
    </h2>
  );
}

export default function SubmitJob() {
  const { submitJob } = useJobs();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const toggleCert = (cert) => {
    setForm(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        experienceRequired: Number(form.experienceRequired) || 0,
        joiningDate: form.joiningDate || undefined,
      };
      await submitJob(payload);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center animate-fade-up">
        <div className="w-20 h-20 bg-brand-rose-light rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
          <svg className="w-9 h-9 text-brand-rose" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
        <h2 className="font-display italic text-3xl text-brand-dark mb-2">Submission Received!</h2>
        <p className="text-brand-muted text-sm leading-relaxed max-w-sm mx-auto font-medium">
          Your job listing has been sent for review. Our admin will approve it shortly and you'll see it go live on the board.
        </p>
        <button
          onClick={() => { setForm(initialForm); setSuccess(false); }}
          className="mt-7 text-sm text-brand-rose font-bold hover:text-brand-rose-dark transition-colors"
        >
          Submit another job →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-7">
      <div className="mb-7">
        <h1 className="font-display italic font-medium text-3xl sm:text-4xl text-brand-dark">Post a Job</h1>
        <p className="text-sm text-brand-muted mt-2 font-medium">Fill in the details and our admin will review and publish it.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Section 1 */}
        <section className="bg-white rounded-2xl border border-brand-blush shadow-sm p-5">
          <SectionHeader num="1" title="School Information" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="School Name" required>
              <input required className={inputClass} value={form.schoolName}
                onChange={e => set('schoolName', e.target.value)} placeholder="Sunshine International School" />
            </Field>
            <Field label="City" required>
              <input required className={inputClass} value={form.city}
                onChange={e => set('city', e.target.value)} placeholder="Mumbai" />
            </Field>
            <Field label="Contact Person" required>
              <input required className={inputClass} value={form.contactPerson}
                onChange={e => set('contactPerson', e.target.value)} placeholder="Priya Sharma" />
            </Field>
            <Field label="Contact Email" required>
              <input required type="email" className={inputClass} value={form.contactEmail}
                onChange={e => set('contactEmail', e.target.value)} placeholder="hr@school.com" />
            </Field>
            <Field label="Phone Number" required>
              <input required type="tel" className={inputClass} value={form.contactPhone}
                onChange={e => set('contactPhone', e.target.value)} placeholder="+91 98765 43210" />
            </Field>
            <Field label="WhatsApp Number">
              <input type="tel" className={inputClass} value={form.whatsappNumber}
                onChange={e => set('whatsappNumber', e.target.value)} placeholder="Same as phone or leave blank" />
            </Field>
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-white rounded-2xl border border-brand-blush shadow-sm p-5">
          <SectionHeader num="2" title="Job Details" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Job Title" required>
                <input required className={inputClass} value={form.jobTitle}
                  onChange={e => set('jobTitle', e.target.value)} placeholder="Kindergarten Class Teacher" />
              </Field>
            </div>
            <Field label="Role Type" required>
              <select required className={inputClass} value={form.roleType}
                onChange={e => set('roleType', e.target.value)}>
                <option value="">Select role type</option>
                <option value="kindergarten">Kindergarten</option>
                <option value="primary">Primary</option>
                <option value="subject">Subject Teacher</option>
                <option value="montessori">Montessori</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label="Subject (if applicable)">
              <input className={inputClass} value={form.subject}
                onChange={e => set('subject', e.target.value)} placeholder="e.g. Mathematics, Science" />
            </Field>
            <Field label="Job Type" required>
              <select required className={inputClass} value={form.jobType}
                onChange={e => set('jobType', e.target.value)}>
                <option value="">Select job type</option>
                <option value="fulltime">Full-time</option>
                <option value="parttime">Part-time</option>
                <option value="substitute">Substitute</option>
              </select>
            </Field>
            <Field label="Experience Required (years)" required>
              <input required type="number" min="0" max="30" className={inputClass} value={form.experienceRequired}
                onChange={e => set('experienceRequired', e.target.value)} placeholder="0 for freshers" />
            </Field>
            <Field label="Salary Range">
              <input className={inputClass} value={form.salaryRange}
                onChange={e => set('salaryRange', e.target.value)} placeholder="e.g. ₹20,000 – ₹35,000 / month" />
            </Field>
            <Field label="Working Hours">
              <input className={inputClass} value={form.workingHours}
                onChange={e => set('workingHours', e.target.value)} placeholder="e.g. 8:00 AM – 3:00 PM" />
            </Field>
            <Field label="Working Days">
              <input className={inputClass} value={form.workingDays}
                onChange={e => set('workingDays', e.target.value)} placeholder="e.g. Mon – Sat" />
            </Field>
            <Field label="Joining Date">
              <input type="date" className={inputClass} value={form.joiningDate}
                onChange={e => set('joiningDate', e.target.value)} />
            </Field>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-white rounded-2xl border border-brand-blush shadow-sm p-5">
          <SectionHeader num="3" title="About the Role" />
          <div className="flex flex-col gap-4">
            <Field label="Job Description">
              <textarea
                rows={4}
                className={`${inputClass} resize-none`}
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
              />
            </Field>

            <div>
              <p className="text-[11px] font-bold text-brand-muted uppercase tracking-widest mb-2.5">Certifications Required</p>
              <div className="flex flex-wrap gap-2">
                {CERTIFICATIONS.map(cert => (
                  <button
                    key={cert}
                    type="button"
                    onClick={() => toggleCert(cert)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                      form.certifications.includes(cert)
                        ? 'bg-brand-rose border-brand-rose text-white shadow-sm'
                        : 'bg-white border-brand-blush text-brand-muted hover:border-brand-rose hover:text-brand-rose'
                    }`}
                  >
                    {cert}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="bg-brand-rose-light border border-brand-rose/20 rounded-xl px-4 py-3 text-sm text-brand-rose-dark font-medium">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-rose hover:bg-brand-rose-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          {submitting ? (
            <><LoadingSpinner size="sm" /> Submitting...</>
          ) : (
            'Submit Job for Review'
          )}
        </button>
      </form>
    </div>
  );
}
