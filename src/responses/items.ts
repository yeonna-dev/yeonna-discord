import { Discord } from 'src/libs/discord';
import { CommandResponse } from 'src/responses/common';
import { Collection, UserCollection } from 'yeonna-core/dist/modules/items/services/CollectionsService';
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
