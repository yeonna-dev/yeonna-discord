import { Command } from 'comtroller';
import sharp from 'sharp';
import axios from 'axios';

import { Log } from '../utilities/logger';

import { Discord } from '../utilities/discord';

// TODO: Update responses.
export const resizetoemote: Command =
{
  name: 'resizetoemote',
  aliases: ['rte'],
  run: async ({ discord }: { discord: Discord, }) =>
  {
    let url = discord.getMediaFromMessage({ imageOnly: true });
    if(!url)
      return discord.send('Please add a valid image link or attachment.');

    try
    {
      discord.startTyping();
      const { data } = await axios({ url, responseType: 'arraybuffer' });
      const resized = await sharp(data)
        .resize({ height: 48 })
        .toBuffer();

      discord.sendFiles([resized]);
    }
    catch(error: any)
    {
      Log.error(error);
      discord.send('Cannot resize image. Please try again.');
    }
  },
};
