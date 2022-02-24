import { RewardMostCollectibles } from './rewardMostCollectibles';

import { Discord } from '../utilities/discord';

export function startJobs(discord: Discord)
{
  RewardMostCollectibles.start(discord);
}
