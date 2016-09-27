import test from 'tape'
import { keys } from 'lodash'

import { collection, user } from '../mock'

import { findCreator, predicateValueContains } from '../../src/redux/project/util'
import { isFavList } from '../../src/redux/project/lang'

const userCollections = predicateValueContains('creator', collection, user)
test('predicateValueContains', t => {
  t.deepEqual(keys(userCollections), [ 'a1', 'a3' ], 'keys match')
  t.equal(userCollections.a1.creator.anon, user, 'a1')
  t.equal(userCollections.a1, collection.a1)
  t.equal(userCollections.a3.creator.anon, user, 'a3')
  t.equal(userCollections.a3, collection.a3)
  t.end()
})
test('findCreator', t => {
  const res = findCreator(isFavList)(userCollections)
  t.equal(res, userCollections.a3, 'find favs')
  t.end()
})
