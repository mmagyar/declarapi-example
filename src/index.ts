/* eslint-env serviceworker */

import { handleRequest } from './handler'
import { KV } from 'declarapi-runtime/abstractKv.js'
declare var WORKER_KV:KV

addEventListener('fetch', (event) => {
  (global as any).customKv = { custom: () => WORKER_KV }
  event.respondWith(handleRequest(event))
})
