/* Media Partners form client behavior */
(function(){
  const MEDIA_ENDPOINT = "https://script.google.com/macros/s/AKfycbx70fRHs4VsAO9pPTDSfXY1qG50NZ5cnoO2DHxYY2YL__xffaeLS0y-cRwfLiQ3XwZWfg/exec"; // Deployed Apps Script endpoint

  function qs(sel, root=document){ return root.querySelector(sel); }
  function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }
  function setText(el, text){ if(el) el.textContent = text || ""; }

  function isUrl(v){
    try{ new URL(String(v||"").trim()); return true; } catch(e){ return false; }
  }

  function clearErrors(form){
    ["name","media","link","email"].forEach(k => setText(qs('#error-'+k, form), ''));
  }

  function validate(form){
    clearErrors(form);
    let ok = true;
    const name = qs('#name', form).value.trim();
    const media = qs('#media', form).value.trim();
    const link = qs('#link', form).value.trim();
    const email = qs('#email', form).value.trim();

    if(!name){ setText(qs('#error-name', form), 'Please enter your name.'); ok = false; }
    if(!media){ setText(qs('#error-media', form), 'Please enter the media name.'); ok = false; }
    if(!link || !isUrl(link)){ setText(qs('#error-link', form), 'Enter a valid URL.'); ok = false; }
    if(email && !/^([^\s@]+@[^\s@]+\.[^\s@]{2,})$/.test(email)){
      setText(qs('#error-email', form), 'Enter a valid email.'); ok = false;
    }
    return ok;
  }

  function serialize(form){
    const fd = new FormData();
    fd.append('name', qs('#name', form).value.trim());
    fd.append('media', qs('#media', form).value.trim());
    fd.append('link', qs('#link', form).value.trim());
    fd.append('email', qs('#email', form).value.trim());
    const hp = qs('#website', form); if(hp) fd.append('website', hp.value || '');
    return new URLSearchParams(fd);
  }

  function showSuccess(container, form){
    // If the success node is inside the form, move it to be a sibling so hiding the form doesn't hide success
    if(container && form && container.parentElement === form){
      form.parentNode.insertBefore(container, form.nextSibling);
    }
    container.classList.add('show');
    container.innerHTML = '<div><h3>Thanks! You\'re on our press list.</h3></div>'+
      '<div class="rc-actions">'+
      '<a href="/index.html" class="secondary-button">Back to Home</a>'+
      '<button type="button" class="secondary-button" data-action="again">Submit another</button>'+
      '</div>';
    container.addEventListener('click', function(e){
      const btn = e.target.closest('[data-action="again"]');
      if(btn){
        container.classList.remove('show');
        container.innerHTML = '';
        form.reset();
        form.style.display = '';
      }
    }, { once: true });
  }

  function init(){
    const form = qs('#mediaForm');
    if(!form) return;
    if(MEDIA_ENDPOINT && MEDIA_ENDPOINT.indexOf('REPLACE_WITH_') !== 0){
      form.action = MEDIA_ENDPOINT;
    }

    form.addEventListener('submit', function(ev){
      if(typeof fetch !== 'function') return; // let normal submit happen
      ev.preventDefault();

      // Honeypot: if filled, simulate success
      const hp = qs('#website', form);
      if(hp && hp.value.trim() !== ''){
        form.style.display = 'none';
        const ok = qs('#mediaSuccess');
        if(ok) showSuccess(ok, form);
        return;
      }

      if(!validate(form)) return;

      const btn = form.querySelector('button[type="submit"]');
      const prev = btn ? btn.textContent : '';
      if(btn){ btn.disabled = true; btn.textContent = 'Sending…'; }

      const body = serialize(form).toString();
      fetch(MEDIA_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        mode: 'no-cors'
      }).then(res => {
        if(res.ok || res.type === 'opaque' || res.status === 0){
          form.reset();
          form.style.display = 'none';
          const ok = qs('#mediaSuccess');
          if(ok) showSuccess(ok, form);
        } else {
          setText(qs('#error-link', form), 'Could not submit now. Please try again.');
          if(btn){ btn.disabled = false; btn.textContent = prev || 'Join Press List'; }
        }
      }).catch(() => {
        setText(qs('#error-link', form), 'Network error. Please try again later.');
        if(btn){ btn.disabled = false; btn.textContent = prev || 'Join Press List'; }
      });
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
