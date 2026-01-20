interface Env {
  UNZIP_BUCKET: R2Bucket;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, params } = context;

  try {
    // params.path is an array for catch-all routes: ["testId", "filename"] or ["testId", "filmstrip", "frame.jpg"]
    const pathParts = params.path as string[];
    
    if (!pathParts || pathParts.length < 2) {
      return Response.json({ error: 'Invalid path' }, { status: 400 });
    }

    const key = pathParts.join('/');
    
    const object = await env.UNZIP_BUCKET.get(key);
    
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
