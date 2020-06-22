import express from 'express'

const app = express()
const port = 8080

app.get('/health', (req, res) => {
  res.json({
    message: 'Ok'
  })
})

app.get('/api/cat', (req, res) => {
  res.json([
    {
      datetime: '2020-06-22T10:55:00Z',
      breed: 'British Shorthair',
      color: 'grey'
    },
    {
      datetime: '2020-06-22T11:31:00Z',
      breed: 'Domestic Shorthair',
      color: [
        'black',
        'white'
      ]
    }
  ])
})

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Server started at http://localhost:${port}`)
})
