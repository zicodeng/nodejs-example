#!/usr/bin/env bash

docker build -t zicodeng/nodejs-server .

docker run -d \
--name nodejs-server \
-p 80:80 \
zicodeng/nodejs-server
