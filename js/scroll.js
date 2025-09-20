// Smooth, reliable scroll for header links using data-scroll
(function(){
  const prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function headerH(){
    const v = getComputedStyle(document.documentElement).getPropertyValue('--header-h');
    const n = parseInt(v, 10);
    return isNaN(n) ? 72 : n;
  }

  function onClick(e){
    // Intercept early (capturing) to avoid jQuery animate handlers
    const a = e.target.closest('a[data-scroll]');
    if(!a) return;
    const href = a.getAttribute('href') || '';
    if(!href || href.charAt(0) !== '#') return;
    const target = document.querySelector(href);
    if(!target) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const y = target.getBoundingClientRect().top + window.pageYOffset - headerH();
    if(prefersReduce){
      window.scrollTo(0, y);
    } else {
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    if(history && history.pushState){
      history.pushState(null, '', href);
    }
  }

  document.addEventListener('click', onClick, true); // capture
})();

