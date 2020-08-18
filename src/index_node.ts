import express from 'express'
import { registerRestMethods, addValidationToContract } from 'declarapi-runtime'
import { contracts } from './generated-code/api-schema-server'

const app = express()
const port = process.env.PORT || 8080

app.use(express.json())

const contractsWithValidation = addValidationToContract(contracts)
const restMethods = registerRestMethods(contractsWithValidation)
restMethods.forEach((expressable) => {
  (app as any)[expressable.method.toLowerCase()](
    expressable.route,
    (req:any, res:any) => expressable.handler(req, res)
  )
})

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
