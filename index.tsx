
import { useState } from 'react'
export default function Home(){
  const [loadingA,setLoadingA]=useState(false)
  const [loadingB,setLoadingB]=useState(false)
  const [make,setMake]=useState(''); const [model,setModel]=useState('')
  const [yearFrom,setYearFrom]=useState('2022'); const [yearTo,setYearTo]=useState('2024')
  const [color,setColor]=useState('Any'); const [budgetMax,setBudgetMax]=useState('')
  const [maxMiles,setMaxMiles]=useState(''); const [zip,setZip]=useState('')
  const [phoneA,setPhoneA]=useState(''); const [emailA,setEmailA]=useState('')
  const [dreamText,setDreamText]=useState(''); const [contact,setContact]=useState('')

  async function submitA(){
    setLoadingA(true)
    const res = await fetch('/api/intake',{method:'POST',headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        type:'structured', make, model, yearFrom:Number(yearFrom), yearTo:Number(yearTo),
        color, budgetMax: budgetMax?Number(budgetMax):null, maxMiles: maxMiles?Number(maxMiles):null,
        zip, contact: { phone: phoneA||undefined, email: emailA||undefined }, consent:true, utm:{source:'direct',campaign:'homepage_hero'}
      })
    })
    setLoadingA(false); alert(res.ok?'Thanks! The Hound is on it.':'Hmm, something went wrong.')
  }
  async function submitB(){
    setLoadingB(true)
    const emailMatch = contact.match(/[\w.+-]+@[\w-]+\.[\w.-]+/)
    const phoneMatch = contact.replace(/[^\d+]/g,'').match(/\+?\d{10,15}/)
    const res = await fetch('/api/intake',{method:'POST',headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        type:'freeform', dreamText, contact: { phone: phoneMatch?phoneMatch[0]:undefined, email: emailMatch?emailMatch[0]:undefined },
        consent:true, utm:{source:'direct',campaign:'homepage_hero'}
      })
    })
    setLoadingB(false); alert(res.ok?'Thanks! The Hound is on it.':'Hmm, something went wrong.')
  }

  return (
    <div>
      <header className="sticky top-0 z-40 bg-white/5 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500 grid place-items-center font-bold">V</div>
            <span className="font-semibold tracking-tight">Vinhound</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#process" className="hover:text-white">Process</a>
            <a href="#results" className="hover:text-white">Results</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="#intro" className="btn btn-ghost">Schedule intro</a>
            <a href="#start" className="btn btn-primary">Start search</a>
          </div>
        </div>
      </header>

      <section className="hero-bg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <p className="inline-block px-3 py-1 rounded-full border border-white/15 text-xs text-white/80 mb-4">
              Enterprise-grade car search concierge
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
              Vinhound is your car search concierge.
            </h1>
            <p className="mt-3 text-white/80">
              Just tell the hound about your dream car and let the fetch begin!
            </p>
          </div>

          <div id="start" className="grid md:grid-cols-2 gap-4 mt-8">
            <div className="soft-card p-5">
              <div className="text-lg font-semibold">Guide the Hound</div>
              <div className="text-sm text-white/70 mb-3">I know what I want — help me narrow it down</div>
              <div className="grid grid-cols-2 gap-2">
                <input className="input" placeholder="Make" value={make} onChange={e=>setMake(e.target.value)} />
                <input className="input" placeholder="Model" value={model} onChange={e=>setModel(e.target.value)} />
                <select className="input" value={yearFrom} onChange={e=>setYearFrom(e.target.value)}>
                  {Array.from({length:45}).map((_,i)=>{const y=2025-i; return <option key={y} value={y}>{y}</option>})}
                </select>
                <select className="input" value={yearTo} onChange={e=>setYearTo(e.target.value)}>
                  {Array.from({length:45}).map((_,i)=>{const y=2025-i; return <option key={y} value={y}>{y}</option>})}
                </select>
                <select className="input" value={color} onChange={e=>setColor(e.target.value)}>
                  {['Any','Black','White','Gray','Blue','Red','Silver','Green'].map(c=> <option key={c} value={c}>{c}</option>)}
                </select>
                <input className="input" placeholder="Budget (max $)" value={budgetMax} onChange={e=>setBudgetMax(e.target.value)} />
                <input className="input" placeholder="Max miles" value={maxMiles} onChange={e=>setMaxMiles(e.target.value)} />
                <input className="input" placeholder="Zip code" value={zip} onChange={e=>setZip(e.target.value)} />
              </div>
              <div className="grid md:grid-cols-2 gap-2 mt-3">
                <input className="input" placeholder="Phone (+1...)" value={phoneA} onChange={e=>setPhoneA(e.target.value)} />
                <input className="input" placeholder="Email" value={emailA} onChange={e=>setEmailA(e.target.value)} />
              </div>
              <button onClick={submitA} disabled={loadingA} className="btn btn-primary w-full mt-3">
                {loadingA? 'Submitting…' : 'Build My Shortlist →'}
              </button>
              <p className="text-xs text-white/60 mt-2">We’ll text you verified options. Standard messaging rates may apply.</p>
            </div>

            <div className="soft-card p-5">
              <div className="text-lg font-semibold">Speak Your Dream</div>
              <div className="text-sm text-white/70 mb-3">Describe it in your own words — we’ll sniff it out</div>
              <textarea className="input min-h-[120px]" placeholder="Maybe: ‘2023 4Runner TRD Off-Road, gray or blue, under 60k miles, SoCal’" value={dreamText} onChange={e=>setDreamText(e.target.value)} />
              <input className="input mt-2" placeholder="Phone or email" value={contact} onChange={e=>setContact(e.target.value)} />
              <button onClick={submitB} disabled={loadingB} className="btn btn-primary w-full mt-3">
                {loadingB? 'Submitting…' : 'Let the Hound Hunt →'}
              </button>
              <p className="text-xs text-white/60 mt-2">By submitting you agree to be contacted. Reply STOP to opt out.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
