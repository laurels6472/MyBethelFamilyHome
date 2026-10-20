// Bethel family alert relay — free Cloudflare Worker.
// It only does one thing: when the family app asks, it sends a phone notification (Web Push) to the phones that turned alerts on.
// Do not share this file: it holds the private key that signs the alerts.
const ALLOWED_ORIGIN = 'https://laurels6472.github.io';
const SITE = 'https://laurels6472.github.io/MyBethelFamilyHome/';
const VAPID_PUBLIC = 'BBjU7NtgZ4cxZ0BJ9b7FhQUOvCCqY9sK8UOmzzMxQXsRmRKVWcuGmHgjXhQjX492y9qkuCJbQmDE5nofrWz_IZc';
const VAPID_PRIVATE_JWK = {"kty":"EC","x":"GNTs22BnhzFnQEn1vsWFBQ68IKpj2wrxQ6bPMzFBexE","y":"mRKVWcuGmHgjXhQjX492y9qkuCJbQmDE5nofrWz_IZc","crv":"P-256","d":"V3Eg0JG_SeGrtE52cITbxsaIaIqUQY8ycFuyPUHYtVQ"};
const PUSH_HOSTS = [/(^|\.)googleapis\.com$/, /(^|\.)push\.apple\.com$/, /(^|\.)push\.services\.mozilla\.com$/, /(^|\.)notify\.windows\.com$/];

const enc = new TextEncoder();
const b64u = (buf) => { let s = ''; const u = new Uint8Array(buf); for (let i = 0; i < u.length; i++) s += String.fromCharCode(u[i]); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
const unb64u = (s) => { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; const b = atob(s), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; };
const cat = (...a) => { let n = 0; a.forEach((x) => (n += x.length)); const o = new Uint8Array(n); let p = 0; a.forEach((x) => { o.set(x, p); p += x.length; }); return o; };

async function hkdf(salt, ikm, info, len) {
  const k = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info }, k, len * 8));
}
// RFC 8291 (aes128gcm) encryption of the message for one phone
async function encrypt(sub, plaintext) {
  const uaPub = unb64u(sub.keys.p256dh), auth = unb64u(sub.keys.auth);
  const eph = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const asPub = new Uint8Array(await crypto.subtle.exportKey('raw', eph.publicKey));
  const uaKey = await crypto.subtle.importKey('raw', uaPub, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const shared = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: uaKey }, eph.privateKey, 256));
  const ikm = await hkdf(auth, shared, cat(enc.encode('WebPush: info\0'), uaPub, asPub), 32);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(salt, ikm, enc.encode('Content-Encoding: aes128gcm\0'), 16);
  const nonce = await hkdf(salt, ikm, enc.encode('Content-Encoding: nonce\0'), 12);
  const key = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  const body = cat(plaintext, new Uint8Array([2]));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, key, body));
  const rs = new Uint8Array([0, 0, 16, 0]); // 4096
  return cat(salt, rs, new Uint8Array([asPub.length]), asPub, ct);
}
let signKey = null;
async function vapidHeader(endpoint) {
  if (!signKey) signKey = await crypto.subtle.importKey('jwk', VAPID_PRIVATE_JWK, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const aud = new URL(endpoint).origin;
  const head = b64u(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const claims = b64u(enc.encode(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: SITE })));
  const sig = new Uint8Array(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, signKey, enc.encode(head + '.' + claims)));
  return 'vapid t=' + head + '.' + claims + '.' + b64u(sig) + ', k=' + VAPID_PUBLIC;
}
async function sendOne(sub, message, urgent) {
  const url = new URL(sub.endpoint);
  if (url.protocol !== 'https:' || !PUSH_HOSTS.some((r) => r.test(url.hostname))) return { endpoint: sub.endpoint, status: 400 };
  const body = await encrypt(sub, enc.encode(message));
  const res = await fetch(sub.endpoint, { method: 'POST', headers: { Authorization: await vapidHeader(sub.endpoint), 'Content-Encoding': 'aes128gcm', 'Content-Type': 'application/octet-stream', TTL: '86400', Urgency: urgent ? 'high' : 'normal' }, body });
  return { endpoint: sub.endpoint, status: res.status };
}
export default {
  async fetch(request) {
    const origin = request.headers.get('Origin') || '';
    const cors = { 'Access-Control-Allow-Origin': origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN, 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin' };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method === 'GET') return new Response('Bethel alert relay is running. ✅', { headers: Object.assign({ 'Content-Type': 'text/plain; charset=utf-8' }, cors) });
    if (request.method !== 'POST' || origin !== ALLOWED_ORIGIN) return new Response('Not allowed', { status: 403, headers: cors });
    let data; try { data = await request.json(); } catch (e) { return new Response('Bad request', { status: 400, headers: cors }); }
    const subs = (Array.isArray(data.subs) ? data.subs : []).filter((s) => s && s.endpoint && s.keys && s.keys.p256dh && s.keys.auth).slice(0, 30);
    const p = data.payload || {};
    const message = JSON.stringify({ fm: 1, title: String(p.title || 'MyBethelFamilyHome').slice(0, 120), body: String(p.body || '').slice(0, 300), url: String(p.url || SITE).slice(0, 300), tag: String(p.tag || '').slice(0, 60), urgent: !!p.urgent });
    const results = await Promise.all(subs.map((s) => sendOne(s, message, !!p.urgent).catch(() => ({ endpoint: s.endpoint, status: 0 }))));
    return new Response(JSON.stringify({ results }), { headers: Object.assign({ 'Content-Type': 'application/json' }, cors) });
  },
};
