import test from 'tape'

import { isFavList, isValidListItem } from '../src/lang'
import { favTitle } from '../src/const'

test('isValidListItem()', (t) => {
  const val = { actionStatus: 'confirmed' }
  t.ok(isValidListItem(val), 'valid')
  const inval = { actionStatus: 'ended' }
  t.notOk(isValidListItem(inval), 'invalid')
  t.end()
})
test('isFavList', (t) => {
  t.ok(isFavList({ title: favTitle }), 'favTitle')
  t.notOk(isFavList({ title: 'boo' }), 'non fav title')
  t.end()
})
