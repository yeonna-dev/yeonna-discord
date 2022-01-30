import { Command, Guard } from 'comtroller';
import { Config } from '../utilities/config';
import { DiscordMessage } from '../utilities/discord';

export const isDisabled: Guard = async (
  { command, message }: { command: Command, message: DiscordMessage, }
) =>
{
  const { config } = Config;

  let enabledCommands;
  const guildId = message.guild.id;
  if(guildId)
  {
    const guildConfig = config.guilds[guildId];
    enabledCommands = guildConfig?.enabledCommands;
  }

  if(!enabledCommands)
    enabledCommands = config?.enabledCommands;

  return !!enabledCommands && enabledCommands !== 'all' && !enabledCommands.includes(command.name);
};
