#!/bin/bash

source ../.env.postgres

docker exec --interactive --tty --user postgres postgresql psql \
        -U ${POSTGRES_USER} \
        -d ${POSTGRES_DB} \
        -c 'COPY "ContactSubmissions" TO STDOUT WITH (FORMAT CSV, HEADER);' > contact_submissions.sql
