/* global describe, it, process */

import {expect} from 'chai'
import childProcess from 'child_process'

describe('update-lambda-environment-config', () => {
  it('should abort if no JSON is passed', done => {
    const child = childProcess.spawn('./dist/update-lambda-environment-config.js', {PATH: process.env.PATH})
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
    const child = childProcess.spawn('./dist/update-lambda-environment-config.js', {PATH: process.env.PATH})
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
  it('should update the environment variables', () => {
    const result = childProcess.execSync('./dist/update-lambda-environment-config.js', {
      env: {
        PATH: process.env.PATH,
        DEPLOY_TIME: '1234567890',
        VERSION: '1.2.3'
      },
      input: '{\n  "Environment": {\n    "Variables": {\n      "FOO": "BAR"\n    }\n  }\n}'
    })
    expect(result.toString(), 'It should create a string to use for updating the vars').to.equal('FOO="BAR",VERSION="1.2.3",DEPLOY_TIME="1234567890"')
  })
})
