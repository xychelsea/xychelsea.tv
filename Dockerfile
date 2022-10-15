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
RUN git branch v0.104.3
RUN go install github.com/magefile/mage@v1.14.0
RUN mage hugo && mage install

# ---

FROM alpine:3.16.2

ENV HUGO_CACHEDIR=/site/hugo_cache

COPY --from=build /go/bin/hugo /usr/bin/hugo

# libc6-compat & libstdc++ are required for extended SASS libraries
# ca-certificates are required to fetch outside resources (like Twitter oEmbeds)
RUN apk update && \
    apk add --no-cache ca-certificates libc6-compat libstdc++ git

# generate our working directory and mount point
RUN mkdir -p /site
WORKDIR /site

# Expose port for live server
EXPOSE 1313

ENTRYPOINT ["/usr/bin/hugo"]
CMD [""]
