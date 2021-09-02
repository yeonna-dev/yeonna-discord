import { Message, MessageReaction, User } from 'discord.js';
import { Command, parseParamsToArray } from 'comtroller';
import { findUserBits } from 'yeonna-core';

import { Log } from '../utilities/logger';

export const bitfind: Command =
{
  name: 'bitfind',
  aliases: [ 'bf' ],
  run: async ({ message, params }: { message: Message, params: string }) =>
  {
    const [ search ] = parseParamsToArray(params);
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

      let pageNumber = 0;
      const getPageContent = () =>
      {
        const pageData = pages[pageNumber];
        const pageContent = pageData
            .map(({ bit }, i) => `${(pageNumber * bitsPerPage) + i + 1}. ${bit.content}`)
            .join('\n');
          return `Found bits\n\n${pageContent}`;
      };

      const sentMessage = await message.channel.send(getPageContent());
      if(result.length <= bitsPerPage)
        return;

      const previousIcon = '⬅️';
      const nextIcon = '➡️';
      await sentMessage.react(previousIcon);
      await sentMessage.react(nextIcon);

      const filter = ({ emoji }: MessageReaction, user: User) =>
        [ previousIcon, nextIcon ].includes(emoji.name) && user.id === userIdentifier;
      const reactCollector = sentMessage
        .createReactionCollector(filter, { time: 30000, dispose: true });

      const onReact = async ({ emoji }: MessageReaction) =>
      {
        const newPage = pageNumber + (emoji.name === nextIcon ? 1 : -1);
        if(newPage < 0)
          return;

        pageNumber = newPage;
        await sentMessage.edit(getPageContent());
      };

      reactCollector.on('collect', onReact);
      reactCollector.on('remove', onReact);
      reactCollector.on('end', () => sentMessage.reactions.removeAll());
    }
    catch(error)
    {
      Log.error(error);
      message.channel.send('Cannot find bits.');
    }
    finally
    {
      message.channel.stopTyping(false);
    }
  },
};
