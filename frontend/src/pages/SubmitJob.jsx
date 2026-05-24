import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const CERTIFICATIONS = [
  'Montessori Certification',
  'B.Ed',
  'D.El.Ed',
  'CTET/STET',
  'NTT',
  'ECCEd',
]

const blankForm = {
  schoolName: '',
  city: '',
  contactPerson: '',
  contactEmail: '',
  contactPhone: '',
  whatsappNumber: '',
  jobTitle: '',
  roleType: '',
  roleTypeOther: '',
  subject: '',
  jobType: '',
  experienceRequired: '',
  salaryMin: '',
  salaryMax: '',
  workingHoursFrom: '',
  workingHoursTo: '',
  workingDays: '',
  joiningDate: '',
  description: '',
  certifications: [],
}

function formFromJob(j) {
  return {
    schoolName: j.schoolName || '',
    city: j.city || '',
    contactPerson: j.contactPerson || '',
    contactEmail: j.contactEmail || '',
    contactPhone: j.contactPhone || '',
    whatsappNumber: j.whatsappNumber || '',
    jobTitle: j.jobTitle || '',
    roleType: j.roleType || '',
    roleTypeOther: j.roleTypeOther || '',
    subject: j.subject || '',
    jobType: j.jobType || '',
    experienceRequired:
      j.experienceRequired !== undefined ? String(j.experienceRequired) : '',
    salaryMin:
      j.salaryMin !== undefined && j.salaryMin !== null
        ? String(j.salaryMin)
        : '',
    salaryMax:
      j.salaryMax !== undefined && j.salaryMax !== null
        ? String(j.salaryMax)
        : '',
    workingHoursFrom: j.workingHoursFrom || '',
    workingHoursTo: j.workingHoursTo || '',
    workingDays: j.workingDays || '',
    joiningDate: j.joiningDate ? j.joiningDate.split('T')[0] : '',
    description: j.description || '',
    certifications: j.certifications || [],
  }
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className='block text-[11px] font-bold text-brand-muted uppercase tracking-widest mb-1.5'>
        {label} {required && <span className='text-brand-rose'>*</span>}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full px-3 py-2.5 bg-white border border-brand-blush rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:border-brand-rose transition-colors placeholder-brand-muted/40'

function SectionHeader({ num, title }) {
  return (
    <h2 className='font-display italic font-medium text-lg text-brand-dark mb-4 flex items-center gap-3'>
      <span className='w-7 h-7 rounded-full bg-brand-rose text-white text-xs font-bold font-sans not-italic flex items-center justify-center flex-shrink-0 shadow-sm'>
        {num}
      </span>
      {title}
    </h2>
  )
}

export default function SubmitJob() {
  const { token } = useParams()
  const [linkState, setLinkState] = useState({
    loading: true,
    valid: false,
    reason: '',
    job: null,
    callerName: '',
    expiresAt: null,
  })
  const [form, setForm] = useState(blankForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setLinkState({
        loading: false,
        valid: false,
        reason: 'not_found',
        job: null,
        callerName: '',
        expiresAt: null,
      })
      return
    }
    fetch(`${API}/api/magic/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) {
          setLinkState({
            loading: false,
            valid: true,
            reason: '',
            job: data.job,
            callerName: data.callerName,
            expiresAt: data.expiresAt,
          })
          console.log(linkState)
          if (data.job) setForm(formFromJob(data.job))
        } else {
          setLinkState({
            loading: false,
            valid: false,
            reason: data.reason || 'not_found',
            job: null,
            callerName: '',
            expiresAt: null,
          })
        }
      })
      .catch(() => {
        setLinkState({
          loading: false,
          valid: false,
          reason: 'server_error',
          job: null,
          callerName: '',
          expiresAt: null,
        })
      })
  }, [token])

  const isEditMode = !!linkState.job

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const toggleCert = (cert) => {
    setForm((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        experienceRequired: Number(form.experienceRequired) || 0,
        salaryMin: form.salaryMin !== '' ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax !== '' ? Number(form.salaryMax) : undefined,
        joiningDate: form.joiningDate || undefined,
        roleTypeOther:
          form.roleType === 'other' ? form.roleTypeOther : undefined,
      }
      const res = await fetch(`${API}/api/magic/${token}`, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Submission failed')
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (linkState.loading) return <LoadingSpinner size='lg' className='py-24' />

  if (!linkState.valid) {
    const isExpired = linkState.reason === 'expired'
    return (
      <div className='max-w-lg mx-auto px-4 py-20 text-center animate-fade-up'>
        <div className='w-20 h-20 bg-brand-rose-light rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm'>
          <svg
            className='w-9 h-9 text-brand-rose'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </div>
        <h2 className='font-display italic text-3xl text-brand-dark mb-2'>
          {isExpired === false ? 'Link Expired' : 'Invalid Link'}
        </h2>
        <p className='text-brand-muted text-sm leading-relaxed max-w-sm mx-auto font-medium'>
          {isExpired
            ? 'This posting link has expired (12-hour window). Please call us to get a new one.'
            : 'This link is not valid. Please contact us to receive a valid job posting link.'}
        </p>
      </div>
    )
  }

  if (success) {
    return (
      <div className='max-w-lg mx-auto px-4 py-20 text-center animate-fade-up'>
        <div className='w-20 h-20 bg-brand-rose-light rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm'>
          <svg
            className='w-9 h-9 text-brand-rose'
            fill='currentColor'
            viewBox='0 0 24 24'
          >
            <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' />
          </svg>
        </div>
        <h2 className='font-display italic text-3xl text-brand-dark mb-2'>
          {isEditMode ? 'Job Updated!' : 'Submission Received!'}
        </h2>
        <p className='text-brand-muted text-sm leading-relaxed max-w-sm mx-auto font-medium'>
          {isEditMode
            ? 'Your job listing has been updated. The admin will review any changes.'
            : "Your job listing has been sent for review. Our admin will approve it shortly and you'll see it go live on the board."}
        </p>
      </div>
    )
  }

  const jobAlreadyReviewed = linkState.job && linkState.job.status !== 'pending'

  if (jobAlreadyReviewed) {
    const statusMsg =
      linkState.job.status === 'active'
        ? 'Your job listing is now live on the board.'
        : 'Your job listing has been reviewed.'
    return (
      <div className='max-w-lg mx-auto px-4 py-20 text-center animate-fade-up'>
        <div className='w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm'>
          <svg
            className='w-9 h-9 text-emerald-600'
            fill='currentColor'
            viewBox='0 0 24 24'
          >
            <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' />
          </svg>
        </div>
        <h2 className='font-display italic text-3xl text-brand-dark mb-2'>
          Already Reviewed
        </h2>
        <p className='text-brand-muted text-sm leading-relaxed max-w-sm mx-auto font-medium'>
          {statusMsg}
        </p>
      </div>
    )
  }

  return (
    <div className='max-w-2xl mx-auto px-4 py-7'>
      <div className='mb-7'>
        <h1 className='font-display italic font-medium text-3xl sm:text-4xl text-brand-dark'>
          {isEditMode ? 'Edit Your Listing' : 'Post a Job'}
        </h1>
        <p className='text-sm text-brand-muted mt-2 font-medium'>
          {isEditMode
            ? 'You can edit your listing until your link expires. Changes go back for review.'
            : `Hi ${linkState.callerName} — fill in the details below and we'll review and publish it shortly.`}
        </p>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* Section 1 */}
        <section className='bg-white rounded-2xl border border-brand-blush shadow-sm p-5'>
          <SectionHeader num='1' title='School Information' />
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Field label='School Name' required>
              <input
                required
                className={inputClass}
                value={form.schoolName}
                onChange={(e) => set('schoolName', e.target.value)}
                placeholder='Sunshine International School'
              />
            </Field>
            <Field label='City' required>
              <input
                required
                className={inputClass}
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                placeholder='Mumbai'
              />
            </Field>
            <Field label='Contact Person' required>
              <input
                required
                className={inputClass}
                value={form.contactPerson}
                onChange={(e) => set('contactPerson', e.target.value)}
                placeholder='Priya Sharma'
              />
            </Field>
            <Field label='Contact Email' required>
              <input
                required
                type='email'
                className={inputClass}
                value={form.contactEmail}
                onChange={(e) => set('contactEmail', e.target.value)}
                placeholder='hr@school.com'
              />
            </Field>
            <Field label='Phone Number' required>
              <input
                required
                type='tel'
                className={inputClass}
                value={form.contactPhone}
                onChange={(e) => set('contactPhone', e.target.value)}
                placeholder='+91 98765 43210'
              />
            </Field>
            <Field label='WhatsApp Number'>
              <input
                type='tel'
                className={inputClass}
                value={form.whatsappNumber}
                onChange={(e) => set('whatsappNumber', e.target.value)}
                placeholder='Same as phone or leave blank'
              />
            </Field>
          </div>
        </section>

        {/* Section 2 */}
        <section className='bg-white rounded-2xl border border-brand-blush shadow-sm p-5'>
          <SectionHeader num='2' title='Job Details' />
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='sm:col-span-2'>
              <Field label='Job Title' required>
                <input
                  required
                  className={inputClass}
                  value={form.jobTitle}
                  onChange={(e) => set('jobTitle', e.target.value)}
                  placeholder='Kindergarten Class Teacher'
                />
              </Field>
            </div>
            <Field label='Role Type' required>
              <select
                required
                className={inputClass}
                value={form.roleType}
                onChange={(e) => set('roleType', e.target.value)}
              >
                <option value=''>Select role type</option>
                <option value='kindergarten'>Kindergarten</option>
                <option value='primary'>Primary</option>
                <option value='subject'>Subject Teacher</option>
                <option value='montessori'>Montessori</option>
                <option value='other'>Other</option>
              </select>
            </Field>
            {form.roleType === 'other' && (
              <Field label='Describe the Role' required>
                <input
                  required
                  className={inputClass}
                  value={form.roleTypeOther}
                  onChange={(e) => set('roleTypeOther', e.target.value)}
                  placeholder='e.g. Sports Coach, Special Educator'
                />
              </Field>
            )}
            <Field label='Subject (if applicable)'>
              <input
                className={inputClass}
                value={form.subject}
                onChange={(e) => set('subject', e.target.value)}
                placeholder='e.g. Mathematics, Science'
              />
            </Field>
            <Field label='Job Type' required>
              <select
                required
                className={inputClass}
                value={form.jobType}
                onChange={(e) => set('jobType', e.target.value)}
              >
                <option value=''>Select job type</option>
                <option value='fulltime'>Full-time</option>
                <option value='parttime'>Part-time</option>
                <option value='substitute'>Substitute</option>
              </select>
            </Field>
            <Field label='Experience Required (years)' required>
              <input
                required
                type='number'
                min='0'
                max='30'
                className={inputClass}
                value={form.experienceRequired}
                onChange={(e) => set('experienceRequired', e.target.value)}
                placeholder='0 for freshers'
              />
            </Field>

            {/* Salary range — two fields */}
            <Field label='Salary — Min (₹ / month)'>
              <input
                type='number'
                min='0'
                className={inputClass}
                value={form.salaryMin}
                onChange={(e) => set('salaryMin', e.target.value)}
                placeholder='e.g. 20000'
              />
            </Field>
            <Field label='Salary — Max (₹ / month)'>
              <input
                type='number'
                min='0'
                className={inputClass}
                value={form.salaryMax}
                onChange={(e) => set('salaryMax', e.target.value)}
                placeholder='e.g. 35000'
              />
            </Field>

            {/* Working hours — two time fields */}
            <Field label='Working Hours — From'>
              <input
                type='time'
                className={inputClass}
                value={form.workingHoursFrom}
                onChange={(e) => set('workingHoursFrom', e.target.value)}
              />
            </Field>
            <Field label='Working Hours — To'>
              <input
                type='time'
                className={inputClass}
                value={form.workingHoursTo}
                onChange={(e) => set('workingHoursTo', e.target.value)}
              />
            </Field>

            <Field label='Working Days'>
              <input
                className={inputClass}
                value={form.workingDays}
                onChange={(e) => set('workingDays', e.target.value)}
                placeholder='e.g. Mon – Sat'
              />
            </Field>
            <Field label='Joining Date'>
              <input
                type='date'
                className={inputClass}
                value={form.joiningDate}
                onChange={(e) => set('joiningDate', e.target.value)}
              />
            </Field>
          </div>
        </section>

        {/* Section 3 */}
        <section className='bg-white rounded-2xl border border-brand-blush shadow-sm p-5'>
          <SectionHeader num='3' title='About the Role' />
          <div className='flex flex-col gap-4'>
            <Field label='Job Description'>
              <textarea
                rows={4}
                className={`${inputClass} resize-none`}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
              />
            </Field>

            <div>
              <p className='text-[11px] font-bold text-brand-muted uppercase tracking-widest mb-2.5'>
                Certifications Required
              </p>
              <div className='flex flex-wrap gap-2'>
                {CERTIFICATIONS.map((cert) => (
                  <button
                    key={cert}
                    type='button'
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
          <div className='bg-brand-rose-light border border-brand-rose/20 rounded-xl px-4 py-3 text-sm text-brand-rose-dark font-medium'>
            {error}
          </div>
        )}

        <button
          type='submit'
          disabled={submitting}
          className='w-full bg-brand-rose hover:bg-brand-rose-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm'
        >
          {submitting ? (
            <>
              <LoadingSpinner size='sm' />{' '}
              {isEditMode ? 'Saving…' : 'Submitting…'}
            </>
          ) : isEditMode ? (
            'Save Changes'
          ) : (
            'Submit Job for Review'
          )}
        </button>
      </form>
    </div>
  )
}
