import { unlinkSync, existsSync } from 'fs';

// For Cloudflare Workers with Assets, _routes.json is not needed and causes issues
// The Assets binding handles static files automatically without routing config
if (existsSync('./dist/_routes.json')) {
  unlinkSync('./dist/_routes.json');
  console.log('✅ Removed _routes.json for Cloudflare Workers with Assets');
} else {
  console.log(
    '✅ No _routes.json found (this is correct for Workers with Assets)',
  );
}
