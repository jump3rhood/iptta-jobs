import { Resend } from 'resend';

export async function sendApprovalEmail(job) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const base = process.env.CLIENT_URL;
  const approveUrl = `${base.replace('jobs.', 'api.jobs.')}/api/approve/${job.approveToken}`;
  const rejectUrl = `${approveUrl}/reject`;

  const expLabel = job.experienceRequired === 0 ? 'Fresher' : `${job.experienceRequired}+ years`;

  console.log(`[email] Sending approval email to ${process.env.ADMIN_EMAIL} for job: "${job.jobTitle}" at ${job.schoolName}`);

  const { data, error } = await resend.emails.send({
    from: 'IPTTA Jobs <onboarding@resend.dev>',
    to: process.env.ADMIN_EMAIL,
    subject: `New Job Submission: ${job.jobTitle} at ${job.schoolName}`,
    html: `
      <h2>New Job Submission</h2>
      <p><strong>School:</strong> ${job.schoolName}, ${job.city}</p>
      <p><strong>Job:</strong> ${job.jobTitle} (${job.roleType}, ${job.jobType})</p>
      <p><strong>Contact:</strong> ${job.contactPerson} — ${job.contactEmail} / ${job.contactPhone}</p>
      <p><strong>Experience:</strong> ${expLabel}</p>
      <p><strong>Salary:</strong> ${job.salaryRange || 'Not specified'}</p>
      <p><strong>Description:</strong><br/>${job.description || ''}</p>
      <br/>
      <a href="${approveUrl}" style="background:#16a34a;color:#fff;padding:10px 20px;text-decoration:none;border-radius:4px;">APPROVE</a>
      &nbsp;&nbsp;
      <a href="${rejectUrl}" style="background:#dc2626;color:#fff;padding:10px 20px;text-decoration:none;border-radius:4px;">REJECT</a>
    `,
  });

  if (error) {
    console.error('[email] Failed to send:', error);
    throw error;
  }

  console.log(`[email] Sent successfully — Resend ID: ${data.id}`);
}
