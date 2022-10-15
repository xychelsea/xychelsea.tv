#!/bin/bash

docker run \
	--interactive \
	--name xychelseatv-hugo \
	--publish 1313:1313 \
	--rm \
	--tty \
	--volume `pwd`:/site \
	hugo:latest
