#!/bin/sh

echo "===START"

echo "Clobber old files..."
rm -rf docs
echo "Compile SASS..."
sass themes/default/assets/css/main.sass themes/default/assets/css/main.css
echo "Run TypeDoc..."
typedoc --mode file --out "./docs" --name "Drafts Script Reference" src --includeDeclarations --theme "./themes/default" --excludeExternals --tsconfig "tsconfig.json"

echo "===END"