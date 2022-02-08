import { Command, Guard } from 'comtroller';
import { Config } from 'yeonna-config';

import { DiscordMessage } from '../utilities/discord';

export const isDisabled: Guard = async (
  { command, message }: { command: Command, message: DiscordMessage, }
) =>
{
  let enabledCommands;
  const guildId = message.guild.id;
  if(guildId)
  {
    const guildConfig = await Config.ofGuild(guildId);
    enabledCommands = guildConfig?.enabledCommands;
  }

  if(!enabledCommands)
  {
    const globalConfig = await Config.global();
    enabledCommands = globalConfig.enabledCommands;
  }

  return !!enabledCommands && enabledCommands !== 'all' && !enabledCommands.includes(command.name);
};
