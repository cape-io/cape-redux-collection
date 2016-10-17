import test from 'tape'
import { keys } from 'lodash'

import { collections, user } from './mock'

import { predicateValueContains } from '../src/util'

const userCollections = predicateValueContains('creator', collections, user)
test('predicateValueContains', (t) => {
  t.deepEqual(keys(userCollections), [ 'a1', 'a3' ], 'keys match')
  t.equal(userCollections.a1.creator.anon, user, 'a1')
  t.equal(userCollections.a1, collections.a1)
  t.equal(userCollections.a3.creator.anon, user, 'a3')
  t.equal(userCollections.a3, collections.a3)
  t.end()
})
