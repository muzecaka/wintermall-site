/* ═══════════════════════════════════════════
   WINTER MALL — main.js
   ─────────────────────────────────────────
   SECTIONS:
   1. Snow animation
   2. Nav scroll behaviour
   3. Page routing
   4. Investor tab switching
   5. Booking modal
   6. Pitch deck download
═══════════════════════════════════════════ */


/* ── 1. SNOW ───────────────────────────── */
const cv = document.getElementById('snow');
const cx = cv.getContext('2d');
let flakes = [];

function rsz(){cv.width=innerWidth;cv.height=innerHeight}
function mkFlakes(){
  flakes=[];
  for(let i=0;i<90;i++) flakes.push({
    x:Math.random()*cv.width, y:Math.random()*cv.height,
    r:Math.random()*2.8+.8, s:Math.random()*.75+.25,
    d:Math.random()*.35-.17, o:Math.random()*.45+.15
  });
}
function drawSnow(){
  cx.clearRect(0,0,cv.width,cv.height);
  flakes.forEach(f=>{
    cx.beginPath();cx.arc(f.x,f.y,f.r,0,Math.PI*2);
    cx.fillStyle=`rgba(0,175,239,${f.o})`;cx.fill();
    f.y+=f.s; f.x+=f.d;
    if(f.y>cv.height+8){f.y=-8;f.x=Math.random()*cv.width}
    if(f.x>cv.width+8) f.x=-8;
    if(f.x<-8) f.x=cv.width+8;
  });
  requestAnimationFrame(drawSnow);
}
window.addEventListener('resize',()=>{rsz();mkFlakes()});
rsz();mkFlakes();drawSnow();


/* ── 2. NAV SCROLL ─────────────────────── */
window.addEventListener('scroll',()=>{
  document.getElementById('nav').classList.toggle('stuck',scrollY>24);
});


/* ── 3. PAGE ROUTING ───────────────────── */
function go(p){
  document.querySelectorAll('.pg').forEach(el=>el.classList.remove('show'));
  document.getElementById('pg-'+p).classList.add('show');
  document.querySelectorAll('.nav-links a[data-p]').forEach(a=>{
    a.classList.toggle('active',a.dataset.p===p);
  });
  window.scrollTo({top:0,behavior:'smooth'});
}


/* ── 3b. HAMBURGER MENU ─────────────────── */
function toggleMenu(){
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('nav-links').classList.toggle('open');
}
function closeMenu(){
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('nav-links').classList.remove('open');
}
/* close menu on tap outside */
document.addEventListener('click',function(e){
  var nav=document.getElementById('nav');
  if(nav && !nav.contains(e.target)) closeMenu();
});


/* ── 4. INVESTOR TABS ──────────────────── */
function invTab(btn,sec){
  document.querySelectorAll('.inv-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.inv-sec').forEach(s=>s.classList.remove('show'));
  btn.classList.add('active');
  document.getElementById('inv-'+sec).classList.add('show');
}


/* ── 5. BOOKING MODAL ──────────────────── */
var modalPrice     = 8000;
var modalType      = 'adult';
var extraChildren  = 0;

function switchModalTab(btn, tabId){
  document.querySelectorAll('.modal-tab').forEach(function(t){ t.classList.remove('active'); });
  document.querySelectorAll('.modal-tab-content').forEach(function(t){ t.classList.remove('active'); });
  btn.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}
