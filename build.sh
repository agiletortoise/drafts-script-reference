#!/bin/sh

echo "===START"

typedoc --mode file --out "./docs" --name "Drafts Script Reference" src --includeDeclarations --theme minimal --excludeExternals --tsconfig "tsconfig.json"

echo "===END"