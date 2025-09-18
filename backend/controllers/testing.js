const router = require('express').Router()
const File = require('../models/file')

router.post('/reset', async (request, response) => {
  await File.deleteMany({})

  response.status(204).end()
})

module.exports = router