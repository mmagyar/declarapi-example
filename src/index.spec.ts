import fetch from 'node-fetch'
import { exampleGetResponse } from './test-data/test-data'

const testPort = 9876
const testHost = `http://localhost:${testPort}`

describe('index.ts', () => {
  it('does not do anything', () => {
    expect(true).toEqual(true)
  })

  it('gets the health check endpoint', async () => {
    const data = await fetch(`${testHost}/health`).then(res => res.json())
    expect(data).toEqual({
      message: 'Ok'
    })
  })

  it('gets the root endpoint', async () => {
    const res = await fetch(`${testHost}/`)
    expect(res.status).toEqual(404)
  })

  it('gets the cat endpoint with no arguments', async () => {
    const data = await fetch(`${testHost}/api/cat`).then(res => res.json())
    expect(data).toEqual(exampleGetResponse)
  })

  it('gets the cat endpoint with invalid arguments', async () => {
    const res = await fetch(`${testHost}/api/cat?x=y`)
    expect(res.status).toEqual(500)
    const data = await res.json()
    expect(data).toEqual({
      error: 'Invalid arguments'
    })
  })
})
