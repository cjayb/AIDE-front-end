#!/bin/bash
cd /app
ls
rm env-config.js
sh ../generate_env_config.sh > ./env-config.js
cd /app
more ./env-config.js
nginx
