import { Command, Guard } from 'comtroller';
import { Config } from 'yeonna-config';

import { Discord } from '../libs/discord';

export const isDisabled: Guard = async (
  { command, discord }: { command: Command, discord: Discord, }
) =>
{
  let enabledCommands;
  const guildId = discord.getGuildId();
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

  return enabledCommands !== 'all' && !!enabledCommands && !enabledCommands.includes(command.name);
};
