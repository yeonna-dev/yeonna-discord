import { Command, parseParamsToArray } from 'comtroller';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { BitsCommandResponse } from 'src/responses/bits';
import { Core } from 'yeonna-core';
import { UserBit } from 'yeonna-core/dist/modules/bits/services/UsersBitsService';

export const bitfind: Command =
{
  name: 'bitfind',
  aliases: ['bf'],
  run: async ({ discord, params }: { discord: Discord, params: string, }) =>
  {
    const response = new BitsCommandResponse(discord);

    const [search] = parseParamsToArray(params);
    const userIdentifier = discord.getAuthorId();

    discord.startTyping();

    let result;
    try
    {
      result = await Core.Bits.findUserBits({ userIdentifier, search });
    }
    catch(error)
    {
      Log.error(error);
      response.cannotFind();
    }

    if(!result || result.length === 0)
      return response.noneFound();

    const bitsPerPage = 5;
    const pages = result.reduce((batches, element, i) =>
    {
      i = Math.floor(i / bitsPerPage);
      if(!batches[i])
        batches[i] = [];

      batches[i].push(element);
      return batches;
    }, [] as UserBit[][]);

    const createPage = (pageNumber: number) =>
    {
      const pageData = pages[pageNumber];
      const pageContent = pageData
        .map(({ bit }, i) => `${(pageNumber * bitsPerPage) + i + 1}. ${bit.content}`)
        .join('\n');

      return `Found bits\n\n${pageContent}`;
    };

    if(result.length <= bitsPerPage)
      return discord.send(createPage(0));

    // TODO: Update responses.
    discord.sendPaginated({ createPage, involvedUserIDs: [userIdentifier] });
  },
};
