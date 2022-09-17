import { isDeveloperOnly } from 'src/guards/isDeveloper';
import { RewardMostCollectibles } from 'src/jobs/rewardMostCollectibles';
import { YeonnaCommand } from 'src/types';

export const collectiblesreset: YeonnaCommand =
{
  name: 'collectiblesreset',
  aliases: ['creset'],
  guards: [isDeveloperOnly],
  run: () => RewardMostCollectibles.run(),
};
