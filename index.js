var http = require('http')
var httpProxy = require('http-proxy');

let istravCommandsIp = '192.168.10.221'
let istravPlatformsIp = '192.168.10.97'
let istravCouchIp = '192.168.10.115'
 
//
// Port numbers range from 0 to 65535, but only port 
// numbers 0 to 1023 are reserved for privileged services
// and designated as well-known ports
//
let alphabet = 'abcdefghijklmnopqrstuvwxyz'
function platformNameToPortNumber (subdomain) {
  // configuration
  // console.log('subdomain', subdomain)

  // name to numbers
  let letters = subdomain.split('')
  let numbers = []
  letters.forEach((letter) => {
    let number = alphabet.indexOf(letter)
    numbers.push(number)
  })
  // console.log('numbers', numbers)
  
  // number to port
  let number = parseInt(numbers.join(''))
  let total = 65000
  let start = 3000
  let max = total - start
  let port = number % max + start
  // console.log('port', port)

  return port
}

//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({});
 
//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
var server = http.createServer(function(req, res) {
  // You can define here your custom logic to handle the request
  // and then proxy the request.

  // configuration
  let host = req.headers.host
  // console.log('host', host)

  // proxy to Commands or a Platform
  let hostNames = host.split('.')
  if (host === 'couchdb.istrav.dev') {
    // this is a request for couchdb
    proxy.web(req, res, { 
      target: `http://${istravCouchIp}:59`,
    });
  } else if (host === 'pro.istrav.dev') {
    // this is a request for pro server
    proxy.web(req, res, { 
      target: `http://${istravPlatformsIp}:1337`,
      ws: true
    });
  } else if (hostNames.length === 3) {
    // this is a request for a platform
    let port = platformNameToPortNumber(hostNames[0])
    let target = `http://${istravPlatformsIp}:${port}`
    // console.log('target', target)
    
    proxy.web(req, res, { target: target });
  } else {
    // this is a request for commands
    proxy.web(req, res, { 
      target: `http://${istravCommandsIp}:8888`,
      ws: true
    });
  }
});

// 
// Listen to the `upgrade` event and proxy the
// WebSocket requests as well.
//
server.on('upgrade', function (req, socket, head) {
  let host = req.headers.host
  if (host === 'pro.istrav.dev') {
    // this is a request for pro server
    proxy.ws(req, socket, head, {
      target: `ws://${istravPlatformsIp}:1337`
    });
  } else {
    // this is a request for commands
    proxy.ws(req, socket, head, {
      target: `ws://${istravCommandsIp}:8888`
    });
  }
});
 
const PORT = process.env.PORT || 8080
console.log(`listening on port ${PORT}`)
server.listen(PORT);