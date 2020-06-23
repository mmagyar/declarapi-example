import { catGetReturns } from '.././generated-code/api-schema-server'

export const exampleGetResponse: catGetReturns = [
  {
    id: 'cat1',
    spotter: 'Joe',
    datetime: '2020-06-22T10:55:00Z',
    location: {
      latitude: 47.4979,
      longitude: 19.0402
    },
    color: [
      'grey'
    ],
    breed: 'British Shorthair',
    age: 'kitten',
    activity: 'acting scared',
    quantumState: 'alive'
  },
  {
    id: 'cat2',
    spotter: 'Clara',
    datetime: '2020-06-22T11:31:00Z',
    color: [
      'black',
      'white'
    ],
    breed: 'Domestic Shorthair'
  }
]
