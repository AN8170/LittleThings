# Little Things — Shared Christmas wishlist

## Setup (one time)

1. In your Supabase project dashboard, open SQL Editor, create a New query, paste `setup.sql`, and run it once. The script uses three new `lt_` tables and applies access policies in a transaction.
2. In Authentication → URL Configuration, set the Site URL to `https://an8170.github.io/LittleThings/` (or the exact custom-domain URL if you use one). Add the same address as an allowed Redirect URL.
3. Keep email authentication enabled. For normal public signup, configure a custom SMTP provider in Supabase Auth so signup confirmations can reach people outside the project team. For a private two-person test, you can instead create and confirm the two users manually in Authentication → Users, then have them sign in with their email and password. Do not share passwords.
4. Upload `index.html`, `holiday.css`, `holiday.js`, `cloud.css`, and `cloud.js` to the root of your GitHub Pages repository, replacing the existing three files. Keep your existing CNAME and other unrelated files. The SQL and this README can stay local.
5. After deployment, open the GitHub Pages URL and sign in. Create a wishlist, copy its invitation code, and send it privately to your partner. The partner creates their own account, signs in, and joins with the code. It expires after seven days and becomes invalid upon use. The creator can regenerate it before it is used.

## Data

Each account belongs to one couple; each couple can have at most two members. Both members can edit shared names, budget and wishes. Row-level security limits all wish and settings operations to members of the corresponding couple. The website refreshes every five seconds, so it does not require enabling Realtime publications. The Supabase publishable key is intentionally visible to the browser; never replace it with a service-role or secret key.

If you have the earlier browser-local version, export its wishlist JSON before updating. After pairing, import it through Couple settings to append its gifts. This also works between devices; it does not overwrite the current wishlist. Existing browser-local data is not automatically uploaded.

## Verify before sharing widely

- Sign in with account A and create a couple. Add a gift and set a budget.
- In a separate browser profile, sign in with account B and join using the code. Check that both see the gift and budget.
- Add and edit gifts from both profiles. Check updates appear within a few seconds. Sign out and sign back in to verify persistence.
- Try a third account: it must not see the couple's data, and it must not be able to reuse the consumed code.
- Verify a newly generated code invalidates the old one and that an account cannot join a second couple.

The backend script must be installed before testing; these live checks have not been run against your project.
