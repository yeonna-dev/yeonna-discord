import axios from 'axios';
import { Command } from 'comtroller';
import sharp from 'sharp';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { EmotesCommandResponse } from 'src/responses/emotes';

export const resizetoemote: Command =
{
  name: 'resizetoemote',
  aliases: ['rte'],
  run: async ({ discord }: { discord: Discord, }) =>
  {
    const response = new EmotesCommandResponse(discord);

    let url = discord.getMediaFromMessage({ imageOnly: true });
    if(!url)
      return response.noMedia();

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
      response.cannotResize();
    }
  },
};
