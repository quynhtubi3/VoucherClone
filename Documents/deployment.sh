#!/bin/bash
cd /home/sapiaidev/GroupWare/groupware/groupware.cloud/ 2>&1
sudo dotnet publish --configuration Release 2>&1
cp -avr /home/sapiaidev/GroupWare/groupware/groupware.cloud/bin/Release/netcoreapp3.1/publish/* /var/www/gw.cloud 2>&1

cp -avr /home/sapiaidev/GroupWare/groupware/groupware.cloud/Template /var/www/gw.cloud

sudo chmod -R 777 /var/www/gw.cloud/wwwroot
sudo systemctl stop gw.cloud.service 2>&1
sudo systemctl start gw.cloud.service 2>&1