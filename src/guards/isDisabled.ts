import { Command, Guard } from 'comtroller';
import { Discord } from 'src/libs/discord';
import { Config } from 'yeonna-config';

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
