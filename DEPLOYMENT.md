# Furnito Deployment Guide

This project is split into:
- `Backend` (Express + MongoDB Atlas)
- `Frontend` (Vite + React)

Deploy backend first, then frontend.

## 1. Deploy Backend

Use any Node host (Render/Railway/Fly/etc.). Recommended settings:
- Root directory: `Backend`
- Build command: `npm ci`
- Start command: `npm start`
- Health check path: `/health`

Set these environment variables on your backend host:

Required:
- `PORT` = `5000` (or host-provided port if required)
- `MONGO_URI` = your MongoDB Atlas URI
- `JWT_SECRET` = long random secret
- `CLIENT_URLS` = comma-separated frontend URLs (example: `https://your-frontend.vercel.app`)
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `GEMINI_API_KEY`
- `GEMINI_MODEL` = `gemini-2.5-flash`
- `SMTP_HOST` (example: `smtp.gmail.com`)
- `SMTP_PORT` (example: `587`)
- `SMTP_SECURE` (`true` for 465, else `false`)
- `SMTP_USER`
- `SMTP_PASS` (for Gmail, use App Password)
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

Optional:
- `CLIENT_URL` (single frontend URL fallback)
- `GOOGLE_CLIENT_ID` (required only if Google login is used)
- `GOOGLE_CLIENT_SECRET` (optional in current code path)

After deploy, verify:
- `GET https://your-backend-domain.com/health` returns `{"status":"ok"}`

## 2. Deploy Frontend

Use any static host (Vercel/Netlify/Cloudflare Pages/etc.). Recommended settings:
- Root directory: `Frontend`
- Build command: `npm run build`
- Output directory: `build`

Set frontend env vars:
- `VITE_API_BASE_URL` = your deployed backend URL (example: `https://your-backend-domain.com`)
- `VITE_GOOGLE_CLIENT_ID` = only if Google login is enabled

After deploy, verify:
- Home loads
- API calls use deployed backend URL (Auth/Orders/Chatbot/Contact)

## 3. CORS + OAuth Finalization

Update backend `CLIENT_URLS` to include every frontend domain you use:
- Production URL
- Preview URL (if needed)

If Google login is enabled, add frontend domain in Google Cloud Console:
- Authorized JavaScript origins: your frontend URL(s)

## 4. Smoke Test Checklist

- Signup/Login works
- Cart + Checkout order flow works
- User Dashboard orders load
- Contact form sends email
- Chatbot responds

If frontend cannot reach backend, first check:
- `VITE_API_BASE_URL` on frontend
- `CLIENT_URLS` on backend
