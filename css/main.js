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
/*
  TO CONNECT A REAL PAYMENT GATEWAY:
  Replace the alert() in confirmBooking() with
  your Paystack / Flutterwave handler.
*/
let modalPrice = 8000;

function openBooking(){
  document.getElementById('booking-modal').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeBooking(){
  document.getElementById('booking-modal').classList.remove('open');
  document.body.style.overflow='';
}
function selectModalTicket(el,price){
  document.querySelectorAll('.modal-tt').forEach(c=>c.classList.remove('sel'));
  el.classList.add('sel');
  modalPrice=price;
  calcModal();
}
function changeModalQty(d){
  const el=document.getElementById('m-qty');
  const v=Math.max(1,parseInt(el.textContent)+d);
  el.textContent=v;
  calcModal();
}
function calcModal(){
  const qty=parseInt(document.getElementById('m-qty').textContent);
  document.getElementById('m-total').textContent='₦'+(modalPrice*qty).toLocaleString();
}
function confirmBooking(){
  alert('Booking confirmed! ❄ Welcome to Winter Mall.\nWe will be in touch shortly with your ticket details.');
  closeBooking();
}
document.addEventListener('click',e=>{if(e.target.id==='booking-modal')closeBooking()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeBooking()});


/* ── 6. PITCH DECK DOWNLOAD ────────────── */
/*
  TO UPDATE THE PDF:
  1. Drop new PDF into /assets/ folder
  2. Update the filename in pdfPath below
*/
function downloadDeck(){
  const link=document.createElement('a');
  link.href='assets/WINTERMALL_V3.pdf';
  link.download='WinterMall-PitchDeck.pdf';
  link.target='_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
