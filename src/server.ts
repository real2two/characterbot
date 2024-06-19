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
  // const token = searchParams.get('token') || '';
  // const commandName = searchParams.get('command') || 'c';

  if (!/^[a-z0-9]{64}$/.test(publicKey)) return c.text('Invalid public key.', 400);
  // if (!/^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u.test(commandName)) {
  // return c.text('Invalid command name.', 400);
  // }
  // if (!/[\w-]{84}|[\w-]{24}\.[\w-]{6}\.[\w-]{27}/.test(token)) return c.text('Invalid token.', 403);

  // const command = {
  //   name: commandName,
  //   description: 'Send a message with this profile',
  //   options: [
  //     {
  //       type: 3,
  //       name: '_',
  //       description: 'This is the message to send',
  //       required: true,
  //       min_length: 1,
  //       max_length: 4000,
  //     },
  //   ],
  //   integration_types: [0, 1],
  //   contexts: [0, 1, 2],
  // };

  const { isValid, interaction } = await server.verifyDiscordRequest(c.req, publicKey);
  if (!isValid || !interaction) return c.text('Bad request signature.', 401);

  const payload = {
    type: interaction?.type,
    applicationId: interaction?.application_id,
    // commandName: interaction?.data?.name?.toLowerCase(),
    content: interaction?.data?.options?.[0]?.value,
  };

  if (payload.type === 1) {
    // const createCommandReq = await fetch(
    //   `https://discord.com/api/v10/applications/${encodeURIComponent(payload.applicationId)}/commands`,
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bot ${token}`,
    //     },
    //     method: 'PUT',
    //     body: JSON.stringify([command]),
    //   },
    // );
    // if (createCommandReq.status !== 200) return c.text('Failed to create commands', 403);

    return c.json({ type: 1 });
  }

  if (payload.type !== 2) return c.text('Invalid interaction.type.', 401);
  if (!/^(\d{17,21})$/.test(payload.applicationId)) {
    return c.text('Invalid interaction.application_id.', 401);
  }
  // if (!/^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u.test(payload.commandName)) {
  //   return c.text('Invalid interaction.data.name.', 400);
  // }
  if (
    typeof payload.content !== 'string' ||
    payload.content.length < 1 ||
    payload.content.length > 4000
  ) {
    return c.text('Invalid interaction.data.options[0].value.', 400);
  }

  // if (payload.commandName !== commandName.toLowerCase())
  //   return c.json({ error: 'Unknown Type' }, 400);

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
