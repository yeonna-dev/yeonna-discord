import { Command } from 'comtroller';

import { DiscordMessage } from '../utilities/discord';
import { Log } from '../utilities/logger';

import { cleanString } from '../helpers/cleanString';
import { getGuildEmotes } from '../actions/getGuildEmotes';

// TODO: Update responses.
export const emoteremove: Command =
{
  name: 'emoteremove',
  aliases: ['erm'],
  run: async ({ message }: { message: DiscordMessage, }) =>
  {
    const { content } = message;

    message.channel.startTyping();

    const emotes = await getGuildEmotes(message.original);
    if(!emotes)
      return message.channel.send('Cannot get the emojis of this server.');

    let [, emoteName] = cleanString(content).split(' ');


    const emoteIdMatch = emoteName.match(/(?:<a?)?:\w+:(\d+)>?/i);
    let emoteToDelete;

    /* If there is not emote in the message, try finding the emote to delete by name. */
    if(!emoteIdMatch)
      emoteToDelete = emotes.find(({ name }) => name === emoteName);
    else
    {
      const emoteId = emoteIdMatch[1];
      emoteToDelete = emotes.find(({ id }) => id === emoteId);
    }

    if(!emoteToDelete)
      return message.channel.send('There is no emote with that name.');

    try
    {
      const deleted = await emoteToDelete.delete();
      message.channel.send(`\`${deleted}\` has been deleted.`);
    }
    catch(error: any)
    {
      Log.error(error);
      message.channel.send('Cannot rename emote.');
    }
  },
};
