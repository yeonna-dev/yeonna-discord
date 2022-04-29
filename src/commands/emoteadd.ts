import { Command } from 'comtroller';

import { Discord } from '../libs/discord';
import { Log } from '../libs/logger';

import { noEmotePermissions } from '../guards/discordMemberPermissions';

import { cleanString } from '../helpers/cleanString';

// TODO: Update responses.
export const emoteadd: Command =
{
  name: 'emoteadd',
  aliases: ['ea'],
  guards: [noEmotePermissions],
  run: async ({ discord }: { discord: Discord, }) =>
  {
    discord.startTyping();

    /* Add short delay to wait for message attachments to load. */
    await new Promise(resolve => setTimeout(resolve, 3000));

    let media = discord.getMediaFromMessage();
    if(!media)
      return discord.send(
        'Please add a valid image or gif link or attachment or try again.'
      );

    let content = discord.getMessageContent();
    content = cleanString(content).replace(media, '');

    const [, emoteNamePart] = content.split(' ');
    if(!emoteNamePart)
      return discord.send('Please type the name for the emote.');

    let emoteName = emoteNamePart.substring(0, emoteNamePart.indexOf(' ')).trim();
    if(!emoteName)
      emoteName = emoteNamePart;

    /* Check if there is already an existing emote with the given emote name. */
    const existingEmote = await discord.findGuildEmoji(emoteName);
    if(existingEmote)
      return discord.send(
        `There is already a \`:${existingEmote.name}:\``
        + `\nIt's ${existingEmote}`
      );

    try
    {
      /* Convert `.webp` to `.png` */
      media = media.replace('.webp', '.png');

      const emote = await discord.createGuildEmoji(media, emoteName);
      discord.send(`${emote}`);
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

      discord.send(response);
    }
  },
};
