istrav-load-balanacer
========

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

Cloudflare DNS tables:
- A * 136.39.108.42 proxied
- A istrav.dev 136.39.108.42 proxied
> note: that is not my ip


## Production
```bash
# firewall
$ sudo ufw allow 8080/tcp
$ sudo ufw reload

# start
$ PORT=8080 pm2 start dist/main.js -i -1 --update-env --name="istrav-load-balanacer"

# stop
$ pm2 stop dist/main.js --name="istrav-load-balanacer"

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
```