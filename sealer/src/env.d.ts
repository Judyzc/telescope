type Runtime = import('@astrojs/cloudflare').Runtime<{
  UNZIP_BUCKET: R2Bucket;
}>;
declare namespace App {
  interface Locals extends Runtime {}
}