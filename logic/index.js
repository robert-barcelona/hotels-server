const data = require('../data/data')

module.exports = {

  searchAvailability: async (adults, children, start, end, discount) => {

    if (Number.isNaN(adults)) throw new Error('Number of adults is a bad value')
    if (Number.isNaN(children)) throw new Error('Number of children is a bad value')

    let startTime, endTime
    const people = adults + children
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
        room.discountedCost = (room.cost * (1 - discount/100)).toFixed(2);
        room.discount = discount
      }
      return room
    }).sort((roomA, roomB) => roomA.cost - roomB.cost)
  }
}
