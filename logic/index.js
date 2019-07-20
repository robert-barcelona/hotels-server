const data = require('../data/data')

module.exports = {

  searchAvailability: async (adults, children, start, end, discount) => {
    if (!(adults && children && start && end)) throw new Error('Not all values were sent to check availability ')
    if (Number.isNaN(adults)) throw new Error('Number of adults is a bad value')
    if (Number.isNaN(children)) throw new Error('Number of children is a bad value')

    let startTime, endTime
    const people = adults + children
    console.log(adults, children, start, end)
    try {
      startTime = Date.parse(start)
      endTime = Date.parse(end)

    } catch (e) {
      throw new Error('Error in start or end times given')
    }

    return data.filter(room => {

      const bookedStart = Date.parse(room.bookingstart)
      const bookedEnd = bookedStart + room.bookinglength * (1000 * 60 * 60 * 24)
      const overlap = !(startTime < bookedStart && endTime < bookedEnd) || (startTime > bookedEnd)
      return (room.people >= people && !overlap)
    }).map(room => {
      if (discount) {
        console.log(discount)
        room.cost *= 1 - discount
        room.discount = discount
      }
      return room
    }).sort((roomA, roomB) => roomA.cost - roomB.cost)
  }
}
