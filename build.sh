#!/bin/bash

# pull from repository
git pull

# refresh node packages
docker run \
        --interactive \
        --name npm-install-postcss-cli \
        --rm \
        --tty \
        --user node \
        --volume `pwd`:/home/node/app \
        --workdir /home/node/app \
        node:18.10.0-alpine3.16 \
        npm install postcss-cli

# clean public directory
rm -rvf `pwd`/public/*

# build static assets with hugo
docker run \
        --interactive \
        --name xychelsea.tv-hugo \
        --publish 1313:1313 \
        --rm \
        --tty \
        --volume `pwd`:/site \
        xychelsea/hugo:v0.104.3

# change ownership of static assets
sudo chown -R $USER:$USER `pwd`/public
