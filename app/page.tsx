'use client';

import { useState } from 'react';

function decodeBase64Url(str: string) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  return atob(base64);
}

function parseJWT(token: string) {
  try {
    const parts = token.trim().split('.');
    if (parts.length !== 3) return null;
    const header = JSON.parse(decodeBase64Url(parts[0]));
    const payload = JSON.parse(decodeBase64Url(parts[1]));
    const exp = payload.exp as number | undefined;
    return { header, payload, signature: parts[2], isExpired: exp ? exp * 1000 < Date.now() : false, expiresAt: exp ? new Date(exp * 1000).toLocaleString() : 'No expiry' };
  } catch { return null; }
}

export default function Home() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<any>(null);
  const [error, setError] = useState('');

  const handleDecode = () => {
    setError(''); setDecoded(null);
    if (!token.trim()) { setError('Paste a JWT token'); return; }
    const result = parseJWT(token);
    if (!result) { setError('Invalid JWT format'); return; }
    setDecoded(result);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">JWT Decoder</h1>
          <p className="text-xl text-gray-600">Decode and inspect JSON Web Tokens instantly. Runs 100% in your browser.</p>
        </div>

        <div className="bg-white rounded-lg border p-6 mb-8">
          <h2 className="font-semibold mb-3">Paste JWT Token</h2>
          <textarea className="w-full h-32 p-3 border rounded-lg font-mono text-sm" placeholder="eyJhbGciOiJIUzI1NiIs..." value={token} onChange={(e) => setToken(e.target.value)} />
          <button onClick={handleDecode} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Decode JWT</button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8">{error}</div>}

        {decoded && (
          <div className="space-y-6">
            <div className={`p-4 rounded-lg ${decoded.isExpired ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
              <span className={`font-semibold ${decoded.isExpired ? 'text-red-700' : 'text-green-700'}`}>{decoded.isExpired ? 'EXPIRED' : 'VALID'}</span>
              <span className="text-gray-600 ml-2">Expires: {decoded.expiresAt}</span>
            </div>
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold mb-3">Header</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">{JSON.stringify(decoded.header, null, 2)}</pre>
            </div>
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold mb-3">Payload</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">{JSON.stringify(decoded.payload, null, 2)}</pre>
            </div>
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold mb-3">Signature</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm break-all">{decoded.signature}</pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
