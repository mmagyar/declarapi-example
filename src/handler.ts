import { addValidationToContract, registerRestMethods } from 'declarapi-runtime'
import { contracts } from './generated-code/api-schema-server'

/* eslint-env serviceworker */
export async function handleRequest (request: Request): Promise<Response> {
  console.log('HANDLRE')
  const contractsWithValidation = addValidationToContract(contracts)
  const restMethods = registerRestMethods(contractsWithValidation)
  return new Promise<Response>((resolve) => {
    for (const method of restMethods) {
      console.log('REQ', request.method, request.destination)
      if (request.method === method.method) {
        const req = {
          query: {},
          body: {},
          params: {}
        }
        return method.handler(req, {
          status: (code: number) => ({
            json: (input:any) => {
              resolve(new Response(input, {
                status: code,
                headers: {
                  'Content-Type': 'application/json'
                }
              }))
            }
          })
        })
      }
    }

    return resolve(new Response('{"error":"method not found"}', {
      status: 404,
      headers: {
        'Content-Type': 'application/json'
      }
    }))
  })
}
