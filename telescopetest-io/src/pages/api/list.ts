import type { APIRoute } from 'astro';
export const GET: APIRoute = async ({ locals }) => {
  const env = locals.runtime.env;
  try {
    const list = await env.UNZIP_BUCKET.list({ delimiter: '/' });
    const testIds = list.delimitedPrefixes.map(prefix => prefix.replace('/', ''));
    
    return Response.json(testIds);
  } catch (error) {
    console.error('List error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to list results' },
      { status: 500 }
    );
  }
};