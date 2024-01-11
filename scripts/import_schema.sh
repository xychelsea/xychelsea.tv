#!/bin/bash

source ../.env.postgres

docker exec --interactive --tty --user postgres postgres psql \
	-U ${POSTGRES_USER} \
	-d ${POSTGRES_DB} \
       	< schema.sql

