#!/bin/sh

echo "===START"

echo "Clobber old files..."
rm -rf docs

echo "Compile SASS..."
npx sass themes/default/assets/css/main.sass themes/default/assets/css/main.css

echo "Combine Sources..."
rm -rf src/drafts.d.ts
cat src-individual/*.d.ts >> src/drafts.d.ts

echo "Run TypeDoc..."
#npx typedoc --mode file --out "./docs" --name "Drafts Script Reference" src --includeDeclarations --theme "./themes/default" --excludeExternals --tsconfig "tsconfig.json"
npx typedoc

echo "Create drafts-definitions.js"
cat src-individual/* >> docs/drafts-definitions.js

echo "===END"