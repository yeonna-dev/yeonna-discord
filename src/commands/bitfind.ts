import { Command, parseParamsToArray } from 'comtroller';
import { findUserBits } from 'yeonna-core';

import { DiscordMessage } from '../utilities/discord';
import { Log } from '../utilities/logger';

// TODO: Update responses.
export const bitfind: Command =
{
  name: 'bitfind',
  aliases: ['bf'],
  run: async ({ message, params }: { message: DiscordMessage, params: string; }) =>
  {
    const [search] = parseParamsToArray(params);
    const userIdentifier = message.author.id;
    try
    {
      message.channel.startTyping();

      const result = await findUserBits({ userIdentifier, search });
      if(result.length === 0)
        return message.channel.send('No bits found.');

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
        return message.channel.send(createPage(0));

      message.channel.sendPaginated({ createPage, involvedUserIDs: [userIdentifier] });
    }
    catch(error: any)
    {
      Log.error(error);
      message.channel.send('Cannot find bits.');
    }
  },
};
