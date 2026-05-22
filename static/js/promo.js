(function(){
    const CLE = 'promoEnd24h';
    let fin = localStorage.getItem(CLE);
    if(!fin || Date.now() > +fin){ fin = Date.now() + 24*3600*1000; localStorage.setItem(CLE, fin); }
    let prev = {};
    function anim(id){ const el=document.getElementById(id); el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); }
    function tick(){
      const r = Math.max(0, Math.floor((+fin - Date.now())/1000));
      if(r===0){ document.querySelector('.promo-banner').style.display='none'; return; }
      const h=String(Math.floor(r/3600)).padStart(2,'0');
      const m=String(Math.floor((r%3600)/60)).padStart(2,'0');
      const s=String(r%60).padStart(2,'0');
      if(h!==prev.h){ document.getElementById('promo-hh').textContent=h; anim('promo-hh'); prev.h=h; }
      if(m!==prev.m){ document.getElementById('promo-mm').textContent=m; anim('promo-mm'); prev.m=m; }
      if(s!==prev.s){ document.getElementById('promo-ss').textContent=s; anim('promo-ss'); prev.s=s; }
    }
    tick(); setInterval(tick,1000);
  })();