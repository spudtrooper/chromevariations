#!/bin/bash

set -x

ZIP_NAME=$(basename $(pwd)).zip
zip -r $ZIP_NAME . -x "README.md" -x "config.template.js" -x "scripts/*" -x .gitignore -x ".git/*"
echo "Zip file $ZIP_NAME created"
