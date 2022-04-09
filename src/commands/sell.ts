import { Command, parseParamsToArray } from 'comtroller';
import { Core } from 'yeonna-core';

import { Discord } from '../utilities/discord';
import { Log } from '../utilities/logger';

enum SellTypes
{
  All = 'all',
  Duplicates = 'duplicates',
  Dup = 'dup',
  Dups = 'dups',
};

export const sell: Command =
{
  name: 'sell',
  run: async ({ discord, params }: { discord: Discord, params: string, }) =>
  {
    const userIdentifier = discord.getAuthorId();
    const discordGuildId = discord.getGuildId();

    const [sellType] = parseParamsToArray(params);
    try
    {
      switch(sellType)
      {
        case SellTypes.All:
          discord.startTyping();

          const soldItemsCost = await Core.Items.sellAllItems({ userIdentifier, discordGuildId });
          discord.reply(`Sold all items for **${soldItemsCost}** points.`);
          break;

        case SellTypes.Duplicates:
        case SellTypes.Dup:
        case SellTypes.Dups:
          discord.startTyping();

          const { sellPrice } = await Core.Items.sellDuplicateItems({
            userIdentifier,
            discordGuildId,
          });

          discord.reply(`Sold all excess duplicate items for **${sellPrice}** points.`);
          break;
      }
    }
    catch(error)
    {
      discord.reply('Cannot sell items. Please try again.');
      Log.error(error);
    }
  },
};

