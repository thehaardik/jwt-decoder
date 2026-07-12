'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, AlertTriangle, Key } from 'lucide-react';
import { toast } from 'sonner';

interface DecodedJWT {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  isExpired: boolean;
  expiresAt: string;
}

function decodeBase64Url(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

function parseJWT(token: string): DecodedJWT | null {
  try {
    const parts = token.trim().split('.');
    if (parts.length !== 3) return null;

    const header = JSON.parse(decodeBase64Url(parts[0]));
    const payload = JSON.parse(decodeBase64Url(parts[1]));
    const signature = parts[2];

    const exp = payload.exp as number | undefined;
    const isExpired = exp ? exp * 1000 < Date.now() : false;
    const expiresAt = exp
      ? new Date(exp * 1000).toLocaleString()
      : 'No expiry set';

    return { header, payload, signature, isExpired, expiresAt };
  } catch {
    return null;
  }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleCopy}>
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

export default function Home() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null);
  const [error, setError] = useState('');

  const handleDecode = () => {
    setError('');
    setDecoded(null);

    if (!token.trim()) {
      setError('Please paste a JWT token');
      return;
    }

    const result = parseJWT(token);
    if (!result) {
      setError('Invalid JWT format. Make sure it has 3 parts separated by dots.');
      return;
    }

    setDecoded(result);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-lg">
              <Key className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            JWT Decoder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Decode and inspect JSON Web Tokens instantly. Runs 100% in your browser — nothing leaves your machine.
          </p>
        </div>

        {/* Input */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Paste JWT Token</CardTitle>
            <CardDescription>Enter your JWT to decode header, payload, and signature</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="min-h-[120px] font-mono text-sm"
            />
            <div className="mt-4 flex gap-2">
              <Button onClick={handleDecode}>Decode JWT</Button>
              <Button variant="outline" onClick={() => { setToken(''); setDecoded(null); setError(''); }}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {decoded && (
          <div className="space-y-6">
            {/* Expiry Status */}
            <Card className={decoded.isExpired ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={decoded.isExpired ? 'destructive' : 'default'}>
                      {decoded.isExpired ? 'EXPIRED' : 'VALID'}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Expires: {decoded.expiresAt}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Header</CardTitle>
                  <CopyButton text={JSON.stringify(decoded.header, null, 2)} />
                </div>
                <CardDescription>Algorithm and token type</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                  {JSON.stringify(decoded.header, null, 2)}
                </pre>
              </CardContent>
            </Card>

            {/* Payload */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Payload</CardTitle>
                  <CopyButton text={JSON.stringify(decoded.payload, null, 2)} />
                </div>
                <CardDescription>Claims and user data</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                  {JSON.stringify(decoded.payload, null, 2)}
                </pre>
              </CardContent>
            </Card>

            {/* Signature */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Signature</CardTitle>
                  <CopyButton text={decoded.signature} />
                </div>
                <CardDescription>Raw signature in Base64</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm font-mono break-all">
                  {decoded.signature}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
