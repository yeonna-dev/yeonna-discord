import { Command } from 'comtroller';
import { DiscordAPIError } from 'discord.js';
import { noEmotePermissions } from 'src/guards/discordMemberPermissions';
import { cleanString } from 'src/helpers/cleanString';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { EmotesCommandResponse } from 'src/responses/emotes';

export const emoteadd: Command =
{
  name: 'emoteadd',
  aliases: ['ea'],
  guards: [noEmotePermissions],
  run: async ({ discord }: { discord: Discord, }) =>
  {
    const response = new EmotesCommandResponse(discord);

    discord.startTyping();

    /* Add short delay to wait for message attachments to load. */
    await new Promise(resolve => setTimeout(resolve, 3000));

    let media = discord.getMediaFromMessage();
    if(!media)
      return response.noMedia();

    let content = discord.getMessageContent();
    content = cleanString(content).replace(media, '');

    const [, emoteNamePart] = content.split(' ');
    if(!emoteNamePart)
      return response.noName();

    let emoteName = emoteNamePart.substring(0, emoteNamePart.indexOf(' ')).trim();
    if(!emoteName)
      emoteName = emoteNamePart;

    /* Check if there is already an existing emote with the given emote name. */
    const existingEmote = await discord.findGuildEmoji(emoteName);
    if(existingEmote)
      return response.existing(existingEmote);

    try
    {
      /* Convert `.webp` to `.png` */
      media = media.replace('.webp', '.png');

      const emote = await discord.createGuildEmoji(media, emoteName);
      response.saved(emote);
    }
    catch(error: any | DiscordAPIError)
    {
      Log.error(error);

      if(error instanceof DiscordAPIError)
      {
        const errorMessage = error.message;
        if(errorMessage.includes('File cannot be larger than'))
          response.fileTooLarge(errorMessage);
        else if(errorMessage.includes('String value did not match validation regex'))
          response.invalidName();
        else
          response.error();
      }
      else
        response.error();
    }
  },
};
