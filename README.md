# cape-redux-collection v1.0.1

Redux functions for managing lists of stuff

Collections are lists of items. This module helps manage lists of items with `redux` and `redux-graph`.

* `CollectionList` entity describes the list. Can set things like the kinds of items the collection expects, date created. What user created it, why it was created, title.
* `ListItem` used to describe what item, its position, description, title, date added, status etc.

There's also some client state management to help handle adding/editing/removing.

Initially wrote thinking there'd only be one item per list. That could/should probably change.
