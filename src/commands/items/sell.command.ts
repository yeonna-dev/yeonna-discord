import { parseParamsToArray } from 'comtroller';
import { Log } from 'src/libs/logger';
import { ItemsCommandResponse } from 'src/responses/items';
import { YeonnaCommand } from 'src/types';
import { Core } from 'yeonna-core';

enum SellTypes
{
  All = 'all',
  Duplicates = 'duplicates',
  Dup = 'dup',
  Dups = 'dups',
};

export const sell: YeonnaCommand =
{
  name: 'sell',
  run: async ({ discord, params }) =>
  {
    const response = new ItemsCommandResponse(discord);

    const userIdentifier = discord.getAuthorId();
    const discordGuildId = discord.getGuildId();

    let [sellParameter] = parseParamsToArray(params);
    if(!sellParameter)
      return;

    discord.startTyping();

    try
    {
      switch(sellParameter)
      {
        /* Selling all items */
        case SellTypes.All: {
          const items = await Core.Items.sellAllItems({ userIdentifier, discordGuildId });
          if(!items)
            throw new Error();

          response.soldAll(items.sellPrice);
          break;
        }

        /* Selling by duplicates */
        case SellTypes.Duplicates:
        case SellTypes.Dup:
        case SellTypes.Dups: {
          const items = await Core.Items.sellDuplicateItems({
            userIdentifier,
            discordGuildId,
          });

          if(!items)
            throw new Error();

          response.soldDuplicates(items.sellPrice);
          break;
        }

        /* Selling by category */
        default: {
          sellParameter = sellParameter.toLowerCase();

          const items = await Core.Items.sellByCategory({
            userIdentifier,
            discordGuildId,
            category: sellParameter,
          });

          if(!items)
            throw new Error();

          const { sellPrice, soldItems } = items;
          if(soldItems.length === 0)
            return response.soldNothing();

          response.soldByParameter(sellParameter, sellPrice);
        }
      }
    }
    catch(error)
    {
      response.cannotSell();
      Log.error(error);
    }
  },
};
