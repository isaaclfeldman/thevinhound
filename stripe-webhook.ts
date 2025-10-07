
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { addCredits } from '@/lib/db'

export const config = { api: { bodyParser: false } }

export default async function handler(req:NextApiRequest, res:NextApiResponse){
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' })
  const buf = await buffer(req as any)
  const sig = req.headers['stripe-signature'] as string
  let event: Stripe.Event
  try{ event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!) }
  catch(err:any){ return res.status(400).send(`Webhook Error: ${err.message}`) }
  if(event.type === 'checkout.session.completed'){
    const session = event.data.object as Stripe.Checkout.Session
    const email = session.customer_email as string
    const line = session.amount_total || 0
    const credits = line>=10000?100:(line>=2500?25:10)
    if(email) addCredits(email, credits)
  }
  res.json({ received:true })
}
async function buffer(readable:any){ const chunks=[]; for await (const c of readable) chunks.push(typeof c==='string'?Buffer.from(c):c); return Buffer.concat(chunks) }
