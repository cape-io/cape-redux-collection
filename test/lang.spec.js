import test from 'tape'

import { isCollectionList, isFavList, isValidListItem } from '../src/lang'
import { ENDED, FAV_TITLE } from '../src/const'

test('isCollectionList', (t) => {
  const collection = {
    dateCreated: new Date(),
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
  const val = { actionStatus: 'confirmed' }
  t.ok(isValidListItem(val), 'valid')
  const inval = { actionStatus: ENDED }
  t.notOk(isValidListItem(inval), 'invalid')
  t.end()
})
test('isFavList', (t) => {
  t.ok(isFavList({ title: FAV_TITLE }), 'FAV_TITLE')
  t.notOk(isFavList({ title: 'boo' }), 'non fav title')
  t.end()
})
