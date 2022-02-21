import dotenv from 'dotenv';
dotenv.config();

import { Comtroller } from 'comtroller';
import { Config } from 'yeonna-config';

import { loadCommands } from './commands';
import { isDisabled } from './guards/isDisabled';
import { startJobs } from './jobs';
import { handleReactions } from './events/reactions';

import { Discord } from './utilities/discord';
import { Log } from './utilities/logger';

(async () =>
{
  await Config.load();
  const { config } = Config;

  const commands = await loadCommands();
  const comtroller = new Comtroller({
    commands,
    defaults:
    {
      prefix: config.global.prefix || ';',
      guards: [isDisabled],
    },
  });

  const bot = new Discord();
  bot.onMessage(message =>
  {
    if(message.fromBot)
      return;

    comtroller.run(message.content, { message });
    Log.command(message);

    /* Catch all errors */
    process.on('uncaughtException', error => Log.error(error));
  });

  /* Listen to and handle message reactions */
  handleReactions(bot.client);

  startJobs(bot);
})();
