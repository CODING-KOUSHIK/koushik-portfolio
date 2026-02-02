// Interactive animations and functionality
document.addEventListener('DOMContentLoaded', ()=>{
  // set year
  document.getElementById('year').textContent = new Date().getFullYear();

  // simple typer effect
  const typer = document.querySelector('.typer');
  if(typer){
    const text = typer.textContent;
    typer.textContent = '';
    let i=0;
    const id = setInterval(()=>{
      typer.textContent += text[i++]||'';
      if(i>text.length) clearInterval(id);
    },18);
  }

  // reveal on scroll
  const reveals = document.querySelectorAll('.reveal, .card, .service-card, .section-title');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('revealed');
    });
  },{threshold:0.12});
  reveals.forEach(r=>io.observe(r));

  // counters (simple demo)
  const animateCount=(el, end, duration=1400)=>{
    let start=0; const step = Math.max(1, Math.floor(end/(duration/16)));
    const id = setInterval(()=>{
      start+=step; if(start>=end){start=end; clearInterval(id)}; el.textContent = (end>=1000? Math.floor(start/1000)+'M+': start + (end>=99?'+':''));
    },16);
  };
  const words = document.getElementById('wordsCount'); if(words) animateCount(words, 1000000, 1000);
  const acc = document.getElementById('accuracy'); if(acc) acc.textContent = '99%+';
  const yrs = document.getElementById('years'); if(yrs) yrs.textContent = '5+';

  // carousel (responsive + swipe support)
  const track = document.querySelector('.carousel-track');
  let pos = 0; let items = 0; let stepWidth = 340; let autoSlideInterval;
  const next = document.querySelector('.carousel-btn.next');
  const prev = document.querySelector('.carousel-btn.prev');
  const carousel = document.getElementById('carousel');

  function computeStepWidth(){
    if(!track) return;
    items = track.children.length;
    if(items === 0) return;
    const first = track.children[0];
    const rect = first.getBoundingClientRect();
    const style = getComputedStyle(first);
    const gap = parseFloat(style.marginRight) || 12;
    stepWidth = Math.round((rect.width || first.offsetWidth || 320) + gap);
    track.style.transition = 'transform 520ms cubic-bezier(.22,.9,.28,1)';
    track.style.transform = `translateX(${-pos*stepWidth}px)`;
    track.style.willChange = 'transform';
  }

  function slide(dir=1){
    if(!track || items <= 1) return;
    pos = Math.min(Math.max(pos + dir, 0), items-1);
    requestAnimationFrame(()=> track.style.transform = `translateX(${-pos*stepWidth}px)`);
  }

  next?.addEventListener('click', ()=>slide(1));
  prev?.addEventListener('click', ()=>slide(-1));

  function initCarousel(){
    computeStepWidth();
    if(items > 1){
      autoSlideInterval = setInterval(()=>slide(1), 4500);
      carousel?.addEventListener('mouseenter', ()=>clearInterval(autoSlideInterval));
      carousel?.addEventListener('mouseleave', ()=>{ autoSlideInterval = setInterval(()=>slide(1), 4500); });
      carousel?.addEventListener('focusin', ()=>clearInterval(autoSlideInterval));
      carousel?.addEventListener('focusout', ()=>{ autoSlideInterval = setInterval(()=>slide(1), 4500); });

      // pointer swipe support
      let startX=0, delta=0, isDown=false;
      track.addEventListener('pointerdown', e=>{ isDown=true; startX = e.clientX; track.setPointerCapture(e.pointerId); clearInterval(autoSlideInterval); });
      track.addEventListener('pointermove', e=>{ if(!isDown) return; delta = e.clientX - startX; track.style.transform = `translateX(${-pos*stepWidth + Math.round(delta)}px)`; });
      const endPointer = e=>{ if(!isDown) return; isDown=false; track.releasePointerCapture?.(e.pointerId); if(Math.abs(delta) > stepWidth*0.25){ slide(delta>0 ? -1 : 1); } else { track.style.transform = `translateX(${-pos*stepWidth}px)`; } delta = 0; autoSlideInterval = setInterval(()=>slide(1), 4500); };
      track.addEventListener('pointerup', endPointer);
      track.addEventListener('pointercancel', endPointer);

      // recompute on resize (debounced)
      let resizeTimer;
      window.addEventListener('resize', ()=>{ clearTimeout(resizeTimer); resizeTimer = setTimeout(()=>computeStepWidth(), 120); });
    }
  }

  // wait for images to load then init
  const imgs = track?.querySelectorAll('img') || [];
  let imgLoadCount = 0;
  if(imgs.length>0){
    imgs.forEach(img=>{ if(img.complete) imgLoadCount++; else img.addEventListener('load', ()=>{ imgLoadCount++; if(imgLoadCount===imgs.length) initCarousel(); }); });
    if(imgLoadCount===imgs.length) initCarousel();
  } else { initCarousel(); }

  // accordion
  document.querySelectorAll('.accordion .q').forEach(q=>{
    q.addEventListener('click', ()=>{
      q.classList.toggle('open'); const a = q.nextElementSibling; if(a.style.display==='block') a.style.display='none'; else a.style.display='block';
    });
  });

  // modal open
  const quoteBtn = document.getElementById('quoteBtn'); const modal = document.getElementById('quoteModal');
  const closeBtns = document.querySelectorAll('.modal-close, #modalCancel');
  quoteBtn?.addEventListener('click', ()=>{modal.setAttribute('aria-hidden','false')});
  closeBtns.forEach(b=>b.addEventListener('click', ()=>modal.setAttribute('aria-hidden','true')));
  modal.addEventListener('click', (e)=>{ if(e.target===modal) modal.setAttribute('aria-hidden','true')});

  // form submission - mailto fallback (no server)
  const quoteForm = document.getElementById('quoteForm'); if(quoteForm) quoteForm.addEventListener('submit', (e)=>{
    e.preventDefault(); const data = new FormData(quoteForm); const subject = encodeURIComponent('Website Quote Request from '+(data.get('company')||'Client'));
    const body = encodeURIComponent('Email: '+data.get('email')+"\n\nDetails:\n"+(data.get('details')||''));
    window.location.href = `mailto:koushik271999@gmail.com?subject=${subject}&body=${body}`;
  });

  // contact form
  const contactForm = document.getElementById('contactForm'); if(contactForm) contactForm.addEventListener('submit', (e)=>{
    e.preventDefault(); const data = new FormData(contactForm); const body = encodeURIComponent('Name: '+data.get('name')+"\nEmail: "+data.get('email')+"\n\nMessage:\n"+data.get('message'));
    window.location.href = `mailto:koushik271999@gmail.com?subject=Website%20Contact&body=${body}`;
  });

  // small floating animation
  const floating = document.querySelector('.floating');
  let t=0; function floatLoop(){ t+=0.016; if(floating) floating.style.transform = `translateY(${Math.sin(t)*6}px)`; requestAnimationFrame(floatLoop)}; floatLoop();

  // hero mouse parallax
  const heroBg = document.getElementById('heroBg');
  document.addEventListener('mousemove', (e)=>{
    const x = (e.clientX/window.innerWidth - 0.5)*30; const y = (e.clientY/window.innerHeight - 0.5)*30;
    heroBg.style.transform = `translate(${x}px, ${y}px)`;
  });

  // small nav toggle for mobile
  document.querySelector('.nav-toggle')?.addEventListener('click', ()=>{
    document.querySelector('.nav')?.classList.toggle('open');
  });

  // Brand highlight & interaction — enhanced
  const brand = document.querySelector('.brand');
  if(brand){
    const pulseOnce = (duration=900)=>{ brand.classList.add('brand-highlight'); setTimeout(()=>brand.classList.remove('brand-highlight'), duration); };
    // entrance pop
    setTimeout(()=>{ brand.classList.add('brand-enter'); setTimeout(()=>brand.classList.remove('brand-enter'), 900); }, 250);
    brand.addEventListener('mouseenter', ()=>pulseOnce(900));
    // gentle periodic pulse to draw attention (pause on focus)
    let brandInterval = setInterval(()=>pulseOnce(900), 5000);
    brand.addEventListener('focus', ()=>clearInterval(brandInterval));
    brand.addEventListener('blur', ()=>{ brandInterval = setInterval(()=>pulseOnce(900), 5000); });
    // compact when page is scrolled
    window.addEventListener('scroll', ()=>{
      if(window.scrollY > 40) brand.classList.add('brand-scrolled'); else brand.classList.remove('brand-scrolled');
    });
    // clicking brand scrolls to top
    brand.addEventListener('click',(e)=>{ e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); });
  }

});
