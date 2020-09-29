// UTILS

// Function utils
export const curry = fn => {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
};

//    identity :: x -> x
const identity = x => x;

// List Utils

//           all :: [x] -> Boolean
export const all = list => list.every(identity);

//           contains :: (x, [x]) -> Boolean
export const contains = (item, list) => list && list.indexOf(item) > -1;

//    returns the list of elements found in both lists
//           intersection :: -> ([x], [x]) -> [x]
export const intersection = (list1, list2) => {
  const lookupList = list1.length > list2.length ? list1 : list2;
  const filteredList = list1.length > list2.length ? list2 : list1;

  return unique(filteredList.filter(x => contains(x, lookupList)));
};

//           sortBy :: Ord b => (x -> b) -> [x] -> [x]
export const sortBy = curry((fn, list) => list.sort((a, b) => fn(a) - fn(b)));

//           unique :: [x] -> [x]
export const unique = list => [...new Set(list)];

//           without :: (x|[x], [x]) -> [x]
export const without = (item, list) => {
  const items = [item].flat();
  return list.filter(x => !contains(x, item));
};

// Object Utils

//           collection :: {key: object} -> [object]
export const collection = obj => Object.keys(obj).map(key => obj[key]);

// passes each key in the object to a custom function to return the collection
//           decorateCollection :: (fn, {key: object}) -> [object]
export const decorateCollection = (fn, object) => Object.keys(object).map(fn);

//    safely return the property at a nested object path
//    e.g. path(["a", "b", "c"], { a: { b: { c: "foo" } } }) => "foo"
//           path :: ([String], object]) -> Any?
export const path = (props, object) => {
  let currentProp = object;
  let index = 0;

  for (; index < props.length; ) {
    if (currentProp == null) {
      return;
    }

    currentProp = currentProp[props[index]];
    index += 1;
  }

  return currentProp;
};

//           prop :: String -> {k: v} -> v?
export const prop = curry((key, object) => object && object[key]);
