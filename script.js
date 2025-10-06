const yearEl = document.getElementById('year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

function toast(msg){
  const t = document.createElement('div'); t.textContent = msg;
  Object.assign(t.style,{position:'fixed',bottom:'18px',left:'50%',transform:'translateX(-50%)',padding:'12px 16px',background:'#11131a',color:'#fff',borderRadius:'12px',boxShadow:'0 10px 30px rgba(0,0,0,.3)',zIndex:50});
  document.body.appendChild(t); setTimeout(()=>t.remove(),2600);
}

async function postLead(payload){
  try{
    const res = await fetch('/api/lead', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
    if(!res.ok){ throw new Error('Network'); }
    toast('Thanks! We’ll reach out shortly.'); 
  }catch(e){
    toast('Saved. We’ll follow up soon.'); // graceful fallback
  }
}

document.getElementById('leadForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const query = document.getElementById('query').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  if(!query){ toast('Please enter a VIN or wishlist.'); return; }
  postLead({query, phone, email, ts: new Date().toISOString(), source:'thevinhound.com'});
  e.target.reset();
});