function openBooking(){
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var iso = tomorrow.toISOString().split('T')[0];
  var dateEl = document.getElementById('m-date');
  if(dateEl){ dateEl.min = iso; if(!dateEl.value) dateEl.value = iso; }
  document.getElementById('booking-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  calcModal();
}
function closeBooking(){
  document.getElementById('booking-modal').classList.remove('open');
  document.body.style.overflow = '';
}

function selectModalTicket(el, type, price){
  /* deselect all */
  document.querySelectorAll('.modal-tt').forEach(function(c){ c.classList.remove('sel'); });
  /* hide all disclaimers */
  document.querySelectorAll('.tt-disclaimer').forEach(function(d){ d.classList.add('hidden'); });
  /* select this one */
  el.classList.add('sel');
  modalType  = type;
  modalPrice = price;
  extraChildren = 0;
  if(document.getElementById('extra-child-n'))
    document.getElementById('extra-child-n').textContent = '0';
  /* show its disclaimer */
  var disc = document.getElementById('disc-' + type);
  if(disc) disc.classList.remove('hidden');
  /* adjust qty label */
  var qtyLabel = document.getElementById('qty-label');
  if(type === 'school' || type === 'corp'){
    qtyLabel.textContent = type === 'school' ? 'Number of Pupils' : 'Number of Attendees';
    var qtyEl = document.getElementById('m-qty');
    if(parseInt(qtyEl.textContent) < (type === 'school' ? 20 : 15))
      qtyEl.textContent = type === 'school' ? '20' : '15';
  } else if(type === 'family'){
    qtyLabel.textContent = 'Number of Family Packs';
    document.getElementById('m-qty').textContent = '1';
  } else {
    qtyLabel.textContent = 'Number of Tickets';
    document.getElementById('m-qty').textContent = '1';
  }
  calcModal();
}

function changeModalQty(d){
  var el  = document.getElementById('m-qty');
  var min = (modalType === 'school') ? 20 : (modalType === 'corp') ? 15 : 1;
  var v   = Math.max(min, parseInt(el.textContent) + d);
  el.textContent = v;
  calcModal();
}

function changeExtraChildren(d){
  extraChildren = Math.max(0, extraChildren + d);
  document.getElementById('extra-child-n').textContent = extraChildren;
  calcModal();
}

function calcModal(){
  var qty   = parseInt(document.getElementById('m-qty').textContent) || 1;
  var base  = modalPrice * qty;
  var extra = (modalType === 'family') ? extraChildren * 5000 : 0;
  var total = base + extra;
  document.getElementById('m-total').textContent = '₦' + total.toLocaleString();
  var breakdown = document.getElementById('m-breakdown');
  if(breakdown){
    var parts = [];
    if(modalType === 'family'){
      parts.push(qty + ' pack' + (qty > 1 ? 's' : '') + ' × ₦' + modalPrice.toLocaleString());
      if(extraChildren > 0)
        parts.push(extraChildren + ' extra child' + (extraChildren > 1 ? 'ren' : '') + ' × ₦5,000');
    } else {
      parts.push(qty + ' × ₦' + modalPrice.toLocaleString());
    }
    breakdown.textContent = parts.join('  +  ');
  }
}

function confirmBooking(){
  /* validate date */
  var dateEl = document.getElementById('m-date');
  if(!dateEl || !dateEl.value){
    alert('Please select a visit date before confirming.');
    return;
  }

  /* validate contact fields */
  var name  = (document.getElementById('b-name')  || {}).value  || '';
  var email = (document.getElementById('b-email') || {}).value  || '';
  var phone = (document.getElementById('b-phone') || {}).value  || '';
  if(!name.trim())  { alert('Please enter your full name.');    return; }
  if(!email.trim()) { alert('Please enter your email address.'); return; }
  if(!phone.trim()) { alert('Please enter your phone number.'); return; }

  var qty   = document.getElementById('m-qty').textContent;
  var total = document.getElementById('m-total').textContent;
  var breakdown = document.getElementById('m-breakdown').textContent;
  var typeNames = {adult:'Adult',teen:'Young Teenager',child:'Child',family:'Family Pack',school:'School Group',corp:'Corporate/Event'};
  var ticketType = typeNames[modalType] || modalType;
  var extrasNote = (modalType === 'family' && extraChildren > 0)
    ? ' + ' + extraChildren + ' extra child(ren)'
    : '';

  /* UI — loading state */
  var btn       = document.getElementById('book-submit-btn');
  var successEl = document.getElementById('book-success');
  var errorEl   = document.getElementById('book-error');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  successEl.style.display = 'none';
  errorEl.style.display   = 'none';

  /* build form data */
  var data = new FormData();
  data.append('_subject',      '🎟 New Booking Request — Winter Mall');
  data.append('Full Name',     name);
  data.append('email',         email);
  data.append('Phone Number',  phone);
  data.append('Ticket Type',   ticketType);
  data.append('Visit Date',    dateEl.value);
  data.append('Quantity',      qty + extrasNote);
  data.append('Order Breakdown', breakdown || ticketType + ' × ' + qty);
  data.append('Order Total',   total);

  /* POST to Formspree */
  fetch('https://formspree.io/f/mvzwpnaw', {
    method: 'POST',
    body: data,
    headers: { 'Accept': 'application/json' }
  })
  .then(function(res){
    if(res.ok){
      successEl.style.display = 'block';
      btn.textContent  = '✅ Booking Sent!';
      btn.style.background = '#0e7c4a';
      /* reset fields */
      document.getElementById('b-name').value  = '';
      document.getElementById('b-email').value = '';
      document.getElementById('b-phone').value = '';
      document.getElementById('m-qty').textContent = '1';
      extraChildren = 0;
      if(document.getElementById('extra-child-n'))
        document.getElementById('extra-child-n').textContent = '0';
      calcModal();
    } else {
      return res.json().then(function(d){ throw d; });
    }
  })
  .catch(function(){
    errorEl.style.display = 'block';
    btn.textContent  = 'Confirm Booking →';
    btn.disabled     = false;
    btn.style.background = '';
  });
}

document.addEventListener('click', function(e){ if(e.target.id==='booking-modal') closeBooking(); });
document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeBooking(); });


