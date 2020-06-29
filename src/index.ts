import express from 'express'
import { registerRestMethods } from 'declarapi/dist/runtime/registerRestMethods'
import { addValidationToContract } from 'declarapi/dist/runtime/contractValidation'
import { contracts } from './generated-code/api-schema-server'

const app = express()
const port = process.env.PORT || 8080

app.use(express.json())

const contractsWithValidation = addValidationToContract(contracts)
const restMethods = registerRestMethods(contractsWithValidation)
restMethods.forEach((expressable) => {
  app[expressable.method](
    expressable.route,
    (req, res) => expressable.handler(req, res)
  )
})

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
