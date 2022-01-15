import dotenv from 'dotenv';
dotenv.config();

import { Comtroller } from 'comtroller';

import { loadCommands } from './commands';
import { startJobs } from './jobs';

import { Config } from './utilities/config';
import { Discord } from './utilities/discord';
import { Log } from './utilities/logger';

(async () =>
{
  await Config.init();
  const { config } = Config;

  const commands = await loadCommands();
  const comtroller = new Comtroller({
    commands,
    defaults: { prefix: config.prefix || ';' },
  });

  const bot = new Discord();
  bot.onMessage(message =>
  {
    if(message.fromBot)
      return;

    const command = comtroller.get(message.content);
    if(!command)
      return;

    let enabledCommands;
    const guildId = message.guild.id;
    if(guildId)
    {
      const guildConfig = config.guilds[guildId];
      enabledCommands = guildConfig?.enabledCommands;
    }

    if(!enabledCommands)
      enabledCommands = config?.enabledCommands;

    if(enabledCommands && enabledCommands !== 'all' && !enabledCommands.includes(command.name))
      return;

    const [, params = ''] = message.content.split(/\s(.+)/g);
    command.run({ params, message });
    Log.command(message);
  });

  startJobs(bot);
})();
