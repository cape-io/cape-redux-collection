import test from 'tape'

import { findActionCreated } from '../src/helpers'

test('findActionCreated()', (t) => {
  const vals = [
    { id: 'foo' },
    { id: 'bar', actionStatus: 'created' },
  ]
  const found = findActionCreated(vals)
  t.equal(found, vals[1])
  t.end()
})
