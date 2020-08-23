import { contracts } from './generated-code/api-schema-server'
import { processContract } from 'declarapi-runtime'
import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

/* eslint-env serviceworker */
export async function handleRequest (fetchEvent: FetchEvent): Promise<Response> {
  const { request } = fetchEvent

  let body = {}
  let url
  try {
    url = new URL(request.url)
    if (request.method === 'GET') {
      const jsonParam = url.searchParams.get('json')
      const search = url.searchParams.get('search')
      const keys = Array.from(url.searchParams.keys())
      if ((jsonParam == null && search == null) && keys.length > 0) {
        throw new Error("Query parameters where given, but parameter named 'json' is missing," +
        " can't parse input. All inputs should be under the parameter named 'json' in a json string")
      }
      if (jsonParam) {
        body = JSON.parse(jsonParam)
      } else if (search) {
        body = { search }
      }
    } else if (request.body) {
      body = await request.json()
    }
  } catch (e) {
    const errorData = request.method === 'GET' ? url && url.searchParams.get('json') : request.text()
    return new Response(JSON.stringify({
      status: 500,
      data: errorData,
      errors: ['Failed to parse input', e.name, e.message]
    }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
  for (const key of Object.keys(contracts)) {
    const wrapped = processContract((contracts as any)[key])
    const sameRoute = url.pathname.startsWith(wrapped.route)
    if (sameRoute && request.method === wrapped.method) {
      const id = url.pathname.split(wrapped.route + '/')[1] || undefined

      const result = await wrapped.handle(body, id)

      return new Response(JSON.stringify(result.response), {
        status: result.status,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  }
  const additionalErrors = []
  if (request.method === 'GET') {
    try {
      return await getAssetFromKV(fetchEvent)
    } catch (e) {
      additionalErrors.push(e.name)
      additionalErrors.push(e.message)
    }
  }
  return new Response(JSON.stringify({ status: 404, errors: ['not found', url, ...additionalErrors], data: request.url }, null, 2), {
    status: 404, headers: { 'Content-Type': 'application/json' }
  })
}
