import { Discord } from 'src/libs/discord';
import { CommandResponse } from 'src/responses/common';
import { table } from 'table';
import { Collection, UserCollection } from 'yeonna-core/dist/modules/items/services/CollectionsService';
import { InventoryItem } from 'yeonna-core/dist/modules/items/services/InventoriesService';
import { Item } from 'yeonna-core/dist/modules/items/services/ItemsService';

export class ItemsCommandResponse extends CommandResponse
{
  constructor(discord: Discord)
  {
    super(discord);
  }

  foundItem = (item: Item) => this.discord.replyEmbed({
    title: `Found **${item.name}**!`,
  });

  foundNothing = () => this.discord.replyEmbed({
    title: 'You found nothing. Keep searching!',
  });

  completedCollections = (collections: Collection[], totalBonus: number) =>
  {
    let response = collections.length === 1
      ? `You have completed the **${collections.pop()?.name} collection**!`
      : (
        `You have completed ${collections.length} collections!\n`
        + collections.map(({ name }) => `• **${name}**`).join('\n')
      );

    return this.discord.replyEmbed({
      title: 'Congratulations!',
      description: `${response}\nYou earn a bonus of __**${totalBonus} points**__!`,
    });
  };

  items = (items: InventoryItem[]) =>
  {
    const tableHeader = ['Item', 'Category', 'Amount', 'Cost'];
    const tableBody = [];
    let totalAmount = 0;
    let totalCost = 0;
    for(const { name, category, amount, price } of items)
    {
      if(!name || !price)
        return;

      totalAmount += amount;
      totalCost += amount * price;
      tableBody.push([
        name.length >= 20 ? `${name.substring(0, 19)}…` : name,
        category,
        amount,
        amount * price,
      ]);
    }

    const tableFooter = ['', 'TOTAL', totalAmount, totalCost];
    const tableData = [
      tableHeader,
      ...tableBody,
      tableFooter,
    ];

    const itemsTable = table(tableData, {
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
    });

    return this.discord.reply(
      '**Current Items**'
      + '\n```ml\n'
      + itemsTable
      + '\n```'
    );
  };

  collections = (collections: UserCollection[]) =>
  {
    let collectionNames = [];
    for(const { name } of collections)
    {
      if(!name)
        continue;

      collectionNames.push(`• **${name}**`);
    }

    this.discord.replyEmbed({
      title: 'Completed Collections',
      description: collectionNames.join('\n'),
    });
  };

  soldAll = (sellPrice: number) => this.discord.replyEmbed({
    title: `Sold all items for **${sellPrice}** points.`,
  });

  soldDuplicates = (sellPrice: number) => this.discord.replyEmbed({
    title: `Sold all excess duplicate items for **${sellPrice}** points.`,
  });

  soldByParameter = (sellParameter: string, sellPrice: number) => this.discord.replyEmbed({
    title: `Sold all "${sellParameter}" items for **${sellPrice}** points.`,
  });

  soldNothing = () => this.discord.replyEmbed({
    title: 'Sold nothing...'
  });

  noItems = () => this.discord.replyEmbed({
    title: 'You do not have items.',
  });

  noCollections = () => this.discord.replyEmbed({
    title: 'You have not completed any collections yet.',
  });

  cannotSearch = () => this.discord.replyEmbed({
    title: 'Cannot search an item. Please try again.'
  });

  cannotGetItems = () => this.discord.replyEmbed({
    title: 'Cannot get your items. Please try again.',
  });

  cannotGetCollections = () => this.discord.replyEmbed({
    title: 'Cannot get your collections. Please try again.',
  });

  cannotSell = () => this.discord.replyEmbed({
    title: 'Cannot sell items. Please try again.',
  });
};
