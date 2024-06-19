const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.post('/commands', async (req, res) => {
  const { id, token, commandName } = req.body;

  if (!/^(\d{17,21})$/.test(id)) return alert('You have provided an invalid application id');
  if (!/[\w-]{84}|[\w-]{24}\.[\w-]{6}\.[\w-]{27}/.test(token))
    return alert('You have provided an invalid token');
  if (!/^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u.test(commandName))
    return alert('The provided value cannot be the command name');

  const command = {
    name: commandName,
    description: 'Send a message with this profile',
    options: [
      {
        type: 3,
        name: '_',
        description: 'This is the message to send',
        required: true,
        min_length: 1,
        max_length: 4000,
      },
    ],
    integration_types: [0, 1],
    contexts: [0, 1, 2],
  };

  const fetched = await fetch(
    `https://discord.com/api/v10/applications/${encodeURIComponent(id)}/commands`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${token}`,
      },
      method: 'PUT',
      body: JSON.stringify([command]),
    },
  );
  res
    .status(fetched.status)
    .send(fetched.status === 200 ? 'Success!' : 'Failed to create commands');
});

app.listen(3000);
