import { Command } from 'comtroller';

import { updatePoints } from '../actions/updatePoints';

import { isDeveloperOnly } from '../guards/isDeveloper';

export const addpoints: Command =
{
  name: 'addpoints',
  guards: [isDeveloperOnly],
  run: ({ discord, params }) => updatePoints({ discord, params, add: true }),
};
