# update-lambda-environment-config

[![npm version](https://img.shields.io/npm/v/@rheactorjs/update-lambda-environment-config.svg)](https://www.npmjs.com/package/@rheactorjs/update-lambda-environment-config)
[![Build Status](https://travis-ci.org/RHeactorJS/update-lambda-environment-config.svg?branch=master)](https://travis-ci.org/RHeactorJS/update-lambda-environment-config)
[![monitored by greenkeeper.io](https://img.shields.io/badge/greenkeeper.io-monitored-brightgreen.svg)](http://greenkeeper.io/) 
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![semantic-release](https://img.shields.io/badge/semver-semantic%20release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This script takes the output of `aws lambda get-function-configuration` and returns an updated environment configuration string with added version, deployTime and node environment from environment variables.

## Example

Given this is the configuration for your lambda:
    
    { 
       "FunctionName": "myLambdaFunction", 
       … 
       "Environment": { 
           "Variables": { 
               "FOO": "BAR" 
           } 
        } 
    } 
    
If called like this:

    $ VERSION=1.2.3
    $ DEPLOY_TIME=1234567890
    $ NODE_ENV=production
    $ VARS=`aws lambda get-function-configuration \
    --function-name myLambdaFunction \
    | ./node_modules/.bin/update-lambda-environment-config`
    
it sets `$VARS` to this
    
    FOO="BAR",VERSION="1.2.3",DEPLOY_TIME="1234567890",NODE_ENV="production"

which can be used for updating it via `aws lambda update-function-configuration`:

    aws lambda update-function-configuration \
    --function-name "myLambdaFunction" \
    --environment "Variables={$(VARS)}"

See it in action [here](https://github.com/RHeactorJS/image-service/blob/master/Makefile).
