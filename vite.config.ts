import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load server-side environment variables (.env, .env.local)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'dino-api-local-dev-middleware',
        configureServer(server) {
          // Expose SUPABASE credentials to process.env during local dev
          if (env.SUPABASE_URL && !process.env.SUPABASE_URL) {
            process.env.SUPABASE_URL = env.SUPABASE_URL;
          }
          if (env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            process.env.SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
          }

          server.middlewares.use(async (req, res, next) => {
            const url = req.url || '';
            if (!url.startsWith('/api/dino/')) {
              return next();
            }

            // Helper to augment Node IncomingMessage / ServerResponse with Express-like helpers
            const augmentResponse = (resObj: any) => {
              resObj.status = (code: number) => {
                resObj.statusCode = code;
                return resObj;
              };
              resObj.json = (data: any) => {
                resObj.setHeader('Content-Type', 'application/json');
                resObj.end(JSON.stringify(data));
                return resObj;
              };
            };

            try {
              if (url.startsWith('/api/dino/leaderboard')) {
                const { default: handler } = await server.ssrLoadModule('/api/dino/leaderboard.ts');
                augmentResponse(res);
                return await handler(req, res);
              }

              if (url.startsWith('/api/dino/score')) {
                const { default: handler } = await server.ssrLoadModule('/api/dino/score.ts');
                augmentResponse(res);

                let bodyStr = '';
                req.on('data', (chunk) => {
                  bodyStr += chunk;
                });
                req.on('end', async () => {
                  try {
                    (req as any).body = bodyStr ? JSON.parse(bodyStr) : {};
                  } catch {
                    (req as any).body = {};
                  }
                  await handler(req, res);
                });
                return;
              }
            } catch (err: any) {
              console.error('[Vite Local Dev API Error]:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Internal Server Error', message: err.message }));
              return;
            }

            next();
          });
        },
      },
    ],
  };
});
