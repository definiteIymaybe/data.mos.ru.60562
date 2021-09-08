const { performance } = require('perf_hooks')

const msToTime = (duration) => {
  // let milliseconds = parseInt((duration % 1000) / 100);
  let seconds = parseInt((duration / 1000) % 60)
  let minutes = parseInt((duration / (1000 * 60)) % 60)
  let hours = parseInt((duration / (1000 * 60 * 60)) % 24)

  hours = hours < 10 ? `0${hours}` : hours
  minutes = minutes < 10 ? `0${minutes}` : minutes
  seconds = seconds < 10 ? `0${seconds}` : seconds

  return `${hours}:${minutes}:${seconds}`
}

class Timer {
  constructor(totalObjects = 0, factor = 1) {
    this.madeRequests = 0
    this.totalRequestTime = 0
    this.timeBeforeRequest = 0
    this.totalObjects = totalObjects
    this.left = 0
    this.index = 0
    this.factor = factor
  }

  beforeRequest(i = 0) {
    this.index = i
    this.timeBeforeRequest = performance.now()
  }

  uponRequest(symbol = '😉') {
    const requestTookFloat = performance.now() - this.timeBeforeRequest
    this.madeRequests += 1
    const requestTook = parseInt(requestTookFloat)
    this.totalRequestTime += requestTookFloat
    this.left = parseInt((this.totalObjects - this.index) / this.factor)
    const avgReguestTime = parseInt(this.totalRequestTime / this.madeRequests)
    const timeLeft = msToTime(this.left * avgReguestTime)
    let thisRequestDiff = requestTook - avgReguestTime
    if (thisRequestDiff > 0) {
      thisRequestDiff = `+${thisRequestDiff}`
    }
    console.log(
      this.madeRequests,
      '/',
      this.left,
      timeLeft,
      new Date(avgReguestTime).toISOString().substr(11, 8),
      thisRequestDiff,
      new Date(requestTook).toISOString().substr(11, 8),
      symbol
    )
  }
}

module.exports = { Timer }
