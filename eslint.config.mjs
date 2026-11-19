import config from '@iobroker/eslint-config';

export default [
    ...config,
    {
        ignores: ['build/**', 'admin/custom/**', 'src-admin/**', 'node_modules/**', 'test/**'],
    },
    {
        rules: {
            'jsdoc/require-jsdoc': 'off',
            'jsdoc/require-param': 'off',
            'jsdoc/no-blank-blocks': 'off',
            '@typescript-eslint/no-base-to-string': 'off',
        },
    },
];
