#!/usr/bin/env bash

docker rm -f $(docker ps -a)
docker-compose up