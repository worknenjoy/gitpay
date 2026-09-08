#!/usr/bin/env bash
set -e

GITPAY_WORKING_DIR=$(cd "$(dirname ${BASH_SOURCE[0]:-$0})" && pwd)

POSTGRES_DB=gitpay_dev
POSTGRES_USER=gitpay_dev
POSTGRES_PASSWORD=gitpay_dev
create_env() {
    2>/dev/null createuser --login --createdb --createrole --superuser "$USER" --no-password || true
    2>/dev/null dropdb "$POSTGRES_DB" || true
    1>/dev/null psql -U $USER -d postgres --no-password -c "DROP ROLE IF EXISTS $POSTGRES_USER"
    2>/dev/null dropuser "$POSTGRES_USER" || true
    createuser --login --createdb --createrole --superuser "$POSTGRES_USER" --no-password
    1>/dev/null psql -d postgres --no-password -c "CREATE DATABASE $POSTGRES_DB"
    1>/dev/null psql -d postgres --no-password -c "ALTER USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD'";
    cat >>.env<<EOF
FRONTEND_HOST=http://localhost:8082
API_HOST="http://localhost:3000"
PAYPAL_HOST="https://api.sandbox.paypal.com"

FACEBOOK_ID=noon
FACEBOOK_SECRET=noon

SENDGRID_API_KEY=noon

GOOGLE_ID=noon
GOOGLE_SECRET=noon

GITHUB_ID=noon
GITHUB_SECRET=noon

BITBUCKET_ID=noon
BITBUCKET_SECRET=noon

MAILCHIMP_API_KEY=noon
MAILCHIMP_LIST_ID=noon

## Slack app with channels:read permission
SLACK_TOKEN=noon
SLACK_CHANNEL_ID=noon
SLACK_CHANNEL_INVITE_LINK=noon

SECRET_PHRASE=noon
STRIPE_KEY=noon
STRIPE_PUBKEY=noon

GOOGLE_RECAPTCHA_SITE_KEY=noon

#postgres auth
POSTGRES_USER=${POSTGRES_USER}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=${POSTGRES_DB}
EOF
}
rm -f .env
if [ ! -f .env ]; then
    create_env
else
    1>&2 echo -e "\033[1;33m.env already exists, remove it and rerun this script to create postgres credentials\033[0m"
fi

echo -e "\033[1;38;5;247mpostgres setup \033[1;38;5;118mOK\033[0m"
