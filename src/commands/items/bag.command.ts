import { Command } from 'comtroller';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { ItemCommandResponse } from 'src/responses/items';
import { table } from 'table';
import { Core } from 'yeonna-core';

export const bag: Command =
{
  name: 'bag',
  aliases: ['b', 'items'],
  run: async ({ discord }: { discord: Discord, }) =>
  {
    const response = new ItemCommandResponse(discord);

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
      return response.cannotGetItems();
    }

    if(!items || !items.length)
      return response.noItems();

    let totalAmount = 0;
    let totalCost = 0;
    const inventoryTableData = [];
    for(const { name, amount, price, category } of items)
    {
      if(!price || !name)
        continue;

      totalAmount += amount;
      totalCost += amount * price;
      inventoryTableData.push([
        name.length >= 20 ? `${name.substring(0, 19)}…` : name,
        category,
        amount,
        amount * price,
      ]);
    }

    const tableData = [
      ['Item', 'Category', 'Amount', 'Cost'],
      ...inventoryTableData,
      ['', 'TOTAL', totalAmount, totalCost],
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

    discord.reply(bag);
  },
};
