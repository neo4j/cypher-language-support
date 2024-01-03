export const dummyDbSchema = {
  functionSignatures: {
    abs: {
      label: 'abs',
      documentation: 'Returns the absolute value of an `INTEGER` or `FLOAT`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: INTEGER | FLOAT',
        },
      ],
    },
    acos: {
      label: 'acos',
      documentation: 'Returns the arccosine of a `FLOAT` in radians.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT',
        },
      ],
    },
    all: {
      label: 'all',
      documentation:
        'Returns true if the predicate holds for all elements in the given `LIST<ANY>`.',
      parameters: [
        {
          label: 'variable',
          documentation: 'variable :: ANY',
        },
        {
          label: 'list',
          documentation: 'list :: LIST<ANY>',
        },
      ],
    },
    any: {
      label: 'any',
      documentation:
        'Returns true if the predicate holds for at least one element in the given `LIST<ANY>`.',
      parameters: [
        {
          label: 'variable',
          documentation: 'variable :: ANY',
        },
        {
          label: 'list',
          documentation: 'list :: LIST<ANY>',
        },
      ],
    },
    'apoc.agg.first': {
      label: 'apoc.agg.first',
      documentation: 'Returns the first value from the given collection.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
      ],
    },
    'apoc.agg.graph': {
      label: 'apoc.agg.graph',
      documentation:
        'Returns all distinct `NODE` and `RELATIONSHIP` values collected into a `MAP` with the keys `nodes` and `relationships`.',
      parameters: [
        {
          label: 'path',
          documentation: 'path :: ANY',
        },
      ],
    },
    'apoc.agg.last': {
      label: 'apoc.agg.last',
      documentation: 'Returns the last value from the given collection.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
      ],
    },
    'apoc.agg.maxItems': {
      label: 'apoc.agg.maxItems',
      documentation:
        'Returns a `MAP` `{items: LIST<ANY>, value: ANY}` where the `value` key is the maximum value present, and `items` represent all items with the same value. The size of the list of items can be limited to a given max size.',
      parameters: [
        {
          label: 'items',
          documentation: 'items :: ANY',
        },
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
        {
          label: 'groupLimit',
          documentation: 'groupLimit = -1 :: INTEGER',
        },
      ],
    },
    'apoc.agg.median': {
      label: 'apoc.agg.median',
      documentation:
        'Returns the mathematical median for all non-null `INTEGER` and `FLOAT` values.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
      ],
    },
    'apoc.agg.minItems': {
      label: 'apoc.agg.minItems',
      documentation:
        'Returns a `MAP` `{items: LIST<ANY>, value: ANY}` where the `value` key is the minimum value present, and `items` represent all items with the same value. The size of the list of items can be limited to a given max size.',
      parameters: [
        {
          label: 'items',
          documentation: 'items :: ANY',
        },
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
        {
          label: 'groupLimit',
          documentation: 'groupLimit = -1 :: INTEGER',
        },
      ],
    },
    'apoc.agg.nth': {
      label: 'apoc.agg.nth',
      documentation:
        'Returns the nth value in the given collection (to fetch the last item of an unknown length collection, -1 can be used).',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
        {
          label: 'offset',
          documentation: 'offset :: INTEGER',
        },
      ],
    },
    'apoc.agg.percentiles': {
      label: 'apoc.agg.percentiles',
      documentation:
        'Returns the given percentiles over the range of numerical values in the given collection.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: INTEGER | FLOAT',
        },
        {
          label: 'percentiles',
          documentation:
            'percentiles = [0.5, 0.75, 0.9, 0.95, 0.99] :: LIST<FLOAT>',
        },
      ],
    },
    'apoc.agg.product': {
      label: 'apoc.agg.product',
      documentation:
        'Returns the product of all non-null `INTEGER` and `FLOAT` values in the collection.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: INTEGER | FLOAT',
        },
      ],
    },
    'apoc.agg.slice': {
      label: 'apoc.agg.slice',
      documentation:
        'Returns a subset of non-null values from the given collection (the collection is considered to be zero-indexed).\nTo specify the range from start until the end of the collection, the length should be set to -1.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
        {
          label: 'from',
          documentation: 'from = 0 :: INTEGER',
        },
        {
          label: 'to',
          documentation: 'to = -1 :: INTEGER',
        },
      ],
    },
    'apoc.agg.statistics': {
      label: 'apoc.agg.statistics',
      documentation:
        'Returns the following statistics on the `INTEGER` and `FLOAT` values in the given collection: percentiles, min, minNonZero, max, total, mean, stdev.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: INTEGER | FLOAT',
        },
        {
          label: 'percentiles',
          documentation:
            'percentiles = [0.5, 0.75, 0.9, 0.95, 0.99] :: LIST<FLOAT>',
        },
      ],
    },
    'apoc.any.isDeleted': {
      label: 'apoc.any.isDeleted',
      documentation:
        'Returns true if the given `NODE` or `RELATIONSHIP` no longer exists.',
      parameters: [
        {
          label: 'object',
          documentation: 'object :: ANY',
        },
      ],
    },
    'apoc.any.properties': {
      label: 'apoc.any.properties',
      documentation:
        'Returns all properties of the given object.\nThe object can be a virtual `NODE`, a real `NODE`, a virtual `RELATIONSHIP`, a real `RELATIONSHIP`, or a `MAP`.',
      parameters: [
        {
          label: 'object',
          documentation: 'object :: ANY',
        },
        {
          label: 'keys',
          documentation: 'keys = null :: LIST<STRING>',
        },
      ],
    },
    'apoc.any.property': {
      label: 'apoc.any.property',
      documentation:
        'Returns the property for the given key from an object.\nThe object can be a virtual `NODE`, a real `NODE`, a virtual `RELATIONSHIP`, a real `RELATIONSHIP`, or a `MAP`.',
      parameters: [
        {
          label: 'object',
          documentation: 'object :: ANY',
        },
        {
          label: 'key',
          documentation: 'key :: STRING',
        },
      ],
    },
    'apoc.bitwise.op': {
      label: 'apoc.bitwise.op',
      documentation: 'Returns the result of the bitwise operation',
      parameters: [
        {
          label: 'a',
          documentation: 'a :: INTEGER',
        },
        {
          label: 'operator',
          documentation: 'operator :: STRING',
        },
        {
          label: 'b',
          documentation: 'b :: INTEGER',
        },
      ],
    },
    'apoc.coll.avg': {
      label: 'apoc.coll.avg',
      documentation:
        'Returns the average of the numbers in the `LIST<INTEGER | FLOAT>`.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<INTEGER | FLOAT>',
        },
      ],
    },
    'apoc.coll.combinations': {
      label: 'apoc.coll.combinations',
      documentation:
        'Returns a collection of all combinations of `LIST<ANY>` elements between the selection size `minSelect` and `maxSelect` (default: `minSelect`).',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
        {
          label: 'minSelect',
          documentation: 'minSelect :: INTEGER',
        },
        {
          label: 'maxSelect',
          documentation: 'maxSelect = -1 :: INTEGER',
        },
      ],
    },
    'apoc.coll.contains': {
      label: 'apoc.coll.contains',
      documentation:
        'Returns whether or not the given value exists in the given collection (using a HashSet).',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
      ],
    },
    'apoc.coll.containsAll': {
      label: 'apoc.coll.containsAll',
      documentation:
        'Returns whether or not all of the given values exist in the given collection (using a HashSet).',
      parameters: [
        {
          label: 'coll1',
          documentation: 'coll1 :: LIST<ANY>',
        },
        {
          label: 'coll2',
          documentation: 'coll2 :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.containsAllSorted': {
      label: 'apoc.coll.containsAllSorted',
      documentation:
        'Returns whether or not all of the given values in the second `LIST<ANY>` exist in an already sorted collection (using a binary search).',
      parameters: [
        {
          label: 'coll1',
          documentation: 'coll1 :: LIST<ANY>',
        },
        {
          label: 'coll2',
          documentation: 'coll2 :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.containsDuplicates': {
      label: 'apoc.coll.containsDuplicates',
      documentation:
        'Returns true if a collection contains duplicate elements.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.containsSorted': {
      label: 'apoc.coll.containsSorted',
      documentation:
        'Returns whether or not the given value exists in an already sorted collection (using a binary search).',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
      ],
    },
    'apoc.coll.different': {
      label: 'apoc.coll.different',
      documentation:
        'Returns true if all the values in the given `LIST<ANY>` are unique.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.disjunction': {
      label: 'apoc.coll.disjunction',
      documentation: 'Returns the disjunct set from two `LIST<ANY>` values.',
      parameters: [
        {
          label: 'list1',
          documentation: 'list1 :: LIST<ANY>',
        },
        {
          label: 'list2',
          documentation: 'list2 :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.dropDuplicateNeighbors': {
      label: 'apoc.coll.dropDuplicateNeighbors',
      documentation:
        'Removes duplicate consecutive objects in the `LIST<ANY>`.',
      parameters: [
        {
          label: 'list',
          documentation: 'list :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.duplicates': {
      label: 'apoc.coll.duplicates',
      documentation:
        'Returns a `LIST<ANY>` of duplicate items in the collection.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.duplicatesWithCount': {
      label: 'apoc.coll.duplicatesWithCount',
      documentation:
        'Returns a `LIST<ANY>` of duplicate items in the collection and their count, keyed by `item` and `count`.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.fill': {
      label: 'apoc.coll.fill',
      documentation: 'Returns a `LIST<ANY>` with the given count of items.',
      parameters: [
        {
          label: 'items',
          documentation: 'items :: STRING',
        },
        {
          label: 'count',
          documentation: 'count :: INTEGER',
        },
      ],
    },
    'apoc.coll.flatten': {
      label: 'apoc.coll.flatten',
      documentation:
        'Flattens the given `LIST<ANY>` (to flatten nested `LIST<ANY>` values, set recursive to true).',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
        {
          label: 'recursive',
          documentation: 'recursive = false :: BOOLEAN',
        },
      ],
    },
    'apoc.coll.frequencies': {
      label: 'apoc.coll.frequencies',
      documentation:
        'Returns a `LIST<ANY>` of frequencies of the items in the collection, keyed by `item` and `count`.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.frequenciesAsMap': {
      label: 'apoc.coll.frequenciesAsMap',
      documentation:
        'Returns a `MAP` of frequencies of the items in the collection, keyed by `item` and `count`.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.indexOf': {
      label: 'apoc.coll.indexOf',
      documentation:
        'Returns the index for the first occurrence of the specified value in the `LIST<ANY>`.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
      ],
    },
    'apoc.coll.insert': {
      label: 'apoc.coll.insert',
      documentation:
        'Inserts a value into the specified index in the `LIST<ANY>`.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
        {
          label: 'index',
          documentation: 'index :: INTEGER',
        },
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
      ],
    },
    'apoc.coll.insertAll': {
      label: 'apoc.coll.insertAll',
      documentation:
        'Inserts all of the values into the `LIST<ANY>`, starting at the specified index.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
        {
          label: 'index',
          documentation: 'index :: INTEGER',
        },
        {
          label: 'values',
          documentation: 'values :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.intersection': {
      label: 'apoc.coll.intersection',
      documentation:
        'Returns the distinct intersection of two `LIST<ANY>` values.',
      parameters: [
        {
          label: 'list1',
          documentation: 'list1 :: LIST<ANY>',
        },
        {
          label: 'list2',
          documentation: 'list2 :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.isEqualCollection': {
      label: 'apoc.coll.isEqualCollection',
      documentation:
        'Returns true if the two collections contain the same elements with the same cardinality in any order (using a HashMap).',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
        {
          label: 'values',
          documentation: 'values :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.max': {
      label: 'apoc.coll.max',
      documentation:
        'Returns the maximum of all values in the given `LIST<ANY>`.',
      parameters: [
        {
          label: 'values',
          documentation: 'values :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.min': {
      label: 'apoc.coll.min',
      documentation:
        'Returns the minimum of all values in the given `LIST<ANY>`.',
      parameters: [
        {
          label: 'values',
          documentation: 'values :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.occurrences': {
      label: 'apoc.coll.occurrences',
      documentation: 'Returns the count of the given item in the collection.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
        {
          label: 'item',
          documentation: 'item :: ANY',
        },
      ],
    },
    'apoc.coll.pairWithOffset': {
      label: 'apoc.coll.pairWithOffset',
      documentation: 'Returns a `LIST<ANY>` of pairs defined by the offset.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
        {
          label: 'offset',
          documentation: 'offset :: INTEGER',
        },
      ],
    },
    'apoc.coll.pairs': {
      label: 'apoc.coll.pairs',
      documentation:
        'Returns a `LIST<ANY>` of adjacent elements in the `LIST<ANY>` ([1,2],[2,3],[3,null]).',
      parameters: [
        {
          label: 'list',
          documentation: 'list :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.pairsMin': {
      label: 'apoc.coll.pairsMin',
      documentation:
        'Returns `LIST<ANY>` values of adjacent elements in the `LIST<ANY>` ([1,2],[2,3]), skipping the final element.',
      parameters: [
        {
          label: 'list',
          documentation: 'list :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.partition': {
      label: 'apoc.coll.partition',
      documentation:
        'Partitions the original `LIST<ANY>` into a new `LIST<ANY>` of the given batch size.\nThe final `LIST<ANY>` may be smaller than the given batch size.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
        {
          label: 'batchSize',
          documentation: 'batchSize :: INTEGER',
        },
      ],
    },
    'apoc.coll.randomItem': {
      label: 'apoc.coll.randomItem',
      documentation:
        'Returns a random item from the `LIST<ANY>`, or null on `LIST<NOTHING>` or `LIST<NULL>`.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.randomItems': {
      label: 'apoc.coll.randomItems',
      documentation:
        'Returns a `LIST<ANY>` of `itemCount` random items from the original `LIST<ANY>` (optionally allowing elements in the original `LIST<ANY>` to be selected more than once).',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
        {
          label: 'itemCount',
          documentation: 'itemCount :: INTEGER',
        },
        {
          label: 'allowRepick',
          documentation: 'allowRepick = false :: BOOLEAN',
        },
      ],
    },
    'apoc.coll.remove': {
      label: 'apoc.coll.remove',
      documentation:
        'Removes a range of values from the `LIST<ANY>`, beginning at position index for the given length of values.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
        {
          label: 'index',
          documentation: 'index :: INTEGER',
        },
        {
          label: 'length',
          documentation: 'length = 1 :: INTEGER',
        },
      ],
    },
    'apoc.coll.removeAll': {
      label: 'apoc.coll.removeAll',
      documentation:
        'Returns the first `LIST<ANY>` with all elements also present in the second `LIST<ANY>` removed.',
      parameters: [
        {
          label: 'list1',
          documentation: 'list1 :: LIST<ANY>',
        },
        {
          label: 'list2',
          documentation: 'list2 :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.runningTotal': {
      label: 'apoc.coll.runningTotal',
      documentation: 'Returns an accumulative `LIST<INTEGER | FLOAT>`.',
      parameters: [
        {
          label: 'list',
          documentation: 'list :: LIST<INTEGER | FLOAT>',
        },
      ],
    },
    'apoc.coll.set': {
      label: 'apoc.coll.set',
      documentation: 'Sets the element at the given index to the new value.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
        {
          label: 'index',
          documentation: 'index :: INTEGER',
        },
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
      ],
    },
    'apoc.coll.shuffle': {
      label: 'apoc.coll.shuffle',
      documentation: 'Returns the `LIST<ANY>` shuffled.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.sort': {
      label: 'apoc.coll.sort',
      documentation: 'Sorts the given `LIST<ANY>` into ascending order.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.sortMaps': {
      label: 'apoc.coll.sortMaps',
      documentation:
        'Sorts the given `LIST<MAP<STRING, ANY>>` into descending order, based on the `MAP` property indicated by `prop`.',
      parameters: [
        {
          label: 'list',
          documentation: 'list :: LIST<MAP>',
        },
        {
          label: 'prop',
          documentation: 'prop :: STRING',
        },
      ],
    },
    'apoc.coll.sortMulti': {
      label: 'apoc.coll.sortMulti',
      documentation:
        'Sorts the given `LIST<MAP<STRING, ANY>>` by the given fields.\nTo indicate that a field should be sorted according to ascending values, prefix it with a caret (^).\nIt is also possible to add limits to the `LIST<MAP<STRING, ANY>>` and to skip values.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<MAP>',
        },
        {
          label: 'orderFields',
          documentation: 'orderFields = [] :: LIST<STRING>',
        },
        {
          label: 'limit',
          documentation: 'limit = -1 :: INTEGER',
        },
        {
          label: 'skip',
          documentation: 'skip = 0 :: INTEGER',
        },
      ],
    },
    'apoc.coll.sortNodes': {
      label: 'apoc.coll.sortNodes',
      documentation:
        'Sorts the given `LIST<NODE>` by the property of the nodes into descending order.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<NODE>',
        },
        {
          label: 'prop',
          documentation: 'prop :: STRING',
        },
      ],
    },
    'apoc.coll.sortText': {
      label: 'apoc.coll.sortText',
      documentation: 'Sorts the given `LIST<STRING>` into ascending order.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<STRING>',
        },
        {
          label: 'conf',
          documentation: 'conf = {} :: MAP',
        },
      ],
    },
    'apoc.coll.stdev': {
      label: 'apoc.coll.stdev',
      documentation:
        'Returns sample or population standard deviation with `isBiasCorrected` true or false respectively.',
      parameters: [
        {
          label: 'list',
          documentation: 'list :: LIST<INTEGER | FLOAT>',
        },
        {
          label: 'isBiasCorrected',
          documentation: 'isBiasCorrected = true :: BOOLEAN',
        },
      ],
    },
    'apoc.coll.subtract': {
      label: 'apoc.coll.subtract',
      documentation:
        'Returns the first `LIST<ANY>` as a set with all the elements of the second `LIST<ANY>` removed.',
      parameters: [
        {
          label: 'list1',
          documentation: 'list1 :: LIST<ANY>',
        },
        {
          label: 'list2',
          documentation: 'list2 :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.sum': {
      label: 'apoc.coll.sum',
      documentation:
        'Returns the sum of all the `INTEGER | FLOAT` in the `LIST<INTEGER | FLOAT>`.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<INTEGER | FLOAT>',
        },
      ],
    },
    'apoc.coll.sumLongs': {
      label: 'apoc.coll.sumLongs',
      documentation:
        'Returns the sum of all the `INTEGER | FLOAT` in the `LIST<INTEGER | FLOAT>`.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<INTEGER | FLOAT>',
        },
      ],
    },
    'apoc.coll.toSet': {
      label: 'apoc.coll.toSet',
      documentation: 'Returns a unique `LIST<ANY>` from the given `LIST<ANY>`.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.union': {
      label: 'apoc.coll.union',
      documentation:
        'Returns the distinct union of the two given `LIST<ANY>` values.',
      parameters: [
        {
          label: 'list1',
          documentation: 'list1 :: LIST<ANY>',
        },
        {
          label: 'list2',
          documentation: 'list2 :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.unionAll': {
      label: 'apoc.coll.unionAll',
      documentation:
        'Returns the full union of the two given `LIST<ANY>` values (duplicates included).',
      parameters: [
        {
          label: 'list1',
          documentation: 'list1 :: LIST<ANY>',
        },
        {
          label: 'list2',
          documentation: 'list2 :: LIST<ANY>',
        },
      ],
    },
    'apoc.coll.zip': {
      label: 'apoc.coll.zip',
      documentation:
        'Returns the two given `LIST<ANY>` values zipped together as a `LIST<LIST<ANY>>`.',
      parameters: [
        {
          label: 'list1',
          documentation: 'list1 :: LIST<ANY>',
        },
        {
          label: 'list2',
          documentation: 'list2 :: LIST<ANY>',
        },
      ],
    },
    'apoc.convert.fromJsonList': {
      label: 'apoc.convert.fromJsonList',
      documentation:
        'Converts the given JSON list into a Cypher `LIST<STRING>`.',
      parameters: [
        {
          label: 'list',
          documentation: 'list :: STRING',
        },
        {
          label: 'path',
          documentation: 'path =  :: STRING',
        },
        {
          label: 'pathOptions',
          documentation: 'pathOptions = null :: LIST<STRING>',
        },
      ],
    },
    'apoc.convert.fromJsonMap': {
      label: 'apoc.convert.fromJsonMap',
      documentation: 'Converts the given JSON map into a Cypher `MAP`.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: STRING',
        },
        {
          label: 'path',
          documentation: 'path =  :: STRING',
        },
        {
          label: 'pathOptions',
          documentation: 'pathOptions = null :: LIST<STRING>',
        },
      ],
    },
    'apoc.convert.getJsonProperty': {
      label: 'apoc.convert.getJsonProperty',
      documentation:
        'Converts a serialized JSON object from the property of the given `NODE` into the equivalent Cypher structure (e.g. `MAP`, `LIST<ANY>`).',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE',
        },
        {
          label: 'key',
          documentation: 'key :: STRING',
        },
        {
          label: 'path',
          documentation: 'path =  :: STRING',
        },
        {
          label: 'pathOptions',
          documentation: 'pathOptions = null :: LIST<STRING>',
        },
      ],
    },
    'apoc.convert.getJsonPropertyMap': {
      label: 'apoc.convert.getJsonPropertyMap',
      documentation:
        'Converts a serialized JSON object from the property of the given `NODE` into a Cypher `MAP`.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE',
        },
        {
          label: 'key',
          documentation: 'key :: STRING',
        },
        {
          label: 'path',
          documentation: 'path =  :: STRING',
        },
        {
          label: 'pathOptions',
          documentation: 'pathOptions = null :: LIST<STRING>',
        },
      ],
    },
    'apoc.convert.toJson': {
      label: 'apoc.convert.toJson',
      documentation: 'Serializes the given JSON value.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
      ],
    },
    'apoc.convert.toList': {
      label: 'apoc.convert.toList',
      documentation: 'Converts the given value into a `LIST<ANY>`.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
      ],
    },
    'apoc.convert.toMap': {
      label: 'apoc.convert.toMap',
      documentation: 'Converts the given value into a `MAP`.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: ANY',
        },
      ],
    },
    'apoc.convert.toNode': {
      label: 'apoc.convert.toNode',
      documentation: 'Converts the given value into a `NODE`.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: ANY',
        },
      ],
    },
    'apoc.convert.toNodeList': {
      label: 'apoc.convert.toNodeList',
      documentation: 'Converts the given value into a `LIST<NODE>`.',
      parameters: [
        {
          label: 'list',
          documentation: 'list :: ANY',
        },
      ],
    },
    'apoc.convert.toRelationship': {
      label: 'apoc.convert.toRelationship',
      documentation: 'Converts the given value into a `RELATIONSHIP`.',
      parameters: [
        {
          label: 'rel',
          documentation: 'rel :: ANY',
        },
      ],
    },
    'apoc.convert.toRelationshipList': {
      label: 'apoc.convert.toRelationshipList',
      documentation: 'Converts the given value into a `LIST<RELATIONSHIP>`.',
      parameters: [
        {
          label: 'relList',
          documentation: 'relList :: ANY',
        },
      ],
    },
    'apoc.convert.toSet': {
      label: 'apoc.convert.toSet',
      documentation:
        'Converts the given value into a set represented in Cypher as a `LIST<ANY>`.',
      parameters: [
        {
          label: 'list',
          documentation: 'list :: ANY',
        },
      ],
    },
    'apoc.convert.toSortedJsonMap': {
      label: 'apoc.convert.toSortedJsonMap',
      documentation:
        'Converts a serialized JSON object from the property of a given `NODE` into a Cypher `MAP`.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
        {
          label: 'ignoreCase',
          documentation: 'ignoreCase = true :: BOOLEAN',
        },
      ],
    },
    'apoc.create.uuid': {
      label: 'apoc.create.uuid',
      documentation: 'Returns a UUID.',
      parameters: [],
    },
    'apoc.create.uuidBase64': {
      label: 'apoc.create.uuidBase64',
      documentation: 'Returns a UUID encoded with base64.',
      parameters: [],
    },
    'apoc.create.uuidBase64ToHex': {
      label: 'apoc.create.uuidBase64ToHex',
      documentation:
        'Takes the given base64 encoded UUID and returns it as a hexadecimal `STRING`.',
      parameters: [
        {
          label: 'base64Uuid',
          documentation: 'base64Uuid :: STRING',
        },
      ],
    },
    'apoc.create.uuidHexToBase64': {
      label: 'apoc.create.uuidHexToBase64',
      documentation:
        'Takes the given UUID represented as a hexadecimal `STRING` and returns it encoded with base64.',
      parameters: [
        {
          label: 'uuid',
          documentation: 'uuid :: STRING',
        },
      ],
    },
    'apoc.create.vNode': {
      label: 'apoc.create.vNode',
      documentation: 'Returns a virtual `NODE`.',
      parameters: [
        {
          label: 'labels',
          documentation: 'labels :: LIST<STRING>',
        },
        {
          label: 'props',
          documentation: 'props = {} :: MAP',
        },
      ],
    },
    'apoc.create.vRelationship': {
      label: 'apoc.create.vRelationship',
      documentation: 'Returns a virtual `RELATIONSHIP`.',
      parameters: [
        {
          label: 'from',
          documentation: 'from :: NODE',
        },
        {
          label: 'relType',
          documentation: 'relType :: STRING',
        },
        {
          label: 'props',
          documentation: 'props :: MAP',
        },
        {
          label: 'to',
          documentation: 'to :: NODE',
        },
      ],
    },
    'apoc.create.virtual.fromNode': {
      label: 'apoc.create.virtual.fromNode',
      documentation:
        'Returns a virtual `NODE` from the given existing `NODE`. The virtual `NODE` only contains the requested properties.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE',
        },
        {
          label: 'propertyNames',
          documentation: 'propertyNames :: LIST<STRING>',
        },
      ],
    },
    'apoc.cypher.runFirstColumnMany': {
      label: 'apoc.cypher.runFirstColumnMany',
      documentation:
        'Runs the given statement with the given parameters and returns the first column collected into a `LIST<ANY>`.',
      parameters: [
        {
          label: 'statement',
          documentation: 'statement :: STRING',
        },
        {
          label: 'params',
          documentation: 'params :: MAP',
        },
      ],
    },
    'apoc.cypher.runFirstColumnSingle': {
      label: 'apoc.cypher.runFirstColumnSingle',
      documentation:
        'Runs the given statement with the given parameters and returns the first element of the first column.',
      parameters: [
        {
          label: 'statement',
          documentation: 'statement :: STRING',
        },
        {
          label: 'params',
          documentation: 'params :: MAP',
        },
      ],
    },
    'apoc.data.url': {
      label: 'apoc.data.url',
      documentation: 'Turns a URL into a `MAP`.',
      parameters: [
        {
          label: 'url',
          documentation: 'url :: STRING',
        },
      ],
    },
    'apoc.date.add': {
      label: 'apoc.date.add',
      documentation: 'Adds a unit of specified time to the given timestamp.',
      parameters: [
        {
          label: 'time',
          documentation: 'time :: INTEGER',
        },
        {
          label: 'unit',
          documentation: 'unit :: STRING',
        },
        {
          label: 'addValue',
          documentation: 'addValue :: INTEGER',
        },
        {
          label: 'addUnit',
          documentation: 'addUnit :: STRING',
        },
      ],
    },
    'apoc.date.convert': {
      label: 'apoc.date.convert',
      documentation:
        'Converts the given timestamp from one time unit into a timestamp of a different time unit.',
      parameters: [
        {
          label: 'time',
          documentation: 'time :: INTEGER',
        },
        {
          label: 'unit',
          documentation: 'unit :: STRING',
        },
        {
          label: 'toUnit',
          documentation: 'toUnit :: STRING',
        },
      ],
    },
    'apoc.date.convertFormat': {
      label: 'apoc.date.convertFormat',
      documentation:
        'Converts a `STRING` of one type of date format into a `STRING` of another type of date format.',
      parameters: [
        {
          label: 'temporal',
          documentation: 'temporal :: STRING',
        },
        {
          label: 'currentFormat',
          documentation: 'currentFormat :: STRING',
        },
        {
          label: 'convertTo',
          documentation: 'convertTo = yyyy-MM-dd :: STRING',
        },
      ],
    },
    'apoc.date.currentTimestamp': {
      label: 'apoc.date.currentTimestamp',
      documentation:
        'Returns the current Unix epoch timestamp in milliseconds.',
      parameters: [],
    },
    'apoc.date.field': {
      label: 'apoc.date.field',
      documentation: 'Returns the value of one field from the given date time.',
      parameters: [
        {
          label: 'time',
          documentation: 'time :: INTEGER',
        },
        {
          label: 'unit',
          documentation: 'unit = d :: STRING',
        },
        {
          label: 'timezone',
          documentation: 'timezone = UTC :: STRING',
        },
      ],
    },
    'apoc.date.fields': {
      label: 'apoc.date.fields',
      documentation:
        'Splits the given date into fields returning a `MAP` containing the values of each field.',
      parameters: [
        {
          label: 'date',
          documentation: 'date :: STRING',
        },
        {
          label: 'pattern',
          documentation: 'pattern = yyyy-MM-dd HH:mm:ss :: STRING',
        },
      ],
    },
    'apoc.date.format': {
      label: 'apoc.date.format',
      documentation:
        'Returns a `STRING` representation of the time value.\nThe time unit (default: ms), date format (default: ISO), and time zone (default: current time zone) can all be changed.',
      parameters: [
        {
          label: 'time',
          documentation: 'time :: INTEGER',
        },
        {
          label: 'unit',
          documentation: 'unit = ms :: STRING',
        },
        {
          label: 'format',
          documentation: 'format = yyyy-MM-dd HH:mm:ss :: STRING',
        },
        {
          label: 'timezone',
          documentation: 'timezone =  :: STRING',
        },
      ],
    },
    'apoc.date.fromISO8601': {
      label: 'apoc.date.fromISO8601',
      documentation:
        'Converts the given date `STRING` (ISO8601) to an `INTEGER` representing the time value in milliseconds.',
      parameters: [
        {
          label: 'time',
          documentation: 'time :: STRING',
        },
      ],
    },
    'apoc.date.parse': {
      label: 'apoc.date.parse',
      documentation:
        'Parses the given date `STRING` from a specified format into the specified time unit.',
      parameters: [
        {
          label: 'time',
          documentation: 'time :: STRING',
        },
        {
          label: 'unit',
          documentation: 'unit = ms :: STRING',
        },
        {
          label: 'format',
          documentation: 'format = yyyy-MM-dd HH:mm:ss :: STRING',
        },
        {
          label: 'timezone',
          documentation: 'timezone =  :: STRING',
        },
      ],
    },
    'apoc.date.systemTimezone': {
      label: 'apoc.date.systemTimezone',
      documentation:
        'Returns the display name of the system time zone (e.g. Europe/London).',
      parameters: [],
    },
    'apoc.date.toISO8601': {
      label: 'apoc.date.toISO8601',
      documentation:
        'Returns a `STRING` representation of a specified time value in the ISO8601 format.',
      parameters: [
        {
          label: 'time',
          documentation: 'time :: INTEGER',
        },
        {
          label: 'unit',
          documentation: 'unit = ms :: STRING',
        },
      ],
    },
    'apoc.date.toYears': {
      label: 'apoc.date.toYears',
      documentation:
        'Converts the given timestamp or the given date into a `FLOAT` representing years.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
        {
          label: 'format',
          documentation: 'format = yyyy-MM-dd HH:mm:ss :: STRING',
        },
      ],
    },
    'apoc.diff.nodes': {
      label: 'apoc.diff.nodes',
      documentation:
        'Returns a `MAP` detailing the differences between the two given `NODE` values.',
      parameters: [
        {
          label: 'leftNode',
          documentation: 'leftNode :: NODE',
        },
        {
          label: 'rightNode',
          documentation: 'rightNode :: NODE',
        },
      ],
    },
    'apoc.hashing.fingerprint': {
      label: 'apoc.hashing.fingerprint',
      documentation:
        'Calculates a MD5 checksum over a `NODE` or `RELATIONSHIP` (identical entities share the same checksum).\nUnsuitable for cryptographic use-cases.',
      parameters: [
        {
          label: 'object',
          documentation: 'object :: ANY',
        },
        {
          label: 'excludedPropertyKeys',
          documentation: 'excludedPropertyKeys = [] :: LIST<STRING>',
        },
      ],
    },
    'apoc.hashing.fingerprintGraph': {
      label: 'apoc.hashing.fingerprintGraph',
      documentation:
        'Calculates a MD5 checksum over the full graph.\nThis function uses in-memory data structures.\nUnsuitable for cryptographic use-cases.',
      parameters: [
        {
          label: 'propertyExcludes',
          documentation: 'propertyExcludes = [] :: LIST<STRING>',
        },
      ],
    },
    'apoc.hashing.fingerprinting': {
      label: 'apoc.hashing.fingerprinting',
      documentation:
        'Calculates a MD5 checksum over a `NODE` or `RELATIONSHIP` (identical entities share the same checksum).\nUnlike `apoc.hashing.fingerprint()`, this function supports a number of config parameters.\nUnsuitable for cryptographic use-cases.',
      parameters: [
        {
          label: 'object',
          documentation: 'object :: ANY',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.json.path': {
      label: 'apoc.json.path',
      documentation: 'Returns the given JSON path.',
      parameters: [
        {
          label: 'json',
          documentation: 'json :: STRING',
        },
        {
          label: 'path',
          documentation: 'path = $ :: STRING',
        },
        {
          label: 'pathOptions',
          documentation: 'pathOptions = null :: LIST<STRING>',
        },
      ],
    },
    'apoc.label.exists': {
      label: 'apoc.label.exists',
      documentation:
        'Returns true or false depending on whether or not the given label exists.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: ANY',
        },
        {
          label: 'label',
          documentation: 'label :: STRING',
        },
      ],
    },
    'apoc.map.clean': {
      label: 'apoc.map.clean',
      documentation:
        'Filters the keys and values contained in the given `LIST<ANY>` values.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP',
        },
        {
          label: 'keys',
          documentation: 'keys :: LIST<STRING>',
        },
        {
          label: 'values',
          documentation: 'values :: LIST<ANY>',
        },
      ],
    },
    'apoc.map.flatten': {
      label: 'apoc.map.flatten',
      documentation:
        'Flattens nested items in the given `MAP`.\nThis function is the reverse of the `apoc.map.unflatten` function.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP',
        },
        {
          label: 'delimiter',
          documentation: 'delimiter = . :: STRING',
        },
      ],
    },
    'apoc.map.fromLists': {
      label: 'apoc.map.fromLists',
      documentation:
        'Creates a `MAP` from the keys and values in the given `LIST<ANY>` values.',
      parameters: [
        {
          label: 'keys',
          documentation: 'keys :: LIST<STRING>',
        },
        {
          label: 'values',
          documentation: 'values :: LIST<ANY>',
        },
      ],
    },
    'apoc.map.fromNodes': {
      label: 'apoc.map.fromNodes',
      documentation:
        'Returns a `MAP` of the given prop to the node of the given label.',
      parameters: [
        {
          label: 'label',
          documentation: 'label :: STRING',
        },
        {
          label: 'prop',
          documentation: 'prop :: STRING',
        },
      ],
    },
    'apoc.map.fromPairs': {
      label: 'apoc.map.fromPairs',
      documentation:
        'Creates a `MAP` from the given `LIST<LIST<ANY>>` of key-value pairs.',
      parameters: [
        {
          label: 'pairs',
          documentation: 'pairs :: LIST<LIST<ANY>>',
        },
      ],
    },
    'apoc.map.fromValues': {
      label: 'apoc.map.fromValues',
      documentation:
        'Creates a `MAP` from the alternating keys and values in the given `LIST<ANY>`.',
      parameters: [
        {
          label: 'values',
          documentation: 'values :: LIST<ANY>',
        },
      ],
    },
    'apoc.map.get': {
      label: 'apoc.map.get',
      documentation:
        'Returns a value for the given key.\nIf the given key does not exist, or lacks a default value, this function will throw an exception.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP',
        },
        {
          label: 'key',
          documentation: 'key :: STRING',
        },
        {
          label: 'value',
          documentation: 'value = null :: ANY',
        },
        {
          label: 'fail',
          documentation: 'fail = true :: BOOLEAN',
        },
      ],
    },
    'apoc.map.groupBy': {
      label: 'apoc.map.groupBy',
      documentation:
        'Creates a `MAP` of the `LIST<ANY>` keyed by the given property, with single values.',
      parameters: [
        {
          label: 'values',
          documentation: 'values :: LIST<ANY>',
        },
        {
          label: 'key',
          documentation: 'key :: STRING',
        },
      ],
    },
    'apoc.map.groupByMulti': {
      label: 'apoc.map.groupByMulti',
      documentation:
        'Creates a `MAP` of the `LIST<ANY>` values keyed by the given property, with the `LIST<ANY>` values.',
      parameters: [
        {
          label: 'values',
          documentation: 'values :: LIST<ANY>',
        },
        {
          label: 'key',
          documentation: 'key :: STRING',
        },
      ],
    },
    'apoc.map.merge': {
      label: 'apoc.map.merge',
      documentation: 'Merges the two given `MAP` values into one `MAP`.',
      parameters: [
        {
          label: 'map1',
          documentation: 'map1 :: MAP',
        },
        {
          label: 'map2',
          documentation: 'map2 :: MAP',
        },
      ],
    },
    'apoc.map.mergeList': {
      label: 'apoc.map.mergeList',
      documentation:
        'Merges all `MAP` values in the given `LIST<MAP<STRING, ANY>>` into one `MAP`.',
      parameters: [
        {
          label: 'maps',
          documentation: 'maps :: LIST<MAP>',
        },
      ],
    },
    'apoc.map.mget': {
      label: 'apoc.map.mget',
      documentation:
        'Returns a `LIST<ANY>` for the given keys.\nIf one of the keys does not exist, or lacks a default value, this function will throw an exception.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP',
        },
        {
          label: 'keys',
          documentation: 'keys :: LIST<STRING>',
        },
        {
          label: 'values',
          documentation: 'values = [] :: LIST<ANY>',
        },
        {
          label: 'fail',
          documentation: 'fail = true :: BOOLEAN',
        },
      ],
    },
    'apoc.map.removeKey': {
      label: 'apoc.map.removeKey',
      documentation:
        'Removes the given key from the `MAP` (recursively if recursive is true).',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP',
        },
        {
          label: 'key',
          documentation: 'key :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.map.removeKeys': {
      label: 'apoc.map.removeKeys',
      documentation:
        'Removes the given keys from the `MAP` (recursively if recursive is true).',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP',
        },
        {
          label: 'keys',
          documentation: 'keys :: LIST<STRING>',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.map.setEntry': {
      label: 'apoc.map.setEntry',
      documentation: 'Adds or updates the given entry in the `MAP`.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP',
        },
        {
          label: 'key',
          documentation: 'key :: STRING',
        },
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
      ],
    },
    'apoc.map.setKey': {
      label: 'apoc.map.setKey',
      documentation: 'Adds or updates the given entry in the `MAP`.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP',
        },
        {
          label: 'key',
          documentation: 'key :: STRING',
        },
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
      ],
    },
    'apoc.map.setLists': {
      label: 'apoc.map.setLists',
      documentation:
        'Adds or updates the given keys/value pairs provided in `LIST<ANY>` format (e.g. [key1, key2],[value1, value2]) in a `MAP`.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP',
        },
        {
          label: 'keys',
          documentation: 'keys :: LIST<STRING>',
        },
        {
          label: 'values',
          documentation: 'values :: LIST<ANY>',
        },
      ],
    },
    'apoc.map.setPairs': {
      label: 'apoc.map.setPairs',
      documentation:
        'Adds or updates the given key/value pairs (e.g. [key1,value1],[key2,value2]) in a `MAP`.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP',
        },
        {
          label: 'pairs',
          documentation: 'pairs :: LIST<LIST<ANY>>',
        },
      ],
    },
    'apoc.map.setValues': {
      label: 'apoc.map.setValues',
      documentation:
        'Adds or updates the alternating key/value pairs (e.g. [key1,value1,key2,value2]) in a `MAP`.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP',
        },
        {
          label: 'pairs',
          documentation: 'pairs :: LIST<ANY>',
        },
      ],
    },
    'apoc.map.sortedProperties': {
      label: 'apoc.map.sortedProperties',
      documentation:
        'Returns a `LIST<ANY>` of key/value pairs.\nThe pairs are sorted by alphabetically by key, with optional case sensitivity.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP',
        },
        {
          label: 'ignoreCase',
          documentation: 'ignoreCase = true :: BOOLEAN',
        },
      ],
    },
    'apoc.map.submap': {
      label: 'apoc.map.submap',
      documentation:
        'Returns a sub-map for the given keys.\nIf one of the keys does not exist, or lacks a default value, this function will throw an exception.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP',
        },
        {
          label: 'keys',
          documentation: 'keys :: LIST<STRING>',
        },
        {
          label: 'values',
          documentation: 'values = [] :: LIST<ANY>',
        },
        {
          label: 'fail',
          documentation: 'fail = true :: BOOLEAN',
        },
      ],
    },
    'apoc.map.unflatten': {
      label: 'apoc.map.unflatten',
      documentation:
        'Unflattens items in the given `MAP` to nested items.\nThis function is the reverse of the `apoc.map.flatten` function.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP',
        },
        {
          label: 'delimiter',
          documentation: 'delimiter = . :: STRING',
        },
      ],
    },
    'apoc.map.updateTree': {
      label: 'apoc.map.updateTree',
      documentation:
        'Adds the data `MAP` on each level of the nested tree, where the key-value pairs match.',
      parameters: [
        {
          label: 'tree',
          documentation: 'tree :: MAP',
        },
        {
          label: 'key',
          documentation: 'key :: STRING',
        },
        {
          label: 'data',
          documentation: 'data :: LIST<LIST<ANY>>',
        },
      ],
    },
    'apoc.map.values': {
      label: 'apoc.map.values',
      documentation:
        'Returns a `LIST<ANY>` indicated by the given keys (returns a null value if a given key is missing).',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP',
        },
        {
          label: 'keys',
          documentation: 'keys = [] :: LIST<STRING>',
        },
        {
          label: 'addNullsForMissing',
          documentation: 'addNullsForMissing = false :: BOOLEAN',
        },
      ],
    },
    'apoc.math.cosh': {
      label: 'apoc.math.cosh',
      documentation: 'Returns the hyperbolic cosine.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: FLOAT',
        },
      ],
    },
    'apoc.math.coth': {
      label: 'apoc.math.coth',
      documentation: 'Returns the hyperbolic cotangent.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: FLOAT',
        },
      ],
    },
    'apoc.math.csch': {
      label: 'apoc.math.csch',
      documentation: 'Returns the hyperbolic cosecant.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: FLOAT',
        },
      ],
    },
    'apoc.math.maxByte': {
      label: 'apoc.math.maxByte',
      documentation: 'Returns the maximum value of a byte.',
      parameters: [],
    },
    'apoc.math.maxDouble': {
      label: 'apoc.math.maxDouble',
      documentation:
        'Returns the largest positive finite value of type double.',
      parameters: [],
    },
    'apoc.math.maxInt': {
      label: 'apoc.math.maxInt',
      documentation: 'Returns the maximum value of an integer.',
      parameters: [],
    },
    'apoc.math.maxLong': {
      label: 'apoc.math.maxLong',
      documentation: 'Returns the maximum value of a long.',
      parameters: [],
    },
    'apoc.math.minByte': {
      label: 'apoc.math.minByte',
      documentation: 'Returns the minimum value of a byte.',
      parameters: [],
    },
    'apoc.math.minDouble': {
      label: 'apoc.math.minDouble',
      documentation:
        'Returns the smallest positive non-zero value of type double.',
      parameters: [],
    },
    'apoc.math.minInt': {
      label: 'apoc.math.minInt',
      documentation: 'Returns the minimum value of an integer.',
      parameters: [],
    },
    'apoc.math.minLong': {
      label: 'apoc.math.minLong',
      documentation: 'Returns the minimum value of a long.',
      parameters: [],
    },
    'apoc.math.sech': {
      label: 'apoc.math.sech',
      documentation: 'Returns the hyperbolic secant of the given value.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: FLOAT',
        },
      ],
    },
    'apoc.math.sigmoid': {
      label: 'apoc.math.sigmoid',
      documentation: 'Returns the sigmoid of the given value.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: FLOAT',
        },
      ],
    },
    'apoc.math.sigmoidPrime': {
      label: 'apoc.math.sigmoidPrime',
      documentation:
        'Returns the sigmoid prime [ sigmoid(val) * (1 - sigmoid(val)) ] of the given value.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: FLOAT',
        },
      ],
    },
    'apoc.math.sinh': {
      label: 'apoc.math.sinh',
      documentation: 'Returns the hyperbolic sine of the given value.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: FLOAT',
        },
      ],
    },
    'apoc.math.tanh': {
      label: 'apoc.math.tanh',
      documentation: 'Returns the hyperbolic tangent of the given value.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: FLOAT',
        },
      ],
    },
    'apoc.meta.cypher.isType': {
      label: 'apoc.meta.cypher.isType',
      documentation: 'Returns true if the given value matches the given type.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
        {
          label: 'type',
          documentation: 'type :: STRING',
        },
      ],
    },
    'apoc.meta.cypher.type': {
      label: 'apoc.meta.cypher.type',
      documentation: 'Returns the type name of the given value.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
      ],
    },
    'apoc.meta.cypher.types': {
      label: 'apoc.meta.cypher.types',
      documentation:
        'Returns a `MAP` containing the type names of the given values.',
      parameters: [
        {
          label: 'props',
          documentation: 'props :: ANY',
        },
      ],
    },
    'apoc.meta.nodes.count': {
      label: 'apoc.meta.nodes.count',
      documentation:
        'Returns the sum of the `NODE` values with the given labels in the `LIST<STRING>`.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes = [] :: LIST<STRING>',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.node.degree': {
      label: 'apoc.node.degree',
      documentation: 'Returns the total degrees of the given `NODE`.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING',
        },
      ],
    },
    'apoc.node.degree.in': {
      label: 'apoc.node.degree.in',
      documentation:
        'Returns the total number of incoming `RELATIONSHIP` values connected to the given `NODE`.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING',
        },
      ],
    },
    'apoc.node.degree.out': {
      label: 'apoc.node.degree.out',
      documentation:
        'Returns the total number of outgoing `RELATIONSHIP` values from the given `NODE`.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING',
        },
      ],
    },
    'apoc.node.id': {
      label: 'apoc.node.id',
      documentation: 'Returns the id for the given virtual `NODE`.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE',
        },
      ],
    },
    'apoc.node.labels': {
      label: 'apoc.node.labels',
      documentation: 'Returns the labels for the given virtual `NODE`.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE',
        },
      ],
    },
    'apoc.node.relationship.exists': {
      label: 'apoc.node.relationship.exists',
      documentation:
        'Returns a `BOOLEAN` based on whether the given `NODE` has a connecting `RELATIONSHIP` (or whether the given `NODE` has a connecting `RELATIONSHIP` of the given type and direction).',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING',
        },
      ],
    },
    'apoc.node.relationship.types': {
      label: 'apoc.node.relationship.types',
      documentation:
        'Returns a `LIST<STRING>` of distinct `RELATIONSHIP` types for the given `NODE`.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING',
        },
      ],
    },
    'apoc.node.relationships.exist': {
      label: 'apoc.node.relationships.exist',
      documentation:
        'Returns a `BOOLEAN` based on whether the given `NODE` has connecting `RELATIONSHIP` values (or whether the given `NODE` has connecting `RELATIONSHIP` values of the given type and direction).',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING',
        },
      ],
    },
    'apoc.nodes.connected': {
      label: 'apoc.nodes.connected',
      documentation:
        'Returns true when a given `NODE` is directly connected to another given `NODE`.\nThis function is optimized for dense nodes.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: NODE',
        },
        {
          label: 'endNode',
          documentation: 'endNode :: NODE',
        },
        {
          label: 'types',
          documentation: 'types =  :: STRING',
        },
      ],
    },
    'apoc.nodes.isDense': {
      label: 'apoc.nodes.isDense',
      documentation: 'Returns true if the given `NODE` is a dense node.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE',
        },
      ],
    },
    'apoc.nodes.relationship.types': {
      label: 'apoc.nodes.relationship.types',
      documentation:
        'Returns a `LIST<STRING>` of distinct `RELATIONSHIP` types from the given `LIST<NODE>` values.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY',
        },
        {
          label: 'types',
          documentation: 'types =  :: STRING',
        },
      ],
    },
    'apoc.nodes.relationships.exist': {
      label: 'apoc.nodes.relationships.exist',
      documentation:
        'Returns a `BOOLEAN` based on whether or not the given `NODE` values have the given `RELATIONSHIP` values.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY',
        },
        {
          label: 'types',
          documentation: 'types =  :: STRING',
        },
      ],
    },
    'apoc.number.arabicToRoman': {
      label: 'apoc.number.arabicToRoman',
      documentation: 'Converts the given Arabic numbers to Roman numbers.',
      parameters: [
        {
          label: 'number',
          documentation: 'number :: ANY',
        },
      ],
    },
    'apoc.number.exact.add': {
      label: 'apoc.number.exact.add',
      documentation:
        'Returns the result of adding the two given large numbers (using Java BigDecimal).',
      parameters: [
        {
          label: 'stringA',
          documentation: 'stringA :: STRING',
        },
        {
          label: 'stringB',
          documentation: 'stringB :: STRING',
        },
      ],
    },
    'apoc.number.exact.div': {
      label: 'apoc.number.exact.div',
      documentation:
        'Returns the result of dividing a given large number with another given large number (using Java BigDecimal).',
      parameters: [
        {
          label: 'stringA',
          documentation: 'stringA :: STRING',
        },
        {
          label: 'stringB',
          documentation: 'stringB :: STRING',
        },
        {
          label: 'precision',
          documentation: 'precision = 0 :: INTEGER',
        },
        {
          label: 'roundingMode',
          documentation: 'roundingMode = HALF_UP :: STRING',
        },
      ],
    },
    'apoc.number.exact.mul': {
      label: 'apoc.number.exact.mul',
      documentation:
        'Returns the result of multiplying two given large numbers (using Java BigDecimal).',
      parameters: [
        {
          label: 'stringA',
          documentation: 'stringA :: STRING',
        },
        {
          label: 'stringB',
          documentation: 'stringB :: STRING',
        },
        {
          label: 'precision',
          documentation: 'precision = 0 :: INTEGER',
        },
        {
          label: 'roundingMode',
          documentation: 'roundingMode = HALF_UP :: STRING',
        },
      ],
    },
    'apoc.number.exact.sub': {
      label: 'apoc.number.exact.sub',
      documentation:
        'Returns the result of subtracting a given large number from another given large number (using Java BigDecimal).',
      parameters: [
        {
          label: 'stringA',
          documentation: 'stringA :: STRING',
        },
        {
          label: 'stringB',
          documentation: 'stringB :: STRING',
        },
      ],
    },
    'apoc.number.exact.toExact': {
      label: 'apoc.number.exact.toExact',
      documentation:
        'Returns the exact value of the given number (using Java BigDecimal).',
      parameters: [
        {
          label: 'number',
          documentation: 'number :: INTEGER',
        },
      ],
    },
    'apoc.number.exact.toFloat': {
      label: 'apoc.number.exact.toFloat',
      documentation:
        'Returns the `FLOAT` of the given large number (using Java BigDecimal).',
      parameters: [
        {
          label: 'string',
          documentation: 'string :: STRING',
        },
        {
          label: 'precision',
          documentation: 'precision = 0 :: INTEGER',
        },
        {
          label: 'roundingMode',
          documentation: 'roundingMode = HALF_UP :: STRING',
        },
      ],
    },
    'apoc.number.exact.toInteger': {
      label: 'apoc.number.exact.toInteger',
      documentation:
        'Returns the `INTEGER` of the given large number (using Java BigDecimal).',
      parameters: [
        {
          label: 'string',
          documentation: 'string :: STRING',
        },
        {
          label: 'precision',
          documentation: 'precision = 0 :: INTEGER',
        },
        {
          label: 'roundingMode',
          documentation: 'roundingMode = HALF_UP :: STRING',
        },
      ],
    },
    'apoc.number.format': {
      label: 'apoc.number.format',
      documentation:
        'Formats the given `INTEGER` or `FLOAT` using the given pattern and language to produce a `STRING`.',
      parameters: [
        {
          label: 'number',
          documentation: 'number :: ANY',
        },
        {
          label: 'pattern',
          documentation: 'pattern =  :: STRING',
        },
        {
          label: 'language',
          documentation: 'language =  :: STRING',
        },
      ],
    },
    'apoc.number.parseFloat': {
      label: 'apoc.number.parseFloat',
      documentation:
        'Parses the given `STRING` using the given pattern and language to produce a `FLOAT`.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
        {
          label: 'pattern',
          documentation: 'pattern =  :: STRING',
        },
        {
          label: 'language',
          documentation: 'language =  :: STRING',
        },
      ],
    },
    'apoc.number.parseInt': {
      label: 'apoc.number.parseInt',
      documentation:
        'Parses the given `STRING` using the given pattern and language to produce a `INTEGER`.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
        {
          label: 'pattern',
          documentation: 'pattern =  :: STRING',
        },
        {
          label: 'language',
          documentation: 'language =  :: STRING',
        },
      ],
    },
    'apoc.number.romanToArabic': {
      label: 'apoc.number.romanToArabic',
      documentation: 'Converts the given Roman numbers to Arabic numbers.',
      parameters: [
        {
          label: 'romanNumber',
          documentation: 'romanNumber :: STRING',
        },
      ],
    },
    'apoc.path.combine': {
      label: 'apoc.path.combine',
      documentation: 'Combines the two given `PATH` values into one `PATH`.',
      parameters: [
        {
          label: 'path1',
          documentation: 'path1 :: PATH',
        },
        {
          label: 'path2',
          documentation: 'path2 :: PATH',
        },
      ],
    },
    'apoc.path.create': {
      label: 'apoc.path.create',
      documentation:
        'Returns a `PATH` from the given start `NODE` and `LIST<RELATIONSHIP>`.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: NODE',
        },
        {
          label: 'rels',
          documentation: 'rels = [] :: LIST<RELATIONSHIP>',
        },
      ],
    },
    'apoc.path.elements': {
      label: 'apoc.path.elements',
      documentation:
        'Converts the given `PATH` into a `LIST<NODE | RELATIONSHIP>`.',
      parameters: [
        {
          label: 'path',
          documentation: 'path :: PATH',
        },
      ],
    },
    'apoc.path.slice': {
      label: 'apoc.path.slice',
      documentation:
        'Returns a new `PATH` of the given length, taken from the given `PATH` at the given offset.',
      parameters: [
        {
          label: 'path',
          documentation: 'path :: PATH',
        },
        {
          label: 'offset',
          documentation: 'offset = 0 :: INTEGER',
        },
        {
          label: 'length',
          documentation: 'length = -1 :: INTEGER',
        },
      ],
    },
    'apoc.rel.endNode': {
      label: 'apoc.rel.endNode',
      documentation:
        'Returns the end `NODE` for the given virtual `RELATIONSHIP`.',
      parameters: [
        {
          label: 'rel',
          documentation: 'rel :: RELATIONSHIP',
        },
      ],
    },
    'apoc.rel.id': {
      label: 'apoc.rel.id',
      documentation: 'Returns the id for the given virtual `RELATIONSHIP`.',
      parameters: [
        {
          label: 'rel',
          documentation: 'rel :: RELATIONSHIP',
        },
      ],
    },
    'apoc.rel.startNode': {
      label: 'apoc.rel.startNode',
      documentation:
        'Returns the start `NODE` for the given virtual `RELATIONSHIP`.',
      parameters: [
        {
          label: 'rel',
          documentation: 'rel :: RELATIONSHIP',
        },
      ],
    },
    'apoc.rel.type': {
      label: 'apoc.rel.type',
      documentation: 'Returns the type for the given virtual `RELATIONSHIP`.',
      parameters: [
        {
          label: 'rel',
          documentation: 'rel :: RELATIONSHIP',
        },
      ],
    },
    'apoc.schema.node.constraintExists': {
      label: 'apoc.schema.node.constraintExists',
      documentation:
        'Returns a `BOOLEAN` depending on whether or not a constraint exists for the given `NODE` label with the given property names.',
      parameters: [
        {
          label: 'labelName',
          documentation: 'labelName :: STRING',
        },
        {
          label: 'propertyName',
          documentation: 'propertyName :: LIST<STRING>',
        },
      ],
    },
    'apoc.schema.node.indexExists': {
      label: 'apoc.schema.node.indexExists',
      documentation:
        'Returns a `BOOLEAN` depending on whether or not an index exists for the given `NODE` label with the given property names.',
      parameters: [
        {
          label: 'labelName',
          documentation: 'labelName :: STRING',
        },
        {
          label: 'propertyName',
          documentation: 'propertyName :: LIST<STRING>',
        },
      ],
    },
    'apoc.schema.relationship.constraintExists': {
      label: 'apoc.schema.relationship.constraintExists',
      documentation:
        'Returns a `BOOLEAN` depending on whether or not a constraint exists for the given `RELATIONSHIP` type with the given property names.',
      parameters: [
        {
          label: 'type',
          documentation: 'type :: STRING',
        },
        {
          label: 'propertyName',
          documentation: 'propertyName :: LIST<STRING>',
        },
      ],
    },
    'apoc.schema.relationship.indexExists': {
      label: 'apoc.schema.relationship.indexExists',
      documentation:
        'Returns a `BOOLEAN` depending on whether or not an index exists for the given `RELATIONSHIP` type with the given property names.',
      parameters: [
        {
          label: 'type',
          documentation: 'type :: STRING',
        },
        {
          label: 'propertyName',
          documentation: 'propertyName :: LIST<STRING>',
        },
      ],
    },
    'apoc.scoring.existence': {
      label: 'apoc.scoring.existence',
      documentation: 'Returns the given score if true, 0 if false.',
      parameters: [
        {
          label: 'score',
          documentation: 'score :: INTEGER',
        },
        {
          label: 'exists',
          documentation: 'exists :: BOOLEAN',
        },
      ],
    },
    'apoc.scoring.pareto': {
      label: 'apoc.scoring.pareto',
      documentation:
        'Applies a Pareto scoring function over the given `INTEGER` values.',
      parameters: [
        {
          label: 'minimumThreshold',
          documentation: 'minimumThreshold :: INTEGER',
        },
        {
          label: 'eightyPercentValue',
          documentation: 'eightyPercentValue :: INTEGER',
        },
        {
          label: 'maximumValue',
          documentation: 'maximumValue :: INTEGER',
        },
        {
          label: 'score',
          documentation: 'score :: INTEGER',
        },
      ],
    },
    'apoc.temporal.format': {
      label: 'apoc.temporal.format',
      documentation:
        'Formats the given temporal value into the given time format.',
      parameters: [
        {
          label: 'temporal',
          documentation: 'temporal :: ANY',
        },
        {
          label: 'format',
          documentation: 'format = yyyy-MM-dd :: STRING',
        },
      ],
    },
    'apoc.temporal.formatDuration': {
      label: 'apoc.temporal.formatDuration',
      documentation: 'Formats the given duration into the given time format.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY',
        },
        {
          label: 'format',
          documentation: 'format :: STRING',
        },
      ],
    },
    'apoc.temporal.toZonedTemporal': {
      label: 'apoc.temporal.toZonedTemporal',
      documentation:
        'Parses the given date `STRING` using the specified format into the given time zone.',
      parameters: [
        {
          label: 'time',
          documentation: 'time :: STRING',
        },
        {
          label: 'format',
          documentation: 'format = yyyy-MM-dd HH:mm:ss :: STRING',
        },
        {
          label: 'timezone',
          documentation: 'timezone = UTC :: STRING',
        },
      ],
    },
    'apoc.text.base64Decode': {
      label: 'apoc.text.base64Decode',
      documentation: 'Decodes the given Base64 encoded `STRING`.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
      ],
    },
    'apoc.text.base64Encode': {
      label: 'apoc.text.base64Encode',
      documentation: 'Encodes the given `STRING` with Base64.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
      ],
    },
    'apoc.text.base64UrlDecode': {
      label: 'apoc.text.base64UrlDecode',
      documentation: 'Decodes the given Base64 encoded URL.',
      parameters: [
        {
          label: 'url',
          documentation: 'url :: STRING',
        },
      ],
    },
    'apoc.text.base64UrlEncode': {
      label: 'apoc.text.base64UrlEncode',
      documentation: 'Encodes the given URL with Base64.',
      parameters: [
        {
          label: 'url',
          documentation: 'url :: STRING',
        },
      ],
    },
    'apoc.text.byteCount': {
      label: 'apoc.text.byteCount',
      documentation: 'Returns the size of the given `STRING` in bytes.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
        {
          label: 'charset',
          documentation: 'charset = UTF-8 :: STRING',
        },
      ],
    },
    'apoc.text.bytes': {
      label: 'apoc.text.bytes',
      documentation: 'Returns the given `STRING` as bytes.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
        {
          label: 'charset',
          documentation: 'charset = UTF-8 :: STRING',
        },
      ],
    },
    'apoc.text.camelCase': {
      label: 'apoc.text.camelCase',
      documentation: 'Converts the given `STRING` to camel case.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
      ],
    },
    'apoc.text.capitalize': {
      label: 'apoc.text.capitalize',
      documentation: 'Capitalizes the first letter of the given `STRING`.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
      ],
    },
    'apoc.text.capitalizeAll': {
      label: 'apoc.text.capitalizeAll',
      documentation:
        'Capitalizes the first letter of every word in the given `STRING`.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
      ],
    },
    'apoc.text.charAt': {
      label: 'apoc.text.charAt',
      documentation:
        'Returns the `INTEGER` value of the character at the given index.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
        {
          label: 'index',
          documentation: 'index :: INTEGER',
        },
      ],
    },
    'apoc.text.clean': {
      label: 'apoc.text.clean',
      documentation:
        'Strips the given `STRING` of everything except alpha numeric characters and converts it to lower case.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
      ],
    },
    'apoc.text.code': {
      label: 'apoc.text.code',
      documentation: 'Converts the `INTEGER` value into a `STRING`.',
      parameters: [
        {
          label: 'codepoint',
          documentation: 'codepoint :: INTEGER',
        },
      ],
    },
    'apoc.text.compareCleaned': {
      label: 'apoc.text.compareCleaned',
      documentation:
        'Compares two given `STRING` values stripped of everything except alpha numeric characters converted to lower case.',
      parameters: [
        {
          label: 'text1',
          documentation: 'text1 :: STRING',
        },
        {
          label: 'text2',
          documentation: 'text2 :: STRING',
        },
      ],
    },
    'apoc.text.decapitalize': {
      label: 'apoc.text.decapitalize',
      documentation:
        'Turns the first letter of the given `STRING` from upper case to lower case.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
      ],
    },
    'apoc.text.decapitalizeAll': {
      label: 'apoc.text.decapitalizeAll',
      documentation:
        'Turns the first letter of every word in the given `STRING` to lower case.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
      ],
    },
    'apoc.text.distance': {
      label: 'apoc.text.distance',
      documentation:
        'Compares the two given `STRING` values using the Levenshtein distance algorithm.',
      parameters: [
        {
          label: 'text1',
          documentation: 'text1 :: STRING',
        },
        {
          label: 'text2',
          documentation: 'text2 :: STRING',
        },
      ],
    },
    'apoc.text.doubleMetaphone': {
      label: 'apoc.text.doubleMetaphone',
      documentation:
        'Returns the double metaphone phonetic encoding of all words in the given `STRING` value.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: STRING',
        },
      ],
    },
    'apoc.text.format': {
      label: 'apoc.text.format',
      documentation: 'Formats the given `STRING` with the given parameters.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
        {
          label: 'params',
          documentation: 'params :: LIST<ANY>',
        },
        {
          label: 'language',
          documentation: 'language = en :: STRING',
        },
      ],
    },
    'apoc.text.fuzzyMatch': {
      label: 'apoc.text.fuzzyMatch',
      documentation:
        'Performs a fuzzy match search of the two given `STRING` values.',
      parameters: [
        {
          label: 'text1',
          documentation: 'text1 :: STRING',
        },
        {
          label: 'text2',
          documentation: 'text2 :: STRING',
        },
      ],
    },
    'apoc.text.hammingDistance': {
      label: 'apoc.text.hammingDistance',
      documentation:
        'Compares the two given `STRING` values using the Hamming distance algorithm.',
      parameters: [
        {
          label: 'text1',
          documentation: 'text1 :: STRING',
        },
        {
          label: 'text2',
          documentation: 'text2 :: STRING',
        },
      ],
    },
    'apoc.text.hexCharAt': {
      label: 'apoc.text.hexCharAt',
      documentation:
        'Returns the hexadecimal value of the given `STRING` at the given index.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
        {
          label: 'index',
          documentation: 'index :: INTEGER',
        },
      ],
    },
    'apoc.text.hexValue': {
      label: 'apoc.text.hexValue',
      documentation: 'Returns the hexadecimal value of the given value.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: INTEGER',
        },
      ],
    },
    'apoc.text.indexOf': {
      label: 'apoc.text.indexOf',
      documentation:
        'Returns the first occurrence of the lookup `STRING` in the given `STRING`, or -1 if not found.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
        {
          label: 'lookup',
          documentation: 'lookup :: STRING',
        },
        {
          label: 'from',
          documentation: 'from = 0 :: INTEGER',
        },
        {
          label: 'to',
          documentation: 'to = -1 :: INTEGER',
        },
      ],
    },
    'apoc.text.indexesOf': {
      label: 'apoc.text.indexesOf',
      documentation:
        'Returns all occurrences of the lookup `STRING` in the given `STRING`, or an empty list if not found.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
        {
          label: 'lookup',
          documentation: 'lookup :: STRING',
        },
        {
          label: 'from',
          documentation: 'from = 0 :: INTEGER',
        },
        {
          label: 'to',
          documentation: 'to = -1 :: INTEGER',
        },
      ],
    },
    'apoc.text.jaroWinklerDistance': {
      label: 'apoc.text.jaroWinklerDistance',
      documentation:
        'Compares the two given `STRING` values using the Jaro-Winkler distance algorithm.',
      parameters: [
        {
          label: 'text1',
          documentation: 'text1 :: STRING',
        },
        {
          label: 'text2',
          documentation: 'text2 :: STRING',
        },
      ],
    },
    'apoc.text.join': {
      label: 'apoc.text.join',
      documentation:
        'Joins the given `STRING` values using the given delimiter.',
      parameters: [
        {
          label: 'texts',
          documentation: 'texts :: LIST<STRING>',
        },
        {
          label: 'delimiter',
          documentation: 'delimiter :: STRING',
        },
      ],
    },
    'apoc.text.levenshteinDistance': {
      label: 'apoc.text.levenshteinDistance',
      documentation:
        'Compares the given `STRING` values using the Levenshtein distance algorithm.',
      parameters: [
        {
          label: 'text1',
          documentation: 'text1 :: STRING',
        },
        {
          label: 'text2',
          documentation: 'text2 :: STRING',
        },
      ],
    },
    'apoc.text.levenshteinSimilarity': {
      label: 'apoc.text.levenshteinSimilarity',
      documentation:
        'Returns the similarity (a value within 0 and 1) between the two given `STRING` values based on the Levenshtein distance algorithm.',
      parameters: [
        {
          label: 'text1',
          documentation: 'text1 :: STRING',
        },
        {
          label: 'text2',
          documentation: 'text2 :: STRING',
        },
      ],
    },
    'apoc.text.lpad': {
      label: 'apoc.text.lpad',
      documentation: 'Left pads the given `STRING` by the given width.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
        {
          label: 'count',
          documentation: 'count :: INTEGER',
        },
        {
          label: 'delimiter',
          documentation: 'delimiter =   :: STRING',
        },
      ],
    },
    'apoc.text.phonetic': {
      label: 'apoc.text.phonetic',
      documentation:
        'Returns the US_ENGLISH phonetic soundex encoding of all words of the `STRING`.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
      ],
    },
    'apoc.text.random': {
      label: 'apoc.text.random',
      documentation:
        'Generates a random `STRING` to the given length using a length parameter and an optional `STRING` of valid characters.\nUnsuitable for cryptographic use-cases.',
      parameters: [
        {
          label: 'length',
          documentation: 'length :: INTEGER',
        },
        {
          label: 'valid',
          documentation: 'valid = A-Za-z0-9 :: STRING',
        },
      ],
    },
    'apoc.text.regexGroups': {
      label: 'apoc.text.regexGroups',
      documentation:
        'Returns all groups matching the given regular expression in the given text.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
        {
          label: 'regex',
          documentation: 'regex :: STRING',
        },
      ],
    },
    'apoc.text.regreplace': {
      label: 'apoc.text.regreplace',
      documentation:
        'Finds and replaces all matches found by the given regular expression with the given replacement.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
        {
          label: 'regex',
          documentation: 'regex :: STRING',
        },
        {
          label: 'replacement',
          documentation: 'replacement :: STRING',
        },
      ],
    },
    'apoc.text.repeat': {
      label: 'apoc.text.repeat',
      documentation:
        'Returns the result of the given item multiplied by the given count.',
      parameters: [
        {
          label: 'item',
          documentation: 'item :: STRING',
        },
        {
          label: 'count',
          documentation: 'count :: INTEGER',
        },
      ],
    },
    'apoc.text.replace': {
      label: 'apoc.text.replace',
      documentation:
        'Finds and replaces all matches found by the given regular expression with the given replacement.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
        {
          label: 'regex',
          documentation: 'regex :: STRING',
        },
        {
          label: 'replacement',
          documentation: 'replacement :: STRING',
        },
      ],
    },
    'apoc.text.rpad': {
      label: 'apoc.text.rpad',
      documentation: 'Right pads the given `STRING` by the given width.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
        {
          label: 'count',
          documentation: 'count :: INTEGER',
        },
        {
          label: 'delimiter',
          documentation: 'delimiter =   :: STRING',
        },
      ],
    },
    'apoc.text.slug': {
      label: 'apoc.text.slug',
      documentation:
        'Replaces the whitespace in the given `STRING` with the given delimiter.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
        {
          label: 'delimiter',
          documentation: 'delimiter = - :: STRING',
        },
      ],
    },
    'apoc.text.snakeCase': {
      label: 'apoc.text.snakeCase',
      documentation: 'Converts the given `STRING` to snake case.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
      ],
    },
    'apoc.text.sorensenDiceSimilarity': {
      label: 'apoc.text.sorensenDiceSimilarity',
      documentation:
        'Compares the two given `STRING` values using the Sørensen–Dice coefficient formula, with the provided IETF language tag.',
      parameters: [
        {
          label: 'text1',
          documentation: 'text1 :: STRING',
        },
        {
          label: 'text2',
          documentation: 'text2 :: STRING',
        },
        {
          label: 'languageTag',
          documentation: 'languageTag = en :: STRING',
        },
      ],
    },
    'apoc.text.split': {
      label: 'apoc.text.split',
      documentation:
        'Splits the given `STRING` using a given regular expression as a separator.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
        {
          label: 'regex',
          documentation: 'regex :: STRING',
        },
        {
          label: 'limit',
          documentation: 'limit = 0 :: INTEGER',
        },
      ],
    },
    'apoc.text.swapCase': {
      label: 'apoc.text.swapCase',
      documentation: 'Swaps the cases in the given `STRING`.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
      ],
    },
    'apoc.text.toCypher': {
      label: 'apoc.text.toCypher',
      documentation: 'Converts the given value to a Cypher property `STRING`.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.text.toUpperCase': {
      label: 'apoc.text.toUpperCase',
      documentation: 'Converts the given `STRING` to upper case.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
      ],
    },
    'apoc.text.upperCamelCase': {
      label: 'apoc.text.upperCamelCase',
      documentation: 'Converts the given `STRING` to upper camel case.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
      ],
    },
    'apoc.text.urldecode': {
      label: 'apoc.text.urldecode',
      documentation: 'Decodes the given URL encoded `STRING`.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
      ],
    },
    'apoc.text.urlencode': {
      label: 'apoc.text.urlencode',
      documentation: 'Encodes the given URL `STRING`.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING',
        },
      ],
    },
    'apoc.util.compress': {
      label: 'apoc.util.compress',
      documentation: 'Zips the given `STRING`.',
      parameters: [
        {
          label: 'data',
          documentation: 'data :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.util.decompress': {
      label: 'apoc.util.decompress',
      documentation: 'Unzips the given byte array.',
      parameters: [
        {
          label: 'data',
          documentation: 'data :: BYTEARRAY',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.util.md5': {
      label: 'apoc.util.md5',
      documentation:
        'Returns the MD5 checksum of the concatenation of all `STRING` values in the given `LIST<ANY>`.\nMD5 is a weak hashing algorithm which is unsuitable for cryptographic use-cases.',
      parameters: [
        {
          label: 'values',
          documentation: 'values :: LIST<ANY>',
        },
      ],
    },
    'apoc.util.sha1': {
      label: 'apoc.util.sha1',
      documentation:
        'Returns the SHA1 of the concatenation of all `STRING` values in the given `LIST<ANY>`.\nSHA1 is a weak hashing algorithm which is unsuitable for cryptographic use-cases.',
      parameters: [
        {
          label: 'values',
          documentation: 'values :: LIST<ANY>',
        },
      ],
    },
    'apoc.util.sha256': {
      label: 'apoc.util.sha256',
      documentation:
        'Returns the SHA256 of the concatenation of all `STRING` values in the given `LIST<ANY>`.',
      parameters: [
        {
          label: 'values',
          documentation: 'values :: LIST<ANY>',
        },
      ],
    },
    'apoc.util.sha384': {
      label: 'apoc.util.sha384',
      documentation:
        'Returns the SHA384 of the concatenation of all `STRING` values in the given `LIST<ANY>`.',
      parameters: [
        {
          label: 'values',
          documentation: 'values :: LIST<ANY>',
        },
      ],
    },
    'apoc.util.sha512': {
      label: 'apoc.util.sha512',
      documentation:
        'Returns the SHA512 of the concatenation of all `STRING` values in the `LIST<ANY>`.',
      parameters: [
        {
          label: 'values',
          documentation: 'values :: LIST<ANY>',
        },
      ],
    },
    'apoc.util.validatePredicate': {
      label: 'apoc.util.validatePredicate',
      documentation:
        'If the given predicate is true an exception is thrown, otherwise it returns true (for use inside `WHERE` subclauses).',
      parameters: [
        {
          label: 'predicate',
          documentation: 'predicate :: BOOLEAN',
        },
        {
          label: 'message',
          documentation: 'message :: STRING',
        },
        {
          label: 'params',
          documentation: 'params :: LIST<ANY>',
        },
      ],
    },
    'apoc.version': {
      label: 'apoc.version',
      documentation: 'Returns the APOC version currently installed.',
      parameters: [],
    },
    'apoc.xml.parse': {
      label: 'apoc.xml.parse',
      documentation: 'Parses the given XML `STRING` as a `MAP`.',
      parameters: [
        {
          label: 'data',
          documentation: 'data :: STRING',
        },
        {
          label: 'path',
          documentation: 'path = / :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
        {
          label: 'simple',
          documentation: 'simple = false :: BOOLEAN',
        },
      ],
    },
    asin: {
      label: 'asin',
      documentation: 'Returns the arcsine of a `FLOAT` in radians.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT',
        },
      ],
    },
    atan: {
      label: 'atan',
      documentation: 'Returns the arctangent of a `FLOAT` in radians.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT',
        },
      ],
    },
    atan2: {
      label: 'atan2',
      documentation:
        'Returns the arctangent2 of a set of coordinates in radians.',
      parameters: [
        {
          label: 'y',
          documentation: 'y :: FLOAT',
        },
        {
          label: 'x',
          documentation: 'x :: FLOAT',
        },
      ],
    },
    avg: {
      label: 'avg',
      documentation:
        'Returns the average of a set of `INTEGER`, `FLOAT` or `DURATION` values.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: INTEGER | FLOAT | DURATION',
        },
      ],
    },
    ceil: {
      label: 'ceil',
      documentation:
        'Returns the smallest `FLOAT` that is greater than or equal to a number and equal to an `INTEGER`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT',
        },
      ],
    },
    char_length: {
      label: 'char_length',
      documentation: 'Returns the number of Unicode characters in a `STRING`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: STRING',
        },
      ],
    },
    character_length: {
      label: 'character_length',
      documentation: 'Returns the number of Unicode characters in a `STRING`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: STRING',
        },
      ],
    },
    coalesce: {
      label: 'coalesce',
      documentation:
        'Returns the first non-null value in a list of expressions.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY',
        },
      ],
    },
    collect: {
      label: 'collect',
      documentation:
        'Returns a list containing the values returned by an expression.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY',
        },
      ],
    },
    cos: {
      label: 'cos',
      documentation: 'Returns the cosine of a `FLOAT`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT',
        },
      ],
    },
    cot: {
      label: 'cot',
      documentation: 'Returns the cotangent of a `FLOAT`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT',
        },
      ],
    },
    count: {
      label: 'count',
      documentation: 'Returns the number of values or rows.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY',
        },
      ],
    },
    date: {
      label: 'date',
      documentation: 'Creates a `DATE` instant.',
      parameters: [
        {
          label: 'input',
          documentation: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
      ],
    },
    'date.realtime': {
      label: 'date.realtime',
      documentation:
        'Returns the current `DATE` instant using the realtime clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
      ],
    },
    'date.statement': {
      label: 'date.statement',
      documentation:
        'Returns the current `DATE` instant using the statement clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
      ],
    },
    'date.transaction': {
      label: 'date.transaction',
      documentation:
        'Returns the current `DATE` instant using the transaction clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
      ],
    },
    'date.truncate': {
      label: 'date.truncate',
      documentation:
        'Truncates the given temporal value to a `DATE` instant using the specified unit.',
      parameters: [
        {
          label: 'unit',
          documentation: 'unit :: STRING',
        },
        {
          label: 'input',
          documentation: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
        {
          label: 'fields',
          documentation: 'fields = null :: MAP',
        },
      ],
    },
    datetime: {
      label: 'datetime',
      documentation: 'Creates a `ZONED DATETIME` instant.',
      parameters: [
        {
          label: 'input',
          documentation: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
      ],
    },
    'datetime.fromepoch': {
      label: 'datetime.fromepoch',
      documentation:
        'Creates a `ZONED DATETIME` given the seconds and nanoseconds since the start of the epoch.',
      parameters: [
        {
          label: 'seconds',
          documentation: 'seconds :: INTEGER | FLOAT',
        },
        {
          label: 'nanoseconds',
          documentation: 'nanoseconds :: INTEGER | FLOAT',
        },
      ],
    },
    'datetime.fromepochmillis': {
      label: 'datetime.fromepochmillis',
      documentation:
        'Creates a `ZONED DATETIME` given the milliseconds since the start of the epoch.',
      parameters: [
        {
          label: 'milliseconds',
          documentation: 'milliseconds :: INTEGER | FLOAT',
        },
      ],
    },
    'datetime.realtime': {
      label: 'datetime.realtime',
      documentation:
        'Returns the current `ZONED DATETIME` instant using the realtime clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
      ],
    },
    'datetime.statement': {
      label: 'datetime.statement',
      documentation:
        'Returns the current `ZONED DATETIME` instant using the statement clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
      ],
    },
    'datetime.transaction': {
      label: 'datetime.transaction',
      documentation:
        'Returns the current `ZONED DATETIME` instant using the transaction clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
      ],
    },
    'datetime.truncate': {
      label: 'datetime.truncate',
      documentation:
        'Truncates the given temporal value to a `ZONED DATETIME` instant using the specified unit.',
      parameters: [
        {
          label: 'unit',
          documentation: 'unit :: STRING',
        },
        {
          label: 'input',
          documentation: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
        {
          label: 'fields',
          documentation: 'fields = null :: MAP',
        },
      ],
    },
    'db.nameFromElementId': {
      label: 'db.nameFromElementId',
      documentation: 'Resolves the database name for the given element id',
      parameters: [
        {
          label: 'elementId',
          documentation: 'elementId :: STRING',
        },
      ],
    },
    degrees: {
      label: 'degrees',
      documentation: 'Converts radians to degrees.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT',
        },
      ],
    },
    duration: {
      label: 'duration',
      documentation: 'Creates a `DURATION` value.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY',
        },
      ],
    },
    'duration.between': {
      label: 'duration.between',
      documentation:
        'Computes the `DURATION` between the `from` instant (inclusive) and the `to` instant (exclusive) in logical units.',
      parameters: [
        {
          label: 'from',
          documentation: 'from :: ANY',
        },
        {
          label: 'to',
          documentation: 'to :: ANY',
        },
      ],
    },
    'duration.inDays': {
      label: 'duration.inDays',
      documentation:
        'Computes the `DURATION` between the `from` instant (inclusive) and the `to` instant (exclusive) in days.',
      parameters: [
        {
          label: 'from',
          documentation: 'from :: ANY',
        },
        {
          label: 'to',
          documentation: 'to :: ANY',
        },
      ],
    },
    'duration.inMonths': {
      label: 'duration.inMonths',
      documentation:
        'Computes the `DURATION` between the `from` instant (inclusive) and the `to` instant (exclusive) in months.',
      parameters: [
        {
          label: 'from',
          documentation: 'from :: ANY',
        },
        {
          label: 'to',
          documentation: 'to :: ANY',
        },
      ],
    },
    'duration.inSeconds': {
      label: 'duration.inSeconds',
      documentation:
        'Computes the `DURATION` between the `from` instant (inclusive) and the `to` instant (exclusive) in seconds.',
      parameters: [
        {
          label: 'from',
          documentation: 'from :: ANY',
        },
        {
          label: 'to',
          documentation: 'to :: ANY',
        },
      ],
    },
    e: {
      label: 'e',
      documentation: 'Returns the base of the natural logarithm, e.',
      parameters: [],
    },
    elementId: {
      label: 'elementId',
      documentation: 'Returns the element id of a `NODE` or `RELATIONSHIP`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: NODE | RELATIONSHIP',
        },
      ],
    },
    endNode: {
      label: 'endNode',
      documentation: 'Returns the end `NODE` of a `RELATIONSHIP`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: RELATIONSHIP',
        },
      ],
    },
    exists: {
      label: 'exists',
      documentation:
        'Returns true if a match for the pattern exists in the graph.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY',
        },
      ],
    },
    exp: {
      label: 'exp',
      documentation:
        'Returns e^n, where e is the base of the natural logarithm, and n is the value of the argument expression.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT',
        },
      ],
    },
    file: {
      label: 'file',
      documentation:
        'Returns the absolute path of the file that LOAD CSV is using.',
      parameters: [],
    },
    floor: {
      label: 'floor',
      documentation:
        'Returns the largest `FLOAT` that is less than or equal to a number and equal to an `INTEGER`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT',
        },
      ],
    },
    'graph.names': {
      label: 'graph.names',
      documentation: 'Lists the names of graphs in the current database.',
      parameters: [],
    },
    'graph.propertiesByName': {
      label: 'graph.propertiesByName',
      documentation: 'Returns the `MAP` of properties associated with a graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING',
        },
      ],
    },
    haversin: {
      label: 'haversin',
      documentation: 'Returns half the versine of a number.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT',
        },
      ],
    },
    head: {
      label: 'head',
      documentation: 'Returns the first element in a `LIST<ANY>`.',
      parameters: [
        {
          label: 'list',
          documentation: 'list :: LIST<ANY>',
        },
      ],
    },
    id: {
      label: 'id',
      documentation: 'Returns the id of a `NODE` or `RELATIONSHIP`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: NODE | RELATIONSHIP',
        },
      ],
    },
    isEmpty: {
      label: 'isEmpty',
      documentation:
        'Checks whether a `STRING`, `MAP` or `LIST<ANY>` is empty.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: STRING | MAP | LIST<ANY>',
        },
      ],
    },
    isNaN: {
      label: 'isNaN',
      documentation: 'Returns whether the given `INTEGER` or `FLOAT` is NaN.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: INTEGER | FLOAT',
        },
      ],
    },
    keys: {
      label: 'keys',
      documentation:
        'Returns a `LIST<STRING>` containing the `STRING` representations for all the property names of a `NODE`, `RELATIONSHIP` or `MAP`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: NODE | RELATIONSHIP | MAP',
        },
      ],
    },
    labels: {
      label: 'labels',
      documentation:
        'Returns a `LIST<STRING>` containing the `STRING` representations for all the labels of a `NODE`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: NODE',
        },
      ],
    },
    last: {
      label: 'last',
      documentation: 'Returns the last element in a `LIST<ANY>`.',
      parameters: [
        {
          label: 'list',
          documentation: 'list :: LIST<ANY>',
        },
      ],
    },
    left: {
      label: 'left',
      documentation:
        'Returns a `STRING` containing the specified number (`INTEGER`) of leftmost characters in the given `STRING`.',
      parameters: [
        {
          label: 'original',
          documentation: 'original :: STRING',
        },
        {
          label: 'length',
          documentation: 'length :: INTEGER',
        },
      ],
    },
    length: {
      label: 'length',
      documentation: 'Returns the length of a `PATH`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: PATH',
        },
      ],
    },
    linenumber: {
      label: 'linenumber',
      documentation:
        'Returns the line number that LOAD CSV is currently using.',
      parameters: [],
    },
    localdatetime: {
      label: 'localdatetime',
      documentation: 'Creates a `LOCAL DATETIME` instant.',
      parameters: [
        {
          label: 'input',
          documentation: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
      ],
    },
    'localdatetime.realtime': {
      label: 'localdatetime.realtime',
      documentation:
        'Returns the current `LOCAL DATETIME` instant using the realtime clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
      ],
    },
    'localdatetime.statement': {
      label: 'localdatetime.statement',
      documentation:
        'Returns the current `LOCAL DATETIME` instant using the statement clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
      ],
    },
    'localdatetime.transaction': {
      label: 'localdatetime.transaction',
      documentation:
        'Returns the current `LOCAL DATETIME` instant using the transaction clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
      ],
    },
    'localdatetime.truncate': {
      label: 'localdatetime.truncate',
      documentation:
        'Truncates the given temporal value to a `LOCAL DATETIME` instant using the specified unit.',
      parameters: [
        {
          label: 'unit',
          documentation: 'unit :: STRING',
        },
        {
          label: 'input',
          documentation: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
        {
          label: 'fields',
          documentation: 'fields = null :: MAP',
        },
      ],
    },
    localtime: {
      label: 'localtime',
      documentation: 'Creates a `LOCAL TIME` instant.',
      parameters: [
        {
          label: 'input',
          documentation: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
      ],
    },
    'localtime.realtime': {
      label: 'localtime.realtime',
      documentation:
        'Returns the current `LOCAL TIME` instant using the realtime clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
      ],
    },
    'localtime.statement': {
      label: 'localtime.statement',
      documentation:
        'Returns the current `LOCAL TIME` instant using the statement clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
      ],
    },
    'localtime.transaction': {
      label: 'localtime.transaction',
      documentation:
        'Returns the current `LOCAL TIME` instant using the transaction clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
      ],
    },
    'localtime.truncate': {
      label: 'localtime.truncate',
      documentation:
        'Truncates the given temporal value to a `LOCAL TIME` instant using the specified unit.',
      parameters: [
        {
          label: 'unit',
          documentation: 'unit :: STRING',
        },
        {
          label: 'input',
          documentation: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
        {
          label: 'fields',
          documentation: 'fields = null :: MAP',
        },
      ],
    },
    log: {
      label: 'log',
      documentation: 'Returns the natural logarithm of a `FLOAT`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT',
        },
      ],
    },
    log10: {
      label: 'log10',
      documentation: 'Returns the common logarithm (base 10) of a `FLOAT`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT',
        },
      ],
    },
    ltrim: {
      label: 'ltrim',
      documentation:
        'Returns the given `STRING` with leading whitespace removed.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: STRING',
        },
      ],
    },
    max: {
      label: 'max',
      documentation: 'Returns the maximum value in a set of values.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY',
        },
      ],
    },
    min: {
      label: 'min',
      documentation: 'Returns the minimum value in a set of values.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY',
        },
      ],
    },
    nodes: {
      label: 'nodes',
      documentation:
        'Returns a `LIST<NODE>` containing all the `NODE` values in a `PATH`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: PATH',
        },
      ],
    },
    none: {
      label: 'none',
      documentation:
        'Returns true if the predicate holds for no element in the given `LIST<ANY>`.',
      parameters: [
        {
          label: 'variable',
          documentation: 'variable :: ANY',
        },
        {
          label: 'list',
          documentation: 'list :: LIST<ANY>',
        },
      ],
    },
    nullIf: {
      label: 'nullIf',
      documentation:
        'Returns null if the two given parameters are equivalent, otherwise returns the value of the first parameter.',
      parameters: [
        {
          label: 'v1',
          documentation: 'v1 :: ANY',
        },
        {
          label: 'v2',
          documentation: 'v2 :: ANY',
        },
      ],
    },
    percentileCont: {
      label: 'percentileCont',
      documentation:
        'Returns the percentile of a value over a group using linear interpolation.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT',
        },
        {
          label: 'percentile',
          documentation: 'percentile :: FLOAT',
        },
      ],
    },
    percentileDisc: {
      label: 'percentileDisc',
      documentation:
        'Returns the nearest `INTEGER` or `FLOAT` value to the given percentile over a group using a rounding method.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: INTEGER | FLOAT',
        },
        {
          label: 'percentile',
          documentation: 'percentile :: FLOAT',
        },
      ],
    },
    pi: {
      label: 'pi',
      documentation: 'Returns the mathematical constant pi.',
      parameters: [],
    },
    point: {
      label: 'point',
      documentation:
        'Returns a 2D or 3D point object, given two or respectively three coordinate values in the Cartesian coordinate system or WGS 84 geographic coordinate system.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: MAP',
        },
      ],
    },
    'point.distance': {
      label: 'point.distance',
      documentation:
        'Returns a `FLOAT` representing the geodesic distance between any two points in the same CRS.',
      parameters: [
        {
          label: 'from',
          documentation: 'from :: POINT',
        },
        {
          label: 'to',
          documentation: 'to :: POINT',
        },
      ],
    },
    'point.withinBBox': {
      label: 'point.withinBBox',
      documentation:
        'Returns true if the provided point is within the bounding box defined by the two provided points.',
      parameters: [
        {
          label: 'point',
          documentation: 'point :: POINT',
        },
        {
          label: 'lowerLeft',
          documentation: 'lowerLeft :: POINT',
        },
        {
          label: 'upperRight',
          documentation: 'upperRight :: POINT',
        },
      ],
    },
    properties: {
      label: 'properties',
      documentation:
        'Returns a `MAP` containing all the properties of a `NODE`, `RELATIONSHIP` or `MAP`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: NODE | RELATIONSHIP | MAP',
        },
      ],
    },
    radians: {
      label: 'radians',
      documentation: 'Converts degrees to radians.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT',
        },
      ],
    },
    rand: {
      label: 'rand',
      documentation:
        'Returns a random `FLOAT` in the range from 0 (inclusive) to 1 (exclusive).',
      parameters: [],
    },
    randomUUID: {
      label: 'randomUUID',
      documentation: 'Generates a random UUID.',
      parameters: [],
    },
    range: {
      label: 'range',
      documentation:
        'Returns a `LIST<INTEGER>` comprising all `INTEGER` values within a specified range created with step length.',
      parameters: [
        {
          label: 'start',
          documentation: 'start :: INTEGER',
        },
        {
          label: 'end',
          documentation: 'end :: INTEGER',
        },
        {
          label: 'step',
          documentation: 'step :: INTEGER',
        },
      ],
    },
    reduce: {
      label: 'reduce',
      documentation:
        'Runs an expression against individual elements of a `LIST<ANY>`, storing the result of the expression in an accumulator.',
      parameters: [
        {
          label: 'accumulator',
          documentation: 'accumulator :: ANY',
        },
        {
          label: 'variable',
          documentation: 'variable :: LIST<ANY>',
        },
      ],
    },
    relationships: {
      label: 'relationships',
      documentation:
        'Returns a `LIST<RELATIONSHIP>` containing all the `RELATIONSHIP` values in a `PATH`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: PATH',
        },
      ],
    },
    replace: {
      label: 'replace',
      documentation:
        'Returns a `STRING` in which all occurrences of a specified search `STRING` in the given `STRING` have been replaced by another (specified) replacement `STRING`.',
      parameters: [
        {
          label: 'original',
          documentation: 'original :: STRING',
        },
        {
          label: 'search',
          documentation: 'search :: STRING',
        },
        {
          label: 'replace',
          documentation: 'replace :: STRING',
        },
      ],
    },
    reverse: {
      label: 'reverse',
      documentation:
        'Returns a `STRING` or `LIST<ANY>` in which the order of all characters or elements in the given `STRING` or `LIST<ANY>` have been reversed.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: STRING | LIST<ANY>',
        },
      ],
    },
    right: {
      label: 'right',
      documentation:
        'Returns a `STRING` containing the specified number of rightmost characters in the given `STRING`.',
      parameters: [
        {
          label: 'original',
          documentation: 'original :: STRING',
        },
        {
          label: 'length',
          documentation: 'length :: INTEGER',
        },
      ],
    },
    round: {
      label: 'round',
      documentation:
        'Returns the value of a number rounded to the specified precision with the specified rounding mode.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: FLOAT',
        },
        {
          label: 'precision',
          documentation: 'precision :: INTEGER | FLOAT',
        },
        {
          label: 'mode',
          documentation: 'mode :: STRING',
        },
      ],
    },
    rtrim: {
      label: 'rtrim',
      documentation:
        'Returns the given `STRING` with trailing whitespace removed.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: STRING',
        },
      ],
    },
    sign: {
      label: 'sign',
      documentation:
        'Returns the signum of an `INTEGER` or `FLOAT`: 0 if the number is 0, -1 for any negative number, and 1 for any positive number.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: INTEGER | FLOAT',
        },
      ],
    },
    sin: {
      label: 'sin',
      documentation: 'Returns the sine of a `FLOAT`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT',
        },
      ],
    },
    single: {
      label: 'single',
      documentation:
        'Returns true if the predicate holds for exactly one of the elements in the given `LIST<ANY>`.',
      parameters: [
        {
          label: 'variable',
          documentation: 'variable :: ANY',
        },
        {
          label: 'list',
          documentation: 'list :: LIST<ANY>',
        },
      ],
    },
    size: {
      label: 'size',
      documentation:
        'Returns the number of items in a `LIST<ANY>` or the number of Unicode characters in a `STRING`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: STRING | LIST<ANY>',
        },
      ],
    },
    split: {
      label: 'split',
      documentation:
        'Returns a `LIST<STRING>` resulting from the splitting of the given `STRING` around matches of the given delimiter(s).',
      parameters: [
        {
          label: 'original',
          documentation: 'original :: STRING',
        },
        {
          label: 'splitDelimiters',
          documentation: 'splitDelimiters :: STRING | LIST<STRING>',
        },
      ],
    },
    sqrt: {
      label: 'sqrt',
      documentation: 'Returns the square root of a `FLOAT`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT',
        },
      ],
    },
    startNode: {
      label: 'startNode',
      documentation: 'Returns the start `NODE` of a `RELATIONSHIP`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: RELATIONSHIP',
        },
      ],
    },
    stdev: {
      label: 'stdev',
      documentation:
        'Returns the standard deviation for the given value over a group for a sample of a population.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT',
        },
      ],
    },
    stdevp: {
      label: 'stdevp',
      documentation:
        'Returns the standard deviation for the given value over a group for an entire population.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT',
        },
      ],
    },
    substring: {
      label: 'substring',
      documentation:
        'Returns a substring of a given `length` from the given `STRING`, beginning with a 0-based index start.',
      parameters: [
        {
          label: 'original',
          documentation: 'original :: STRING',
        },
        {
          label: 'start',
          documentation: 'start :: INTEGER',
        },
        {
          label: 'length',
          documentation: 'length :: INTEGER',
        },
      ],
    },
    sum: {
      label: 'sum',
      documentation:
        'Returns the sum of a set of `INTEGER`, `FLOAT` or `DURATION` values',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: INTEGER | FLOAT | DURATION',
        },
      ],
    },
    tail: {
      label: 'tail',
      documentation: 'Returns all but the first element in a `LIST<ANY>`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: LIST<ANY>',
        },
      ],
    },
    tan: {
      label: 'tan',
      documentation: 'Returns the tangent of a `FLOAT`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT',
        },
      ],
    },
    time: {
      label: 'time',
      documentation: 'Creates a `ZONED TIME` instant.',
      parameters: [
        {
          label: 'input',
          documentation: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
      ],
    },
    'time.realtime': {
      label: 'time.realtime',
      documentation:
        'Returns the current `ZONED TIME` instant using the realtime clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
      ],
    },
    'time.statement': {
      label: 'time.statement',
      documentation:
        'Returns the current `ZONED TIME` instant using the statement clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
      ],
    },
    'time.transaction': {
      label: 'time.transaction',
      documentation:
        'Returns the current `ZONED TIME` instant using the transaction clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
      ],
    },
    'time.truncate': {
      label: 'time.truncate',
      documentation:
        'Truncates the given temporal value to a `ZONED TIME` instant using the specified unit.',
      parameters: [
        {
          label: 'unit',
          documentation: 'unit :: STRING',
        },
        {
          label: 'input',
          documentation: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
        },
        {
          label: 'fields',
          documentation: 'fields = null :: MAP',
        },
      ],
    },
    timestamp: {
      label: 'timestamp',
      documentation:
        'Returns the difference, measured in milliseconds, between the current time and midnight, January 1, 1970 UTC',
      parameters: [],
    },
    toBoolean: {
      label: 'toBoolean',
      documentation:
        'Converts a `BOOLEAN`, `STRING` or `INTEGER` value to a `BOOLEAN` value. For `INTEGER` values, 0 is defined to be false and any other `INTEGER` is defined to be true.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: BOOLEAN | STRING | INTEGER',
        },
      ],
    },
    toBooleanList: {
      label: 'toBooleanList',
      documentation:
        'Converts a `LIST<ANY>` of values to a `LIST<BOOLEAN>` values. If any values are not convertible to `BOOLEAN` they will be null in the `LIST<BOOLEAN>` returned.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: LIST<ANY>',
        },
      ],
    },
    toBooleanOrNull: {
      label: 'toBooleanOrNull',
      documentation:
        'Converts a value to a `BOOLEAN` value, or null if the value cannot be converted.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY',
        },
      ],
    },
    toFloat: {
      label: 'toFloat',
      documentation:
        'Converts a `STRING`, `INTEGER` or `FLOAT` value to a `FLOAT` value.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: STRING | INTEGER | FLOAT',
        },
      ],
    },
    toFloatList: {
      label: 'toFloatList',
      documentation:
        'Converts a `LIST<ANY>` to a `LIST<FLOAT>` values. If any values are not convertible to `FLOAT` they will be null in the `LIST<FLOAT>` returned.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: LIST<ANY>',
        },
      ],
    },
    toFloatOrNull: {
      label: 'toFloatOrNull',
      documentation:
        'Converts a value to a `FLOAT` value, or null if the value cannot be converted.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY',
        },
      ],
    },
    toInteger: {
      label: 'toInteger',
      documentation:
        'Converts a `BOOLEAN`, `STRING`, `INTEGER` or `FLOAT` value to an `INTEGER` value. For `BOOLEAN` values, true is defined to be 1 and false is defined to be 0.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: BOOLEAN | STRING | INTEGER | FLOAT',
        },
      ],
    },
    toIntegerList: {
      label: 'toIntegerList',
      documentation:
        'Converts a `LIST<ANY>` to a `LIST<INTEGER>` values. If any values are not convertible to `INTEGER` they will be null in the `LIST<INTEGER>` returned.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: LIST<ANY>',
        },
      ],
    },
    toIntegerOrNull: {
      label: 'toIntegerOrNull',
      documentation:
        'Converts a value to an `INTEGER` value, or null if the value cannot be converted.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY',
        },
      ],
    },
    toLower: {
      label: 'toLower',
      documentation: 'Returns the given `STRING` in lowercase.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: STRING',
        },
      ],
    },
    toString: {
      label: 'toString',
      documentation:
        'Converts an `INTEGER`, `FLOAT`, `BOOLEAN`, `POINT` or temporal type (i.e. `DATE`, `ZONED TIME`, `LOCAL TIME`, `ZONED DATETIME`, `LOCAL DATETIME` or `DURATION`) value to a `STRING`.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY',
        },
      ],
    },
    toStringList: {
      label: 'toStringList',
      documentation:
        'Converts a `LIST<ANY>` to a `LIST<STRING>` values. If any values are not convertible to `STRING` they will be null in the `LIST<STRING>` returned.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: LIST<ANY>',
        },
      ],
    },
    toStringOrNull: {
      label: 'toStringOrNull',
      documentation:
        'Converts an `INTEGER`, `FLOAT`, `BOOLEAN`, `POINT` or temporal type (i.e. `DATE`, `ZONED TIME`, `LOCAL TIME`, `ZONED DATETIME`, `LOCAL DATETIME` or `DURATION`) value to a `STRING`, or null if the value cannot be converted.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY',
        },
      ],
    },
    toUpper: {
      label: 'toUpper',
      documentation: 'Returns the given `STRING` in uppercase.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: STRING',
        },
      ],
    },
    trim: {
      label: 'trim',
      documentation:
        'Returns the given `STRING` with leading and trailing whitespace removed.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: STRING',
        },
      ],
    },
    type: {
      label: 'type',
      documentation:
        'Returns a `STRING` representation of the `RELATIONSHIP` type.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: RELATIONSHIP',
        },
      ],
    },
    valueType: {
      label: 'valueType',
      documentation:
        'Returns a `STRING` representation of the most precise value type that the given expression evaluates to.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY',
        },
      ],
    },
  },
  procedureSignatures: {
    'apoc.algo.aStar': {
      label: 'apoc.algo.aStar',
      documentation:
        'Runs the A* search algorithm to find the optimal path between two `NODE` values, using the given `RELATIONSHIP` property name for the cost function.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: NODE',
        },
        {
          label: 'endNode',
          documentation: 'endNode :: NODE',
        },
        {
          label: 'relTypesAndDirections',
          documentation: 'relTypesAndDirections :: STRING',
        },
        {
          label: 'weightPropertyName',
          documentation: 'weightPropertyName :: STRING',
        },
        {
          label: 'latPropertyName',
          documentation: 'latPropertyName :: STRING',
        },
        {
          label: 'lonPropertyName',
          documentation: 'lonPropertyName :: STRING',
        },
      ],
    },
    'apoc.algo.aStarConfig': {
      label: 'apoc.algo.aStarConfig',
      documentation:
        'Runs the A* search algorithm to find the optimal path between two `NODE` values, using the given `RELATIONSHIP` property name for the cost function.\nThis procedure looks for weight, latitude and longitude properties in the config.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: NODE',
        },
        {
          label: 'endNode',
          documentation: 'endNode :: NODE',
        },
        {
          label: 'relTypesAndDirections',
          documentation: 'relTypesAndDirections :: STRING',
        },
        {
          label: 'config',
          documentation: 'config :: MAP',
        },
      ],
    },
    'apoc.algo.allSimplePaths': {
      label: 'apoc.algo.allSimplePaths',
      documentation:
        'Runs a search algorithm to find all of the simple paths between the given `RELATIONSHIP` values, up to a max depth described by `maxNodes`.\nThe returned paths will not contain loops.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: NODE',
        },
        {
          label: 'endNode',
          documentation: 'endNode :: NODE',
        },
        {
          label: 'relTypesAndDirections',
          documentation: 'relTypesAndDirections :: STRING',
        },
        {
          label: 'maxNodes',
          documentation: 'maxNodes :: INTEGER',
        },
      ],
    },
    'apoc.algo.cover': {
      label: 'apoc.algo.cover',
      documentation:
        'Returns all `RELATIONSHIP` values connecting the given set of `NODE` values.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY',
        },
      ],
    },
    'apoc.algo.dijkstra': {
      label: 'apoc.algo.dijkstra',
      documentation:
        "Runs Dijkstra's algorithm using the given `RELATIONSHIP` property as the cost function.",
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: NODE',
        },
        {
          label: 'endNode',
          documentation: 'endNode :: NODE',
        },
        {
          label: 'relTypesAndDirections',
          documentation: 'relTypesAndDirections :: STRING',
        },
        {
          label: 'weightPropertyName',
          documentation: 'weightPropertyName :: STRING',
        },
        {
          label: 'defaultWeight',
          documentation: 'defaultWeight = NaN :: FLOAT',
        },
        {
          label: 'numberOfWantedPaths',
          documentation: 'numberOfWantedPaths = 1 :: INTEGER',
        },
      ],
    },
    'apoc.atomic.add': {
      label: 'apoc.atomic.add',
      documentation:
        'Sets the given property to the sum of itself and the given `INTEGER` or `FLOAT` value.\nThe procedure then sets the property to the returned sum.',
      parameters: [
        {
          label: 'container',
          documentation: 'container :: ANY',
        },
        {
          label: 'propertyName',
          documentation: 'propertyName :: STRING',
        },
        {
          label: 'number',
          documentation: 'number :: INTEGER | FLOAT',
        },
        {
          label: 'retryAttempts',
          documentation: 'retryAttempts = 5 :: INTEGER',
        },
      ],
    },
    'apoc.atomic.concat': {
      label: 'apoc.atomic.concat',
      documentation:
        'Sets the given property to the concatenation of itself and the `STRING` value.\nThe procedure then sets the property to the returned `STRING`.',
      parameters: [
        {
          label: 'container',
          documentation: 'container :: ANY',
        },
        {
          label: 'propertyName',
          documentation: 'propertyName :: STRING',
        },
        {
          label: 'string',
          documentation: 'string :: STRING',
        },
        {
          label: 'retryAttempts',
          documentation: 'retryAttempts = 5 :: INTEGER',
        },
      ],
    },
    'apoc.atomic.insert': {
      label: 'apoc.atomic.insert',
      documentation:
        'Inserts a value at position into the `LIST<ANY>` value of a property.\nThe procedure then sets the result back on the property.',
      parameters: [
        {
          label: 'container',
          documentation: 'container :: ANY',
        },
        {
          label: 'propertyName',
          documentation: 'propertyName :: STRING',
        },
        {
          label: 'position',
          documentation: 'position :: INTEGER',
        },
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
        {
          label: 'retryAttempts',
          documentation: 'retryAttempts = 5 :: INTEGER',
        },
      ],
    },
    'apoc.atomic.remove': {
      label: 'apoc.atomic.remove',
      documentation:
        'Removes the element at position from the `LIST<ANY>` value of a property.\nThe procedure then sets the property to the resulting `LIST<ANY>` value.',
      parameters: [
        {
          label: 'container',
          documentation: 'container :: ANY',
        },
        {
          label: 'propertyName',
          documentation: 'propertyName :: STRING',
        },
        {
          label: 'position',
          documentation: 'position :: INTEGER',
        },
        {
          label: 'retryAttempts',
          documentation: 'retryAttempts = 5 :: INTEGER',
        },
      ],
    },
    'apoc.atomic.subtract': {
      label: 'apoc.atomic.subtract',
      documentation:
        'Sets the property of a value to itself minus the given `INTEGER` or `FLOAT` value.\nThe procedure then sets the property to the returned sum.',
      parameters: [
        {
          label: 'container',
          documentation: 'container :: ANY',
        },
        {
          label: 'propertyName',
          documentation: 'propertyName :: STRING',
        },
        {
          label: 'number',
          documentation: 'number :: INTEGER | FLOAT',
        },
        {
          label: 'retryAttempts',
          documentation: 'retryAttempts = 5 :: INTEGER',
        },
      ],
    },
    'apoc.atomic.update': {
      label: 'apoc.atomic.update',
      documentation: 'Updates the value of a property with a Cypher operation.',
      parameters: [
        {
          label: 'container',
          documentation: 'container :: ANY',
        },
        {
          label: 'propertyName',
          documentation: 'propertyName :: STRING',
        },
        {
          label: 'operation',
          documentation: 'operation :: STRING',
        },
        {
          label: 'retryAttempts',
          documentation: 'retryAttempts = 5 :: INTEGER',
        },
      ],
    },
    'apoc.case': {
      label: 'apoc.case',
      documentation:
        'For each pair of conditional and read-only queries in the given `LIST<ANY>`, this procedure will run the first query for which the conditional is evaluated to true. If none of the conditionals are true, the `ELSE` query will run instead.',
      parameters: [
        {
          label: 'conditionals',
          documentation: 'conditionals :: LIST<ANY>',
        },
        {
          label: 'elseQuery',
          documentation: 'elseQuery =  :: STRING',
        },
        {
          label: 'params',
          documentation: 'params = {} :: MAP',
        },
      ],
    },
    'apoc.coll.elements': {
      label: 'apoc.coll.elements',
      documentation:
        'Deconstructs a `LIST<ANY>` into identifiers indicating their specific type.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
        {
          label: 'limit',
          documentation: 'limit = -1 :: INTEGER',
        },
        {
          label: 'offset',
          documentation: 'offset = 0 :: INTEGER',
        },
      ],
    },
    'apoc.coll.pairWithOffset': {
      label: 'apoc.coll.pairWithOffset',
      documentation: 'Returns a `LIST<ANY>` of pairs defined by the offset.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
        {
          label: 'offset',
          documentation: 'offset :: INTEGER',
        },
      ],
    },
    'apoc.coll.partition': {
      label: 'apoc.coll.partition',
      documentation:
        'Partitions the original `LIST<ANY>` into a new `LIST<ANY>` of the given batch size.\nThe final `LIST<ANY>` may be smaller than the given batch size.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
        {
          label: 'batchSize',
          documentation: 'batchSize :: INTEGER',
        },
      ],
    },
    'apoc.coll.split': {
      label: 'apoc.coll.split',
      documentation:
        'Splits a collection by the given value.\nThe value itself will not be part of the resulting `LIST<ANY>` values.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST<ANY>',
        },
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
      ],
    },
    'apoc.coll.zipToRows': {
      label: 'apoc.coll.zipToRows',
      documentation:
        'Returns the two `LIST<ANY>` values zipped together, with one row per zipped pair.',
      parameters: [
        {
          label: 'list1',
          documentation: 'list1 :: LIST<ANY>',
        },
        {
          label: 'list2',
          documentation: 'list2 :: LIST<ANY>',
        },
      ],
    },
    'apoc.convert.setJsonProperty': {
      label: 'apoc.convert.setJsonProperty',
      documentation:
        'Serializes the given JSON object and sets it as a property on the given `NODE`.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE',
        },
        {
          label: 'key',
          documentation: 'key :: STRING',
        },
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
      ],
    },
    'apoc.convert.toTree': {
      label: 'apoc.convert.toTree',
      documentation:
        'Returns a stream of `MAP` values, representing the given `PATH` values as a tree with at least one root.',
      parameters: [
        {
          label: 'paths',
          documentation: 'paths :: LIST<PATH>',
        },
        {
          label: 'lowerCaseRels',
          documentation: 'lowerCaseRels = true :: BOOLEAN',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.create.addLabels': {
      label: 'apoc.create.addLabels',
      documentation: 'Adds the given labels to the given `NODE` values.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY',
        },
        {
          label: 'labels',
          documentation: 'labels :: LIST<STRING>',
        },
      ],
    },
    'apoc.create.clonePathToVirtual': {
      label: 'apoc.create.clonePathToVirtual',
      documentation:
        'Takes the given `PATH` and returns a virtual representation of it.',
      parameters: [
        {
          label: 'path',
          documentation: 'path :: PATH',
        },
      ],
    },
    'apoc.create.clonePathsToVirtual': {
      label: 'apoc.create.clonePathsToVirtual',
      documentation:
        'Takes the given `LIST<PATH>` and returns a virtual representation of them.',
      parameters: [
        {
          label: 'paths',
          documentation: 'paths :: LIST<PATH>',
        },
      ],
    },
    'apoc.create.node': {
      label: 'apoc.create.node',
      documentation: 'Creates a `NODE` with the given dynamic labels.',
      parameters: [
        {
          label: 'labels',
          documentation: 'labels :: LIST<STRING>',
        },
        {
          label: 'props',
          documentation: 'props :: MAP',
        },
      ],
    },
    'apoc.create.nodes': {
      label: 'apoc.create.nodes',
      documentation: 'Creates `NODE` values with the given dynamic labels.',
      parameters: [
        {
          label: 'labels',
          documentation: 'labels :: LIST<STRING>',
        },
        {
          label: 'props',
          documentation: 'props :: LIST<MAP>',
        },
      ],
    },
    'apoc.create.relationship': {
      label: 'apoc.create.relationship',
      documentation:
        'Creates a `RELATIONSHIP` with the given dynamic relationship type.',
      parameters: [
        {
          label: 'from',
          documentation: 'from :: NODE',
        },
        {
          label: 'relType',
          documentation: 'relType :: STRING',
        },
        {
          label: 'props',
          documentation: 'props :: MAP',
        },
        {
          label: 'to',
          documentation: 'to :: NODE',
        },
      ],
    },
    'apoc.create.removeLabels': {
      label: 'apoc.create.removeLabels',
      documentation: 'Removes the given labels from the given `NODE` values.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY',
        },
        {
          label: 'labels',
          documentation: 'labels :: LIST<STRING>',
        },
      ],
    },
    'apoc.create.removeProperties': {
      label: 'apoc.create.removeProperties',
      documentation:
        'Removes the given properties from the given `NODE` values.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY',
        },
        {
          label: 'keys',
          documentation: 'keys :: LIST<STRING>',
        },
      ],
    },
    'apoc.create.removeRelProperties': {
      label: 'apoc.create.removeRelProperties',
      documentation:
        'Removes the given properties from the given `RELATIONSHIP` values.',
      parameters: [
        {
          label: 'rels',
          documentation: 'rels :: ANY',
        },
        {
          label: 'keys',
          documentation: 'keys :: LIST<STRING>',
        },
      ],
    },
    'apoc.create.setLabels': {
      label: 'apoc.create.setLabels',
      documentation:
        'Sets the given labels to the given `NODE` values. Non-matching labels are removed from the nodes.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY',
        },
        {
          label: 'labels',
          documentation: 'labels :: LIST<STRING>',
        },
      ],
    },
    'apoc.create.setProperties': {
      label: 'apoc.create.setProperties',
      documentation: 'Sets the given properties to the given `NODE` values.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY',
        },
        {
          label: 'keys',
          documentation: 'keys :: LIST<STRING>',
        },
        {
          label: 'values',
          documentation: 'values :: LIST<ANY>',
        },
      ],
    },
    'apoc.create.setProperty': {
      label: 'apoc.create.setProperty',
      documentation: 'Sets the given property to the given `NODE` values.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY',
        },
        {
          label: 'key',
          documentation: 'key :: STRING',
        },
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
      ],
    },
    'apoc.create.setRelProperties': {
      label: 'apoc.create.setRelProperties',
      documentation: 'Sets the given properties on the `RELATIONSHIP` values.',
      parameters: [
        {
          label: 'rels',
          documentation: 'rels :: ANY',
        },
        {
          label: 'keys',
          documentation: 'keys :: LIST<STRING>',
        },
        {
          label: 'values',
          documentation: 'values :: LIST<ANY>',
        },
      ],
    },
    'apoc.create.setRelProperty': {
      label: 'apoc.create.setRelProperty',
      documentation: 'Sets the given property on the `RELATIONSHIP` values.',
      parameters: [
        {
          label: 'rels',
          documentation: 'rels :: ANY',
        },
        {
          label: 'key',
          documentation: 'key :: STRING',
        },
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
      ],
    },
    'apoc.create.uuids': {
      label: 'apoc.create.uuids',
      documentation: 'Returns a stream of UUIDs.',
      parameters: [
        {
          label: 'count',
          documentation: 'count :: INTEGER',
        },
      ],
    },
    'apoc.create.vNode': {
      label: 'apoc.create.vNode',
      documentation: 'Returns a virtual `NODE`.',
      parameters: [
        {
          label: 'labels',
          documentation: 'labels :: LIST<STRING>',
        },
        {
          label: 'props',
          documentation: 'props :: MAP',
        },
      ],
    },
    'apoc.create.vNodes': {
      label: 'apoc.create.vNodes',
      documentation: 'Returns virtual `NODE` values.',
      parameters: [
        {
          label: 'labels',
          documentation: 'labels :: LIST<STRING>',
        },
        {
          label: 'props',
          documentation: 'props :: LIST<MAP>',
        },
      ],
    },
    'apoc.create.vRelationship': {
      label: 'apoc.create.vRelationship',
      documentation: 'Returns a virtual `RELATIONSHIP`.',
      parameters: [
        {
          label: 'from',
          documentation: 'from :: NODE',
        },
        {
          label: 'relType',
          documentation: 'relType :: STRING',
        },
        {
          label: 'props',
          documentation: 'props :: MAP',
        },
        {
          label: 'to',
          documentation: 'to :: NODE',
        },
      ],
    },
    'apoc.create.virtualPath': {
      label: 'apoc.create.virtualPath',
      documentation: 'Returns a virtual `PATH`.',
      parameters: [
        {
          label: 'labelsN',
          documentation: 'labelsN :: LIST<STRING>',
        },
        {
          label: 'n',
          documentation: 'n :: MAP',
        },
        {
          label: 'relType',
          documentation: 'relType :: STRING',
        },
        {
          label: 'props',
          documentation: 'props :: MAP',
        },
        {
          label: 'labelsM',
          documentation: 'labelsM :: LIST<STRING>',
        },
        {
          label: 'm',
          documentation: 'm :: MAP',
        },
      ],
    },
    'apoc.cypher.doIt': {
      label: 'apoc.cypher.doIt',
      documentation:
        'Runs a dynamically constructed statement with the given parameters. This procedure allows for both read and write statements.',
      parameters: [
        {
          label: 'statement',
          documentation: 'statement :: STRING',
        },
        {
          label: 'params',
          documentation: 'params :: MAP',
        },
      ],
    },
    'apoc.cypher.run': {
      label: 'apoc.cypher.run',
      documentation:
        'Runs a dynamically constructed read-only statement with the given parameters.',
      parameters: [
        {
          label: 'statement',
          documentation: 'statement :: STRING',
        },
        {
          label: 'params',
          documentation: 'params :: MAP',
        },
      ],
    },
    'apoc.cypher.runMany': {
      label: 'apoc.cypher.runMany',
      documentation:
        'Runs each semicolon separated statement and returns a summary of the statement outcomes.',
      parameters: [
        {
          label: 'statement',
          documentation: 'statement :: STRING',
        },
        {
          label: 'params',
          documentation: 'params :: MAP',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.cypher.runManyReadOnly': {
      label: 'apoc.cypher.runManyReadOnly',
      documentation:
        'Runs each semicolon separated read-only statement and returns a summary of the statement outcomes.',
      parameters: [
        {
          label: 'statement',
          documentation: 'statement :: STRING',
        },
        {
          label: 'params',
          documentation: 'params :: MAP',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.cypher.runSchema': {
      label: 'apoc.cypher.runSchema',
      documentation:
        'Runs the given query schema statement with the given parameters.',
      parameters: [
        {
          label: 'statement',
          documentation: 'statement :: STRING',
        },
        {
          label: 'params',
          documentation: 'params :: MAP',
        },
      ],
    },
    'apoc.cypher.runTimeboxed': {
      label: 'apoc.cypher.runTimeboxed',
      documentation:
        'Terminates a Cypher statement if it has not finished before the set timeout (ms).',
      parameters: [
        {
          label: 'statement',
          documentation: 'statement :: STRING',
        },
        {
          label: 'params',
          documentation: 'params :: MAP',
        },
        {
          label: 'timeout',
          documentation: 'timeout :: INTEGER',
        },
      ],
    },
    'apoc.cypher.runWrite': {
      label: 'apoc.cypher.runWrite',
      documentation: 'Alias for `apoc.cypher.doIt`.',
      parameters: [
        {
          label: 'statement',
          documentation: 'statement :: STRING',
        },
        {
          label: 'params',
          documentation: 'params :: MAP',
        },
      ],
    },
    'apoc.do.case': {
      label: 'apoc.do.case',
      documentation:
        'For each pair of conditional queries in the given `LIST<ANY>`, this procedure will run the first query for which the conditional is evaluated to true.\nIf none of the conditionals are true, the `ELSE` query will run instead.',
      parameters: [
        {
          label: 'conditionals',
          documentation: 'conditionals :: LIST<ANY>',
        },
        {
          label: 'elseQuery',
          documentation: 'elseQuery =  :: STRING',
        },
        {
          label: 'params',
          documentation: 'params = {} :: MAP',
        },
      ],
    },
    'apoc.do.when': {
      label: 'apoc.do.when',
      documentation:
        'Runs the given read/write `ifQuery` if the conditional has evaluated to true, otherwise the `elseQuery` will run.',
      parameters: [
        {
          label: 'condition',
          documentation: 'condition :: BOOLEAN',
        },
        {
          label: 'ifQuery',
          documentation: 'ifQuery :: STRING',
        },
        {
          label: 'elseQuery',
          documentation: 'elseQuery =  :: STRING',
        },
        {
          label: 'params',
          documentation: 'params = {} :: MAP',
        },
      ],
    },
    'apoc.example.movies': {
      label: 'apoc.example.movies',
      documentation: 'Seeds the database with the Neo4j movie dataset.',
      parameters: [],
    },
    'apoc.export.arrow.all': {
      label: 'apoc.export.arrow.all',
      documentation: 'Exports the full database as an arrow file.',
      parameters: [
        {
          label: 'file',
          documentation: 'file :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.export.arrow.graph': {
      label: 'apoc.export.arrow.graph',
      documentation: 'Exports the given graph as an arrow file.',
      parameters: [
        {
          label: 'file',
          documentation: 'file :: STRING',
        },
        {
          label: 'graph',
          documentation: 'graph :: ANY',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.export.arrow.query': {
      label: 'apoc.export.arrow.query',
      documentation:
        'Exports the results from the given Cypher query as an arrow file.',
      parameters: [
        {
          label: 'file',
          documentation: 'file :: STRING',
        },
        {
          label: 'query',
          documentation: 'query :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.export.arrow.stream.all': {
      label: 'apoc.export.arrow.stream.all',
      documentation: 'Exports the full database as an arrow byte array.',
      parameters: [
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.export.arrow.stream.graph': {
      label: 'apoc.export.arrow.stream.graph',
      documentation: 'Exports the given graph as an arrow byte array.',
      parameters: [
        {
          label: 'graph',
          documentation: 'graph :: ANY',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.export.arrow.stream.query': {
      label: 'apoc.export.arrow.stream.query',
      documentation: 'Exports the given Cypher query as an arrow byte array.',
      parameters: [
        {
          label: 'query',
          documentation: 'query :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.export.csv.all': {
      label: 'apoc.export.csv.all',
      documentation: 'Exports the full database to the provided CSV file.',
      parameters: [
        {
          label: 'file',
          documentation: 'file :: STRING',
        },
        {
          label: 'config',
          documentation: 'config :: MAP',
        },
      ],
    },
    'apoc.export.csv.data': {
      label: 'apoc.export.csv.data',
      documentation:
        'Exports the given `NODE` and `RELATIONSHIP` values to the provided CSV file.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST<NODE>',
        },
        {
          label: 'rels',
          documentation: 'rels :: LIST<RELATIONSHIP>',
        },
        {
          label: 'file',
          documentation: 'file :: STRING',
        },
        {
          label: 'config',
          documentation: 'config :: MAP',
        },
      ],
    },
    'apoc.export.csv.graph': {
      label: 'apoc.export.csv.graph',
      documentation: 'Exports the given graph to the provided CSV file.',
      parameters: [
        {
          label: 'graph',
          documentation: 'graph :: MAP',
        },
        {
          label: 'file',
          documentation: 'file :: STRING',
        },
        {
          label: 'config',
          documentation: 'config :: MAP',
        },
      ],
    },
    'apoc.export.csv.query': {
      label: 'apoc.export.csv.query',
      documentation:
        'Exports the results from running the given Cypher query to the provided CSV file.',
      parameters: [
        {
          label: 'query',
          documentation: 'query :: STRING',
        },
        {
          label: 'file',
          documentation: 'file :: STRING',
        },
        {
          label: 'config',
          documentation: 'config :: MAP',
        },
      ],
    },
    'apoc.export.cypher.all': {
      label: 'apoc.export.cypher.all',
      documentation:
        'Exports the full database (incl. indexes) as Cypher statements to the provided file (default: Cypher Shell).',
      parameters: [
        {
          label: 'file',
          documentation: 'file =  :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.export.cypher.data': {
      label: 'apoc.export.cypher.data',
      documentation:
        'Exports the given `NODE` and `RELATIONSHIP` values (incl. indexes) as Cypher statements to the provided file (default: Cypher Shell).',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST<NODE>',
        },
        {
          label: 'rels',
          documentation: 'rels :: LIST<RELATIONSHIP>',
        },
        {
          label: 'file',
          documentation: 'file =  :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.export.cypher.graph': {
      label: 'apoc.export.cypher.graph',
      documentation:
        'Exports the given graph (incl. indexes) as Cypher statements to the provided file (default: Cypher Shell).',
      parameters: [
        {
          label: 'graph',
          documentation: 'graph :: MAP',
        },
        {
          label: 'file',
          documentation: 'file =  :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.export.cypher.query': {
      label: 'apoc.export.cypher.query',
      documentation:
        'Exports the `NODE` and `RELATIONSHIP` values from the given Cypher query (incl. indexes) as Cypher statements to the provided file (default: Cypher Shell).',
      parameters: [
        {
          label: 'statement',
          documentation: 'statement :: STRING',
        },
        {
          label: 'file',
          documentation: 'file =  :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.export.cypher.schema': {
      label: 'apoc.export.cypher.schema',
      documentation:
        'Exports all schema indexes and constraints to Cypher statements.',
      parameters: [
        {
          label: 'file',
          documentation: 'file =  :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.export.graphml.all': {
      label: 'apoc.export.graphml.all',
      documentation: 'Exports the full database to the provided GraphML file.',
      parameters: [
        {
          label: 'file',
          documentation: 'file :: STRING',
        },
        {
          label: 'config',
          documentation: 'config :: MAP',
        },
      ],
    },
    'apoc.export.graphml.data': {
      label: 'apoc.export.graphml.data',
      documentation:
        'Exports the given `NODE` and `RELATIONSHIP` values to the provided GraphML file.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST<NODE>',
        },
        {
          label: 'rels',
          documentation: 'rels :: LIST<RELATIONSHIP>',
        },
        {
          label: 'file',
          documentation: 'file :: STRING',
        },
        {
          label: 'config',
          documentation: 'config :: MAP',
        },
      ],
    },
    'apoc.export.graphml.graph': {
      label: 'apoc.export.graphml.graph',
      documentation: 'Exports the given graph to the provided GraphML file.',
      parameters: [
        {
          label: 'graph',
          documentation: 'graph :: MAP',
        },
        {
          label: 'file',
          documentation: 'file :: STRING',
        },
        {
          label: 'config',
          documentation: 'config :: MAP',
        },
      ],
    },
    'apoc.export.graphml.query': {
      label: 'apoc.export.graphml.query',
      documentation:
        'Exports the given `NODE` and `RELATIONSHIP` values from the Cypher statement to the provided GraphML file.',
      parameters: [
        {
          label: 'statement',
          documentation: 'statement :: STRING',
        },
        {
          label: 'file',
          documentation: 'file :: STRING',
        },
        {
          label: 'config',
          documentation: 'config :: MAP',
        },
      ],
    },
    'apoc.export.json.all': {
      label: 'apoc.export.json.all',
      documentation: 'Exports the full database to the provided JSON file.',
      parameters: [
        {
          label: 'file',
          documentation: 'file :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.export.json.data': {
      label: 'apoc.export.json.data',
      documentation:
        'Exports the given `NODE` and `RELATIONSHIP` values to the provided JSON file.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST<NODE>',
        },
        {
          label: 'rels',
          documentation: 'rels :: LIST<RELATIONSHIP>',
        },
        {
          label: 'file',
          documentation: 'file :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.export.json.graph': {
      label: 'apoc.export.json.graph',
      documentation: 'Exports the given graph to the provided JSON file.',
      parameters: [
        {
          label: 'graph',
          documentation: 'graph :: MAP',
        },
        {
          label: 'file',
          documentation: 'file :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.export.json.query': {
      label: 'apoc.export.json.query',
      documentation:
        'Exports the results from the Cypher statement to the provided JSON file.',
      parameters: [
        {
          label: 'statement',
          documentation: 'statement :: STRING',
        },
        {
          label: 'file',
          documentation: 'file :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.graph.from': {
      label: 'apoc.graph.from',
      documentation:
        'Generates a virtual sub-graph by extracting all of the `NODE` and `RELATIONSHIP` values from the given data.',
      parameters: [
        {
          label: 'data',
          documentation: 'data :: ANY',
        },
        {
          label: 'name',
          documentation: 'name :: STRING',
        },
        {
          label: 'props',
          documentation: 'props :: MAP',
        },
      ],
    },
    'apoc.graph.fromCypher': {
      label: 'apoc.graph.fromCypher',
      documentation:
        'Generates a virtual sub-graph by extracting all of the `NODE` and `RELATIONSHIP` values from the data returned by the given Cypher statement.',
      parameters: [
        {
          label: 'statement',
          documentation: 'statement :: STRING',
        },
        {
          label: 'params',
          documentation: 'params :: MAP',
        },
        {
          label: 'name',
          documentation: 'name :: STRING',
        },
        {
          label: 'props',
          documentation: 'props :: MAP',
        },
      ],
    },
    'apoc.graph.fromDB': {
      label: 'apoc.graph.fromDB',
      documentation:
        'Generates a virtual sub-graph by extracting all of the `NODE` and `RELATIONSHIP` values from the data returned by the given database.',
      parameters: [
        {
          label: 'name',
          documentation: 'name :: STRING',
        },
        {
          label: 'props',
          documentation: 'props :: MAP',
        },
      ],
    },
    'apoc.graph.fromData': {
      label: 'apoc.graph.fromData',
      documentation:
        'Generates a virtual sub-graph by extracting all of the `NODE` and `RELATIONSHIP` values from the given data.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST<NODE>',
        },
        {
          label: 'rels',
          documentation: 'rels :: LIST<RELATIONSHIP>',
        },
        {
          label: 'name',
          documentation: 'name :: STRING',
        },
        {
          label: 'props',
          documentation: 'props :: MAP',
        },
      ],
    },
    'apoc.graph.fromDocument': {
      label: 'apoc.graph.fromDocument',
      documentation:
        'Generates a virtual sub-graph by extracting all of the `NODE` and `RELATIONSHIP` values from the data returned by the given JSON file.',
      parameters: [
        {
          label: 'json',
          documentation: 'json :: ANY',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.graph.fromPath': {
      label: 'apoc.graph.fromPath',
      documentation:
        'Generates a virtual sub-graph by extracting all of the `NODE` and `RELATIONSHIP` values from the data returned by the given `PATH`.',
      parameters: [
        {
          label: 'path',
          documentation: 'path :: PATH',
        },
        {
          label: 'name',
          documentation: 'name :: STRING',
        },
        {
          label: 'props',
          documentation: 'props :: MAP',
        },
      ],
    },
    'apoc.graph.fromPaths': {
      label: 'apoc.graph.fromPaths',
      documentation:
        'Generates a virtual sub-graph by extracting all of the `NODE` and `RELATIONSHIP` values from the data returned by the given `PATH` values.',
      parameters: [
        {
          label: 'paths',
          documentation: 'paths :: LIST<PATH>',
        },
        {
          label: 'name',
          documentation: 'name :: STRING',
        },
        {
          label: 'props',
          documentation: 'props :: MAP',
        },
      ],
    },
    'apoc.graph.validateDocument': {
      label: 'apoc.graph.validateDocument',
      documentation:
        'Validates the JSON file and returns the result of the validation.',
      parameters: [
        {
          label: 'json',
          documentation: 'json :: ANY',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.help': {
      label: 'apoc.help',
      documentation:
        'Returns descriptions of the available APOC procedures and functions. If a keyword is provided, it will return only those procedures and functions that have the keyword in their name.',
      parameters: [
        {
          label: 'proc',
          documentation: 'proc :: STRING',
        },
      ],
    },
    'apoc.import.csv': {
      label: 'apoc.import.csv',
      documentation:
        'Imports `NODE` and `RELATIONSHIP` values with the given labels and types from the provided CSV file.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST<MAP>',
        },
        {
          label: 'rels',
          documentation: 'rels :: LIST<MAP>',
        },
        {
          label: 'config',
          documentation: 'config :: MAP',
        },
      ],
    },
    'apoc.import.graphml': {
      label: 'apoc.import.graphml',
      documentation: 'Imports a graph from the provided GraphML file.',
      parameters: [
        {
          label: 'urlOrBinaryFile',
          documentation: 'urlOrBinaryFile :: ANY',
        },
        {
          label: 'config',
          documentation: 'config :: MAP',
        },
      ],
    },
    'apoc.import.json': {
      label: 'apoc.import.json',
      documentation: 'Imports a graph from the provided JSON file.',
      parameters: [
        {
          label: 'urlOrBinaryFile',
          documentation: 'urlOrBinaryFile :: ANY',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.import.xml': {
      label: 'apoc.import.xml',
      documentation: 'Imports a graph from the provided XML file.',
      parameters: [
        {
          label: 'urlOrBinary',
          documentation: 'urlOrBinary :: ANY',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.load.arrow': {
      label: 'apoc.load.arrow',
      documentation:
        'Imports `NODE` and `RELATIONSHIP` values from the provided arrow file.',
      parameters: [
        {
          label: 'file',
          documentation: 'file :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.load.arrow.stream': {
      label: 'apoc.load.arrow.stream',
      documentation:
        'Imports `NODE` and `RELATIONSHIP` values from the provided arrow byte array.',
      parameters: [
        {
          label: 'source',
          documentation: 'source :: BYTEARRAY',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.load.json': {
      label: 'apoc.load.json',
      documentation:
        'Imports JSON file as a stream of values if the given JSON file is a `LIST<ANY>`.\nIf the given JSON file is a `MAP`, this procedure imports a single value instead.',
      parameters: [
        {
          label: 'urlOrKeyOrBinary',
          documentation: 'urlOrKeyOrBinary :: ANY',
        },
        {
          label: 'path',
          documentation: 'path =  :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.load.jsonArray': {
      label: 'apoc.load.jsonArray',
      documentation:
        'Loads array from a JSON URL (e.g. web-API) to then import the given JSON file as a stream of values.',
      parameters: [
        {
          label: 'url',
          documentation: 'url :: STRING',
        },
        {
          label: 'path',
          documentation: 'path =  :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.load.jsonParams': {
      label: 'apoc.load.jsonParams',
      documentation:
        'Loads parameters from a JSON URL (e.g. web-API) as a stream of values if the given JSON file is a `LIST<ANY>`.\nIf the given JSON file is a `MAP`, this procedure imports a single value instead.',
      parameters: [
        {
          label: 'urlOrKeyOrBinary',
          documentation: 'urlOrKeyOrBinary :: ANY',
        },
        {
          label: 'headers',
          documentation: 'headers :: MAP',
        },
        {
          label: 'payload',
          documentation: 'payload :: STRING',
        },
        {
          label: 'path',
          documentation: 'path =  :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.load.xml': {
      label: 'apoc.load.xml',
      documentation:
        'Loads a single nested `MAP` from an XML URL (e.g. web-API).',
      parameters: [
        {
          label: 'urlOrBinary',
          documentation: 'urlOrBinary :: ANY',
        },
        {
          label: 'path',
          documentation: 'path = / :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
        {
          label: 'simple',
          documentation: 'simple = false :: BOOLEAN',
        },
      ],
    },
    'apoc.lock.all': {
      label: 'apoc.lock.all',
      documentation:
        'Acquires a write lock on the given `NODE` and `RELATIONSHIP` values.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST<NODE>',
        },
        {
          label: 'rels',
          documentation: 'rels :: LIST<RELATIONSHIP>',
        },
      ],
    },
    'apoc.lock.nodes': {
      label: 'apoc.lock.nodes',
      documentation: 'Acquires a write lock on the given `NODE` values.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST<NODE>',
        },
      ],
    },
    'apoc.lock.read.nodes': {
      label: 'apoc.lock.read.nodes',
      documentation: 'Acquires a read lock on the given `NODE` values.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST<NODE>',
        },
      ],
    },
    'apoc.lock.read.rels': {
      label: 'apoc.lock.read.rels',
      documentation: 'Acquires a read lock on the given `RELATIONSHIP` values.',
      parameters: [
        {
          label: 'rels',
          documentation: 'rels :: LIST<RELATIONSHIP>',
        },
      ],
    },
    'apoc.lock.rels': {
      label: 'apoc.lock.rels',
      documentation:
        'Acquires a write lock on the given `RELATIONSHIP` values.',
      parameters: [
        {
          label: 'rels',
          documentation: 'rels :: LIST<RELATIONSHIP>',
        },
      ],
    },
    'apoc.log.stream': {
      label: 'apoc.log.stream',
      documentation:
        'Returns the file contents from the given log, optionally returning only the last n lines.\nThis procedure requires users to have an admin role.',
      parameters: [
        {
          label: 'path',
          documentation: 'path :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.math.regr': {
      label: 'apoc.math.regr',
      documentation:
        'Returns the coefficient of determination (R-squared) for the values of propertyY and propertyX in the given label.',
      parameters: [
        {
          label: 'label',
          documentation: 'label :: STRING',
        },
        {
          label: 'propertyY',
          documentation: 'propertyY :: STRING',
        },
        {
          label: 'propertyX',
          documentation: 'propertyX :: STRING',
        },
      ],
    },
    'apoc.merge.node': {
      label: 'apoc.merge.node',
      documentation:
        'Merges the given `NODE` values with the given dynamic labels.',
      parameters: [
        {
          label: 'labels',
          documentation: 'labels :: LIST<STRING>',
        },
        {
          label: 'identProps',
          documentation: 'identProps :: MAP',
        },
        {
          label: 'onCreateProps',
          documentation: 'onCreateProps = {} :: MAP',
        },
        {
          label: 'onMatchProps',
          documentation: 'onMatchProps = {} :: MAP',
        },
      ],
    },
    'apoc.merge.node.eager': {
      label: 'apoc.merge.node.eager',
      documentation:
        'Merges the given `NODE` values with the given dynamic labels eagerly.',
      parameters: [
        {
          label: 'labels',
          documentation: 'labels :: LIST<STRING>',
        },
        {
          label: 'identProps',
          documentation: 'identProps :: MAP',
        },
        {
          label: 'onCreateProps',
          documentation: 'onCreateProps = {} :: MAP',
        },
        {
          label: 'onMatchProps',
          documentation: 'onMatchProps = {} :: MAP',
        },
      ],
    },
    'apoc.merge.nodeWithStats': {
      label: 'apoc.merge.nodeWithStats',
      documentation:
        'Merges the given `NODE` values with the given dynamic labels. Provides queryStatistics in the result.',
      parameters: [
        {
          label: 'labels',
          documentation: 'labels :: LIST<STRING>',
        },
        {
          label: 'identProps',
          documentation: 'identProps :: MAP',
        },
        {
          label: 'onCreateProps',
          documentation: 'onCreateProps = {} :: MAP',
        },
        {
          label: 'onMatchProps',
          documentation: 'onMatchProps = {} :: MAP',
        },
      ],
    },
    'apoc.merge.nodeWithStats.eager': {
      label: 'apoc.merge.nodeWithStats.eager',
      documentation:
        'Merges the given `NODE` values with the given dynamic labels eagerly. Provides queryStatistics in the result.',
      parameters: [
        {
          label: 'labels',
          documentation: 'labels :: LIST<STRING>',
        },
        {
          label: 'identProps',
          documentation: 'identProps :: MAP',
        },
        {
          label: 'onCreateProps',
          documentation: 'onCreateProps = {} :: MAP',
        },
        {
          label: 'onMatchProps',
          documentation: 'onMatchProps = {} :: MAP',
        },
      ],
    },
    'apoc.merge.relationship': {
      label: 'apoc.merge.relationship',
      documentation:
        'Merges the given `RELATIONSHIP` values with the given dynamic types/properties.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: NODE',
        },
        {
          label: 'relType',
          documentation: 'relType :: STRING',
        },
        {
          label: 'identProps',
          documentation: 'identProps :: MAP',
        },
        {
          label: 'onCreateProps',
          documentation: 'onCreateProps :: MAP',
        },
        {
          label: 'endNode',
          documentation: 'endNode :: NODE',
        },
        {
          label: 'onMatchProps',
          documentation: 'onMatchProps = {} :: MAP',
        },
      ],
    },
    'apoc.merge.relationship.eager': {
      label: 'apoc.merge.relationship.eager',
      documentation:
        'Merges the given `RELATIONSHIP` values with the given dynamic types/properties eagerly.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: NODE',
        },
        {
          label: 'relType',
          documentation: 'relType :: STRING',
        },
        {
          label: 'identProps',
          documentation: 'identProps :: MAP',
        },
        {
          label: 'onCreateProps',
          documentation: 'onCreateProps :: MAP',
        },
        {
          label: 'endNode',
          documentation: 'endNode :: NODE',
        },
        {
          label: 'onMatchProps',
          documentation: 'onMatchProps = {} :: MAP',
        },
      ],
    },
    'apoc.merge.relationshipWithStats': {
      label: 'apoc.merge.relationshipWithStats',
      documentation:
        'Merges the given `RELATIONSHIP` values with the given dynamic types/properties. Provides queryStatistics in the result.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: NODE',
        },
        {
          label: 'relType',
          documentation: 'relType :: STRING',
        },
        {
          label: 'identProps',
          documentation: 'identProps :: MAP',
        },
        {
          label: 'onCreateProps',
          documentation: 'onCreateProps :: MAP',
        },
        {
          label: 'endNode',
          documentation: 'endNode :: NODE',
        },
        {
          label: 'onMatchProps',
          documentation: 'onMatchProps = {} :: MAP',
        },
      ],
    },
    'apoc.merge.relationshipWithStats.eager': {
      label: 'apoc.merge.relationshipWithStats.eager',
      documentation:
        'Merges the given `RELATIONSHIP` values with the given dynamic types/properties eagerly. Provides queryStatistics in the result.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: NODE',
        },
        {
          label: 'relType',
          documentation: 'relType :: STRING',
        },
        {
          label: 'identProps',
          documentation: 'identProps :: MAP',
        },
        {
          label: 'onCreateProps',
          documentation: 'onCreateProps :: MAP',
        },
        {
          label: 'endNode',
          documentation: 'endNode :: NODE',
        },
        {
          label: 'onMatchProps',
          documentation: 'onMatchProps = {} :: MAP',
        },
      ],
    },
    'apoc.meta.data': {
      label: 'apoc.meta.data',
      documentation: 'Examines the full graph and returns a table of metadata.',
      parameters: [
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.meta.data.of': {
      label: 'apoc.meta.data.of',
      documentation:
        'Examines the given sub-graph and returns a table of metadata.',
      parameters: [
        {
          label: 'graph',
          documentation: 'graph :: ANY',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.meta.graph': {
      label: 'apoc.meta.graph',
      documentation: 'Examines the full graph and returns a meta-graph.',
      parameters: [
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.meta.graph.of': {
      label: 'apoc.meta.graph.of',
      documentation: 'Examines the given sub-graph and returns a meta-graph.',
      parameters: [
        {
          label: 'graph',
          documentation: 'graph = {} :: ANY',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.meta.graphSample': {
      label: 'apoc.meta.graphSample',
      documentation:
        'Examines the full graph and returns a meta-graph.\nUnlike `apoc.meta.graph`, this procedure does not filter away non-existing paths.',
      parameters: [
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.meta.nodeTypeProperties': {
      label: 'apoc.meta.nodeTypeProperties',
      documentation:
        'Examines the full graph and returns a table of metadata with information about the `NODE` values therein.',
      parameters: [
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.meta.relTypeProperties': {
      label: 'apoc.meta.relTypeProperties',
      documentation:
        'Examines the full graph and returns a table of metadata with information about the `RELATIONSHIP` values therein.',
      parameters: [
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.meta.schema': {
      label: 'apoc.meta.schema',
      documentation:
        'Examines the given sub-graph and returns metadata as a `MAP`.',
      parameters: [
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.meta.stats': {
      label: 'apoc.meta.stats',
      documentation:
        'Returns the metadata stored in the transactional database statistics.',
      parameters: [],
    },
    'apoc.meta.subGraph': {
      label: 'apoc.meta.subGraph',
      documentation: 'Examines the given sub-graph and returns a meta-graph.',
      parameters: [
        {
          label: 'config',
          documentation: 'config :: MAP',
        },
      ],
    },
    'apoc.neighbors.athop': {
      label: 'apoc.neighbors.athop',
      documentation:
        'Returns all `NODE` values connected by the given `RELATIONSHIP` types at the specified distance.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING',
        },
        {
          label: 'distance',
          documentation: 'distance = 1 :: INTEGER',
        },
      ],
    },
    'apoc.neighbors.athop.count': {
      label: 'apoc.neighbors.athop.count',
      documentation:
        'Returns the count of all `NODE` values connected by the given `RELATIONSHIP` types at the specified distance.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING',
        },
        {
          label: 'distance',
          documentation: 'distance = 1 :: INTEGER',
        },
      ],
    },
    'apoc.neighbors.byhop': {
      label: 'apoc.neighbors.byhop',
      documentation:
        'Returns all `NODE` values connected by the given `RELATIONSHIP` types within the specified distance. Returns `LIST<NODE>` values, where each `PATH` of `NODE` values represents one row of the `LIST<NODE>` values.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING',
        },
        {
          label: 'distance',
          documentation: 'distance = 1 :: INTEGER',
        },
      ],
    },
    'apoc.neighbors.byhop.count': {
      label: 'apoc.neighbors.byhop.count',
      documentation:
        'Returns the count of all `NODE` values connected by the given `RELATIONSHIP` types within the specified distance.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING',
        },
        {
          label: 'distance',
          documentation: 'distance = 1 :: INTEGER',
        },
      ],
    },
    'apoc.neighbors.tohop': {
      label: 'apoc.neighbors.tohop',
      documentation:
        'Returns all `NODE` values connected by the given `RELATIONSHIP` types within the specified distance.\n`NODE` values are returned individually for each row.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING',
        },
        {
          label: 'distance',
          documentation: 'distance = 1 :: INTEGER',
        },
      ],
    },
    'apoc.neighbors.tohop.count': {
      label: 'apoc.neighbors.tohop.count',
      documentation:
        'Returns the count of all `NODE` values connected by the given `RELATIONSHIP` values in the pattern within the specified distance.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING',
        },
        {
          label: 'distance',
          documentation: 'distance = 1 :: INTEGER',
        },
      ],
    },
    'apoc.nodes.collapse': {
      label: 'apoc.nodes.collapse',
      documentation:
        'Merges `NODE` values together in the given `LIST<NODE>`.\nThe `NODE` values are then combined to become one `NODE`, with all labels of the previous `NODE` values attached to it, and all `RELATIONSHIP` values pointing to it.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST<NODE>',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.nodes.cycles': {
      label: 'apoc.nodes.cycles',
      documentation:
        'Detects all `PATH` cycles in the given `LIST<NODE>`.\nThis procedure can be limited on `RELATIONSHIP` values as well.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST<NODE>',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.nodes.delete': {
      label: 'apoc.nodes.delete',
      documentation: 'Deletes all `NODE` values with the given ids.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY',
        },
        {
          label: 'batchSize',
          documentation: 'batchSize :: INTEGER',
        },
      ],
    },
    'apoc.nodes.get': {
      label: 'apoc.nodes.get',
      documentation: 'Returns all `NODE` values with the given ids.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY',
        },
      ],
    },
    'apoc.nodes.group': {
      label: 'apoc.nodes.group',
      documentation:
        'Allows for the aggregation of `NODE` values based on the given properties.\nThis procedure returns virtual `NODE` values.',
      parameters: [
        {
          label: 'labels',
          documentation: 'labels :: LIST<STRING>',
        },
        {
          label: 'groupByProperties',
          documentation: 'groupByProperties :: LIST<STRING>',
        },
        {
          label: 'aggregations',
          documentation: 'aggregations = [{*=count}, {*=count}] :: LIST<MAP>',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.nodes.link': {
      label: 'apoc.nodes.link',
      documentation:
        'Creates a linked list of the given `NODE` values connected by the given `RELATIONSHIP` type.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST<NODE>',
        },
        {
          label: 'type',
          documentation: 'type :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.nodes.rels': {
      label: 'apoc.nodes.rels',
      documentation: 'Returns all `RELATIONSHIP` values with the given ids.',
      parameters: [
        {
          label: 'rels',
          documentation: 'rels :: ANY',
        },
      ],
    },
    'apoc.path.expand': {
      label: 'apoc.path.expand',
      documentation:
        'Returns `PATH` values expanded from the start `NODE` following the given `RELATIONSHIP` types from min-depth to max-depth.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: ANY',
        },
        {
          label: 'relFilter',
          documentation: 'relFilter :: STRING',
        },
        {
          label: 'labelFilter',
          documentation: 'labelFilter :: STRING',
        },
        {
          label: 'minDepth',
          documentation: 'minDepth :: INTEGER',
        },
        {
          label: 'maxDepth',
          documentation: 'maxDepth :: INTEGER',
        },
      ],
    },
    'apoc.path.expandConfig': {
      label: 'apoc.path.expandConfig',
      documentation:
        'Returns `PATH` values expanded from the start `NODE` with the given `RELATIONSHIP` types from min-depth to max-depth.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: ANY',
        },
        {
          label: 'config',
          documentation: 'config :: MAP',
        },
      ],
    },
    'apoc.path.spanningTree': {
      label: 'apoc.path.spanningTree',
      documentation:
        'Returns spanning tree `PATH` values expanded from the start `NODE` following the given `RELATIONSHIP` types to max-depth.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: ANY',
        },
        {
          label: 'config',
          documentation: 'config :: MAP',
        },
      ],
    },
    'apoc.path.subgraphAll': {
      label: 'apoc.path.subgraphAll',
      documentation:
        'Returns the sub-graph reachable from the start `NODE` following the given `RELATIONSHIP` types to max-depth.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: ANY',
        },
        {
          label: 'config',
          documentation: 'config :: MAP',
        },
      ],
    },
    'apoc.path.subgraphNodes': {
      label: 'apoc.path.subgraphNodes',
      documentation:
        'Returns the `NODE` values in the sub-graph reachable from the start `NODE` following the given `RELATIONSHIP` types to max-depth.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: ANY',
        },
        {
          label: 'config',
          documentation: 'config :: MAP',
        },
      ],
    },
    'apoc.periodic.cancel': {
      label: 'apoc.periodic.cancel',
      documentation: 'Cancels the given background job.',
      parameters: [
        {
          label: 'name',
          documentation: 'name :: STRING',
        },
      ],
    },
    'apoc.periodic.commit': {
      label: 'apoc.periodic.commit',
      documentation:
        'Runs the given statement in separate batched transactions.',
      parameters: [
        {
          label: 'statement',
          documentation: 'statement :: STRING',
        },
        {
          label: 'params',
          documentation: 'params = {} :: MAP',
        },
      ],
    },
    'apoc.periodic.countdown': {
      label: 'apoc.periodic.countdown',
      documentation:
        'Runs a repeatedly called background statement until it returns 0.',
      parameters: [
        {
          label: 'name',
          documentation: 'name :: STRING',
        },
        {
          label: 'statement',
          documentation: 'statement :: STRING',
        },
        {
          label: 'delay',
          documentation: 'delay :: INTEGER',
        },
      ],
    },
    'apoc.periodic.iterate': {
      label: 'apoc.periodic.iterate',
      documentation:
        'Runs the second statement for each item returned by the first statement.\nThis procedure returns the number of batches and the total number of processed rows.',
      parameters: [
        {
          label: 'cypherIterate',
          documentation: 'cypherIterate :: STRING',
        },
        {
          label: 'cypherAction',
          documentation: 'cypherAction :: STRING',
        },
        {
          label: 'config',
          documentation: 'config :: MAP',
        },
      ],
    },
    'apoc.periodic.list': {
      label: 'apoc.periodic.list',
      documentation: 'Returns a `LIST<ANY>` of all background jobs.',
      parameters: [],
    },
    'apoc.periodic.repeat': {
      label: 'apoc.periodic.repeat',
      documentation:
        'Runs a repeatedly called background job.\nTo stop this procedure, use `apoc.periodic.cancel`.',
      parameters: [
        {
          label: 'name',
          documentation: 'name :: STRING',
        },
        {
          label: 'statement',
          documentation: 'statement :: STRING',
        },
        {
          label: 'rate',
          documentation: 'rate :: INTEGER',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.periodic.submit': {
      label: 'apoc.periodic.submit',
      documentation:
        'Creates a background job which runs the given Cypher statement once.',
      parameters: [
        {
          label: 'name',
          documentation: 'name :: STRING',
        },
        {
          label: 'statement',
          documentation: 'statement :: STRING',
        },
        {
          label: 'params',
          documentation: 'params = {} :: MAP',
        },
      ],
    },
    'apoc.periodic.truncate': {
      label: 'apoc.periodic.truncate',
      documentation:
        'Removes all entities (and optionally indexes and constraints) from the database using the `apoc.periodic.iterate` procedure.',
      parameters: [
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.refactor.categorize': {
      label: 'apoc.refactor.categorize',
      documentation:
        'Creates new category `NODE` values from `NODE` values in the graph with the specified `sourceKey` as one of its property keys.\nThe new category `NODE` values are then connected to the original `NODE` values with a `RELATIONSHIP` of the given type.',
      parameters: [
        {
          label: 'sourceKey',
          documentation: 'sourceKey :: STRING',
        },
        {
          label: 'type',
          documentation: 'type :: STRING',
        },
        {
          label: 'outgoing',
          documentation: 'outgoing :: BOOLEAN',
        },
        {
          label: 'label',
          documentation: 'label :: STRING',
        },
        {
          label: 'targetKey',
          documentation: 'targetKey :: STRING',
        },
        {
          label: 'copiedKeys',
          documentation: 'copiedKeys :: LIST<STRING>',
        },
        {
          label: 'batchSize',
          documentation: 'batchSize :: INTEGER',
        },
      ],
    },
    'apoc.refactor.cloneNodes': {
      label: 'apoc.refactor.cloneNodes',
      documentation:
        'Clones the given `NODE` values with their labels and properties.\nIt is possible to skip any `NODE` properties using skipProperties (note: this only skips properties on `NODE` values and not their `RELATIONSHIP` values).',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST<NODE>',
        },
        {
          label: 'withRelationships',
          documentation: 'withRelationships = false :: BOOLEAN',
        },
        {
          label: 'skipProperties',
          documentation: 'skipProperties = [] :: LIST<STRING>',
        },
      ],
    },
    'apoc.refactor.cloneSubgraph': {
      label: 'apoc.refactor.cloneSubgraph',
      documentation:
        'Clones the given `NODE` values with their labels and properties (optionally skipping any properties in the `skipProperties` `LIST<STRING>` via the config `MAP`), and clones the given `RELATIONSHIP` values.\nIf no `RELATIONSHIP` values are provided, all existing `RELATIONSHIP` values between the given `NODE` values will be cloned.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST<NODE>',
        },
        {
          label: 'rels',
          documentation: 'rels = [] :: LIST<RELATIONSHIP>',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.refactor.cloneSubgraphFromPaths': {
      label: 'apoc.refactor.cloneSubgraphFromPaths',
      documentation:
        'Clones a sub-graph defined by the given `LIST<PATH>` values.\nIt is possible to skip any `NODE` properties using the `skipProperties` `LIST<STRING>` via the config `MAP`.',
      parameters: [
        {
          label: 'paths',
          documentation: 'paths :: LIST<PATH>',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.refactor.collapseNode': {
      label: 'apoc.refactor.collapseNode',
      documentation:
        'Collapses the given `NODE` and replaces it with a `RELATIONSHIP` of the given type.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY',
        },
        {
          label: 'relType',
          documentation: 'relType :: STRING',
        },
      ],
    },
    'apoc.refactor.deleteAndReconnect': {
      label: 'apoc.refactor.deleteAndReconnect',
      documentation:
        'Removes the given `NODE` values from the `PATH` and reconnects the remaining `NODE` values.',
      parameters: [
        {
          label: 'path',
          documentation: 'path :: PATH',
        },
        {
          label: 'nodes',
          documentation: 'nodes :: LIST<NODE>',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.refactor.extractNode': {
      label: 'apoc.refactor.extractNode',
      documentation:
        'Expands the given `RELATIONSHIP` VALUES into intermediate `NODE` VALUES.\nThe intermediate `NODE` values are connected by the given `outType` and `inType`.',
      parameters: [
        {
          label: 'rels',
          documentation: 'rels :: ANY',
        },
        {
          label: 'labels',
          documentation: 'labels :: LIST<STRING>',
        },
        {
          label: 'outType',
          documentation: 'outType :: STRING',
        },
        {
          label: 'inType',
          documentation: 'inType :: STRING',
        },
      ],
    },
    'apoc.refactor.from': {
      label: 'apoc.refactor.from',
      documentation:
        'Redirects the given `RELATIONSHIP` to the given start `NODE`.',
      parameters: [
        {
          label: 'rel',
          documentation: 'rel :: RELATIONSHIP',
        },
        {
          label: 'newNode',
          documentation: 'newNode :: NODE',
        },
      ],
    },
    'apoc.refactor.invert': {
      label: 'apoc.refactor.invert',
      documentation: 'Inverts the direction of the given `RELATIONSHIP`.',
      parameters: [
        {
          label: 'rel',
          documentation: 'rel :: RELATIONSHIP',
        },
      ],
    },
    'apoc.refactor.mergeNodes': {
      label: 'apoc.refactor.mergeNodes',
      documentation:
        'Merges the given `LIST<NODE>` onto the first `NODE` in the `LIST<NODE>`.\nAll `RELATIONSHIP` values are merged onto that `NODE` as well.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST<NODE>',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.refactor.mergeRelationships': {
      label: 'apoc.refactor.mergeRelationships',
      documentation:
        'Merges the given `LIST<RELATIONSHIP>` onto the first `RELATIONSHIP` in the `LIST<RELATIONSHIP>`.',
      parameters: [
        {
          label: 'rels',
          documentation: 'rels :: LIST<RELATIONSHIP>',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.refactor.normalizeAsBoolean': {
      label: 'apoc.refactor.normalizeAsBoolean',
      documentation: 'Refactors the given property to a `BOOLEAN`.',
      parameters: [
        {
          label: 'entity',
          documentation: 'entity :: ANY',
        },
        {
          label: 'propertyKey',
          documentation: 'propertyKey :: STRING',
        },
        {
          label: 'trueValues',
          documentation: 'trueValues :: LIST<ANY>',
        },
        {
          label: 'falseValues',
          documentation: 'falseValues :: LIST<ANY>',
        },
      ],
    },
    'apoc.refactor.rename.label': {
      label: 'apoc.refactor.rename.label',
      documentation:
        'Renames the given label from `oldLabel` to `newLabel` for all `NODE` values.\nIf a `LIST<NODE>` is provided, the renaming is applied to the `NODE` values within this `LIST<NODE>` only.',
      parameters: [
        {
          label: 'oldLabel',
          documentation: 'oldLabel :: STRING',
        },
        {
          label: 'newLabel',
          documentation: 'newLabel :: STRING',
        },
        {
          label: 'nodes',
          documentation: 'nodes = [] :: LIST<NODE>',
        },
      ],
    },
    'apoc.refactor.rename.nodeProperty': {
      label: 'apoc.refactor.rename.nodeProperty',
      documentation:
        'Renames the given property from `oldName` to `newName` for all `NODE` values.\nIf a `LIST<NODE>` is provided, the renaming is applied to the `NODE` values within this `LIST<NODE>` only.',
      parameters: [
        {
          label: 'oldName',
          documentation: 'oldName :: STRING',
        },
        {
          label: 'newName',
          documentation: 'newName :: STRING',
        },
        {
          label: 'nodes',
          documentation: 'nodes = [] :: LIST<NODE>',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.refactor.rename.type': {
      label: 'apoc.refactor.rename.type',
      documentation:
        'Renames all `RELATIONSHIP` values with type `oldType` to `newType`.\nIf a `LIST<RELATIONSHIP>` is provided, the renaming is applied to the `RELATIONSHIP` values within this `LIST<RELATIONSHIP>` only.',
      parameters: [
        {
          label: 'oldType',
          documentation: 'oldType :: STRING',
        },
        {
          label: 'newType',
          documentation: 'newType :: STRING',
        },
        {
          label: 'rels',
          documentation: 'rels = [] :: LIST<RELATIONSHIP>',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.refactor.rename.typeProperty': {
      label: 'apoc.refactor.rename.typeProperty',
      documentation:
        'Renames the given property from `oldName` to `newName` for all `RELATIONSHIP` values.\nIf a `LIST<RELATIONSHIP>` is provided, the renaming is applied to the `RELATIONSHIP` values within this `LIST<RELATIONSHIP>` only.',
      parameters: [
        {
          label: 'oldName',
          documentation: 'oldName :: STRING',
        },
        {
          label: 'newName',
          documentation: 'newName :: STRING',
        },
        {
          label: 'rels',
          documentation: 'rels = [] :: LIST<RELATIONSHIP>',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.refactor.setType': {
      label: 'apoc.refactor.setType',
      documentation: 'Changes the type of the given `RELATIONSHIP`.',
      parameters: [
        {
          label: 'rel',
          documentation: 'rel :: RELATIONSHIP',
        },
        {
          label: 'newType',
          documentation: 'newType :: STRING',
        },
      ],
    },
    'apoc.refactor.to': {
      label: 'apoc.refactor.to',
      documentation:
        'Redirects the given `RELATIONSHIP` to the given end `NODE`.',
      parameters: [
        {
          label: 'rel',
          documentation: 'rel :: RELATIONSHIP',
        },
        {
          label: 'endNode',
          documentation: 'endNode :: NODE',
        },
      ],
    },
    'apoc.schema.assert': {
      label: 'apoc.schema.assert',
      documentation:
        'Drops all other existing indexes and constraints when `dropExisting` is `true` (default is `true`).\nAsserts at the end of the operation that the given indexes and unique constraints are there.',
      parameters: [
        {
          label: 'indexes',
          documentation: 'indexes :: MAP',
        },
        {
          label: 'constraints',
          documentation: 'constraints :: MAP',
        },
        {
          label: 'dropExisting',
          documentation: 'dropExisting = true :: BOOLEAN',
        },
      ],
    },
    'apoc.schema.nodes': {
      label: 'apoc.schema.nodes',
      documentation:
        'Returns all indexes and constraints information for all `NODE` labels in the database.\nIt is possible to define a set of labels to include or exclude in the config parameters.',
      parameters: [
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.schema.properties.distinct': {
      label: 'apoc.schema.properties.distinct',
      documentation:
        'Returns all distinct `NODE` property values for the given key.',
      parameters: [
        {
          label: 'label',
          documentation: 'label :: STRING',
        },
        {
          label: 'key',
          documentation: 'key :: STRING',
        },
      ],
    },
    'apoc.schema.properties.distinctCount': {
      label: 'apoc.schema.properties.distinctCount',
      documentation:
        'Returns all distinct property values and counts for the given key.',
      parameters: [
        {
          label: 'label',
          documentation: 'label =  :: STRING',
        },
        {
          label: 'key',
          documentation: 'key =  :: STRING',
        },
      ],
    },
    'apoc.schema.relationships': {
      label: 'apoc.schema.relationships',
      documentation:
        'Returns the indexes and constraints information for all the relationship types in the database.\nIt is possible to define a set of relationship types to include or exclude in the config parameters.',
      parameters: [
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.search.multiSearchReduced': {
      label: 'apoc.search.multiSearchReduced',
      documentation:
        'Returns a reduced representation of the `NODE` values found after a parallel search over multiple indexes.\nThe reduced `NODE` values representation includes: node id, node labels, and the searched properties.',
      parameters: [
        {
          label: 'labelPropertyMap',
          documentation: 'labelPropertyMap :: ANY',
        },
        {
          label: 'operator',
          documentation: 'operator :: STRING',
        },
        {
          label: 'value',
          documentation: 'value :: STRING',
        },
      ],
    },
    'apoc.search.node': {
      label: 'apoc.search.node',
      documentation:
        'Returns all the distinct `NODE` values found after a parallel search over multiple indexes.',
      parameters: [
        {
          label: 'labelPropertyMap',
          documentation: 'labelPropertyMap :: ANY',
        },
        {
          label: 'operator',
          documentation: 'operator :: STRING',
        },
        {
          label: 'value',
          documentation: 'value :: STRING',
        },
      ],
    },
    'apoc.search.nodeAll': {
      label: 'apoc.search.nodeAll',
      documentation:
        'Returns all the `NODE` values found after a parallel search over multiple indexes.',
      parameters: [
        {
          label: 'labelPropertyMap',
          documentation: 'labelPropertyMap :: ANY',
        },
        {
          label: 'operator',
          documentation: 'operator :: STRING',
        },
        {
          label: 'value',
          documentation: 'value :: STRING',
        },
      ],
    },
    'apoc.search.nodeAllReduced': {
      label: 'apoc.search.nodeAllReduced',
      documentation:
        'Returns a reduced representation of the `NODE` values found after a parallel search over multiple indexes.\nThe reduced `NODE` values representation includes: node id, node labels, and the searched properties.',
      parameters: [
        {
          label: 'labelPropertyMap',
          documentation: 'labelPropertyMap :: ANY',
        },
        {
          label: 'operator',
          documentation: 'operator :: STRING',
        },
        {
          label: 'value',
          documentation: 'value :: ANY',
        },
      ],
    },
    'apoc.search.nodeReduced': {
      label: 'apoc.search.nodeReduced',
      documentation:
        'Returns a reduced representation of the distinct `NODE` values found after a parallel search over multiple indexes.\nThe reduced `NODE` values representation includes: node id, node labels, and the searched properties.',
      parameters: [
        {
          label: 'labelPropertyMap',
          documentation: 'labelPropertyMap :: ANY',
        },
        {
          label: 'operator',
          documentation: 'operator :: STRING',
        },
        {
          label: 'value',
          documentation: 'value :: STRING',
        },
      ],
    },
    'apoc.spatial.geocode': {
      label: 'apoc.spatial.geocode',
      documentation:
        'Returns the geographic location (latitude, longitude, and description) of the given address using a geocoding service (default: OpenStreetMap).',
      parameters: [
        {
          label: 'location',
          documentation: 'location :: STRING',
        },
        {
          label: 'maxResults',
          documentation: 'maxResults = 100 :: INTEGER',
        },
        {
          label: 'quotaException',
          documentation: 'quotaException = false :: BOOLEAN',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.spatial.geocodeOnce': {
      label: 'apoc.spatial.geocodeOnce',
      documentation:
        'Returns the geographic location (latitude, longitude, and description) of the given address using a geocoding service (default: OpenStreetMap).\nThis procedure returns at most one result.',
      parameters: [
        {
          label: 'location',
          documentation: 'location :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.spatial.reverseGeocode': {
      label: 'apoc.spatial.reverseGeocode',
      documentation:
        'Returns a textual address from the given geographic location (latitude, longitude) using a geocoding service (default: OpenStreetMap).\nThis procedure returns at most one result.',
      parameters: [
        {
          label: 'latitude',
          documentation: 'latitude :: FLOAT',
        },
        {
          label: 'longitude',
          documentation: 'longitude :: FLOAT',
        },
        {
          label: 'quotaException',
          documentation: 'quotaException = false :: BOOLEAN',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.spatial.sortByDistance': {
      label: 'apoc.spatial.sortByDistance',
      documentation:
        'Sorts the given collection of `PATH` values by the sum of their distance based on the latitude/longitude values in the `NODE` values.',
      parameters: [
        {
          label: 'paths',
          documentation: 'paths :: LIST<PATH>',
        },
      ],
    },
    'apoc.stats.degrees': {
      label: 'apoc.stats.degrees',
      documentation:
        'Returns the percentile groupings of the degrees on the `NODE` values connected by the given `RELATIONSHIP` types.',
      parameters: [
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING',
        },
      ],
    },
    'apoc.text.phoneticDelta': {
      label: 'apoc.text.phoneticDelta',
      documentation:
        'Returns the US_ENGLISH soundex character difference between the two given `STRING` values.',
      parameters: [
        {
          label: 'text1',
          documentation: 'text1 :: STRING',
        },
        {
          label: 'text2',
          documentation: 'text2 :: STRING',
        },
      ],
    },
    'apoc.trigger.add': {
      label: 'apoc.trigger.add',
      documentation:
        "Adds a trigger to the given Cypher statement.\nThe selector for this procedure is {phase:'before/after/rollback/afterAsync'}.",
      parameters: [
        {
          label: 'name',
          documentation: 'name :: STRING',
        },
        {
          label: 'statement',
          documentation: 'statement :: STRING',
        },
        {
          label: 'selector',
          documentation: 'selector :: MAP',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.trigger.drop': {
      label: 'apoc.trigger.drop',
      documentation: 'Eventually removes the given trigger.',
      parameters: [
        {
          label: 'databaseName',
          documentation: 'databaseName :: STRING',
        },
        {
          label: 'name',
          documentation: 'name :: STRING',
        },
      ],
    },
    'apoc.trigger.dropAll': {
      label: 'apoc.trigger.dropAll',
      documentation: 'Eventually removes all triggers from the given database.',
      parameters: [
        {
          label: 'databaseName',
          documentation: 'databaseName :: STRING',
        },
      ],
    },
    'apoc.trigger.install': {
      label: 'apoc.trigger.install',
      documentation:
        'Eventually adds a trigger for a given database which is invoked when a successful transaction occurs.',
      parameters: [
        {
          label: 'databaseName',
          documentation: 'databaseName :: STRING',
        },
        {
          label: 'name',
          documentation: 'name :: STRING',
        },
        {
          label: 'statement',
          documentation: 'statement :: STRING',
        },
        {
          label: 'selector',
          documentation: 'selector :: MAP',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'apoc.trigger.list': {
      label: 'apoc.trigger.list',
      documentation:
        'Lists all currently installed triggers for the session database.',
      parameters: [],
    },
    'apoc.trigger.pause': {
      label: 'apoc.trigger.pause',
      documentation: 'Pauses the given trigger.',
      parameters: [
        {
          label: 'name',
          documentation: 'name :: STRING',
        },
      ],
    },
    'apoc.trigger.remove': {
      label: 'apoc.trigger.remove',
      documentation: 'Removes the given trigger.',
      parameters: [
        {
          label: 'name',
          documentation: 'name :: STRING',
        },
      ],
    },
    'apoc.trigger.removeAll': {
      label: 'apoc.trigger.removeAll',
      documentation: 'Removes all previously added triggers.',
      parameters: [],
    },
    'apoc.trigger.resume': {
      label: 'apoc.trigger.resume',
      documentation: 'Resumes the given paused trigger.',
      parameters: [
        {
          label: 'name',
          documentation: 'name :: STRING',
        },
      ],
    },
    'apoc.trigger.show': {
      label: 'apoc.trigger.show',
      documentation: 'Lists all eventually installed triggers for a database.',
      parameters: [
        {
          label: 'databaseName',
          documentation: 'databaseName :: STRING',
        },
      ],
    },
    'apoc.trigger.start': {
      label: 'apoc.trigger.start',
      documentation: 'Eventually restarts the given paused trigger.',
      parameters: [
        {
          label: 'databaseName',
          documentation: 'databaseName :: STRING',
        },
        {
          label: 'name',
          documentation: 'name :: STRING',
        },
      ],
    },
    'apoc.trigger.stop': {
      label: 'apoc.trigger.stop',
      documentation: 'Eventually stops the given trigger.',
      parameters: [
        {
          label: 'databaseName',
          documentation: 'databaseName :: STRING',
        },
        {
          label: 'name',
          documentation: 'name :: STRING',
        },
      ],
    },
    'apoc.util.sleep': {
      label: 'apoc.util.sleep',
      documentation:
        'Causes the currently running Cypher to sleep for the given duration of milliseconds (the transaction termination is honored).',
      parameters: [
        {
          label: 'duration',
          documentation: 'duration :: INTEGER',
        },
      ],
    },
    'apoc.util.validate': {
      label: 'apoc.util.validate',
      documentation: 'If the given predicate is true an exception is thrown.',
      parameters: [
        {
          label: 'predicate',
          documentation: 'predicate :: BOOLEAN',
        },
        {
          label: 'message',
          documentation: 'message :: STRING',
        },
        {
          label: 'params',
          documentation: 'params :: LIST<ANY>',
        },
      ],
    },
    'apoc.warmup.run': {
      label: 'apoc.warmup.run',
      documentation:
        'Loads all `NODE` and `RELATIONSHIP` values in the database into memory.',
      parameters: [
        {
          label: 'loadProperties',
          documentation: 'loadProperties = false :: BOOLEAN',
        },
        {
          label: 'loadDynamicProperties',
          documentation: 'loadDynamicProperties = false :: BOOLEAN',
        },
        {
          label: 'loadIndexes',
          documentation: 'loadIndexes = false :: BOOLEAN',
        },
      ],
    },
    'apoc.when': {
      label: 'apoc.when',
      documentation:
        'This procedure will run the read-only `ifQuery` if the conditional has evaluated to true, otherwise the `elseQuery` will run.',
      parameters: [
        {
          label: 'condition',
          documentation: 'condition :: BOOLEAN',
        },
        {
          label: 'ifQuery',
          documentation: 'ifQuery :: STRING',
        },
        {
          label: 'elseQuery',
          documentation: 'elseQuery =  :: STRING',
        },
        {
          label: 'params',
          documentation: 'params = {} :: MAP',
        },
      ],
    },
    'cdc.current': {
      label: 'cdc.current',
      documentation:
        'Returns the current change identifier that can be used to stream changes from.',
      parameters: [],
    },
    'cdc.earliest': {
      label: 'cdc.earliest',
      documentation:
        'Returns the earliest change identifier that can be used to stream changes from.',
      parameters: [],
    },
    'cdc.query': {
      label: 'cdc.query',
      documentation:
        'Query changes happened from the provided change identifier.',
      parameters: [
        {
          label: 'from',
          documentation: 'from =  :: STRING',
        },
        {
          label: 'selectors',
          documentation: 'selectors = [] :: LIST<MAP>',
        },
      ],
    },
    'db.awaitIndex': {
      label: 'db.awaitIndex',
      documentation:
        'Wait for an index to come online (for example: CALL db.awaitIndex("MyIndex", 300)).',
      parameters: [
        {
          label: 'indexName',
          documentation: 'indexName :: STRING',
        },
        {
          label: 'timeOutSeconds',
          documentation: 'timeOutSeconds = 300 :: INTEGER',
        },
      ],
    },
    'db.awaitIndexes': {
      label: 'db.awaitIndexes',
      documentation:
        'Wait for all indexes to come online (for example: CALL db.awaitIndexes(300)).',
      parameters: [
        {
          label: 'timeOutSeconds',
          documentation: 'timeOutSeconds = 300 :: INTEGER',
        },
      ],
    },
    'db.checkpoint': {
      label: 'db.checkpoint',
      documentation:
        'Initiate and wait for a new check point, or wait any already on-going check point to complete. Note that this temporarily disables the `db.checkpoint.iops.limit` setting in order to make the check point complete faster. This might cause transaction throughput to degrade slightly, due to increased IO load.',
      parameters: [],
    },
    'db.clearQueryCaches': {
      label: 'db.clearQueryCaches',
      documentation: 'Clears all query caches.',
      parameters: [],
    },
    'db.create.setNodeVectorProperty': {
      label: 'db.create.setNodeVectorProperty',
      documentation:
        "Set a vector property on a given node in a more space efficient representation than Cypher's SET.",
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE',
        },
        {
          label: 'key',
          documentation: 'key :: STRING',
        },
        {
          label: 'vector',
          documentation: 'vector :: LIST<FLOAT>',
        },
      ],
    },
    'db.create.setVectorProperty': {
      label: 'db.create.setVectorProperty',
      documentation:
        "Set a vector property on a given node in a more space efficient representation than Cypher's SET.",
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE',
        },
        {
          label: 'key',
          documentation: 'key :: STRING',
        },
        {
          label: 'vector',
          documentation: 'vector :: LIST<FLOAT>',
        },
      ],
    },
    'db.createLabel': {
      label: 'db.createLabel',
      documentation: 'Create a label',
      parameters: [
        {
          label: 'newLabel',
          documentation: 'newLabel :: STRING',
        },
      ],
    },
    'db.createProperty': {
      label: 'db.createProperty',
      documentation: 'Create a Property',
      parameters: [
        {
          label: 'newProperty',
          documentation: 'newProperty :: STRING',
        },
      ],
    },
    'db.createRelationshipType': {
      label: 'db.createRelationshipType',
      documentation: 'Create a RelationshipType',
      parameters: [
        {
          label: 'newRelationshipType',
          documentation: 'newRelationshipType :: STRING',
        },
      ],
    },
    'db.index.fulltext.awaitEventuallyConsistentIndexRefresh': {
      label: 'db.index.fulltext.awaitEventuallyConsistentIndexRefresh',
      documentation:
        'Wait for the updates from recently committed transactions to be applied to any eventually-consistent full-text indexes.',
      parameters: [],
    },
    'db.index.fulltext.listAvailableAnalyzers': {
      label: 'db.index.fulltext.listAvailableAnalyzers',
      documentation:
        'List the available analyzers that the full-text indexes can be configured with.',
      parameters: [],
    },
    'db.index.fulltext.queryNodes': {
      label: 'db.index.fulltext.queryNodes',
      documentation:
        "Query the given full-text index. Returns the matching nodes, and their Lucene query score, ordered by score. Valid keys for the options map are: 'skip' to skip the top N results; 'limit' to limit the number of results returned; 'analyzer' to use the specified analyzer as a search analyzer for this query.",
      parameters: [
        {
          label: 'indexName',
          documentation: 'indexName :: STRING',
        },
        {
          label: 'queryString',
          documentation: 'queryString :: STRING',
        },
        {
          label: 'options',
          documentation: 'options = {} :: MAP',
        },
      ],
    },
    'db.index.fulltext.queryRelationships': {
      label: 'db.index.fulltext.queryRelationships',
      documentation:
        "Query the given full-text index. Returns the matching relationships, and their Lucene query score, ordered by score. Valid keys for the options map are: 'skip' to skip the top N results; 'limit' to limit the number of results returned; 'analyzer' to use the specified analyzer as search analyzer for this query.",
      parameters: [
        {
          label: 'indexName',
          documentation: 'indexName :: STRING',
        },
        {
          label: 'queryString',
          documentation: 'queryString :: STRING',
        },
        {
          label: 'options',
          documentation: 'options = {} :: MAP',
        },
      ],
    },
    'db.index.vector.createNodeIndex': {
      label: 'db.index.vector.createNodeIndex',
      documentation:
        "Create a named node vector index for the given label and property for a specified vector dimensionality.\nValid similarity functions are 'EUCLIDEAN' and 'COSINE', and are case-insensitive.\nUse the `db.index.vector.queryNodes` procedure to query the named index.\n",
      parameters: [
        {
          label: 'indexName',
          documentation: 'indexName :: STRING',
        },
        {
          label: 'label',
          documentation: 'label :: STRING',
        },
        {
          label: 'propertyKey',
          documentation: 'propertyKey :: STRING',
        },
        {
          label: 'vectorDimension',
          documentation: 'vectorDimension :: INTEGER',
        },
        {
          label: 'vectorSimilarityFunction',
          documentation: 'vectorSimilarityFunction :: STRING',
        },
      ],
    },
    'db.index.vector.queryNodes': {
      label: 'db.index.vector.queryNodes',
      documentation:
        'Query the given vector index.\nReturns requested number of nearest neighbors to the provided query vector,\nand their similarity score to that query vector, based on the configured similarity function for the index.\nThe similarity score is a value between [0, 1]; where 0 indicates least similar, 1 most similar.\n',
      parameters: [
        {
          label: 'indexName',
          documentation: 'indexName :: STRING',
        },
        {
          label: 'numberOfNearestNeighbours',
          documentation: 'numberOfNearestNeighbours :: INTEGER',
        },
        {
          label: 'query',
          documentation: 'query :: LIST<FLOAT>',
        },
      ],
    },
    'db.info': {
      label: 'db.info',
      documentation: 'Provides information regarding the database.',
      parameters: [],
    },
    'db.labels': {
      label: 'db.labels',
      documentation:
        "List all labels attached to nodes within a database according to the user's access rights. The procedure returns empty results if the user is not authorized to view those labels.",
      parameters: [],
    },
    'db.listLocks': {
      label: 'db.listLocks',
      documentation: 'List all locks at this database.',
      parameters: [],
    },
    'db.ping': {
      label: 'db.ping',
      documentation:
        'This procedure can be used by client side tooling to test whether they are correctly connected to a database. The procedure is available in all databases and always returns true. A faulty connection can be detected by not being able to call this procedure.',
      parameters: [],
    },
    'db.prepareForReplanning': {
      label: 'db.prepareForReplanning',
      documentation:
        'Triggers an index resample and waits for it to complete, and after that clears query caches. After this procedure has finished queries will be planned using the latest database statistics.',
      parameters: [
        {
          label: 'timeOutSeconds',
          documentation: 'timeOutSeconds = 300 :: INTEGER',
        },
      ],
    },
    'db.propertyKeys': {
      label: 'db.propertyKeys',
      documentation: 'List all property keys in the database.',
      parameters: [],
    },
    'db.relationshipTypes': {
      label: 'db.relationshipTypes',
      documentation:
        "List all types attached to relationships within a database according to the user's access rights. The procedure returns empty results if the user is not authorized to view those relationship types.",
      parameters: [],
    },
    'db.resampleIndex': {
      label: 'db.resampleIndex',
      documentation:
        'Schedule resampling of an index (for example: CALL db.resampleIndex("MyIndex")).',
      parameters: [
        {
          label: 'indexName',
          documentation: 'indexName :: STRING',
        },
      ],
    },
    'db.resampleOutdatedIndexes': {
      label: 'db.resampleOutdatedIndexes',
      documentation: 'Schedule resampling of all outdated indexes.',
      parameters: [],
    },
    'db.schema.nodeTypeProperties': {
      label: 'db.schema.nodeTypeProperties',
      documentation:
        'Show the derived property schema of the nodes in tabular form.',
      parameters: [],
    },
    'db.schema.relTypeProperties': {
      label: 'db.schema.relTypeProperties',
      documentation:
        'Show the derived property schema of the relationships in tabular form.',
      parameters: [],
    },
    'db.schema.visualization': {
      label: 'db.schema.visualization',
      documentation:
        'Visualizes the schema of the data based on available statistics. A new node is returned for each label. The properties represented on the node include: `name` (label name), `indexes` (list of indexes), and `constraints` (list of constraints). A relationship of a given type is returned for all possible combinations of start and end nodes. The properties represented on the relationship include: `name` (type name). Note that this may include additional relationships that do not exist in the data due to the information available in the count store. ',
      parameters: [],
    },
    'db.stats.clear': {
      label: 'db.stats.clear',
      documentation:
        "Clear collected data of a given data section. Valid sections are 'QUERIES'",
      parameters: [
        {
          label: 'section',
          documentation: 'section :: STRING',
        },
      ],
    },
    'db.stats.collect': {
      label: 'db.stats.collect',
      documentation:
        "Start data collection of a given data section. Valid sections are 'QUERIES'",
      parameters: [
        {
          label: 'section',
          documentation: 'section :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'db.stats.retrieve': {
      label: 'db.stats.retrieve',
      documentation:
        "Retrieve statistical data about the current database. Valid sections are 'GRAPH COUNTS', 'TOKENS', 'QUERIES', 'META'",
      parameters: [
        {
          label: 'section',
          documentation: 'section :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'db.stats.retrieveAllAnonymized': {
      label: 'db.stats.retrieveAllAnonymized',
      documentation:
        'Retrieve all available statistical data about the current database, in an anonymized form.',
      parameters: [
        {
          label: 'graphToken',
          documentation: 'graphToken :: STRING',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP',
        },
      ],
    },
    'db.stats.status': {
      label: 'db.stats.status',
      documentation:
        'Retrieve the status of all available collector daemons, for this database.',
      parameters: [],
    },
    'db.stats.stop': {
      label: 'db.stats.stop',
      documentation:
        "Stop data collection of a given data section. Valid sections are 'QUERIES'",
      parameters: [
        {
          label: 'section',
          documentation: 'section :: STRING',
        },
      ],
    },
    'dbms.checkConfigValue': {
      label: 'dbms.checkConfigValue',
      documentation: 'Check if a potential config setting value is valid.',
      parameters: [
        {
          label: 'setting',
          documentation: 'setting :: STRING',
        },
        {
          label: 'value',
          documentation: 'value :: STRING',
        },
      ],
    },
    'dbms.cluster.checkConnectivity': {
      label: 'dbms.cluster.checkConnectivity',
      documentation:
        "Check the connectivity of this instance to other cluster members. Not all ports are relevant to all members. Valid values for 'port-name' are: [CLUSTER, RAFT]",
      parameters: [
        {
          label: 'port-name',
          documentation: 'port-name = null :: STRING',
        },
        {
          label: 'server',
          documentation: 'server = null :: STRING',
        },
      ],
    },
    'dbms.cluster.cordonServer': {
      label: 'dbms.cluster.cordonServer',
      documentation:
        'Mark a server in the topology as not suitable for new allocations. It will not force current allocations off the server. This is useful when deallocating databases when you have multiple unavailable servers.',
      parameters: [
        {
          label: 'server',
          documentation: 'server :: STRING',
        },
      ],
    },
    'dbms.cluster.protocols': {
      label: 'dbms.cluster.protocols',
      documentation: 'Overview of installed protocols',
      parameters: [],
    },
    'dbms.cluster.readReplicaToggle': {
      label: 'dbms.cluster.readReplicaToggle',
      documentation:
        'The toggle can pause or resume read replica (deprecated in favor of dbms.cluster.secondaryReplicationDisable)',
      parameters: [
        {
          label: 'databaseName',
          documentation: 'databaseName :: STRING',
        },
        {
          label: 'pause',
          documentation: 'pause :: BOOLEAN',
        },
      ],
    },
    'dbms.cluster.routing.getRoutingTable': {
      label: 'dbms.cluster.routing.getRoutingTable',
      documentation:
        "Returns the advertised bolt capable endpoints for a given database, divided by each endpoint's capabilities. For example, an endpoint may serve read queries, write queries, and/or future `getRoutingTable` requests.",
      parameters: [
        {
          label: 'context',
          documentation: 'context :: MAP',
        },
        {
          label: 'database',
          documentation: 'database = null :: STRING',
        },
      ],
    },
    'dbms.cluster.secondaryReplicationDisable': {
      label: 'dbms.cluster.secondaryReplicationDisable',
      documentation:
        'The toggle can pause or resume the secondary replication process.',
      parameters: [
        {
          label: 'databaseName',
          documentation: 'databaseName :: STRING',
        },
        {
          label: 'pause',
          documentation: 'pause :: BOOLEAN',
        },
      ],
    },
    'dbms.cluster.setAutomaticallyEnableFreeServers': {
      label: 'dbms.cluster.setAutomaticallyEnableFreeServers',
      documentation:
        'With this method you can set whether free servers are automatically enabled.',
      parameters: [
        {
          label: 'autoEnable',
          documentation: 'autoEnable :: BOOLEAN',
        },
      ],
    },
    'dbms.cluster.uncordonServer': {
      label: 'dbms.cluster.uncordonServer',
      documentation:
        "Remove the cordon on a server, returning it to 'enabled'.",
      parameters: [
        {
          label: 'server',
          documentation: 'server :: STRING',
        },
      ],
    },
    'dbms.components': {
      label: 'dbms.components',
      documentation: 'List DBMS components and their versions.',
      parameters: [],
    },
    'dbms.info': {
      label: 'dbms.info',
      documentation: 'Provides information regarding the DBMS.',
      parameters: [],
    },
    'dbms.killConnection': {
      label: 'dbms.killConnection',
      documentation: 'Kill network connection with the given connection id.',
      parameters: [
        {
          label: 'id',
          documentation: 'id :: STRING',
        },
      ],
    },
    'dbms.killConnections': {
      label: 'dbms.killConnections',
      documentation:
        'Kill all network connections with the given connection ids.',
      parameters: [
        {
          label: 'ids',
          documentation: 'ids :: LIST<STRING>',
        },
      ],
    },
    'dbms.listActiveLocks': {
      label: 'dbms.listActiveLocks',
      documentation:
        'List the active lock requests granted for the transaction executing the query with the given query id.',
      parameters: [
        {
          label: 'queryId',
          documentation: 'queryId :: STRING',
        },
      ],
    },
    'dbms.listCapabilities': {
      label: 'dbms.listCapabilities',
      documentation: 'List capabilities.',
      parameters: [],
    },
    'dbms.listConfig': {
      label: 'dbms.listConfig',
      documentation:
        'List the currently active configuration settings of Neo4j.',
      parameters: [
        {
          label: 'searchString',
          documentation: 'searchString =  :: STRING',
        },
      ],
    },
    'dbms.listConnections': {
      label: 'dbms.listConnections',
      documentation:
        'List all accepted network connections at this instance that are visible to the user.',
      parameters: [],
    },
    'dbms.listPools': {
      label: 'dbms.listPools',
      documentation:
        'List all memory pools, including sub pools, currently registered at this instance that are visible to the user.',
      parameters: [],
    },
    'dbms.quarantineDatabase': {
      label: 'dbms.quarantineDatabase',
      documentation: 'Place a database into quarantine or remove it from it.',
      parameters: [
        {
          label: 'databaseName',
          documentation: 'databaseName :: STRING',
        },
        {
          label: 'setStatus',
          documentation: 'setStatus :: BOOLEAN',
        },
        {
          label: 'reason',
          documentation: 'reason = No reason given :: STRING',
        },
      ],
    },
    'dbms.queryJmx': {
      label: 'dbms.queryJmx',
      documentation:
        'Query JMX management data by domain and name. For instance, use `*:*` to find all JMX beans.',
      parameters: [
        {
          label: 'query',
          documentation: 'query :: STRING',
        },
      ],
    },
    'dbms.routing.getRoutingTable': {
      label: 'dbms.routing.getRoutingTable',
      documentation:
        "Returns the advertised bolt capable endpoints for a given database, divided by each endpoint's capabilities. For example, an endpoint may serve read queries, write queries, and/or future `getRoutingTable` requests.",
      parameters: [
        {
          label: 'context',
          documentation: 'context :: MAP',
        },
        {
          label: 'database',
          documentation: 'database = null :: STRING',
        },
      ],
    },
    'dbms.scheduler.failedJobs': {
      label: 'dbms.scheduler.failedJobs',
      documentation:
        'List failed job runs. There is a limit for amount of historical data.',
      parameters: [],
    },
    'dbms.scheduler.groups': {
      label: 'dbms.scheduler.groups',
      documentation:
        'List the job groups that are active in the database internal job scheduler.',
      parameters: [],
    },
    'dbms.scheduler.jobs': {
      label: 'dbms.scheduler.jobs',
      documentation:
        'List all jobs that are active in the database internal job scheduler.',
      parameters: [],
    },
    'dbms.security.clearAuthCache': {
      label: 'dbms.security.clearAuthCache',
      documentation: 'Clears authentication and authorization cache.',
      parameters: [],
    },
    'dbms.setConfigValue': {
      label: 'dbms.setConfigValue',
      documentation:
        'Update a given setting value. Passing an empty value results in removing the configured value and falling back to the default value. Changes do not persist and are lost if the server is restarted. In a clustered environment, `dbms.setConfigValue` affects only the cluster member it is run against.',
      parameters: [
        {
          label: 'setting',
          documentation: 'setting :: STRING',
        },
        {
          label: 'value',
          documentation: 'value :: STRING',
        },
      ],
    },
    'dbms.setDatabaseAllocator': {
      label: 'dbms.setDatabaseAllocator',
      documentation:
        'With this method you can set the allocator that is responsible for selecting servers for hosting databases.',
      parameters: [
        {
          label: 'allocator',
          documentation: 'allocator :: STRING',
        },
      ],
    },
    'dbms.setDefaultAllocationNumbers': {
      label: 'dbms.setDefaultAllocationNumbers',
      documentation:
        'With this method you can set the default number of primaries and secondaries.',
      parameters: [
        {
          label: 'primaries',
          documentation: 'primaries :: INTEGER',
        },
        {
          label: 'secondaries',
          documentation: 'secondaries :: INTEGER',
        },
      ],
    },
    'dbms.setDefaultDatabase': {
      label: 'dbms.setDefaultDatabase',
      documentation:
        'Change the default database to the provided value. The database must exist and the old default database must be stopped.',
      parameters: [
        {
          label: 'databaseName',
          documentation: 'databaseName :: STRING',
        },
      ],
    },
    'dbms.showCurrentUser': {
      label: 'dbms.showCurrentUser',
      documentation: 'Show the current user.',
      parameters: [],
    },
    'dbms.showTopologyGraphConfig': {
      label: 'dbms.showTopologyGraphConfig',
      documentation:
        'With this method the configuration of the Topology Graph can be displayed.',
      parameters: [],
    },
    'dbms.upgrade': {
      label: 'dbms.upgrade',
      documentation:
        'Upgrade the system database schema if it is not the current schema.',
      parameters: [],
    },
    'dbms.upgradeStatus': {
      label: 'dbms.upgradeStatus',
      documentation:
        'Report the current status of the system database sub-graph schema.',
      parameters: [],
    },
    'tx.getMetaData': {
      label: 'tx.getMetaData',
      documentation: 'Provides attached transaction metadata.',
      parameters: [],
    },
    'tx.setMetaData': {
      label: 'tx.setMetaData',
      documentation:
        'Attaches a map of data to the transaction. The data will be printed when listing queries, and inserted into the query log.',
      parameters: [
        {
          label: 'data',
          documentation: 'data :: MAP',
        },
      ],
    },
  },
  labels: ['Movie', 'Person'],
  relationshipTypes: [
    'ACTED_IN',
    'DIRECTED',
    'FOLLOWS',
    'PRODUCED',
    'REVIEWED',
    'WROTE',
  ],
  propertyKeys: [
    'born',
    'data',
    'id',
    'name',
    'nodes',
    'rating',
    'relationships',
    'released',
    'roles',
    'style',
    'summary',
    'tagline',
    'title',
    'visualisation',
  ],
  parameters: {
    param1: {
      property: 'value',
      speed: 123.4,
    },
    favColor: 'green',
    myParam: 1337,
  },
  databaseNames: ['neo4j', 'oskar', 'system'],
  aliasNames: ['alias2', 'testalias'],
};
