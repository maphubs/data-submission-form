#!/bin/sh
NODE_ENV=production
PACKAGE_VERSION=`node -p "require('./version.json').version"`
ASSET_CDN_PREFIX=https://hpvhe47439ygwrt.belugacdn.link/maphubs/data-submission-form

#next.js build and export assets
node --max_old_space_size=4096 node_modules/next/dist/bin/next-build
node node_modules/next/dist/bin/next-export -o .next-export

#docker build
docker pull node:8
docker build . --compress -t quay.io/maphubs/data-submission-form:latest

#commit version tag
git add version.json
git commit  -m "version $PACKAGE_VERSION"
git tag v$PACKAGE_VERSION
git push origin
git push origin v$PACKAGE_VERSION

#sync assets to CDN
aws s3 sync .next-export/ s3://maphubs-cdn/maphubs/data-submission-form --acl public-read

#push Docker image to repo
docker tag quay.io/maphubs/web:data-submission-form quay.io/maphubs/data-submission-form:v$PACKAGE_VERSION
docker push quay.io/maphubs/data-submission-form:v$PACKAGE_VERSION

#update changelog
npm run changelog
