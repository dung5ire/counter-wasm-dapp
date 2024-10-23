#!/bin/bash
set -e
cd "`dirname $0`"/../counter
cargo contract build
cd ..

cp counter/target/ink/*.wasm ./res/
cp counter/target/ink/counter.json ./res/
cp counter/target/ink/counter.json ../ui/src/metadata/