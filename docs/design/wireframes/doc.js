(function(){
  function fit(){
    document.querySelectorAll('.frame').forEach(function(f){
      var w=+f.dataset.w, avail=f.parentElement.clientWidth;
      var s=Math.min(1,avail/w); f.style.setProperty('--s',s);
    });
  }
  fit(); addEventListener('resize',fit); addEventListener('load',fit);
  var links={}; document.querySelectorAll('#side nav a').forEach(function(a){links[a.dataset.s]=a});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){Object.values(links).forEach(function(l){l.classList.remove('on')});var l=links[e.target.id];if(l)l.classList.add('on')}
    })},{rootMargin:'-20% 0px -70% 0px'});
    Object.keys(links).forEach(function(id){var el=document.getElementById(id);if(el)io.observe(el)});
  }
})();
