#!/bin/sh

set -e
gem install bundler -v 1.17.3
bundle binstubs bundler --force
bundle check || bundle install --binstubs="$BUNDLE_BIN"

yarn install

rails db:setup

rm -f tmp/pids/server.pid

bin/rails server --port $RAILS_SERVER_PORT --binding $RAILS_SERVER_HOST
