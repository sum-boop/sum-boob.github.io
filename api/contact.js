const MAX_REQUEST_BYTES = 28000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function respond(res, status, payload) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(status).json(payload);
}

module.exports = async function contactHandler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return respond(res, 405, { error: 'Method not allowed.' });
  }

  const contentType = String(req.headers['content-type'] || '').split(';', 1)[0].trim().toLowerCase();
  if (contentType !== 'application/json') {
    return respond(res, 415, { error: 'Unsupported content type.' });
  }

  const origin = req.headers.origin;
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      const requestHost = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
      if (!requestHost || originHost !== requestHost) {
        return respond(res, 403, { error: 'Request origin is not allowed.' });
      }
    } catch {
      return respond(res, 403, { error: 'Request origin is not allowed.' });
    }
  }

  let payload = req.body;
  if (Buffer.isBuffer(payload)) payload = payload.toString('utf8');
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch {
      return respond(res, 400, { error: 'Invalid request body.' });
    }
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return respond(res, 400, { error: 'Invalid request body.' });
  }

  if (Buffer.byteLength(JSON.stringify(payload), 'utf8') > MAX_REQUEST_BYTES) {
    return respond(res, 413, { error: 'Request is too large.' });
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const organization = typeof payload.organization === 'string' ? payload.organization.trim() : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';

  if (
    name.length < 2 || name.length > 120 ||
    email.length < 3 || email.length > 254 || !EMAIL_PATTERN.test(email) ||
    organization.length > 120 ||
    message.length < 10 || message.length > 5000
  ) {
    return respond(res, 400, { error: 'Please check the contact form fields.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !publishableKey) {
    return respond(res, 503, { error: 'Contact storage is not configured.' });
  }

  let endpoint;
  try {
    const base = new URL(supabaseUrl);
    if (base.protocol !== 'https:') throw new Error('HTTPS is required.');
    endpoint = new URL('/rest/v1/contact_messages', base);
  } catch {
    return respond(res, 503, { error: 'Contact storage is not configured.' });
  }

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        apikey: publishableKey,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name,
        email,
        organization: organization || null,
        message,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!result.ok) return respond(res, 502, { error: 'Could not save the message.' });
    return respond(res, 201, { ok: true });
  } catch {
    return respond(res, 502, { error: 'Could not save the message.' });
  }
};
