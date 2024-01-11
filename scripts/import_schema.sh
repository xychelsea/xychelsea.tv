#!/bin/bash

source .env

docker exec --interactive --tty --user postgres postgres psql \
	-U ${POSTGRES_USERNAME} \
	-d ${POSTGRES_DATABASE} \
       	< schema.sql

