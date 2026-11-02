(function(){
  var y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var t=document.querySelector('.menu-toggle'), n=document.getElementById('nav');
  if(t&&n){
    t.addEventListener('click',function(){
      var o=n.classList.toggle('open'); t.setAttribute('aria-expanded',o); t.setAttribute('aria-label',o?'Cerrar menú':'Abrir menú');
    });
    n.addEventListener('click',function(e){ if(e.target.tagName==='A'){ n.classList.remove('open'); t.setAttribute('aria-expanded','false'); } });
  }

  // Portada: fachada y video de la pileta rotan solos; los puntos permiten elegir.
  var hero=document.querySelector('.hero'), logoT, slides=[].slice.call(document.querySelectorAll('.hero .slide')), dots=[].slice.call(document.querySelectorAll('.hero-dots button')), cur=0, timer;
  function show(k){
    cur=k;
    clearTimeout(logoT); hero.classList.remove('logo-on');
    if(slides[k].classList.contains('slide-video')) logoT=setTimeout(function(){ hero.classList.add('logo-on'); },2600);
    slides.forEach(function(s,i){
      s.classList.toggle('active',i===k);
      var v=s.querySelector('video');
      if(v){ if(i===k){ try{v.currentTime=0;}catch(e){} v.play().catch(function(){}); } else { setTimeout(function(){ if(!s.classList.contains('active')) v.pause(); },1300); } }
    });
    dots.forEach(function(d,i){ d.classList.toggle('active',i===k); d.setAttribute('aria-current',i===k?'true':'false'); });
    schedule();
  }
  function schedule(){
    clearTimeout(timer);
    if(reduce||document.hidden||slides.length<2) return;
    timer=setTimeout(function(){ show((cur+1)%slides.length); },(parseFloat(slides[cur].getAttribute('data-dur'))||7)*1000);
  }
  dots.forEach(function(d,i){ d.addEventListener('click',function(){ show(i); }); });
  document.addEventListener('visibilitychange',schedule);
  if(!reduce) schedule();

  // Música oficial: solo suena si la persona la activa (los navegadores no permiten sonido automático).
  var a=document.getElementById('bgm'), btns=[].slice.call(document.querySelectorAll('.music-btn'));
  function paint(on){ btns.forEach(function(b){ b.setAttribute('aria-pressed',on?'true':'false'); b.textContent=b.getAttribute(on?'data-on':'data-off'); }); }
  if(a&&btns.length){
    a.volume=.5;
    btns.forEach(function(b){
      b.addEventListener('click',function(){
        if(a.paused){ a.play().then(function(){ paint(true); }).catch(function(){}); } else { a.pause(); paint(false); }
      });
    });
    document.querySelectorAll('.video-card video').forEach(function(v){
      v.addEventListener('play',function(){ if(!a.paused){ a.pause(); paint(false); } });
    });
  }
})();
