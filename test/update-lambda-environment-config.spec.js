'use strict'

/* global describe, it, process */

const expect = require('chai').expect
const childProcess = require('child_process')

describe('update-lambda-environment-config', () => {
  it('should abort if no JSON is passed', done => {
    const child = childProcess.spawn('./dist/update-lambda-environment-config.js')
    let errData = ''
    child.stdin.write('')
    child.stderr.on('data', data => {
      errData += data
    })
    child.stdin.end()
    child.on('close', code => {
      expect(code, 'Exit code should be 1').to.equal(1)
      expect(errData, 'An error messsage should have been produced').to.match(/Failed to parse "" to JSON/)
      done()
    })
  })
  it('should abort if no Environment is passed', done => {
    const child = childProcess.spawn('./dist/update-lambda-environment-config.js')
    let errData = ''
    child.stderr.on('data', data => {
      errData += data
    })
    child.stdin.write('{')
    child.stdin.write('  "Environment": {')
    child.stdin.write('  }')
    child.stdin.write('}')
    child.stdin.end()
    child.on('close', code => {
      expect(errData, 'An error messsage should have been produced').to.match(/Missing environment./)
      expect(code, 'Exit code should be 2').to.equal(2)
      done()
    })
  })
  it('should update the environment variables', done => {
    const child = childProcess.spawn('./dist/update-lambda-environment-config.js', {
      env: {
        DEPLOY_TIME: '1234567890',
        VERSION: '1.2.3'
      }
    })
    let result = ''
    let errData = ''
    child.stderr.on('data', data => {
      errData += data
    })
    child.stdout.on('data', data => {
      result += data
    })
    child.stdin.write('{')
    child.stdin.write('  "Environment": {')
    child.stdin.write('    "Variables": {')
    child.stdin.write('      "FOO": "BAR"')
    child.stdin.write('    }')
    child.stdin.write('  }')
    child.stdin.write('}')
    child.stdin.end()
    child.on('close', code => {
      expect(errData, 'No error messsage should have been produced').to.equal('')
      expect(code, 'Exit code should be 0').to.equal(0)
      expect(result, 'It should create a string to use for updating the vars').to.equal('FOO="BAR",VERSION="1.2.3",DEPLOY_TIME="1234567890"')
      done()
    })
  })
})
