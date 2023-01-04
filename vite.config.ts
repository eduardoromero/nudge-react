import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/nudge-react',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'app/javascript/App/'),
            timers: 'rollup-plugin-node-polyfills/polyfills/timers'
        }
    },
    plugins: [react()]
});
