import { useState } from 'react';

const CERTIFICATIONS = ['Montessori Certification', 'B.Ed', 'D.El.Ed', 'CTET/STET', 'NTT', 'ECCEd'];

const ROLE_OPTIONS = [
  { value: 'kindergarten', label: 'Kindergarten' },
  { value: 'primary', label: 'Primary' },
  { value: 'subject', label: 'Subject Teacher' },
  { value: 'montessori', label: 'Montessori' },
  { value: 'other', label: 'Other' },
];

const JOB_TYPE_OPTIONS = [
  { value: 'fulltime', label: 'Full-time' },
  { value: 'parttime', label: 'Part-time' },
  { value: 'substitute', label: 'Substitute' },
];

function stripCountryCode(phone) {
  if (!phone) return '';
  return phone.replace(/^\+91\s*/, '').replace(/\D/g, '');
}

function toFormValues(job) {
  if (!job) return {};
  return {
    schoolName: job.schoolName ?? '',
    city: job.city ?? '',
    contactPerson: job.contactPerson ?? '',
    contactEmail: job.contactEmail ?? '',
    contactPhone: stripCountryCode(job.contactPhone),
    whatsappNumber: job.whatsappNumber ?? '',
    jobTitle: job.jobTitle ?? '',
    roleType: job.roleType ?? '',
    roleTypeOther: job.roleTypeOther ?? '',
    subject: job.subject ?? '',
    jobType: job.jobType ?? '',
    experienceRequired: job.experienceRequired?.toString() ?? '',
    salaryMin: job.salaryMin?.toString() ?? '',
    salaryMax: job.salaryMax?.toString() ?? '',
    workingHoursFrom: job.workingHoursFrom ?? '',
    workingHoursTo: job.workingHoursTo ?? '',
    workingDays: job.workingDays ?? '',
    joiningDate: job.joiningDate ? new Date(job.joiningDate).toISOString().split('T')[0] : '',
    description: job.description ?? '',
    certifications: job.certifications ?? [],
  };
}

function validate(data) {
  const errors = {};
  const today = new Date().toISOString().split('T')[0];

  if (!data.schoolName?.trim()) errors.schoolName = 'School name is required';
  if (!data.city?.trim()) errors.city = 'City is required';
  if (!data.contactPerson?.trim()) errors.contactPerson = 'Contact person is required';
  if (!data.contactEmail?.trim()) {
    errors.contactEmail = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail.trim())) {
    errors.contactEmail = 'Enter a valid email address';
  }
  const phoneDigits = (data.contactPhone || '').replace(/\D/g, '');
  if (!phoneDigits) {
    errors.contactPhone = 'Phone number is required';
  } else if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
    errors.contactPhone = 'Enter a valid 10-digit Indian mobile number (starts with 6–9)';
  }

  if (!data.jobTitle?.trim()) errors.jobTitle = 'Job title is required';
  if (!data.roleType) errors.roleType = 'Role type is required';
  if (data.roleType === 'other' && !data.roleTypeOther?.trim()) {
    errors.roleTypeOther = 'Please specify the role type';
  }
  if (!data.jobType) errors.jobType = 'Job type is required';
  if (data.experienceRequired === '' || data.experienceRequired === undefined || data.experienceRequired === null) {
    errors.experienceRequired = 'Experience is required';
  }
  if (data.salaryMin && !/^\d+$/.test(data.salaryMin)) {
    errors.salaryMin = 'Must be a number (digits only)';
  }
  if (data.salaryMax && !/^\d+$/.test(data.salaryMax)) {
    errors.salaryMax = 'Must be a number (digits only)';
  }
  if (data.salaryMin && data.salaryMax && !/\D/.test(data.salaryMin) && !/\D/.test(data.salaryMax)
    && Number(data.salaryMin) > Number(data.salaryMax)) {
    errors.salaryMax = 'Max salary must be greater than or equal to min salary';
  }
  if (data.joiningDate && data.joiningDate < today) {
    errors.joiningDate = 'Joining date cannot be in the past';
  }
  if (!data.description?.trim()) {
    errors.description = 'Please provide at least a brief job description';
  }

  return errors;
}

