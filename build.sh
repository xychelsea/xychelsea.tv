#!/bin/bash

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

docker run \
	--interactive \
	--name xychelsea.tv-hugo \
	--publish 1313:1313 \
	--rm \
	--tty \
	--volume `pwd`:/site \
	xychelsea/hugo:v0.104.3
