import { Command } from 'comtroller';
import sharp from 'sharp';
import axios from 'axios';

import { DiscordMessage } from '../utilities/discord';
import { Log } from '../utilities/logger';

import { getMedia } from '../actions/getMedia';

// TODO: Update responses.
export const resizetoemote: Command =
{
  name: 'resizetoemote',
  aliases: ['rte'],
  run: async ({ message }: { message: DiscordMessage, }) =>
  {
    let url = getMedia(message.original, true);
    if(!url)
      return message.channel.send('Please add a valid image link or attachment or try again.');

    try
    {
      message.channel.startTyping();
      const { data } = await axios({ url, responseType: 'arraybuffer' });
      const resized = await sharp(data)
        .resize({ height: 48 })
        .toBuffer();

      message.original.channel.send({ files: [{ attachment: resized }] });
    }
    catch(error: any)
    {
      Log.error(error);
      message.channel.send('Cannot resize image. Please try again.');
    }
  },
};
