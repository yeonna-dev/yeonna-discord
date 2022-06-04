import { parseParamsToArray } from 'comtroller';
import { GuildMemberRoleManager } from 'discord.js';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { Config } from 'yeonna-config';
import { Core } from 'yeonna-core';

export async function updateStreak({
  discord,
  increment,
  decrement,
  reset,
  params,
}: {
  discord: Discord,
  increment?: boolean,
  decrement?: boolean,
  reset?: boolean,
  params?: string,
})
{
  const userIdentifier = discord.getAuthorId();
  const discordGuildId = discord.getGuildId();
  if(!discordGuildId)
    return;

  let count;
  if(reset)
    count = 0;
  else
  {
    let [countString] = parseParamsToArray(params || '');
    if(count && isNaN(count) && (!increment || !decrement))
      return;

    if(countString)
      count = Number(countString);
  }

  discord.startTyping();

  let streaksName;
  let streaksRoles;
  try
  {
    const { streaks } = await Config.ofGuild(discordGuildId);
    streaksName = streaks?.name;
    streaksRoles = streaks?.roles;
  }
  catch(error)
  {
    Log.error(error);
    discord.send('Oops. Something went wrong. Please try again.');
  }

  let streak;
  try
  {
    streak = await Core.Streaks.update({
      userIdentifier,
      discordGuildId,
      count,
      increment,
      decrement,
    });
  }
  catch(error)
  {
    Log.error(error);
    return discord.send('Oops. Something went wrong. Please try again.');
  }

  if(!streak)
    return;

  const { previous, current } = streak;

  const previousCount = previous?.count || 0;
  const previousCountString = `${previousCount} ${streaksName}`;
  const currentCountString = `${current.count} ${streaksName}`;

  const replyEmbed = discord.createDiscordEmbed({
    title: `Updated your streak from ${previousCountString} ➡️ __${currentCountString}__`,
  });

  discord.replyEmbed(replyEmbed);

  const streakCount = current.count;
  if(!streaksRoles)
    return;

  /* Find the key of the role to assign, which would be the
    lower bound of the range where the streak count is. */
  const roleKeys = Object.keys(streaksRoles);
  let roleKey = roleKeys.find((_, i, array) =>
    !array[i + 1] || Number(array[i + 1]) > streakCount);

  /* Find the key of the previous role, which would be unassigned
    if there would be a new streak role to assign. */
  let previousRoleKey = roleKeys.find((_, i, array) =>
    !array[i + 1] || Number(array[i + 1]) > (previous?.count || 0));

  if(!roleKey)
    return;

  const newRoleId = streaksRoles[Number(roleKey)];
  const previousRoleId = streaksRoles[Number(previousRoleKey)];
  try
  {
    const roles = await discord.getRoles(userIdentifier, true);
    if(!roles)
      return;

    const rolesManager = roles as GuildMemberRoleManager;
    const currentRole = rolesManager.cache.find(({ id }) => id === previousRoleId);

    /* Assign the new streak role if there is no streak role yet. */
    if(!currentRole)
    {
      await rolesManager.add(newRoleId);
      return;
    }

    const rolesToUnassign = Object.values(streaksRoles).filter(id => id !== newRoleId);
    if(rolesToUnassign.length !== 0)
      await rolesManager.remove(rolesToUnassign);

    /* Don't assign a new streak role if the supposed new streak role is not new. */
    if(currentRole.id !== newRoleId)
      await rolesManager.add(newRoleId);
  }
  catch(error)
  {
    Log.error(error);
  }
}
