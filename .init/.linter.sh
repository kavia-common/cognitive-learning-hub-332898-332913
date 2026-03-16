#!/bin/bash
cd /home/kavia/workspace/code-generation/cognitive-learning-hub-332898-332913/frontend_web_app
npm run lint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

