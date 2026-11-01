import * as migration_20261030_132750_initial from './20261030_132750_initial';

export const migrations = [
  {
    up: migration_20261030_132750_initial.up,
    down: migration_20261030_132750_initial.down,
    name: '20261030_132750_initial'
  },
];
