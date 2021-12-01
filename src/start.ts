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

    const command = comtroller.run(message.content, { message });
    if(command)
      Log.command(message);
  });

  startJobs(bot);
})();
