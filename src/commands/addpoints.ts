import { Command } from 'comtroller';

import { updatePoints } from '../actions/updatePoints';

import { isDeveloperOnly } from '../guards/isDeveloper';

export const addpoints: Command =
{
  name: 'addpoints',
  guards: [isDeveloperOnly],
  run: ({ message, params }) => updatePoints({ message, params, add: true }),
};
