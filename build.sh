#!/bin/sh

echo "===START"

echo "Clobber old files..."
rm -rf docs
echo "Compile SASS..."
npx sass themes/default/assets/css/main.sass themes/default/assets/css/main.css
echo "Run TypeDoc..."
npx typedoc --mode file --out "./docs" --name "Drafts Script Reference" src --includeDeclarations --theme "./themes/default" --excludeExternals --tsconfig "tsconfig.json"

echo "Create drafts-definitions.js"
cat src/* >> docs/drafts-definitions.js

echo "===END"