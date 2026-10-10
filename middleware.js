/* ═══════════════════════════════════════════
   WINTER MALL — site access gate (Vercel Routing Middleware)
   ─────────────────────────────────────────
   Every request to the site passes through here first.
   Visitors must enter the access token before they can see any page,
   image, video or file.

   THE TOKEN lives in Vercel, not in this file:
     Vercel → wml → Settings → Environment Variables → SITE_ACCESS_TOKEN
   After changing it, redeploy (Deployments → ⋯ → Redeploy).
   Changing the token signs everyone out.

   Sign out on this device: visit /__logout
═══════════════════════════════════════════ */

export const config = { matcher: '/:path*' };

const COOKIE = 'wm_access';
const MAX_AGE = 60 * 60 * 24 * 30; // stay signed in for 30 days

async function sha256(text){
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function readCookie(request, name){
  const header = request.headers.get('cookie') || '';
  const m = header.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return m ? m[1] : null;
}

/* only allow redirects back into this site */
function safeNext(next){
  return (typeof next === 'string' && next.startsWith('/') && !next.startsWith('//')) ? next : '/';
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function gatePage(status, message, next){
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Winter Mall — Private Preview</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;
       font-family:system-ui,-apple-system,'Segoe UI',sans-serif;
       background:linear-gradient(160deg,#F2FBFF 0%,#D0F1FF 100%);color:#0B1F2E}
  .card{width:100%;max-width:420px;background:#fff;border-radius:24px;padding:40px 32px;
        box-shadow:0 24px 64px rgba(11,45,69,.15);border:1px solid rgba(0,175,239,.2);text-align:center}
  .flake{font-size:2.6rem;margin-bottom:6px}
  .brand{font-family:Georgia,'Times New Roman',serif;font-size:1.9rem;font-weight:700;color:#0B2D45}
  .brand em{color:#00AFEF;font-style:normal}
  .pill{display:inline-block;margin:14px 0 18px;font-size:.7rem;font-weight:700;letter-spacing:.1em;
        text-transform:uppercase;color:#0090C5;background:rgba(0,175,239,.1);border:1px solid rgba(0,175,239,.35);
        padding:6px 14px;border-radius:50px}
  p{font-size:.92rem;line-height:1.6;color:#2C4A5E;margin-bottom:22px}
  input{width:100%;padding:14px 16px;border-radius:12px;border:1.5px solid #C8EAFF;font-size:1rem;
        outline:none;margin-bottom:12px}
  input:focus{border-color:#00AFEF}
  button{width:100%;padding:14px;border:none;border-radius:12px;background:#00AFEF;color:#fff;
         font-size:1rem;font-weight:600;cursor:pointer}
  button:hover{background:#0090C5}
  .err{background:rgba(220,50,50,.08);border:1px solid rgba(220,50,50,.3);color:#c0392b;
       border-radius:10px;padding:10px 12px;font-size:.85rem;margin-bottom:14px}
  .foot{margin-top:20px;font-size:.75rem;color:#5A7A8A}
  .foot a{color:#0090C5}
</style>
</head>
<body>
  <form class="card" method="POST" action="/__access">
    <div class="flake">❄</div>
    <div class="brand">Winter <em>Mall</em></div>
    <div class="pill">🔒 Private Preview</div>
    <p>This site is shared privately with partners and investors. Enter the access token you were given to continue.</p>
    ${message ? `<div class="err">${escapeHtml(message)}</div>` : ''}
    <input type="password" name="token" placeholder="Access token" autocomplete="current-password" required autofocus>
    <input type="hidden" name="next" value="${escapeHtml(next)}">
    <button type="submit">Enter site →</button>
    <div class="foot">Need access? <a href="mailto:wintermallng@gmail.com?subject=Access%20request%20%E2%80%94%20Winter%20Mall">wintermallng@gmail.com</a></div>
  </form>
</body>
</html>`;
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow'
    }
  });
}

export default async function middleware(request){
  const url   = new URL(request.url);
  const token = (process.env.SITE_ACCESS_TOKEN || '').trim();

  /* sign out on this device */
  if(url.pathname === '/__logout'){
    return new Response(null, { status: 303, headers: {
      Location: '/',
      'Set-Cookie': `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`
    }});
  }

  /* no token set in Vercel yet → keep the site locked */
  if(!token){
    return gatePage(503, 'Access is not set up yet. Please try again later.', '/');
  }

  /* the cookie holds a hash of the token, so changing the token signs everyone out */
  const expected = await sha256('winter-mall:' + token);

  /* login form submitted */
  if(url.pathname === '/__access' && request.method === 'POST'){
    let given = '', next = '/';
    try {
      const form = await request.formData();
      given = String(form.get('token') || '').trim();
      next  = safeNext(String(form.get('next') || '/'));
    } catch(e) {}
    if(given && (await sha256('winter-mall:' + given)) === expected){
      return new Response(null, { status: 303, headers: {
        Location: next,
        'Set-Cookie': `${COOKIE}=${expected}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
        'Cache-Control': 'no-store'
      }});
    }
    return gatePage(401, 'That access token is not correct. Please check and try again.', next);
  }

  /* already signed in → let the request through to the site */
  if(readCookie(request, COOKIE) === expected) return;

  /* not signed in → show the access page */
  return gatePage(401, '', safeNext(url.pathname + url.search));
}
