#!/usr/bin/env bash
#project= $(dirname "$PWD")

cd web

echo '清空web文件夹'
rm -rf ./dist/*

echo '开始编译'
npm run build

web_dir=../dist/web
echo '清空编译文件夹'
rm -rf $web_dir/*

echo '复制web文件夹'
if [[ ! -d $web_dir ]];then
    mkdir $web_dir
fi
cp -r ./dist/* $web_dir
