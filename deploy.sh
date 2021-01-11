#!/bin/bash

echo "nvm 설정"

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

echo "해당 디렉토리 이동"

cd /home/ec2-user/delpoy/WebApiServer

echo "실핼중인 프로세스 종료"

kill -9 `ps -ef | grep 'node app.js' | awk '{print $2}'`

echo "package 설치 시작"

npm install

echo "node 환경설정"
export NODE_ENV=production

echo "app 실행 시작"

nohup npm start 1>/dev/null 2>&1 &

