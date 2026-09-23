import js from '@eslint/js';
import n from 'eslint-plugin-n';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

/**
 * Flat config (ESLint 10 dropped .eslintrc support entirely).
 *
 * Replaces the previous `airbnb` + `plugin:node/recommended` setup:
 *   - eslint-config-airbnb was last published in 2022 and has no flat config;
 *     it also pulled the full React ruleset into this Node-only API.
 *   - eslint-plugin-node was superseded by eslint-plugin-n.
 *
 * Formatting is owned by Prettier — `prettierRecommended` must stay last so it
 * can switch off any stylistic rule that would fight it.
 */
export default [
  {
    ignores: ['node_modules/**', 'public/**', 'dist/**', 'coverage/**'],
  },

  js.configs.recommended,
  n.configs['flat/recommended-script'],
  prettierRecommended,

  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Formatting: keep the previous endOfLine setting so mixed line endings
      // do not fail the lint run.
      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      // Carried over from .eslintrc.json.
      'no-console': 'off',
      'no-param-reassign': 'off',
      'no-underscore-dangle': 'off',
      'no-return-await': 'off',
      'consistent-return': 'off',
      'func-names': 'off',
      'object-shorthand': 'off',
      'class-methods-use-this': 'off',
      'spaced-comment': 'off',
      // Keep the preference for destructuring declarations, but not for plain
      // reassignments, where `({ x } = obj)` reads worse than `x = obj.x`.
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: { object: true, array: false },
          AssignmentExpression: { object: false, array: false },
        },
      ],
      // ignoreRestSiblings allows the omit-a-property idiom
      // `const { active, ...rest } = badge`, where the extracted key is unused
      // by design.
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: 'req|res|next|val',
          caughtErrors: 'none',
          ignoreRestSiblings: true,
        },
      ],

      // eslint-plugin-n equivalents of the old eslint-plugin-node rules.
      'n/no-process-exit': 'off',
      // Dev-only tooling, tests and this config may reach for devDependencies.
      'n/no-unpublished-require': 'off',
      'n/no-unpublished-import': 'off',
    },
  },

  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },

  {
    // This config file, and anything else authored as ESM.
    files: ['**/*.mjs'],
    languageOptions: {
      sourceType: 'module',
    },
  },

  {
    // Maintenance scripts are invoked directly (`node dev-tools/…`) and via npm
    // scripts rather than declared as package `bin` entries, so n/hashbang's
    // "needs no shebang" complaint does not apply.
    files: ['dev-tools/**/*.js'],
    rules: {
      'n/hashbang': 'off',
    },
  },
];