/* ── 6. PITCH DECK DOWNLOAD ────────────── */
/*
  TO UPDATE THE PDF:
  1. Drop new PDF into /assets/ folder
  2. Update the filename in pdfPath below
*/
function downloadDeck(){
  var pw = prompt('🔐 Enter your investor access code to download the pitch deck:');
  if(pw === null) return; // user cancelled
  if(pw.trim() === 'WM2026Invest'){
    const link=document.createElement('a');
    link.href='assets/WINTERMALL_V3.pdf';
    link.download='WinterMall-PitchDeck-Confidential.pdf';
    link.target='_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert('❌ Incorrect access code.\n\nTo receive your investor access code, please submit an enquiry via the Investor Portal or contact wintermallng@gmail.com');
  }
}


/* ── 7. GALLERY LIGHTBOX ───────────────── */
/*
  The gallery lightbox lives in the inline script at the bottom of
  index.html. Don't redeclare its variables (lbIndex etc.) here: a
  `let` with the same name makes the browser reject that whole inline
  script, which breaks the forms, FAQ and data room.
*/


/* ── 8. EXPERIENCES FILTER ─────────────── */
/* Shows only the attraction tiles whose data-zone matches the chip */
function attFilter(btn, zone){
  document.querySelectorAll('.att-chip').forEach(function(c){ c.classList.toggle('on', c === btn); });
  document.querySelectorAll('.att-grid .att').forEach(function(t){
    t.classList.toggle('hide', zone !== 'all' && t.dataset.zone !== zone);
  });
}


/* ── 9. HERO VIDEO LOOP + FULL TOUR ────── */
/* The hero plays only the part of the 3D video between data-loop-start and
   data-loop-end (seconds), skipping the mascot intro. */
(function(){
  var v = document.getElementById('hero-video');
  if(!v) return;
  var start = parseFloat(v.dataset.loopStart) || 0;
  var end   = parseFloat(v.dataset.loopEnd)   || 0;
  if(!start && !end) return;
  function toStart(){ if(v.duration) v.currentTime = Math.min(start, v.duration - 1); }
  if(v.readyState >= 1) toStart(); else v.addEventListener('loadedmetadata', toStart);
  v.addEventListener('timeupdate', function(){
    if((end && v.currentTime >= end) || v.currentTime < start - 1) toStart();
  });
})();

function openTourVideo(){
  var m = document.getElementById('video-modal');
  var v = document.getElementById('full-tour');
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
  var p = v.play(); if(p && p.catch) p.catch(function(){});
}
function closeTourVideo(){
  var m = document.getElementById('video-modal');
  if(!m || !m.classList.contains('open')) return;
  document.getElementById('full-tour').pause();
  m.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeTourVideo(); });


/* ── 10. VISITOR MOMENTS ───────────────── */
function copyHashtag(btn){
  var tag = btn.dataset.tag, lbl = btn.querySelector('.moments-copy');
  function done(){ if(lbl){ lbl.textContent = 'Copied!'; setTimeout(function(){ lbl.textContent = 'Copy'; }, 1800); } }
  if(navigator.clipboard) navigator.clipboard.writeText(tag).then(done, done); else done();
}
