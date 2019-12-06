#!/bin/bash

if [[ $NODE_ENV == development ]]; then
  prefix="DEV_"

  for i in _ {a..z} {A..Z}; do
     for var in `eval echo \\${!$i@}`; do
          if [[ $var == DEV_SERVERLESS_APP* ]]; then
              envName=$var
              prefix_removed_env=${envName/#$prefix}
              echo "${prefix_removed_env}=${!var}"
              echo "${prefix_removed_env}=${!var}" >> .env;
              export "${prefix_removed_env}=${!var}"
            fi
     done
  done
fi

if [[ $NODE_ENV == production ]]; then
  for i in _ {a..z} {A..Z}; do
     for var in `eval echo \\${!$i@}`; do
          if [[ $var == SERVERLESS_APP* ]]; then
              echo "${var}=${!var}"
              echo "${var}=${!var}" >> .env;
              export "${var}=${!var}"
            fi
     done
  done
fi