import { Command } from 'comtroller';
import { Core } from 'yeonna-core';
import { table } from 'table';

import { Discord } from '../utilities/discord';
import { Log } from '../utilities/logger';

// TODO: Update responses.
export const bag: Command =
{
  name: 'bag',
  aliases: ['b'],
  run: async ({ discord }: { discord: Discord, }) =>
  {
    discord.startTyping();

    let items;
    try
    {
      items = await Core.Items.getUserItems({
        userIdentifier: discord.getAuthorId(),
        discordGuildId: discord.getGuildId(),
      });
    }
    catch(error)
    {
      Log.error(error);
      return discord.send('Cannot get your items. Please try again.');
    }

    if(!items || !items.length)
      return discord.send('You do not have items.');

    let totalAmount = 0;
    let totalCost = 0;
    const inventoryTableData = [];
    for(const { name, amount, price } of items)
    {
      if(!price || !name) continue;

      totalAmount += amount;
      totalCost += amount * price;
      inventoryTableData.push([
        name.length >= 20 ? `${name.substring(0, 19)}…` : name,
        amount,
        amount * price,
      ]);
    }

    const tableData = [
      ['Item', 'Amount', 'Cost'],
      ...inventoryTableData,
      ['TOTAL', totalAmount, totalCost],
    ];

    const bag = '```ml\n'
      + table(tableData, {
        border:
        {
          topBody: `─`,
          topJoin: `┬`,
          topLeft: `┌`,
          topRight: `┐`,

          bottomBody: `─`,
          bottomJoin: `┴`,
          bottomLeft: `└`,
          bottomRight: `┘`,

          bodyLeft: `│`,
          bodyRight: `│`,
          bodyJoin: `│`,

          joinBody: `─`,
          joinLeft: `├`,
          joinRight: `┤`,
          joinJoin: `┼`
        },
        drawHorizontalLine: (index, size) => (
          index === 0
          || index === 1
          || index === size - 1
          || index === size
        ),
      })
      + '\n```';

    discord.send(bag);
  },
};
