import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// TODO:
/*
(!) Some chunks are larger than 500 kBs after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
*/
export default defineConfig({
    // plugins: [tsconfigPaths(), react()],
    plugins: [basicSsl(), tsconfigPaths(), react()],
    server: { https: true, host: '127.0.0.1' },
});
