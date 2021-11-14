require('dotenv').config();

import { Comtroller } from 'comtroller';

import { loadCommands } from './commands';
import { Discord } from './utilities/discord';
import { Log } from './utilities/logger';

(async () =>
{
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
})();
