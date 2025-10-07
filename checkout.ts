
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
export default async function handler(req:NextApiRequest, res:NextApiResponse){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'})
  const { email, plan='credits_25' } = req.body || {}
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' })
  const priceMap: Record<string,string> = {
    'credits_10': process.env.STRIPE_PRICE_10!,
    'credits_25': process.env.STRIPE_PRICE_25!,
    'credits_100': process.env.STRIPE_PRICE_100!
  }
  const price = priceMap[plan]; if(!price) return res.status(422).json({error:'Unknown plan'})
  const session = await stripe.checkout.sessions.create({
    mode:'payment',
    line_items:[{ price, quantity:1 }],
    customer_email: email,
    success_url: process.env.PUBLIC_URL + '/?success=1',
    cancel_url: process.env.PUBLIC_URL + '/?canceled=1'
  })
  res.status(200).json({ url: session.url })
}
