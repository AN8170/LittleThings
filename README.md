<div align="center">
  <img src="assets/logo.png" alt="Little Things — The Christmas Edition" width="343" />

  <h3>Make a little list. Share a little magic.</h3>

  <p>A private Christmas wishlist for two, built for thoughtful gifts, cozy traditions, and the joy of giving.</p>

  <a href="https://an8170.github.io/LittleThings/"><strong>Open the wishlist</strong></a>
  · <a href="#getting-started">Getting started</a>
  · <a href="#how-it-works">How it works</a>

  <p>
    <img src="https://img.shields.io/badge/HTML5-A33D43?logo=html5&logoColor=white&style=flat-square" alt="HTML5" />
    <img src="https://img.shields.io/badge/CSS3-234F40?logo=css&logoColor=white&style=flat-square" alt="CSS" />
    <img src="https://img.shields.io/badge/JavaScript-D6AD68?logo=javascript&logoColor=white&style=flat-square" alt="JavaScript" />
    <img src="https://img.shields.io/badge/Supabase-Database-234F40?logo=supabase&logoColor=white&style=flat-square" alt="Supabase" />
  </p>
</div>

---

## 🎄 About Little Things

Little Things began with a simple idea: Christmas shopping should feel personal, not complicated. Instead of sending screenshots, scattered links, or separate notes, couples can keep their holiday wishes together in one cozy space.

Each couple gets their own private wishlist, accessible from either partner's device. Create an account, connect with a single invitation code, and start planning Christmas together.

## ✨ Features

| Feature | Description |
| --- | --- |
| 🎁 Individual wishlists | Keep track of what each partner would love to receive. |
| 💚 Shared wishes | Plan matching gifts, holiday dates, and experiences together. |
| 🔗 Couple pairing | Connect two accounts using a private, single-use invitation code. |
| 💸 Gift budget | Estimate total gift costs and see how much remains in your budget. |
| 🛍️ Gift organization | Add product links, prices, categories, priorities, and helpful notes. |
| ✅ Shopping checklist | Mark gifts as purchased and revisit checked-off items. |
| ❄️ Christmas countdown | Count down the days until December 25. |
| ☁️ Cross-device sync | Access your shared list on different devices, with updates checked every five seconds. |
| 📦 Import & export | Back up your wishlist or append gifts from an existing export. |

## 💌 How it works

1. **Create an account** using your email and password.
2. **Create a wishlist** and copy your unique invitation code.
3. **Share the code** privately with your partner.
4. **Connect** when your partner signs in with their own account and joins using the code.
5. **Make Christmas magical** by adding gifts, setting a budget, and planning holiday memories together.

The invitation code expires after seven days and can only be used once. Both partners can access the wishlist afterward by signing in, without needing the code again.

## 🛠️ Built with

- **HTML, CSS & JavaScript** — responsive Christmas-themed interface, with no build step.
- **Supabase Auth** — individual email/password accounts.
- **Supabase PostgreSQL** — persistent couples, membership, and gift records.
- **Row-level security** — database access is restricted to the members of each couple.
- **GitHub Pages** — static website hosting.

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/AN8170/LittleThings.git
cd LittleThings
```

### 2. Configure your own Supabase project

1. Create a project at [Supabase](https://supabase.com/).
2. Open **SQL Editor**, create a query, and run `setup.sql` once.
3. In `cloud.js`, replace the existing project URL and publishable key with your own project's values.
4. Under **Authentication → URL Configuration**, set the Site URL and allowed redirect URL to your deployed address.
5. Enable email authentication and configure custom SMTP for public account confirmation emails. For a private test, create and confirm test accounts manually in the dashboard.

> [!IMPORTANT]
> Only use the Supabase publishable key in the frontend. Never commit a secret key, service-role key, or database password.

### 3. Run locally

```bash
python -m http.server 8000
```

Open `http://localhost:8000` in your browser. Add this address to Supabase's allowed redirect URLs when testing authentication locally.

### 4. Deploy

Push the files to your GitHub repository. In **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/(root)`, and save. Configure your Supabase Site URL to match the published website.

## 📁 Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Page layout, login and pairing screens, gift forms |
| `holiday.css` | Christmas theme and responsive wishlist styles |
| `holiday.js` | Gift management, filters, budget, and countdown |
| `cloud.js` | Supabase connection, authentication, pairing, and synchronization |
| `cloud.css` | Account and pairing screen styles |
| `setup.sql` | Database schema, access policies, and pairing functions |
| `assets/logo.png` | Little Things Christmas logo |

## 🔒 Privacy & data

- Each account can join one couple, and each couple can have at most two partners.
- Database policies restrict gift records and settings to that couple's members.
- Both partners can edit their shared wishlist and budget; the purchased status is visible to both.
- Invite codes are single-use and expire after seven days. Do not post them publicly.
- Old browser-local wishes are not uploaded automatically. Export them from the original version and import the backup into the shared list through Couple settings.

Before inviting users beyond a test couple, verify sign-in, pairing, synchronization, and access isolation with separate test accounts.

---

<div align="center">
  <p>Made with care for the little things that make Christmas special. ♡</p>
  <a href="https://github.com/AN8170">@AN8170</a>
</div>
