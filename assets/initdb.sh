#!/bin/bash
docker exec -i shopping-system_mysql_1 sh -c 'exec mysql -uroot -proot123.' < init.sql
