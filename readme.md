# Redux-Tale

## Not even ready for normal usage

Note: This script was made with learning purposes, but I'm studying if it's somewhat relevant to have an actual package...

Any feedback is appreciated, but please note this script was not highly tested.

## Usage:

```javascript
import DuckTale from 'redux-ducktale'

/*
 * Returns the combined reducers of all passed on tales
 * Use it as a root reducer
 */
DuckTale.combine(...tales)



const tale = new DuckTale('NAMESPACE' = '', initialState = {})

/*
 * Sets the ducktale reducer initial state
 */
tale.init(initialState)

/*
 * Adds an action type with the appropriate NAMESPACE
 * Types are accessible with `tale.types.TYPENAME`
 */
tale.addType(typeName[, typeName2[, typeName3[, ...]]])

/*
 * Generates an action creator for the specified `typeName`
 * Use payloadTransform callback to transform the received payload
 * Use metaTransform callback to insert a meta property on the actions
 * Action creatores are accessible with `tale.actions.actionName`
 */
tale.addAction(actionName, typeName, payloadTransform, metaTransform)
tale.addActions({
  actionName: typeName,
  actionName2: [typeName, payloadTransform, metaTransform]
})

/*
 * Creates a routine
 * Reducers object keys must be one of the following:
 * trigger, request, failure, success, fullfilled
 * Routines are accessible with `tale.routines.routineName`
*/
tale.addRoutine(routineName, typeName, reducersObject, payloadTransform, metaTransform)

/*
 * Creates a selector
 * Selectors are accessible with `tale.selectors.selectorName`
*/
tale.addSelector(selectorName, selectorFn)
tale.addSelectors({
  selectorName: selectorFn,
  selectorName2: selectorFn2,
})

/*
 * Creates a reducer for the specified types
 * Reducers are accessible with `tale.reducers.typeName`
*/
tale.reduce(typeName, typeReducer = (state, action) => state)
tale.reduce([typeName1, typeName2], typesReducer = (state, action) => state)

/*
 * Gets the combine reducer for the tale
*/
tale.getReducer()
```
