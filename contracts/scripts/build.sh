#!/bin/bash
set -e
cd "`dirname $0`"/../counter
cargo +nightly contract build 
cd ..

cp counter/target/ink/*.wasm counter/target/ink/metadata.json ./res/