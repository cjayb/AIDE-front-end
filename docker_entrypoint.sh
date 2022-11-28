#!/bin/bash
ls app
cd app
rm env-config.js
sh ./generate_env_config.sh > ./env-config.js
more ./env-config.js
nginx
