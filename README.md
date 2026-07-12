# 🔑 JWT Decoder

Decode and inspect JSON Web Tokens (JWT) instantly. Paste your token to see header, payload, and signature — no online tools, no data leaks.

## 🚀 Features

- **Instant Decode** — Paste JWT, see results immediately
- **Header & Payload** — View decoded JSON with syntax highlighting
- **Signature Display** — See raw signature in Base64
- **Expiration Check** — Visual indicator if token is expired
- **Copy Decoded** — One-click copy for header and payload
- **No Server** — Runs entirely in browser, zero data sent anywhere

## 🎯 Why This?

Most JWT decoders are online tools that send your tokens to third-party servers. Your tokens contain sensitive auth data — they shouldn't leave your machine.

This decoder runs 100% in your browser. Nothing is sent anywhere.

## 🛠 Tech Stack

- Next.js 14
- React
- Tailwind CSS
- shadcn/ui components
- jose (JWT library)

## 📦 Setup

```bash
git clone https://github.com/thehaardik/jwt-decoder.git
cd jwt-decoder
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📋 How It Works

1. Paste your JWT token
2. View decoded header (algorithm, type)
3. View decoded payload (claims, expiry)
4. Check signature status

## 🔐 Security

- Zero network requests
- No data logging
- Runs locally by default
- Open source

## 📄 License

MIT

## 👨‍💻 Author

Built by [Haardik Miglani](https://github.com/thehaardik)
