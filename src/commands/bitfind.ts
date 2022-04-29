import { Command, parseParamsToArray } from 'comtroller';
import { Core } from 'yeonna-core';

import { Discord } from '../libs/discord';
import { Log } from '../libs/logger';

// TODO: Update responses.
export const bitfind: Command =
{
  name: 'bitfind',
  aliases: ['bf'],
  run: async ({ discord, params }: { discord: Discord, params: string, }) =>
  {
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
      discord.send('Cannot find bits.');
    }

    if(!result || result.length === 0)
      return discord.send('No bits found.');

    const bitsPerPage = 5;
    const pages = result.reduce((batches, element, i) =>
    {
      i = Math.floor(i / bitsPerPage);
      if(!batches[i])
        batches[i] = [];

      batches[i].push(element);
      return batches;
    }, [] as any[][]);

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

    discord.sendPaginated({ createPage, involvedUserIDs: [userIdentifier] });
  },
};
