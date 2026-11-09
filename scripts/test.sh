#!/bin/sh
# `npm test`: one fresh, clean build (so a stale bundle in public/ can never be
# the one under test), then the party tests against that build's bundle.
# Fails on a Hugo error and on a missing-asset or unknown-glyph warning, which
# Hugo itself only logs while still exiting 0.
set -eu

out=$(hugo --gc --minify --destination .test-build --cleanDestinationDir 2>&1) || { echo "$out"; exit 1; }
if echo "$out" | grep -E 'no asset at|unknown glyph'; then
  echo "test.sh: Hugo could not find an image or glyph (see above)" >&2
  exit 1
fi

RIP_PARTY_JS=$(ls .test-build/ts/party.*.js) node --test tests/party-storage.test.cjs
