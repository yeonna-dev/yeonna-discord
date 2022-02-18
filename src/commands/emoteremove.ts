import { Command } from 'comtroller';

import { DiscordMessage } from '../utilities/discord';
import { Log } from '../utilities/logger';

import { getGuildEmotes } from '../actions/getGuildEmotes';

import { noEmotePermissions } from '../guards/discordMemberPermissions';

import { cleanString } from '../helpers/cleanString';

// TODO: Update responses.
export const emoteremove: Command =
{
  name: 'emoteremove',
  aliases: ['erm'],
  guards: [noEmotePermissions],
  run: async ({ message }: { message: DiscordMessage, }) =>
  {
    const { content } = message;

    let [, emoteName] = cleanString(content).split(' ');
    if(!emoteName)
      return message.channel.send('Please type the emote or the name of the emote.');

    message.channel.startTyping();
    const emotes = await getGuildEmotes(message.original);
    if(!emotes)
      return message.channel.send('Cannot get the emojis of this server.');

    let emoteToDelete;

    /* If there is no emote in the message, try finding the emote to delete by name. */
    const emoteIdMatch = emoteName.match(/(?:<a?)?:\w+:(\d+)>?/i);
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
