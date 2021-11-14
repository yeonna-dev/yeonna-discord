import { Command, parseParamsToArray } from 'comtroller';
import { findUserBits } from 'yeonna-core';

import { DiscordMessage } from '../utilities/discord';
import { Log } from '../utilities/logger';

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

      const bitsPerPage = 5;
      const pages: [any[]] = result.reduce((batches, element, i) =>
      {
        i = Math.floor(i / bitsPerPage);
        if(!batches[i])
          batches[i] = [];

        batches[i].push(element);
        return batches;
      }, []);

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
