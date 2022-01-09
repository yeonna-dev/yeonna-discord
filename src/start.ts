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
  Config.init();

  const commands = await loadCommands();
  const comtroller = new Comtroller({
    commands,
    defaults: { prefix: ';' },
  });

  const bot = new Discord();
  bot.onMessage(message =>
  {
    if(message.fromBot)
      return;

    const command = comtroller.get(message.content);
    if(!command)
      return;

    const enabledCommands = process.env.ENABLED_COMMANDS;
    if(
      enabledCommands &&
      enabledCommands !== 'all' &&
      !enabledCommands.split(',').includes(command.name)
    )
      return;

    const [, params = ''] = message.content.split(/\s(.+)/g);
    command.run({ params, message });
    Log.command(message);
  });

  startJobs(bot);
})();
