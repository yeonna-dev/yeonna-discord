require('dotenv').config();

import { Client, Intents } from 'discord.js';
import { Comtroller } from 'comtroller';

import { loadCommands } from './commands';
import { Log } from './utilities/logger';

(async () =>
{
  const commands = await loadCommands();
  const comtroller = new Comtroller({
    commands,
    defaults: { prefix: ';' },
  });

  const discordBot = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_BANS,
      Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
      Intents.FLAGS.GUILD_INTEGRATIONS,
      Intents.FLAGS.GUILD_WEBHOOKS,
      Intents.FLAGS.GUILD_INVITES,
      Intents.FLAGS.GUILD_VOICE_STATES,
      Intents.FLAGS.GUILD_PRESENCES,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.GUILD_MESSAGE_TYPING,
      Intents.FLAGS.DIRECT_MESSAGES,
      Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
      Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    ],
  });
  discordBot.login(process.env.BOT_TOKEN);

  discordBot.on('ready', () => Log.info(`Discord bot connected as ${discordBot.user?.tag}`, true));

  discordBot.on('messageCreate', message =>
  {
    if(message.author.bot)
      return;

    const command = comtroller.run(message.content, { message });
    if(command)
      Log.command(message);
  });
})();
