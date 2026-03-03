# ❄ WINTER MALL WEBSITE — Project Guide

## 📁 Folder Structure

```
wintermall-site/
│
├── index.html              ← Main website (all pages live here)
│
├── css/
│   ├── styles.css          ← All visual styling (colors, layout, fonts)
│   └── main.js             ← All JavaScript (snow, routing, booking, download)
│
├── images/                 ← DROP ALL GALLERY IMAGES HERE
│   ├── snow-slides.jpg     ← (example — add your own)
│   ├── ice-skating.jpg
│   ├── kids-zone.jpg
│   └── ...
│
└── assets/
    └── WINTERMALL_V3.pdf   ← Pitch deck (replace with new version anytime)
```

---

## 🎬 HOW TO ADD YOUR 3D VIDEO (Hero Section)

1. Save your video file into `/assets/`
   - Recommended format: **MP4** (works on all browsers)
   - Name it e.g. `wintermall-3d.mp4`

2. Open `index.html` in VS Code

3. Find this comment block in the hero section:
   ```
   <!-- ↓ REPLACE THIS BLOCK WITH YOUR VIDEO -->
   <div class="hf-inner">
     ...
   </div>
   <!-- ↑ REPLACE THIS BLOCK WITH YOUR VIDEO -->
   ```

4. Delete the entire `<div class="hf-inner">...</div>` block

5. Paste this in its place:
   ```html
   <video autoplay muted loop playsinline
     style="width:100%;height:100%;object-fit:cover;border-radius:32px">
     <source src="assets/wintermall-3d.mp4" type="video/mp4">
   </video>
   ```

---

## 📸 HOW TO ADD GALLERY IMAGES

1. Drop your image files into the `/images/` folder
   - Supported formats: JPG, PNG, WebP

2. Open `index.html` and find the `GALLERY PAGE` section

3. Each gallery tile looks like this:
   ```html
   <div class="gi" style="background:linear-gradient(...)">
     <div class="gi-in">🛷</div>
     ...
   ```

4. Replace the gradient with your image:
   ```html
   <div class="gi" style="background:url('images/snow-slides.jpg') center/cover no-repeat">
   ```

5. Delete the `<div class="gi-in">` emoji line — you won't need it once you have a real image

---

## 📊 HOW TO UPDATE THE PITCH DECK PDF

1. Drop the new PDF into `/assets/`
2. Open `css/main.js`
3. Find the `downloadDeck()` function and update the filename:
   ```js
   link.href = 'assets/YOUR-NEW-FILENAME.pdf';
   ```

---

## 👥 HOW TO ADD REAL TEAM PHOTOS

1. Drop portrait photos into `/images/`
   - Square crops work best (1:1 ratio)
   - Recommended size: 400×400px minimum

2. Open `index.html` and find the TEAM PAGE section

3. Each team card has a comment like:
   ```html
   <!-- TO ADD A REAL PHOTO:
     <img src="images/ishola.jpg" ...> -->
   👨‍💼
   ```

4. Remove the emoji and uncomment the `<img>` tag:
   ```html
   <img src="images/ishola.jpg" alt="Ishola Olasunkanmi"
        style="width:100%;height:100%;object-fit:cover">
   ```

---

## 🎨 HOW TO CHANGE COLORS

Open `css/styles.css` — all brand colors are at the top in `:root{}`:

```css
:root {
  --turq:      #00AFEF;   /* Winter Mall primary turquoise */
  --turq-dark: #0090C5;   /* Darker turquoise for hover */
  --navy:      #0B2D45;   /* Deep navy */
  --gold:      #C9A227;   /* Gold accent */
  --bg:        #F2FBFF;   /* Page background (ice white) */
}
```

Change any value and it updates everywhere on the site automatically.

---

## 💳 HOW TO CONNECT A REAL PAYMENT SYSTEM (Paystack/Flutterwave)

1. Open `css/main.js`
2. Find the `confirmBooking()` function
3. Replace the `alert()` with your payment gateway code:

```js
// PAYSTACK EXAMPLE:
function confirmBooking(){
  const handler = PaystackPop.setup({
    key: 'pk_live_YOUR_PUBLIC_KEY',
    email: 'customer@email.com',
    amount: modalPrice * parseInt(document.getElementById('m-qty').textContent) * 100,
    currency: 'NGN',
    callback: function(response){
      alert('Payment successful! Ref: ' + response.reference);
      closeBooking();
    },
    onClose: function(){ closeBooking(); }
  });
  handler.openIframe();
}
```

---

## 🌐 HOW TO GO LIVE

**Option A — Free hosting (Netlify):**
1. Go to netlify.com → drag and drop the entire `wintermall-site/` folder
2. Your site is live instantly with a URL like `wintermall.netlify.app`
3. Add your custom domain (wintermall.com) in Netlify settings

**Option B — cPanel hosting:**
1. Zip the entire `wintermall-site/` folder
2. Upload via File Manager to `public_html/`
3. Extract the zip

---

*© 2026 Winter Mall Nigeria Ltd.*
