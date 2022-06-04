import { Command } from 'comtroller';
import { isDeveloperOnly } from 'src/guards/isDeveloper';
import { RewardMostCollectibles } from 'src/jobs/rewardMostCollectibles';

export const collectiblesreset: Command =
{
  name: 'collectiblesreset',
  aliases: ['creset'],
  guards: [isDeveloperOnly],
  run: () => RewardMostCollectibles.run(),
};
