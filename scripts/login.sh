#!/bin/bash

source .env

docker exec --interactive --tty --user postgres postgresql psql \
        -U ${POSTGRES_USERNAME} \
        -d ${POSTGRES_DATABASE}

