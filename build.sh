#!/bin/sh

echo "===START"

typedoc --mode file --out "./docs" --name "Drafts" src --includeDeclarations --theme minimal --excludeExternals

echo "===END"