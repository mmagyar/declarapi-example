import express from 'express'
import { contracts } from './generated-code/api-schema-server.js'
import { processContract } from 'declarapi-runtime'

const app = express()
const port = process.env.PORT || 8080

app.use(express.json())

for (const key of Object.keys(contracts)) {
  const wrapped = processContract((contracts as any)[key])
  const method: 'get' | 'post' | 'put' |'patch' | 'delete' = (wrapped.method.toLowerCase() as any)
  app[method](wrapped.route, async (req:any, res:any) => {
    const { status, response } = await wrapped.handle(method === 'get' ? req.query : req.body, req.params.id, {})
    res
      .status(status)
      .json(response)
  })
}

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
