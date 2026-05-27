// Cloudflare Pages Function — proxy for Anthropic's Messages API
// -----------------------------------------------------------------------------
// Purpose: keep the Anthropic API key server-side so it never reaches the
// browser. The Kids Money Tracker POSTs the same body it would have sent
// directly to api.anthropic.com; this function adds the `x-api-key` and
// `anthropic-version` headers and forwards to Anthropic.
//
// Required environment variable (set in Cloudflare Pages → Settings →
// Environment variables → Production):
//
//     ANTHROPIC_API_KEY = sk-ant-...
//
// Access control: Cloudflare Access protects the whole project, so this
// endpoint is automatically gated by the same email-allowlist policy that
// gates the rest of the site. Only authenticated sessions can call it.

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.ANTHROPIC_API_KEY) {
    return json({
      error: 'Server is missing ANTHROPIC_API_KEY env var. Set it in Cloudflare Pages → Settings → Environment variables.'
    }, 500);
  }

  let body;
  try {
    body = await request.text();
  } catch (e) {
    return json({ error: 'Could not read request body: ' + e.message }, 400);
  }

  try {
    const anthropicResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body,
    });

    // Forward status + body. Strip hop-by-hop headers, keep content-type.
    const text = await anthropicResp.text();
    return new Response(text, {
      status: anthropicResp.status,
      headers: {
        'content-type': anthropicResp.headers.get('content-type') || 'application/json',
      },
    });
  } catch (e) {
    return json({ error: 'Upstream fetch failed: ' + e.message }, 502);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
