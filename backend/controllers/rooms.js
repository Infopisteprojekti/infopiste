const router = require('express').Router()
const { generateRooms } = require('../mockdata/generate-room-data.js')

// const ROOMS = generateRooms()

router.get('/', async (request, response) => {
  response.status(200).json(ROOMS)
})

router.get('/:id', async (request, response) => {
  const room = ROOMS.find(r => r.id === request.params.id)
  if (!room) {
    return response.status(404).json({ error: 'room not found' })
  }
  response.status(200).json(room)
})

router.get('/:id/reservations', async (request, response) => {
  const { id } = request.params
  const { date } = request.query

  const room = ROOMS.find(r => r.id === id)
  if (!room) {
    return response.status(404).json({ error: 'room not found' })
  }

  let { reservations } = room

  if (date) {
    reservations = reservations.filter(r =>
      r.start.dateTime.startsWith(date))
  }

  response.json(reservations)
})

module.exports = router