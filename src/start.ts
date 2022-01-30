import dotenv from 'dotenv';
dotenv.config();

import { Comtroller } from 'comtroller';

import { loadCommands } from './commands';
import { isDisabled } from './guards/isDisabled';
import { startJobs } from './jobs';
import { handleReactions } from './events/reactions';

import { Config } from './utilities/config';
import { Discord } from './utilities/discord';
import { Log } from './utilities/logger';

const guards = [isDisabled];

(async () =>
{
  await Config.init();
  const { config } = Config;

  const commands = await loadCommands();
  const comtroller = new Comtroller({
    commands,
    defaults:
    {
      prefix: config.prefix || ';',
      guards,
    },
  });

  const bot = new Discord();
  bot.onMessage(message =>
  {
    if(message.fromBot)
      return;

    comtroller.run(message.content, { message });
    Log.command(message);
  });

  /* Listen to and handle message reactions */
  handleReactions(bot.client);

  startJobs(bot);
})();
