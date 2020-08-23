import { contracts } from './generated-code/api-schema-server'
import { processContract } from 'declarapi-runtime'

/* eslint-env serviceworker */
export async function handleRequest (request: Request): Promise<Response> {
  let body = {}
  let url
  try {
    url = new URL(request.url)
    if (request.method === 'GET') {
      const jsonParam = url.searchParams.get('json')
      const keys = Array.from(url.searchParams.keys())
      if (jsonParam == null && keys.length > 0) {
        throw new Error("Query parameters where given, but parameter named 'json' is missing," +
        " can't parse input. All inputs should be under the parameter named 'json' in a json string")
      }
      if (jsonParam) { body = JSON.parse(jsonParam) }
    } else if (request.bodyUsed) {
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
  return new Response('{"error":"method not found"}', {
    status: 404, headers: { 'Content-Type': 'application/json' }
  })
}
