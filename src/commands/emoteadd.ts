import { Command } from 'comtroller';

import { DiscordMessage } from '../utilities/discord';
import { Log } from '../utilities/logger';

import { getMedia } from '../actions/getMedia';
import { getGuildEmotes } from '../actions/getGuildEmotes';

import { noEmotePermissions } from '../guards/discordMemberPermissions';

import { cleanString } from '../helpers/cleanString';

// TODO: Update responses.
export const emoteadd: Command =
{
  name: 'emoteadd',
  aliases: ['ea'],
  guards: [noEmotePermissions],
  run: async ({ message }: { message: DiscordMessage, }) =>
  {
    message.channel.startTyping();

    let media = getMedia(message.original);
    if(!media)
      return message.channel.send(
        'Please add a valid image or gif link or attachment or try again.'
      );

    let { content } = message;
    content = cleanString(content).replace(media, '');

    const [, emoteNamePart] = content.split(' ');
    if(!emoteNamePart)
      return message.channel.send('Please type the name for the emote.');

    let emoteName = emoteNamePart.substring(0, emoteNamePart.indexOf(' ')).trim();
    if(!emoteName)
      emoteName = emoteNamePart;

    const emojis = message.original.guild?.emojis;
    if(!emojis)
      return message.channel.send('This command can only be used in a server.');

    let existingEmotes = await getGuildEmotes(message.original);
    if(!existingEmotes)
      return message.channel.send('Cannot get the emojis of this server.');

    /* Check if there is already an existing emote with the given emote name. */
    const existingEmote = existingEmotes.find(({ name }) => name === emoteName);
    if(existingEmote)
      return message.channel.send(
        `There is already a \`:${existingEmote.name}:\``
        + `\nIt's ${existingEmote}`
      );

    try
    {
      /* Convert `.webp` to `.png` */
      media = media.replace('.webp', '.png');

      const emote = await emojis.create(media, emoteName);
      message.channel.send(`${emote}`);
    }
    catch(error: any)
    {
      Log.error(error);
      let response = 'An error occurred in adding the emote. Please try again.';
      const errorMessage: string = error.message;
      if(errorMessage.includes('File cannot be larger than 256.0 kb'))
        response = 'The image or gif cannot be larger than 256.0 KB.';
      if(errorMessage.includes('String value did not match validation regex'))
        response = 'Invalid emote name.';

      message.channel.send(response);
    }
  },
};
