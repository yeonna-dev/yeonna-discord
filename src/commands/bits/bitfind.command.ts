import { parseParamsToArray } from 'comtroller';
import { Log } from 'src/libs/logger';
import { BitsCommandResponse } from 'src/responses/bits';
import { YeonnaCommand } from 'src/types';
import { Core } from 'yeonna-core';
import { UserBit } from 'yeonna-core/dist/modules/bits/services/UserBitService';

export const bitfind: YeonnaCommand =
{
  name: 'bitfind',
  aliases: ['bf'],
  run: async ({ discord, params }) =>
  {
    const response = new BitsCommandResponse(discord);

    const [search] = parseParamsToArray(params);
    const userIdentifier = discord.getAuthorId();

    discord.startTyping();

    let bits;
    try
    {
      bits = await Core.Bits.findUserBits({ userIdentifier, search });
    }
    catch(error)
    {
      Log.error(error);
      response.cannotFind();
    }

    if(!bits || bits.length === 0)
      return response.noneFound();

    const bitsPerPage = 5;
    const createPage = ({ pageItems, pageNumber }: { pageItems: UserBit[], pageNumber: number; }) =>
    {
      const pageContent = pageItems
        .map(({ bit }, i) => `${(pageNumber * bitsPerPage) + i + 1}. ${bit.content}`)
        .join('\n');

      return `Found bits\n\n${pageContent}`;
    };

    if(bits.length <= bitsPerPage)
      return discord.send(createPage({ pageItems: bits, pageNumber: 0 }));

    // TODO: Update responses.
    discord.sendPaginated({
      createPage,
      data: bits,
      itemsPerPage: bitsPerPage,
      pageControlUserIds: [userIdentifier],
    });
  },
};
