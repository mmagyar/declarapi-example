import express from 'express'
import { registerRestMethods } from 'declarapi/src/runtime/registerRestMethods'
import { addValidationToContract } from 'declarapi/src/runtime/contractValidation'
import { contracts, catGetArgument, catGetReturns, ContractListType } from './generated-code/api-schema-server'
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

const extendedContracts: ContractListType = {
  catGet: {
    name: contracts.catGet.name,
    authentication: contracts.catGet.authentication,
    type: contracts.catGet.type,
    arguments: contracts.catGet.arguments,
    returns: contracts.catGet.returns,
    handle: async (input: catGetArgument): Promise<catGetReturns> => {
      if (input.id) {
        return exampleGetResponse.filter((spotting) => spotting.id === input.id)
      }
      if (input.search) {
        const searchString = input.search.toLowerCase()
        return exampleGetResponse.filter((spotting) => (
          spotting.spotter.toLowerCase().includes(searchString) ||
          spotting.breed.toLowerCase().includes(searchString)
        ))
      }
      return exampleGetResponse
    }
  },
  catPost: contracts.catPost,
  catPut: contracts.catPut,
  catPatch: contracts.catPatch,
  catDelete: contracts.catDelete
}

const contractsWithValidation = addValidationToContract(extendedContracts)

const hmm = registerRestMethods(contractsWithValidation)

app.get(hmm[0].route, hmm[0].handler)

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
