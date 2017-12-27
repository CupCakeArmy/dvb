const http = require('http')
const https = require('https')

// GET YOUR OWN AT: https://openweathermap.org/appid
const APP_KEY = 'db597413fa4f4a8545b0f2bb43262f11'

const LISTEN = `${__dirname}/run.sock`

const REGEXP = {
  URL: /^\/[\d]{1,8}$/
}

const API = {
  // Define max 60 calls per 1 Minute
  MAX_CALLS: 60,
  INTERVAL: 1000 * 60, // 1 Minute
  current_calls: 0,
  last_reset: Date.now(),
}

const CACHE = {}
const MAX_AGE = 60 * 1000 // 1 Minute
const LAST_UPDATE_KEY = 'last_update'

function getForZip(zip) {
  return new Promise((resolve, reject) => {

    // If interval is over, reset max count
    if (Date.now() - API.last_reset > API.INTERVAL) {
      API.last_reset = Date.now()
      API.current_calls = 0
    }

    // Check if too many calls were already made
    if (API.current_calls > API.MAX_CALLS)
      resolve()

    API.current_calls++;

    // Make the call
    https.get({
      host: 'api.openweathermap.org',
      path: `/data/2.5/forecast?APPID=${APP_KEY}&zip=${zip},DE&units=metric`,
      timeout: 15 * 1000,
    }, res => {
      res.setEncoding('utf8')
      let body = ''
      res.on('data', data => {
        body += data
      })
      res.on('end', () => {
        const data = JSON.parse(body)
        data[LAST_UPDATE_KEY] = Date.now()
        resolve(data)
      })
    })

  })
}

function getUrlFromPath(path) {
  // Check if url is valid
  if (!REGEXP.URL.test(path))
    return false
  else
    // Exctract ZIP code
    return path.replace('/', '')
}

const server = http.createServer(async(req, res) => {

  const zip = getUrlFromPath(req.url)
  // Check if url is valid
  if (zip === false) {
    res.writeHead(400, {})
    res.end()
    return
  }

  // If there is no cached version, get it
  // If the last cached version is older than MAX_AGE, get it
  if (CACHE[zip] === undefined || Date.now() - CACHE[zip][LAST_UPDATE_KEY] > MAX_AGE)
    CACHE[zip] = await getForZip(zip)

  res.writeHead(200, {
    'Content-Type': 'application/json',
  })
  res.write(JSON.stringify(CACHE[zip] || {}))
  res.end()
})

function exit() {
  console.log('Bye Bye')
  server.close()
}

function start() {
  console.log(`Started server on: ${LISTEN}`)
  server.listen(LISTEN)
}

// Register exit function
process.on('exit', exit)
process.on('SIGINT', exit)
process.on('SIGQUIT', exit)
process.on('SIGTERM', exit)
process.on('uncaughtException', exit)

start()