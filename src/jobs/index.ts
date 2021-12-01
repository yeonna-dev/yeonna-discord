import { rewardMostCollectibles } from './rewardMostCollectibles';

import { Discord } from '../utilities/discord';

export function startJobs(discord: Discord)
{
  rewardMostCollectibles.start(discord);
}
