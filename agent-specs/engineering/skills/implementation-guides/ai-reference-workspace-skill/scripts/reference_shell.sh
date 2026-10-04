#!/bin/sh

unset OPENAI_API_KEY OPENAI_API_BASE OPENAI_BASE_URL
unset HTTP_PROXY HTTPS_PROXY ALL_PROXY NO_PROXY
unset http_proxy https_proxy all_proxy no_proxy

exec /opt/ai-reference-runtime/bash "$@"
