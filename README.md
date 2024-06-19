# Custom characters for Discord

I created this for anyone who wants to create and send messages with custom characters using Discord user apps, which you can use in DMs, group chats and servers where you have the `Use External Apps` permission.

## Setup

### 1. Create the application and customize your character

Go to the [Discord Developer Portal](https://discord.com/developers/applications) and click to `New Application` on the top right.

![image1](/assets/image1.png)

Then, set your application name as your character name, click the checkmark, and check the "Create" button.

![image2](/assets/image2.png)

Now, you'll see this screen. You can change your character's name here and also set your character's "About Me" description. Also, make sure to copy the "Application ID" on the side, because you'll need it later.

> This is absolutely optional but: you could put `https://github.com/real2two/characterbot/blob/main/README.md` on the bottom of the character's description to share this project around!

![image3](/assets/image3.png)

Go to the "Installation" page, toggle on "User Install", set the Install Link as "Discord Provided Link" and click "Save Changes".

![image4](/assets/image4.png)

Customize your character on the "Bot" page and disable the "Public Bot" toggle.

![image5](/assets/image5.png)

### 2. Create the commands

Make sure to still have your application ID on the side, because you'll need it very soon!

On the same page, obtain the bot token and copy it.

![image6](/assets/image6.png)

Now, open this website: [https://characterbot.onrender.com/](https://characterbot.onrender.com/)

Then, fill out the application ID, token and optionally a command name (defaults to `/c`), then click "Submit". It should result with "Success".

![image7](/assets/image7.png)

### 3. Add the interaction endpoint URL

Go back to "General Information" and set the "Interaction Endpoint URL" as `https://characterbot.customrpg.xyz/?public_key=[PUBLIC_KEY]`. Make sure to replace `[PUBLIC_KEY]` with the public key.

![image8](/assets/image8.png)

### 4. Authorize the bot to your account

Go back to "Installation" and copy the Install Link.

![image9](/assets/image9.png)

Open the Install Link URL and click "Authorize".

![image10](/assets/image10.png)

Then, reload your Discord and you should be able to use the command now!

![image11](/assets/image11.png)
