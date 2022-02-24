import { Command } from 'comtroller';

import { Discord } from '../utilities/discord';
import { Log } from '../utilities/logger';

import { noEmotePermissions } from '../guards/discordMemberPermissions';

import { cleanString } from '../helpers/cleanString';

// TODO: Update responses.
export const emoteremove: Command =
{
  name: 'emoteremove',
  aliases: ['erm'],
  guards: [noEmotePermissions],
  run: async ({ discord }: { discord: Discord, }) =>
  {
    const content = discord.getMessageContent();
    let [, emoteName] = cleanString(content).split(' ');
    if(!emoteName)
      return discord.send('Please type the emote or the name of the emote.');

    discord.startTyping();

    let emoteFindString = emoteName;
    const emoteIdMatch = emoteName.match(/(?:<a?)?:\w+:(\d+)>?/i);
    if(emoteIdMatch)
    {
      const [, emoteId] = emoteIdMatch;
      emoteFindString = emoteId;
    }

    let emoteToDelete;
    try
    {
      emoteToDelete = await discord.findGuildEmoji(emoteFindString);
    }
    catch(error)
    {
      Log.error(error);
    }

    if(!emoteToDelete)
      return discord.send('There is no emote with that name.');

    try
    {
      const deleted = await emoteToDelete.delete();
      discord.send(`\`${deleted}\` has been deleted.`);
    }
    catch(error: any)
    {
      Log.error(error);
      discord.send('Cannot rename emote.');
    }
  },
};
