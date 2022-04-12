import dotenv from 'dotenv';
dotenv.config();

import { Comtroller } from 'comtroller';
import { Config } from 'yeonna-config';

import { loadCommands } from './commands';
import { isDisabled } from './guards/isDisabled';
import { startJobs } from './jobs';
import { handleReactions } from './events/reactions';

import { DiscordClient, Discord } from './utilities/discord';
import { Log } from './utilities/logger';

(async () =>
{
  await Config.load();
  const { config } = Config;

  const commands = await loadCommands();
  const prefix = config.global.prefix || ';';
  const comtroller = new Comtroller({
    commands,
    defaults:
    {
      prefix,
      guards: [isDisabled],
    },
  });

  const bot = new DiscordClient();
  bot.onGuildMemberMessage(async message =>
  {
    const discord = new Discord(message);
    const guildId = discord.getGuildId();
    let content = discord.getMessageContent();

    if(guildId)
    {
      let guildConfig;
      try
      {
        guildConfig = await Config.ofGuild(guildId);
      }
      catch(error)
      {
        Log.command(message, true);
        Log.error(error);
      }

      /*
        If the command was done in a guild, get the guild's command prefix
        and check if the message content starts with the guild's prefix.
        If it does, replace the start of the message content (the prefix part)
        with the global prefix to trigger the command.
        If if starts with the global prefix, do not run the command.
      */
      const guildPrefix = guildConfig?.prefix;
      if(guildPrefix)
      {
        if(content.startsWith(prefix))
          return;

        if(content.startsWith(guildPrefix))
          content = content.replace(guildPrefix, prefix);
      }

      /*
        If the command was done in a guild, get the guild's command aliases
        and check if the command part of the message content starts with any
        of the aliases. If it does, replace the command part of the message
        content (the prefix part) with the matched alias to trigger the command.
      */
      const guildCommandAliases = guildConfig?.commandAliases;
      if(guildCommandAliases)
      {
        for(const command in guildCommandAliases)
        {
          const contentWithoutPrefix = content.substring((guildPrefix || prefix).length);
          const [commandString] = contentWithoutPrefix.split(' ');
          const alias = guildCommandAliases[command]
            .find((alias: string) => commandString.toLowerCase() === alias);

          if(alias)
          {
            content = content.replace(commandString, command);
            break;
          }
        }
      }
    }

    try
    {
      const command = await comtroller.run(content, { message, discord });
      if(command)
        Log.command(message);
    }
    catch(error)
    {
      Log.command(message, true);
      Log.error(error);
    }
  });

  /* Listen to and handle message reactions */
  handleReactions(bot);

  startJobs(bot);
})();
