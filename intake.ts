
import type { NextApiRequest, NextApiResponse } from 'next'
import { saveLead } from '@/lib/db'

function bad(res:NextApiResponse, code:number, msg:string){ return res.status(code).json({error: msg}) }

export default async function handler(req:NextApiRequest, res:NextApiResponse){
  if(req.method!=='POST') return bad(res,405,'Method not allowed')
  const body = req.body || {}
  const { type, consent } = body || {}
  if(!type || !['structured','freeform'].includes(type)) return bad(res,422,'Invalid type')
  const contact = body.contact || {}
  if(!(contact.phone || contact.email)) return bad(res,422,'Provide phone or email')
  if(consent!==true) return bad(res,422,'Consent required')

  const record = {
    Type: type,
    Make: body.make || null, Model: body.model || null,
    'Year From': body.yearFrom || null, 'Year To': body.yearTo || null,
    Color: body.color || null, 'Budget Max': body.budgetMax || null,
    'Max Miles': body.maxMiles || null, Zip: body.zip || null,
    'Dream Text': body.dreamText || null,
    Phone: contact.phone || null, Email: contact.email || null,
    Consent: true, 'UTM Source': body?.utm?.source || null, 'UTM Campaign': body?.utm?.campaign || null
  }

  let airtableId: string | null = null
  try{
    if(process.env.AIRTABLE_TOKEN && process.env.AIRTABLE_BASE && process.env.AIRTABLE_TABLE){
      const resp = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}/${encodeURIComponent(process.env.AIRTABLE_TABLE)}`,
        { method:'POST', headers:{ 'Authorization':`Bearer ${process.env.AIRTABLE_TOKEN}`, 'Content-Type':'application/json' },
          body: JSON.stringify({ records: [{ fields: record }], typecast: true }) })
      const data = await resp.json(); airtableId = data?.records?.[0]?.id || null
    }
  }catch(e){ console.error('Airtable error', e) }

  // Twilio alert (optional)
  try{
    if(process.env.TWILIO_SID && process.env.TWILIO_AUTH && process.env.TWILIO_FROM && process.env.ALERT_TO){
      const tw = await import('twilio'); const client = tw.default(process.env.TWILIO_SID, process.env.TWILIO_AUTH)
      const summary = type==='structured' ? `${body.make||''} ${body.model||''} ${body.yearFrom||''}-${body.yearTo||''}, $${body.budgetMax||''}, ${body.maxMiles||''} mi, ${body.zip||''}` : (body.dreamText||'')
      await client.messages.create({ to: process.env.ALERT_TO!, from: process.env.TWILIO_FROM!, body: `New Vinhound lead — ${type}\n${summary}\nContact: ${contact.phone||contact.email}` })
    }
  }catch(e){ console.error('Twilio error', e) }

  const localId = saveLead(type, body, contact);
  return res.status(201).json({ id: airtableId || localId, status: 'received' })
}
