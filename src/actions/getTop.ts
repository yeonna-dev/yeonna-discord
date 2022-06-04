import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { Core } from 'yeonna-core';

// TODO: Update responses
export async function getTop(discord: Discord, collectibles?: boolean)
{
  discord.startTyping();

  const count = 10;
  const discordGuildId = discord.getGuildId();
  const top = await (collectibles
    ? Core.Obtainables.getTopCollectibles({ count, discordGuildId })
    : Core.Obtainables.getTopPoints({ count, discordGuildId })
  );

  if(!top || top.length === 0)
    return discord.send('No top users.');

  let board = '';
  for(const i in top)
  {
    const { discordId, amount } = top[i];
    if(!discordId)
      continue;

    let username;
    const memberDisplayName = await discord.getGuildMemberDisplayName(discordId);
    if(memberDisplayName)
      username = memberDisplayName;
    else
    {
      let name;
      try
      {
        name = await discord.getUsername(discordId);
      }
      catch(error: any)
      {
        /*
        Error code `10013` is when the given user is an unknown user.
          Error code `10007` is when the user is not a member of the server.
          There is no need to log these errors because these are expected scenarios.
        */
        if(error.code !== 10013 && error.code !== 10007)
          Log.error(error);
      }

      if(!name)
        continue;

      username = name;
    }

    board += `${parseInt(i) + 1}. ${amount} - ${username}\n`;
  }

  discord.send(board);
}
