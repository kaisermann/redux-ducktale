const routineSuffixes = [
  'TRIGGER',
  'REQUEST',
  'SUCCESS',
  'FAILURE',
  'FULLFILL',
];

export default class DuckTale {
  namespace;
  initialState;
  types = {};
  routines = {};
  actions = {};
  selectors = {};
  reducers = {};

  constructor(namespace, initialState) {
    this.namespace = namespace;
    this.initialState = initialState;
  }

  init(initialState) {
    this.initialState = initialState;
    return this;
  }

  addType(...types) {
    types.forEach(type => {
      this.types[type] = `${this.namespace}/${type}`;
    });
    return this;
  }

  addRoutine(routineName, typeName, reducersObj, ...rest) {
    typeName = `${this.namespace}/${typeName}`;
    this.routines[routineName] = DuckTale.createRoutine(typeName, ...rest);
    if (reducersObj != null && reducersObj.constructor === Object) {
      Object.keys(reducersObj).forEach(key => {
        this.reduce(`${typeName}_${key.toUpperCase()}`, reducersObj[key], true);
      });
    }
    return this;
  }

  addAction(actionName, typeName, ...rest) {
    if (!this.types[typeName]) {
      this.addTypes([typeName]);
    }
    this.actions[actionName] = DuckTale.createAction(
      this.types[typeName],
      ...rest,
    );
    return this;
  }

  addActions(actions) {
    Object.keys(actions).forEach(actionName => {
      if (!Array.isArray(actions[actionName])) {
        actions[actionName] = [actions[actionName]];
      }
      this.addAction(actionName, ...actions[actionName]);
    });
    return this;
  }

  addSelector(selectorName, selectorFn) {
    this.selectors[selectorName] = selectorFn;
    return this;
  }

  addSelectors(selectorsObj) {
    Object.keys(selectorsObj).forEach(key =>
      this.addSelector(key, selectorsObj[key]),
    );
    return this;
  }

  reduce(typeNames, reducerFn) {
    if (!Array.isArray(typeNames)) {
      typeNames = [typeNames];
    }
    typeNames.forEach(typeName => {
      typeName = this.types[typeName] || typeName;
      this.reducers[typeName] = reducerFn;
    });
    return this;
  }

  getReducer() {
    return (state = this.initialState, action) => {
      if (this.reducers[action.type]) {
        return this.reducers[action.type](state, action);
      }
      return state;
    };
  }

  static createAction(type, payloadTransform, metaTransform) {
    return (...args) => {
      const action = { type };
      const payload =
        args[0] instanceof Error || typeof payloadTransform !== 'function'
          ? args[0]
          : payloadTransform(...args);

      if (payload instanceof Error) action.error = true;
      if (payload !== undefined) action.payload = payload;
      if (typeof metaTransform === 'function') {
        action.meta = metaTransform(...args);
      }
      return action;
    };
  }

  static createRoutine(routinePrefix = '', payloadTransform, metaTransform) {
    routinePrefix = routinePrefix.toUpperCase();
    return routineSuffixes.reduce((acc, suffix) => {
      const type = `${routinePrefix}_${suffix}`;

      // Uppercase properties should denote the action type
      acc[suffix] = type;

      // Lowercase properties should denote the action creators
      acc[suffix.toLowerCase()] = DuckTale.createAction(
        type,
        payloadTransform,
        metaTransform,
      );
      return acc;
    }, {});
  }

  static combine(talesObj) {
    const cachedReducers = {};
    return (state = {}, action) => {
      return Object.keys(talesObj).reduce((nextState, statePropName) => {
        if (cachedReducers[statePropName] === undefined) {
          cachedReducers[statePropName] = talesObj[statePropName].getReducer();
        }

        nextState[statePropName] = cachedReducers[statePropName](
          state[statePropName],
          action,
        );

        return nextState;
      }, {});
    };
  }
}
