#!/bin/bash
# run this script if you have problems with disk space for docker
docker rm $(docker ps -q -f 'status=exited')
docker rmi $(docker images -q -f "dangling=true")
docker volume prune