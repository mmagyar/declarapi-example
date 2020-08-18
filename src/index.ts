/* eslint-env serviceworker */

import { handleRequest } from './handler'
// console.log((handleRequest as any)?.sdf, 'df')
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})
