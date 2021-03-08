const fetch = require('node-fetch')

const { createWriteStream } = require('fs')
const { transformImage } = require('..')

const getDestStream = scene =>
  createWriteStream(`${scene.name}.${scene.format}`)

const sceneXl = {
  name: 'lg',
  format: 'png',
  getDestStream,
  template: [
    ['resize', '1920x700'],
    ['gravity', 'center'],
    ['crop', '1920x700+0+0']
  ]
}

const sceneLg = {
  name: 'md',
  format: 'png',
  getDestStream,
  template: [
    ['resize', '1280x600'],
    ['gravity', 'center'],
    ['crop', '1280x600+0+0']
  ]
}

async function example () {
  const res = await fetch(
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/15159932-383e-4462-bede-7dfd6d0bdf02/dc34pkt-e306c9e8-ce9a-465c-bd46-df602f430250.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMTUxNTk5MzItMzgzZS00NDYyLWJlZGUtN2RmZDZkMGJkZjAyXC9kYzM0cGt0LWUzMDZjOWU4LWNlOWEtNDY1Yy1iZDQ2LWRmNjAyZjQzMDI1MC5qcGcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.HQTFFVoTdgDeYp1klSs1DgBmDRJwvDGkYgBx8hhV-Iw'
  )
  await transformImage(res.body, [sceneXl, sceneLg])
}

example()
