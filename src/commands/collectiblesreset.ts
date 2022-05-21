import { Command } from 'comtroller';
import { isDeveloperOnly } from '../guards/isDeveloper';
import { RewardMostCollectibles } from '../jobs/rewardMostCollectibles';

export const collectiblesreset: Command =
{
  name: 'collectiblesreset',
  aliases: ['creset'],
  guards: [isDeveloperOnly],
  run: () => RewardMostCollectibles.run(),
};
