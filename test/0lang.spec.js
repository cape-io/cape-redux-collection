import test from 'tape'
import { now } from 'lodash'
import { REF } from '@kaicurry/redux-graph'
import { isActionEnded, isCollectionList, isFavList, noItemRef, isValidListItem } from '../src/lang'
import { CONFIRMED, ENDED, FAV_TITLE } from '../src/const'
import { sailboat } from './mock'

test('noItemRef', (t) => {
  t.true(noItemRef({}))
  t.true(noItemRef({ [REF]: {} }))
  t.true(noItemRef({ [REF]: { foo: {} } }))
  t.false(noItemRef({ [REF]: { item: {} } }))
  t.end()
})
test('isActionEnded', (t) => {
  t.true(isActionEnded({ actionStatus: ENDED, [REF]: { item: sailboat } }))
  t.false(isActionEnded({ actionStatus: CONFIRMED, [REF]: { item: sailboat } }))
  t.true(isActionEnded({ actionStatus: CONFIRMED, [REF]: {} }))
  t.end()
})
test('isCollectionList', (t) => {
  const collection = {
    dateCreated: now(),
    itemListOrder: 'Ascending',
    type: 'CollectionList',
    title: 'Favorites',
    id: 'mk46xvzp',
  }
  t.ok(isCollectionList(collection))
  collection.itemListOrder = 'Desc'
  t.false(isCollectionList(collection))
  t.end()
})
test('isValidListItem()', (t) => {
  const val = { actionStatus: 'confirmed', [REF]: { item: {} } }
  t.ok(isValidListItem(val), 'valid')
  const val2 = { actionStatus: 'confirmed' }
  t.false(isValidListItem(val2), 'valid')
  const inval = { actionStatus: ENDED, [REF]: { item: {} } }
  t.notOk(isValidListItem(inval), 'invalid')
  t.end()
})
test('isFavList', (t) => {
  t.ok(isFavList({ title: FAV_TITLE }), 'FAV_TITLE')
  t.notOk(isFavList({ title: 'boo' }), 'non fav title')
  t.end()
})
