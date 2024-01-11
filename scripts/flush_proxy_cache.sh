#!/bin/bash                                                                                             

docker-compose down

# flush proxy cache
sudo rm -rvf /data/nginx/proxy_cache

docker-compose up -d

