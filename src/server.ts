import crypto from 'node:crypto';
import { verify } from 'discord-verify';
import { Hono, type HonoRequest } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.redirect('https://github.com/real2two/characterbot');
});

app.post('/', async (c) => {
  const { searchParams } = new URL(c.req.raw.url);
  const publicKey = searchParams.get('public_key') || '';

  if (!/^[a-z0-9]{64}$/.test(publicKey)) return c.text('Invalid public key.', 400);

  const { isValid, interaction } = await server.verifyDiscordRequest(c.req, publicKey);
  if (!isValid || !interaction) return c.text('Bad request signature.', 401);

  const payload = {
    type: interaction?.type,
    applicationId: interaction?.application_id,
    content: interaction?.data?.options?.[0]?.value,
  };

  if (payload.type === 1) {
    return c.json({ type: 1 });
  }

  if (payload.type !== 2) return c.text('Invalid interaction.type.', 401);
  if (!/^(\d{17,21})$/.test(payload.applicationId)) {
    return c.text('Invalid interaction.application_id.', 401);
  }
  if (
    typeof payload.content !== 'string' ||
    payload.content.length < 1 ||
    payload.content.length > 4000
  ) {
    return c.text('Invalid interaction.data.options[0].value.', 400);
  }

  return c.json({
    type: 4,
    data: { content: payload.content },
  });
});

app.all('*', (c) => c.text('Not Found.', 404));

async function verifyDiscordRequest(req: HonoRequest<'/'>, publicKey: string) {
  const signature = req.header('x-signature-ed25519');
  const timestamp = req.header('x-signature-timestamp');
  const body = await req.text();
  const isValidRequest =
    signature &&
    timestamp &&
    (await verify(body, signature, timestamp, publicKey, crypto.webcrypto.subtle));

  if (!isValidRequest) return { isValid: false };
  return { interaction: JSON.parse(body), isValid: true };
}

const server = {
  verifyDiscordRequest,
  fetch: app.fetch,
};

export default server;
