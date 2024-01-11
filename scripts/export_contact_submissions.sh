#!/bin/bash

source .env

docker exec --interactive --tty --user postgres postgresql psql \
        -U ${POSTGRES_USERNAME} \
        -d ${POSTGRES_DATABASE} \
        -c 'COPY "ContactSubmissions" TO STDOUT WITH (FORMAT CSV, HEADER);' > contact_submissions.sql
