import express from 'express'
import { info } from 'declarapi'
import { registerRestMethods } from 'declarapi/dist/runtime/registerRestMethods'
import { addValidationToContract } from 'declarapi/dist/runtime/contractValidation'
import { contracts } from './generated-code/api-schema-server'

const app = express()
const port = process.env.PORT || 8080

app.use(express.json())

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
        description: 'CRUD endpoint for cat spotting'
      }
    ]
  })
})

app.get('/health', (req, res) => {
  res.json({
    message: 'Ok'
  })
})

const contractsWithValidation = addValidationToContract(contracts)
const restMethods = registerRestMethods(contractsWithValidation)
restMethods.forEach((expressable) => {
  app[expressable.method](expressable.route,
    (req, res) =>
      expressable.handler(req, res))
})

app.get('/elastic', async (_, res) => {
  res.json({ info: await info().catch(console.warn) })
})

app.route('/api/*').all((_, res) => {
  res.status(404)
  res.json({ status: 404, error: 'not found', info: 'no method implemented under this url' })
})

const missingApi = (_:any, res:any) => {
  res.status(405)
  res.json({ status: 405, error: 'method not allowed', info: 'All API calls must be under /api' })
}

app.post('*', missingApi)
app.put('*', missingApi)
app.patch('*', missingApi)
app.delete('*', missingApi)

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
