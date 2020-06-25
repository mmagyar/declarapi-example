import express from 'express'
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
  app[expressable.method](expressable.route, (req, res) => expressable.handler(req, res))
})

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Server started at http://localhost:${port}`)
})
