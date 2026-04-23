module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = {}
    }
  }

  const {
    name = '',
    phone = '',
    email = '',
    destination = '',
    pax = '',
    month = '',
    duration = '',
    budget = '',
    message = '',
  } = body || {}

  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.ENQUIRY_TO_EMAIL
  const fromEmail = process.env.ENQUIRY_FROM_EMAIL || 'Vasudhara Enquiries <onboarding@resend.dev>'

  // Keep the endpoint safe-by-default: if env vars are not configured, don't error the frontend.
  if (!apiKey || !toEmail) {
    return res.status(200).json({ ok: true, skipped: true })
  }

  const subject = `New Enquiry: ${destination || 'Travel Package'} - ${name || 'Guest'}`
  const text = [
    'New enquiry received',
    '',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Destination: ${destination}`,
    `Travellers: ${pax}`,
    `Month: ${month}`,
    `Duration: ${duration}`,
    `Budget: ${budget}`,
    `Message: ${message}`,
  ].join('\n')

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject,
        text,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      return res.status(502).json({ ok: false, error: 'Email send failed', details: errorText })
    }

    return res.status(200).json({ ok: true })
  } catch (error) {
    return res.status(502).json({ ok: false, error: 'Email send failed', details: String(error?.message || error) })
  }
}

