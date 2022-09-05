istrav-load-balancer
========
Innovation Management Software (IMS)

istrav source code:
- istrav.com: https://github.com/trabur/istrav.com
- trabur.workers.dev: https://github.com/trabur/istrav-global
- istrav.net: https://github.com/trabur/istrav-platform-frontgate
- meta.istrav.net: https://github.com/trabur/istrav-platform-frontend
- istrav.istrav.dev: https://github.com/trabur/istrav-platform-backend
- istrav-load-balancer: https://github.com/trabur/istrav-load-balancer
- istrav.dev: https://github.com/trabur/istrav.dev
- istrav-headquarters: https://github.com/trabur/istrav-headquarters
- istrav.stream: https://github.com/trabur/istrav.stream

istrav-load-balancer tech:
- http-proxy
- node.js

## About
The router from google fiber has port forwarding setup so that
all traffic in and out of homebase is over port 80 (router) 
and port 8080 (bridgeputer). 

I have named machines, for DNS routing (see code), the following:
- bridgeputer: ubuntu with PM2/load-balancer
- coolermaster: Proxmox
- thinkputer: Proxmox

Here are the VMs running in Proxmox:
- istrav-commands
- istrav-database
- istrav-buckets
- istrav-platforms
- istrav-osrm
- istrav-couchdb

Cloudflare DNS tables:
- A * 136.39.108.42 proxied
- A istrav.dev 136.39.108.42 proxied
> note: that ip is just for example


## Production
```bash
# firewall
$ sudo ufw allow 8080/tcp
$ sudo ufw reload

# start
$ PORT=8080 pm2 start index.js -i -1 --update-env --name="istrav-load-balanacer"

# stop
$ pm2 stop index.js --name="istrav-load-balanacer"

# logs
$ pm2 logs istrav-load-balanacer

# delete
$ pm2 delete istrav-load-balanacer

# list
$ pm2 status

# Generate Startup Script
$ pm2 startup

# Freeze your process list across server restart
$ pm2 save

# Remove Startup Script
$ pm2 unstartup

# after code change
$ pm2 reload all
```