import { WorkerEntrypoint } from 'cloudflare:workers';

// custom_domain = true means ALL requests get routed to this index.ts (Worker code), and this index.ts simply returns all requests 
export default class extends WorkerEntrypoint<Env> {
  override async fetch(request: Request) {
    return this.env.ASSETS.fetch(request);  // uses the ASSETS biding to servie files from dist/
  }
}
