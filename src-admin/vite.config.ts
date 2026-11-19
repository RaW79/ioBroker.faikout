import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
    plugins: [
        react(),
        federation({
            name: 'faikout',
            filename: 'customComponents.js',
            exposes: {
                './customComponents': './src/Components.tsx',
            },
            shared: {
                react: { singleton: true, requiredVersion: '*' },
                'react-dom': { singleton: true, requiredVersion: '*' },
            },
        }),
    ],
    build: {
        outDir: '../admin/custom',
        emptyOutDir: true,
        target: 'es2020',
        rollupOptions: {
            input: {},
        },
    },
});
