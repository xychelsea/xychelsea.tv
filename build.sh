#!/bin/bash

docker run \
	--interactive \
	--name xychelsea.tv-hugo \
	--publish 1313:1313 \
	--rm \
	--tty \
	--volume `pwd`:/site \
	xychelsea/hugo:latest $1
