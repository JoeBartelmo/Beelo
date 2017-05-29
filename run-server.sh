#!/bin/bash -e

if [[ $UID != 0 ]]; then
    echo "Please run this script with sudo:"
    echo "sudo $0 $*"
    exit 1
fi

cd client
npm start &
PIDS[0]=$!
cd -
python api.py &
PIDS[1]=$!

#because of the threading something wonkey is going on where i don't
#get the correct # of pids, will look into later FIXME
trap "pkill python -9; pkill node -9" SIGINT
trap "pkill python -9; pkill node -9" SIGTERM
echo 'Waiting for apps...'
wait

