const yearEl = document.getElementById('year'); if (yearEl) yearEl.textContent = new Date().getFullYear();
function toast(msg){
  const t = document.createElement('div'); t.textContent = msg;
  Object.assign(t.style,{position:'fixed',bottom:'18px',left:'50%',transform:'translateX(-50%)',padding:'12px 16px',background:'#11131a',color:'#fff',borderRadius:'12px',boxShadow:'0 10px 30px rgba(0,0,0,.3)',zIndex:50});
  document.body.appendChild(t); setTimeout(()=>t.remove(),2400);
}
document.getElementById('leadForm')?.addEventListener('submit', (e)=>{e.preventDefault(); toast('Thanks! We’ll text you options shortly.'); e.target.reset();});
