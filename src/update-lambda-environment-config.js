#!/usr/bin/env node

/* global process */

let input = ''

process.stdin.setEncoding('utf8')

process.stdin.on('data', data => {
  input += data
})

process.stdin.on('end', () => {
  let config
  try {
    config = JSON.parse(input)
  } catch (err) {
    process.stderr.write(`Failed to parse "${input}" to JSON.`)
    process.exit(1)
  }
  if (!config.Environment || !config.Environment.Variables) {
    process.stderr.write('Missing environment.')
    process.exit(2)
  }
  const env = Object.assign(config.Environment.Variables, {
    VERSION: process.env.VERSION,
    DEPLOY_TIME: process.env.DEPLOY_TIME || Date.now()
  })
  let vars = []
  for (let k in env) {
    vars.push(`${k}="${env[k]}"`)
  }
  process.stdout.write(vars.join(','))
})
