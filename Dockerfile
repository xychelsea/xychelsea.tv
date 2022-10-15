# GitHub:       https://github.com/gohugoio
# Twitter:      https://twitter.com/gohugoio
# Website:      https://gohugo.io/

FROM golang:1.19.2-alpine AS build

# Optionally set HUGO_BUILD_TAGS to "extended" or "nodeploy" when building like so:
#   docker build --network=host -t xychelsea/hugo:latest --build-arg HUGO_BUILD_TAGS=extended -f Dockerfile .
ARG HUGO_BUILD_TAGS

ARG CGO=1
ENV CGO_ENABLED=${CGO}
ENV GOOS=linux
ENV GO111MODULE=on

# gcc/g++ are required to build SASS libraries for extended version
RUN apk update && \
    apk add --no-cache gcc g++ musl-dev git

# build hugo
RUN git clone https://github.com/gohugoio/hugo.git /go/src/github.com/gohugoio/hugo
WORKDIR /go/src/github.com/gohugoio/hugo
RUN go install github.com/magefile/mage@latest
RUN mage hugo && mage install

# ---

FROM alpine:3.16.2

COPY --from=build /go/bin/hugo /usr/bin/hugo

# libc6-compat & libstdc++ are required for extended SASS libraries
# ca-certificates are required to fetch outside resources (like Twitter oEmbeds)
RUN apk update && \
    apk add --no-cache ca-certificates libc6-compat libstdc++ git

RUN mkdir -p /site
WORKDIR /site

# Expose port for live server
EXPOSE 1313

ENTRYPOINT ["hugo"]
CMD ["--help"]
