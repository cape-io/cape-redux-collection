# cape-redux-collection v2.0.0

Redux functions for managing lists of stuff

Collections are lists of items. This module helps manage lists of items with `redux` and `redux-graph`.

Client state management to help handle adding/editing/removing.

A start next to field name indicates it is a reference to a single entity.

## Entities

### CollectionList

A blend of `Collection` and `ItemList`. Entity describes the item collection list. Can set things like the kinds of items the collection expects, date created. What user created it, why it was created, title.

- `additionalType` - String defines specific kind of collection.
- `agent`* - optional ref to entity that facilitated creation.
- `creator`* - ref to entity that created the list.
- `editor`* - ref to entity that edits/owns the list.
- `itemListElement`* * - Multi value of ListItem entity references.
- `itemListOrder` - One of (Ascending, Descending, Unordered)
- `mainEntity`* - Is the list limited to a specific type of item? Reference entity describing type/source.
- `numberOfItems`
- `title`: "Favorites"

### ListItem

Used to describe what item, its position, description, title, date added, status etc.

- `creator`* - ref to entity that created the list.
- `editor`* - Ref to editor/owner.
- `item`* - Ref to item of this list item.
- `mainEntity`* - ref to list it shows up on. Should it be multi value?
- `actionStatus` - One of ( Active, Created, Completed, Confirmed, Ended, Failed )
- `position` - int

## Actions

- `close` - Close dialog box for specific item.
- `confirmItem` - Set ListItem status to confirmed.
- `confirmActive` - Gets active ListItem and sends it to `confirmItem`.
- `createItem({ item, mainEntity })` - Create a new ListItem.
- `createList` - Create a new CollectionList.
- `endItem(listItem)` - Used to remove an ListItem from a list.
- `ensureUserHasCollection` - Give a user a default "favs" list if they don't have one.
- `open` - Specific to an item. App should show dialog box.
- `toggle` - Add or remove from favs list or open dialog.
