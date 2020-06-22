import express from 'express'
import { validate } from 'yaschva'
import { contracts } from './generated-code/api-schema-server'
import { exampleGetResponse } from './test-data/test-data'

const app = express()
const port = process.env.PORT || 8080

app.get('/', (req, res) => {
  res.json({
    name: 'CatSpotter API',
    endpoints: [
      {
        url: '/',
        description: 'List available endpoints'
      },
      {
        url: '/health',
        description: 'Health check'
      },
      {
        url: '/api/cat',
        description: 'List cat spottings'
      },
      {
        url: '/api/cat',
        method: 'POST',
        description: 'Report new cat spotting'
      }
    ]
  })
})

app.get('/health', (req, res) => {
  res.json({
    message: 'Ok'
  })
})

const serverError = (res: any, message: string) => {
  res.status(500).send({
    error: message
  })
}

app.get('/api/cat', (req, res) => {
  const valid = validate(contracts.CatSpotterGet.arguments, req.query)
  if (valid.result === 'fail') return serverError(res, 'Invalid arguments')
  res.json(exampleGetResponse)
})

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
