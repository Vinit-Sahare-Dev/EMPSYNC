#!/bin/bash

# Temporary migration script to run inside Docker
docker run --rm --network empsync_empsync-network \
  -e SOURCE_HOST=mysql \
  -e SOURCE_PORT=3306 \
  -e SOURCE_DB=employee_management_system \
  -e SOURCE_USER=root \
  -e SOURCE_PASS=newpassword \
  mysql:8.0 \
  mysqldump -h $SOURCE_HOST -P $SOURCE_PORT -u $SOURCE_USER -p$SOURCE_PASS $SOURCE_DB

echo "Use the above dump to import to your Aiven database"
