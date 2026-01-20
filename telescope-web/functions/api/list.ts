interface Env {
  UNZIP_BUCKET: R2Bucket;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;

  try {
    // List all "directories" (test IDs) in the bucket
    const list = await env.UNZIP_BUCKET.list({ delimiter: '/' });
    
    // Extract test IDs from the common prefixes
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
