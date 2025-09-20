/* Pitch form client behavior */
(function(){
  const PITCH_ENDPOINT = "https://script.google.com/macros/s/AKfycbxTg08AZ1aaLE7ihTRor_gZ1ucpIgAHKc3c3blHIxtbHRKxT784jSsCvQ5uoyNtej1W7w/exec"; // Live endpoint

  function qs(sel, root=document){ return root.querySelector(sel); }
  function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  function setText(el, text){ if(el){ el.textContent = text || ""; } }

  function emailValid(v){
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v||"").trim());
  }

  function collectPorts(form){
    return qsa('.port-card input:checked', form).map(cb => cb.value);
  }

  function clearErrors(form){
    ['name','email','pitch','ports'].forEach(k => setText(qs('#error-'+k, form), ''));
  }

  function validate(form){
    clearErrors(form);
    let ok = true;
    const name = qs('#name', form).value.trim();
    const email = qs('#email', form).value.trim();
    const pitch = qs('#pitch', form).value.trim();
    const ports = collectPorts(form);

    if(!name){ setText(qs('#error-name', form), 'Please enter your name.'); ok = false; }
    if(!email || !emailValid(email)){ setText(qs('#error-email', form), 'Enter a valid email.'); ok = false; }
    if(pitch.length < 10){ setText(qs('#error-pitch', form), 'Pitch should be at least 10 characters.'); ok = false; }
    if(ports.length > 3){ setText(qs('#error-ports', form), 'Select up to 3 platforms.'); ok = false; }
    return ok;
  }

  function updatePortsCounter(form){
    const cnt = qs('#portsCount', form);
    if(!cnt) return;
    const n = collectPorts(form).length;
    setText(cnt, n + '/3 selected');
  }

  function updatePitchCounter(form){
    const pitch = qs('#pitch', form);
    const out = qs('#pitchCounter', form);
    if(!pitch || !out) return;
    setText(out, String(pitch.value.length));
  }

  function onPortsChange(e){
    const form = e.currentTarget.closest('form');
    const ports = collectPorts(form);
    if(ports.length > 3){
      // Uncheck the latest check
      e.target.checked = false;
      setText(qs('#error-ports', form), 'Select up to 3 platforms.');
    } else {
      setText(qs('#error-ports', form), '');
    }
    // Toggle checked style for card label
    const label = e.target.closest('label');
    if(label){ label.classList.toggle('checked', e.target.checked); }
    updatePortsCounter(form);
  }

  function serializeForm(form){
    const fd = new FormData(form);
    // FormData already repeats keys for multi-values.
    return new URLSearchParams(fd);
  }

  function init(){
    const form = qs('#pitchForm');
    if(!form) return;

    // keep action in sync with constant if replaced
    if(PITCH_ENDPOINT && PITCH_ENDPOINT.indexOf('REPLACE_WITH_') !== 0){
      form.action = PITCH_ENDPOINT;
    }

    // Larger hit areas and limit selection
    qsa('.port-card input', form).forEach(cb => {
      // reflect current state on load
      const label = cb.closest('label');
      if(label){ label.classList.toggle('checked', cb.checked); }
      cb.addEventListener('change', onPortsChange);
    });
    updatePortsCounter(form);
    updatePitchCounter(form);

    const pitchInput = qs('#pitch', form);
    if(pitchInput){
      pitchInput.addEventListener('input', () => updatePitchCounter(form));
    }

    form.addEventListener('submit', function(ev){
      if(typeof fetch !== 'function') return; // progressive enhancement fallback
      ev.preventDefault();

      // Honeypot: if filled, show success without sending
      const honeypot = qs('#website', form);
      if(honeypot && honeypot.value.trim() !== ''){
        form.style.display = 'none';
        const ok = qs('#pitchSuccess');
        if(ok){ showSuccess(ok, form); }
        return;
      }

      if(!validate(form)) { return; }

      const submitBtn = form.querySelector('button[type="submit"]');
      let prevText = '';
      if(submitBtn){ prevText = submitBtn.textContent; submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      const params = serializeForm(form);
      fetch(PITCH_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        // Allow opaque success if Apps Script requires no-cors
        mode: 'no-cors'
      }).then(res => {
        if(res.ok || res.type === 'opaque' || res.status === 0){
          form.reset();
          form.style.display = 'none';
          const ok = qs('#pitchSuccess');
          if(ok){ showSuccess(ok, form); }
        } else {
          setText(qs('#error-pitch', form), 'Could not submit now. Please try again later or email us.');
          if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = prevText || 'Submit Pitch'; }
        }
      }).catch(() => {
        setText(qs('#error-pitch', form), 'Network issue. Please try again.');
        if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = prevText || 'Submit Pitch'; }
      });
    });
  }

  function showSuccess(container, form){
    // If the success node is inside the form, move it next to the form
    var holder = (form && form.closest('.rc-card')) || form.parentNode || document.body;
    if(container && form && container.parentElement === form){
      form.parentNode.insertBefore(container, form.nextSibling);
    }
    container.classList.add('show');
    container.innerHTML = '<div><h3>Thanks! We\'ll review your pitch.</h3></div>'+
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
        updatePortsCounter(form); updatePitchCounter(form);
        form.style.display = '';
      }
    }, { once: true });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
