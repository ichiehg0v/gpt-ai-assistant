import { expect, test } from '@jest/globals';
import {
  COMMAND_SYS_DEPLOY,
  COMMAND_SYS_DOC,
} from '../app/commands/index.js';
import Context from '../app/context.js';
import { check } from '../app/handlers/deploy.js';

test('rejects the deploy command for a non-admin participant', () => {
  const context = {
    isAdmin: false,
    hasCommand: () => true,
  };

  expect(check(context)).toBe(false);
});

test('allows the deploy command for an explicitly authorized admin', () => {
  const context = {
    isAdmin: true,
    hasCommand: (command) => command === COMMAND_SYS_DEPLOY,
  };

  expect(check(context)).toBe(true);
});

test('hides deploy actions from non-admin quick replies', () => {
  const context = Object.create(Context.prototype);
  Object.defineProperty(context, 'isAdmin', { value: false });

  expect(context.filterAuthorizedActions([COMMAND_SYS_DOC, COMMAND_SYS_DEPLOY]))
    .toEqual([COMMAND_SYS_DOC]);
});

test('keeps deploy actions visible for an authorized admin', () => {
  const context = Object.create(Context.prototype);
  Object.defineProperty(context, 'isAdmin', { value: true });

  expect(context.filterAuthorizedActions([COMMAND_SYS_DOC, COMMAND_SYS_DEPLOY]))
    .toEqual([COMMAND_SYS_DOC, COMMAND_SYS_DEPLOY]);
});
