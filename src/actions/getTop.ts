import { getTopCollectibles, getTopPoints } from 'yeonna-core';
import { DiscordMessage } from '../utilities/discord';

// TODO: Update responses
export async function getTop(message: DiscordMessage, collectibles?: boolean)
{
  if(message.channel.isDM())
    return message.channel.send('This command can only be used in a guild.');

  message.channel.startTyping();

  const count = 10;
  const guild = message.guild.id;
  const top = await (collectibles
    ? getTopCollectibles({ count, discordGuildID: guild })
    : getTopPoints({ count, discordGuildID: guild })
  );

  let board = '';
  for(const i in top)
  {
    const { discordID, points } = top[i];
    if(!discordID)
      continue;

    let username;
    const member = await message.guild.getMember(discordID);
    if(!member)
    {
      const user = await message.client.getUser(discordID);
      if(!user)
        continue;

      username = user.username;
    }
    else username = member.displayName;

    board += `${parseInt(i) + 1}. ${points} - ${username}\n`;
  }

  message.channel.send(board);
}
