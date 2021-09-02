require('dotenv').config();

import { Client } from 'discord.js';
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

  const discordBot = new Client();
  discordBot.login(process.env.BOT_TOKEN);

  discordBot.on('ready', () => Log.info(`Discord bot connected as ${discordBot.user?.tag}`, true));

  discordBot.on('message', message =>
  {
    if(message.author.bot)
      return;

    const command = comtroller.run(message.content, { message });
    if(command)
      Log.command(message);
  });
})();
