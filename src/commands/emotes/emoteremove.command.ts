import { noEmotePermissions } from 'src/guards/discordMemberPermissions';
import { cleanString } from 'src/helpers/cleanString';
import { Log } from 'src/libs/logger';
import { EmotesCommandResponse } from 'src/responses/emotes';
import { YeonnaCommand } from 'src/types';

export const emoteremove: YeonnaCommand =
{
  name: 'emoteremove',
  aliases: ['erm'],
  guards: [noEmotePermissions],
  run: async ({ discord }) =>
  {
    const response = new EmotesCommandResponse(discord);

    const content = discord.getMessageContent();
    let [, emoteName] = cleanString(content).split(' ');
    if(!emoteName)
      return response.noEmoteOrName();

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
      return response.nonExisting();

    try
    {
      const deletedEmote = await emoteToDelete.delete();
      response.deleted(deletedEmote);
    }
    catch(error: any)
    {
      Log.error(error);
      response.cannotRename();
    }
  },
};
