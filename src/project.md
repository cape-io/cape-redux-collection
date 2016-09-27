## Status

- `noList` - Item not in any list.
- `inList` - auth in list.
- `editing` - Auth can add/remove/edit.

## onClick

1. `noList` (+) Create `ListItem` entity associated with item. Create default favs collection list if user has no others. Display edit window.
1. `inList` (...) Display edit window.
1. `editing` (x) Close edit window.

## Editing Window

- `projects` List of projects the item is in. Remove and Edit button next to each. Dropdown to add to other projects. Option to make new project.
- `project` Project detail. Allow editing comment, position or remove from collection.
- `addProject` Add project.

## Item Icons
1. `noList` (+) Create `ListItem` entity associated with item. Create default favs collection list if user has no others. Display edit window.
1. `inList` (...) Display edit window.
1. `editing` (x) Close edit window.

## State
- Editing specific `ListItem`.
