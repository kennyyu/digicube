#!/bin/bash -ex

git status
current_branch=$(git rev-parse --abbrev-ref HEAD)
yarn run build
tmpdir=$(mktemp -d)
mv build $tmpdir
git fetch
git checkout origin_public/gh-pages
rm -rf *
rm -rf .gitignore
cp -R $tmpdir/build/* .
git add *
git commit -am "Site published at $(date)"
git push origin_public HEAD:gh-pages
git checkout $current_branch
rm -rf $tmpdir
