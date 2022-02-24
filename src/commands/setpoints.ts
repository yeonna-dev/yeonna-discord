import { Command } from 'comtroller';

import { updatePoints } from '../actions/updatePoints';

import { isDeveloperOnly } from '../guards/isDeveloper';

export const setpoints: Command =
{
  name: 'setpoints',
  guards: [isDeveloperOnly],
  run: ({ discord, params }) => updatePoints({ discord, params }),
};
