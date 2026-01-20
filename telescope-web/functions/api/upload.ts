import { unzipSync } from 'fflate';

interface Env {
  RESULTS_BUCKET: R2Bucket;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const contentType = request.headers.get('content-type') || '';
    
    if (!contentType.includes('multipart/form-data')) {
      return Response.json({ error: 'Expected multipart/form-data' }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.endsWith('.zip')) {
      return Response.json({ error: 'File must be a ZIP' }, { status: 400 });
    }

    // Read the ZIP file
    const arrayBuffer = await file.arrayBuffer();
    const zipData = new Uint8Array(arrayBuffer);

    // Unzip the file
    let unzipped: Record<string, Uint8Array>;
    try {
      unzipped = unzipSync(zipData);
    } catch (e) {
      return Response.json({ error: 'Invalid ZIP file' }, { status: 400 });
    }

    // Extract test ID from ZIP filename or generate one
    const testId = file.name.replace('.zip', '') || generateTestId();

    // Upload each file to R2
    const uploadPromises = Object.entries(unzipped).map(async ([filename, data]) => {
      // Skip directories and hidden files
      if (filename.endsWith('/') || filename.startsWith('.') || filename.includes('__MACOSX')) {
        return;
      }

      const key = `${testId}/${filename}`;
      const contentType = getContentType(filename);

      await env.UNZIP_BUCKET.put(key, data, {
        httpMetadata: { contentType },
      });
    });

    await Promise.all(uploadPromises);

    return Response.json({
      success: true,
      testId,
      message: `Uploaded ${Object.keys(unzipped).length} files`,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
};

function generateTestId(): string {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0];
  const random = Math.random().toString(36).substring(2, 8);
  return `${dateStr}-${random}`;
}

function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const types: Record<string, string> = {
    json: 'application/json',
    har: 'application/json',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webm: 'video/webm',
    mp4: 'video/mp4',
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
  };
  return types[ext || ''] || 'application/octet-stream';
}
