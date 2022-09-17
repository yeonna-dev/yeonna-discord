import { GuildConfig } from 'src/types';
import { ConfigType } from 'yeonna-config';

export function setConfigDefaults(config?: ConfigType)
{
  const guildConfig = config || {};
  if(!guildConfig.pointsName)
    guildConfig.pointsName = 'points';

  if(!guildConfig.collectiblesName)
    guildConfig.collectiblesName = 'collectibles';

  return guildConfig as GuildConfig;
}