const inputCls = 'w-full px-4 py-3 bg-brand-cream border border-brand-blush rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:border-brand-rose transition-colors placeholder-brand-muted/40';
const inputErrCls = 'w-full px-4 py-3 bg-red-50 border border-red-300 rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-red-300/50 focus:border-red-400 transition-colors placeholder-brand-muted/40';
const selectCls = inputCls + ' appearance-none cursor-pointer';
const selectErrCls = inputErrCls + ' appearance-none cursor-pointer';
const labelCls = 'block text-xs font-bold text-brand-muted uppercase tracking-widest mb-1.5';

function FieldError({ msg }) {
  if (!msg) return null;
  return <p data-field-error className="text-xs text-red-500 font-medium mt-1.5">{msg}</p>;
}

function SectionHeader({ accent, title }) {
  return (
    <h2 className="font-display italic font-medium text-lg text-brand-dark flex items-center gap-2 mb-5">
      <span className={`w-1 h-5 ${accent} rounded-full inline-block`}></span>
      {title}
    </h2>
  );
}

export default function JobForm({ initialValues, onSubmit, submitLabel = 'Submit', submitting }) {
  const [data, setData] = useState(() => ({
    schoolName: '', city: '', contactPerson: '', contactEmail: '',
    contactPhone: '', whatsappNumber: '',
    jobTitle: '', roleType: '', roleTypeOther: '', subject: '',
    jobType: '', experienceRequired: '',
    salaryMin: '', salaryMax: '',
    workingHoursFrom: '', workingHoursTo: '',
    workingDays: '',
    joiningDate: '',
    description: '',
    certifications: [],
    ...toFormValues(initialValues),
  }));
  const [errors, setErrors] = useState({});

  const today = new Date().toISOString().split('T')[0];

  const set = (field, value) => {
    setData(d => ({ ...d, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  };

  const toggleCert = (cert) => {
    setData(d => ({
      ...d,
      certifications: d.certifications.includes(cert)
        ? d.certifications.filter(c => c !== cert)
        : [...d.certifications, cert],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(data);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setTimeout(() => {
        document.querySelector('[data-field-error]')?.closest('div')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return;
    }

    const phoneDigits = data.contactPhone.replace(/\D/g, '');
    const payload = {
      ...data,
      contactPhone: `+91${phoneDigits}`,
      experienceRequired: Number(data.experienceRequired),
      salaryMin: data.salaryMin ? Number(data.salaryMin) : undefined,
      salaryMax: data.salaryMax ? Number(data.salaryMax) : undefined,
      roleTypeOther: data.roleType === 'other' ? data.roleTypeOther : undefined,
      joiningDate: data.joiningDate || undefined,
      workingHoursFrom: data.workingHoursFrom || undefined,
      workingHoursTo: data.workingHoursTo || undefined,
      workingDays: data.workingDays || undefined,
      subject: data.subject || undefined,
      whatsappNumber: data.whatsappNumber || undefined,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* ── School Information ─────────────────────────── */}
      <div className="bg-white rounded-2xl border border-brand-blush shadow-sm p-5 mb-5">
        <SectionHeader accent="bg-brand-rose" title="School Information" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div>
            <label className={labelCls}>School Name <span className="text-brand-rose">*</span></label>
            <input
              type="text"
              value={data.schoolName}
              onChange={e => set('schoolName', e.target.value)}
              className={errors.schoolName ? inputErrCls : inputCls}
              placeholder="e.g. Sunrise Public School"
            />
            <FieldError msg={errors.schoolName} />
          </div>

          <div>
            <label className={labelCls}>City <span className="text-brand-rose">*</span></label>
            <input
              type="text"
              value={data.city}
              onChange={e => set('city', e.target.value)}
              className={errors.city ? inputErrCls : inputCls}
              placeholder="e.g. Mumbai"
            />
            <FieldError msg={errors.city} />
          </div>

          <div>
            <label className={labelCls}>Contact Person <span className="text-brand-rose">*</span></label>
            <input
              type="text"
              value={data.contactPerson}
              onChange={e => set('contactPerson', e.target.value)}
              className={errors.contactPerson ? inputErrCls : inputCls}
              placeholder="Principal / HR Name"
            />
            <FieldError msg={errors.contactPerson} />
          </div>

          <div>
            <label className={labelCls}>Contact Email <span className="text-brand-rose">*</span></label>
            <input
              type="email"
              value={data.contactEmail}
              onChange={e => set('contactEmail', e.target.value)}
              className={errors.contactEmail ? inputErrCls : inputCls}
              placeholder="contact@school.edu.in"
            />
            <FieldError msg={errors.contactEmail} />
          </div>

          <div>
            <label className={labelCls}>Phone Number <span className="text-brand-rose">*</span></label>
            <div className="flex">
              <span className={`inline-flex items-center px-3.5 bg-brand-blush/60 border border-r-0 ${errors.contactPhone ? 'border-red-300' : 'border-brand-blush'} rounded-l-xl text-sm font-bold text-brand-muted select-none`}>
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={data.contactPhone}
                onChange={e => set('contactPhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                className={`flex-1 px-4 py-3 ${errors.contactPhone ? 'bg-red-50 border-red-300' : 'bg-brand-cream border-brand-blush'} border rounded-r-xl text-sm font-medium text-brand-dark focus:outline-none focus:ring-2 ${errors.contactPhone ? 'focus:ring-red-300/50 focus:border-red-400' : 'focus:ring-brand-rose/30 focus:border-brand-rose'} transition-colors placeholder-brand-muted/40`}
                placeholder="9876543210"
              />
            </div>
            <FieldError msg={errors.contactPhone} />
          </div>

          <div>
            <label className={labelCls}>WhatsApp Number <span className="text-brand-muted font-medium normal-case tracking-normal">(optional)</span></label>
            <div className="flex">
              <span className="inline-flex items-center px-3.5 bg-brand-blush/60 border border-r-0 border-brand-blush rounded-l-xl text-sm font-bold text-brand-muted select-none">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={data.whatsappNumber}
                onChange={e => set('whatsappNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="flex-1 px-4 py-3 bg-brand-cream border border-brand-blush rounded-r-xl text-sm font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:border-brand-rose transition-colors placeholder-brand-muted/40"
                placeholder="9876543210"
              />
            </div>
          </div>

        </div>
      </div>

      {/* ── Job Details ────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-brand-blush shadow-sm p-5 mb-5">
        <SectionHeader accent="bg-brand-gold" title="Job Details" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="sm:col-span-2">
            <label className={labelCls}>Job Title <span className="text-brand-rose">*</span></label>
            <input
              type="text"
              value={data.jobTitle}
              onChange={e => set('jobTitle', e.target.value)}
              className={errors.jobTitle ? inputErrCls : inputCls}
              placeholder="e.g. Primary School Teacher"
            />
            <FieldError msg={errors.jobTitle} />
          </div>

          <div>
            <label className={labelCls}>Role Type <span className="text-brand-rose">*</span></label>
            <div className="relative">
              <select
                value={data.roleType}
                onChange={e => set('roleType', e.target.value)}
                className={errors.roleType ? selectErrCls : selectCls}
              >
                <option value="">Select role type</option>
                {ROLE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <FieldError msg={errors.roleType} />
          </div>

          {data.roleType === 'other' && (
            <div>
              <label className={labelCls}>Specify Role <span className="text-brand-rose">*</span></label>
              <input
                type="text"
                value={data.roleTypeOther}
                onChange={e => set('roleTypeOther', e.target.value)}
                className={errors.roleTypeOther ? inputErrCls : inputCls}
                placeholder="e.g. Dance Teacher"
              />
              <FieldError msg={errors.roleTypeOther} />
            </div>
          )}

          <div>
            <label className={labelCls}>Subject <span className="text-brand-muted font-medium normal-case tracking-normal">(optional)</span></label>
            <input
              type="text"
              value={data.subject}
              onChange={e => set('subject', e.target.value)}
              className={inputCls}
              placeholder="e.g. Mathematics, Science"
            />
          </div>

          <div>
            <label className={labelCls}>Job Type <span className="text-brand-rose">*</span></label>
            <div className="relative">
              <select
                value={data.jobType}
                onChange={e => set('jobType', e.target.value)}
                className={errors.jobType ? selectErrCls : selectCls}
              >
                <option value="">Select job type</option>
                {JOB_TYPE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <FieldError msg={errors.jobType} />
          </div>

          <div>
            <label className={labelCls}>Experience Required <span className="text-brand-rose">*</span></label>
            <input
              type="number"
              min={0}
              max={30}
              value={data.experienceRequired}
              onChange={e => set('experienceRequired', e.target.value)}
              className={errors.experienceRequired ? inputErrCls : inputCls}
              placeholder="0 for freshers"
            />
            <FieldError msg={errors.experienceRequired} />
          </div>

          <div>
            <label className={labelCls}>Min Salary / Month <span className="text-brand-muted font-medium normal-case tracking-normal">(optional)</span></label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-brand-muted">₹</span>
              <input
                type="text"
                inputMode="numeric"
                value={data.salaryMin}
                onChange={e => set('salaryMin', e.target.value)}
                className={`${errors.salaryMin ? inputErrCls : inputCls} pl-8`}
                placeholder="e.g. 20000"
              />
            </div>
            <FieldError msg={errors.salaryMin} />
          </div>

          <div>
            <label className={labelCls}>Max Salary / Month <span className="text-brand-muted font-medium normal-case tracking-normal">(optional)</span></label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-brand-muted">₹</span>
              <input
                type="text"
                inputMode="numeric"
                value={data.salaryMax}
                onChange={e => set('salaryMax', e.target.value)}
                className={`${errors.salaryMax ? inputErrCls : inputCls} pl-8`}
                placeholder="e.g. 35000"
              />
            </div>
            <FieldError msg={errors.salaryMax} />
          </div>

          <div>
            <label className={labelCls}>Working Hours From <span className="text-brand-muted font-medium normal-case tracking-normal">(optional)</span></label>
            <input
              type="time"
              value={data.workingHoursFrom}
              onChange={e => set('workingHoursFrom', e.target.value)}
              className={inputCls}
            />
            <p className="text-[11px] text-brand-muted font-medium mt-1">24-hour format · Mon – Fri</p>
          </div>

          <div>
            <label className={labelCls}>Working Hours To <span className="text-brand-muted font-medium normal-case tracking-normal">(optional)</span></label>
            <input
              type="time"
              value={data.workingHoursTo}
              onChange={e => set('workingHoursTo', e.target.value)}
              className={inputCls}
            />
            <p className="text-[11px] text-brand-muted font-medium mt-1">24-hour format · Mon – Fri</p>
          </div>

          <div>
            <label className={labelCls}>Working Days <span className="text-brand-muted font-medium normal-case tracking-normal">(optional)</span></label>
            <input
              type="text"
              value={data.workingDays}
              onChange={e => set('workingDays', e.target.value)}
              className={inputCls}
              placeholder="Monday – Friday"
            />
          </div>

          <div>
            <label className={labelCls}>Joining Date <span className="text-brand-muted font-medium normal-case tracking-normal">(optional)</span></label>
            <input
              type="date"
              min={today}
              value={data.joiningDate}
              onChange={e => set('joiningDate', e.target.value)}
              className={errors.joiningDate ? inputErrCls : inputCls}
            />
            <FieldError msg={errors.joiningDate} />
          </div>

        </div>
      </div>

      {/* ── About the Role ─────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-brand-blush shadow-sm p-5 mb-5">
        <SectionHeader accent="bg-emerald-400" title="About the Role" />

        <div className="mb-4">
          <label className={labelCls}>Job Description <span className="text-brand-rose">*</span></label>
          <textarea
            rows={5}
            value={data.description}
            onChange={e => set('description', e.target.value)}
            className={`${errors.description ? inputErrCls : inputCls} resize-none`}
            placeholder="Describe the responsibilities, requirements, and anything else relevant to the role..."
          />
          <FieldError msg={errors.description} />
        </div>

        <div>
          <label className={labelCls}>Certifications Preferred <span className="text-brand-muted font-medium normal-case tracking-normal">(optional)</span></label>
          <div className="flex flex-wrap gap-2 mt-1">
            {CERTIFICATIONS.map(cert => {
              const selected = data.certifications.includes(cert);
              return (
                <button
                  type="button"
                  key={cert}
                  onClick={() => toggleCert(cert)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                    selected
                      ? 'bg-brand-rose text-white border-brand-rose'
                      : 'bg-white text-brand-muted border-brand-blush hover:border-brand-rose/40 hover:text-brand-rose'
                  }`}
                >
                  {cert}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand-rose hover:bg-brand-rose-dark disabled:opacity-60 text-white font-bold py-4 rounded-xl text-sm transition-colors"
      >
        {submitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
