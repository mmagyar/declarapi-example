// set up global namespace for worker environment
import * as makeServiceWorkerEnv from 'service-worker-mock'
declare var global: any
// @ts-ignore
Object.assign(global, makeServiceWorkerEnv())
