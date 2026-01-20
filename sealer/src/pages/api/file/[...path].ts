import type { APIRoute } from 'astro';
export const GET: APIRoute = async ({ params, locals }) => {
  const env = locals.runtime.env;
  try {
    // params.path will be like "testId/screenshot.png" or "testId/filmstrip/frame1.jpg"
    const path = params.path;
    
    if (!path) {
      return Response.json({ error: 'Invalid path' }, { status: 400 });
    }
    const object = await env.UNZIP_BUCKET.get(path);
    
    if (!object) {
      return Response.json({ error: 'File not found' }, { status: 404 });
    }
    const headers = new Headers();
    headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream');
    headers.set('Cache-Control', 'public, max-age=31536000');
    return new Response(object.body, { headers });
  } catch (error) {
    console.error('File fetch error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch file' },
      { status: 500 }
    );
  }
};