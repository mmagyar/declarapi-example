import express from 'express'
import { registerRestMethods } from 'declarapi/src/runtime/registerRestMethods'
import { addValidationToContract } from 'declarapi/src/runtime/contractValidation'
import { contracts, catGetArgument, catGetReturns } from './generated-code/api-schema-server'
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

const catGetHandler = (input: catGetArgument): Promise<catGetReturns> => {
  if (input.id) {
    return Promise.resolve(exampleGetResponse.filter((spotting) => spotting.id === input.id))
  }
  if (input.search) {
    const searchString = input.search.toLowerCase()
    return Promise.resolve(exampleGetResponse.filter((spotting) => (
      spotting.spotter.toLowerCase().includes(searchString) ||
      spotting.breed.toLowerCase().includes(searchString)
    )))
  }
  return Promise.resolve(exampleGetResponse)
}

const extendedContracts = Object.assign({}, contracts, {
  catGet: Object.assign({}, contracts.catGet, {
    handle: catGetHandler
  })
})
const contractsWithValidation = addValidationToContract(extendedContracts)
const restMethods = registerRestMethods(contractsWithValidation)
app.get(restMethods[0].route, restMethods[0].handler)

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
