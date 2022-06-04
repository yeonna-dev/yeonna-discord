import { Command } from 'comtroller';
import { noEmotePermissions } from 'src/guards/discordMemberPermissions';
import { cleanString } from 'src/helpers/cleanString';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';

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
