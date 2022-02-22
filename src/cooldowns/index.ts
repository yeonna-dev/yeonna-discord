import { Cooldowns } from 'comtroller';

export const cooldowns = new Cooldowns(`${__dirname}/cooldowns.data`);

export function checkCooldownInGuild(cooldownName: string, guildId: string, userDiscordId: string)
{
  /* Create a string which represents the cooldown's key
    from the guild ID and the user's Discord ID. */
  const cooldownKey = `${guildId}:${userDiscordId}`;
  return cooldowns.check(cooldownName, cooldownKey);
}
