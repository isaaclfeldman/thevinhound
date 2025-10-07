
import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

export default async function handler(req:NextApiRequest, res:NextApiResponse){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'})
  const { text } = req.body || {}
  if(!text) return res.status(422).json({error:'text required'})
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const sys = `You normalize a car buying request into JSON keys: make, model, yearFrom, yearTo, color, budgetMax, maxMiles, zip, notes. Only output JSON.`
  const user = `Normalize: ${text}`
  try{
    const resp = await client.chat.completions.create({ model:'gpt-4o-mini', messages:[{role:'system',content:sys},{role:'user',content:user}], temperature:0.2 })
    const content = resp.choices?.[0]?.message?.content || '{}'
    return res.status(200).json({ normalized: JSON.parse(content) })
  }catch(e:any){ return res.status(200).json({ normalized: { notes: text } }) }
}
