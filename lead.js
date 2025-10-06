export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error: 'Method not allowed' });
  try {
    const body = req.body || {};
    const lead = {
      query: (body.query || '').toString().slice(0, 500),
      phone: (body.phone || '').toString().slice(0, 40),
      email: (body.email || '').toString().slice(0, 120),
      ts: body.ts || new Date().toISOString(),
      source: body.source || 'thevinhound.com'
    };

    // Optional: email via Resend
    if (process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Vinhound <noreply@resend.dev>',
            to: [process.env.NOTIFY_EMAIL],
            subject: 'New Vinhound Lead',
            text: `Query: ${lead.query}\nPhone: ${lead.phone}\nEmail: ${lead.email}\nTime: ${lead.ts}`
          })
        });
      } catch (e) {}
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(200).json({ ok: true });
  }
}
