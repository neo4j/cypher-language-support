import { DbSchema } from '../dbSchema';

const mockSchema: DbSchema = {
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
  rawFunctions: [
    {
      name: 'abs',
      category: 'Numeric',
      description: 'Returns the absolute value of an `INTEGER` or `FLOAT`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: INTEGER | FLOAT',
          name: 'input',
          type: 'INTEGER | FLOAT',
        },
      ],
      signature: 'abs(input :: INTEGER | FLOAT) :: INTEGER | FLOAT',
      returnDescription: 'INTEGER | FLOAT',
      aggregating: false,
    },
    {
      name: 'acos',
      category: 'Trigonometric',
      description: 'Returns the arccosine of a `FLOAT` in radians.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: FLOAT',
          name: 'input',
          type: 'FLOAT',
        },
      ],
      signature: 'acos(input :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'all',
      category: 'Predicate',
      description:
        'Returns true if the predicate holds for all elements in the given `LIST<ANY>`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'variable :: ANY',
          name: 'variable',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'list :: LIST<ANY>',
          name: 'list',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'all(variable :: VARIABLE IN list :: LIST<ANY> WHERE predicate :: ANY) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'any',
      category: 'Predicate',
      description:
        'Returns true if the predicate holds for at least one element in the given `LIST<ANY>`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'variable :: ANY',
          name: 'variable',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'list :: LIST<ANY>',
          name: 'list',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'any(variable :: VARIABLE IN list :: LIST<ANY> WHERE predicate :: ANY) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'apoc.agg.first',
      category: '',
      description: 'Returns the first value from the given collection.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
      ],
      signature: 'apoc.agg.first(value :: ANY) :: ANY',
      returnDescription: 'ANY',
      aggregating: true,
    },
    {
      name: 'apoc.agg.graph',
      category: '',
      description:
        'Returns all distinct `NODE` and `RELATIONSHIP` values collected into a `MAP` with the keys `nodes` and `relationships`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'path :: ANY',
          name: 'path',
          type: 'ANY',
        },
      ],
      signature: 'apoc.agg.graph(path :: ANY) :: MAP',
      returnDescription: 'MAP',
      aggregating: true,
    },
    {
      name: 'apoc.agg.last',
      category: '',
      description: 'Returns the last value from the given collection.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
      ],
      signature: 'apoc.agg.last(value :: ANY) :: ANY',
      returnDescription: 'ANY',
      aggregating: true,
    },
    {
      name: 'apoc.agg.maxItems',
      category: '',
      description:
        'Returns a `MAP` `{items: LIST<ANY>, value: ANY}` where the `value` key is the maximum value present, and `items` represent all items with the same value. The size of the list of items can be limited to a given max size.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'items :: ANY',
          name: 'items',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=-1, type=INTEGER}',
          description: 'groupLimit = -1 :: INTEGER',
          name: 'groupLimit',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.agg.maxItems(items :: ANY, value :: ANY, groupLimit = -1 :: INTEGER) :: ANY',
      returnDescription: 'ANY',
      aggregating: true,
    },
    {
      name: 'apoc.agg.median',
      category: '',
      description:
        'Returns the mathematical median for all non-null `INTEGER` and `FLOAT` values.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
      ],
      signature: 'apoc.agg.median(value :: ANY) :: ANY',
      returnDescription: 'ANY',
      aggregating: true,
    },
    {
      name: 'apoc.agg.minItems',
      category: '',
      description:
        'Returns a `MAP` `{items: LIST<ANY>, value: ANY}` where the `value` key is the minimum value present, and `items` represent all items with the same value. The size of the list of items can be limited to a given max size.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'items :: ANY',
          name: 'items',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=-1, type=INTEGER}',
          description: 'groupLimit = -1 :: INTEGER',
          name: 'groupLimit',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.agg.minItems(items :: ANY, value :: ANY, groupLimit = -1 :: INTEGER) :: ANY',
      returnDescription: 'ANY',
      aggregating: true,
    },
    {
      name: 'apoc.agg.nth',
      category: '',
      description:
        'Returns the nth value in the given collection (to fetch the last item of an unknown length collection, -1 can be used).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'offset :: INTEGER',
          name: 'offset',
          type: 'INTEGER',
        },
      ],
      signature: 'apoc.agg.nth(value :: ANY, offset :: INTEGER) :: ANY',
      returnDescription: 'ANY',
      aggregating: true,
    },
    {
      name: 'apoc.agg.percentiles',
      category: '',
      description:
        'Returns the given percentiles over the range of numerical values in the given collection.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: INTEGER | FLOAT',
          name: 'value',
          type: 'INTEGER | FLOAT',
        },
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=[0.5, 0.75, 0.9, 0.95, 0.99], type=LIST<FLOAT>}',
          description:
            'percentiles = [0.5, 0.75, 0.9, 0.95, 0.99] :: LIST<FLOAT>',
          name: 'percentiles',
          type: 'LIST<FLOAT>',
        },
      ],
      signature:
        'apoc.agg.percentiles(value :: INTEGER | FLOAT, percentiles = [0.5, 0.75, 0.9, 0.95, 0.99] :: LIST<FLOAT>) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: true,
    },
    {
      name: 'apoc.agg.product',
      category: '',
      description:
        'Returns the product of all non-null `INTEGER` and `FLOAT` values in the collection.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: INTEGER | FLOAT',
          name: 'value',
          type: 'INTEGER | FLOAT',
        },
      ],
      signature:
        'apoc.agg.product(value :: INTEGER | FLOAT) :: INTEGER | FLOAT',
      returnDescription: 'INTEGER | FLOAT',
      aggregating: true,
    },
    {
      name: 'apoc.agg.slice',
      category: '',
      description:
        'Returns a subset of non-null values from the given collection (the collection is considered to be zero-indexed).\nTo specify the range from start until the end of the collection, the length should be set to -1.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=0, type=INTEGER}',
          description: 'from = 0 :: INTEGER',
          name: 'from',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=-1, type=INTEGER}',
          description: 'to = -1 :: INTEGER',
          name: 'to',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.agg.slice(value :: ANY, from = 0 :: INTEGER, to = -1 :: INTEGER) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: true,
    },
    {
      name: 'apoc.agg.statistics',
      category: '',
      description:
        'Returns the following statistics on the `INTEGER` and `FLOAT` values in the given collection: percentiles, min, minNonZero, max, total, mean, stdev.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: INTEGER | FLOAT',
          name: 'value',
          type: 'INTEGER | FLOAT',
        },
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=[0.5, 0.75, 0.9, 0.95, 0.99], type=LIST<FLOAT>}',
          description:
            'percentiles = [0.5, 0.75, 0.9, 0.95, 0.99] :: LIST<FLOAT>',
          name: 'percentiles',
          type: 'LIST<FLOAT>',
        },
      ],
      signature:
        'apoc.agg.statistics(value :: INTEGER | FLOAT, percentiles = [0.5, 0.75, 0.9, 0.95, 0.99] :: LIST<FLOAT>) :: MAP',
      returnDescription: 'MAP',
      aggregating: true,
    },
    {
      name: 'apoc.any.isDeleted',
      category: '',
      description:
        'Returns true if the given `NODE` or `RELATIONSHIP` no longer exists.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'object :: ANY',
          name: 'object',
          type: 'ANY',
        },
      ],
      signature: 'apoc.any.isDeleted(object :: ANY) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'apoc.any.properties',
      category: '',
      description:
        'Returns all properties of the given object.\nThe object can be a virtual `NODE`, a real `NODE`, a virtual `RELATIONSHIP`, a real `RELATIONSHIP`, or a `MAP`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'object :: ANY',
          name: 'object',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=null, type=LIST<STRING>}',
          description: 'keys = null :: LIST<STRING>',
          name: 'keys',
          type: 'LIST<STRING>',
        },
      ],
      signature:
        'apoc.any.properties(object :: ANY, keys = null :: LIST<STRING>) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.any.property',
      category: '',
      description:
        'Returns the property for the given key from an object.\nThe object can be a virtual `NODE`, a real `NODE`, a virtual `RELATIONSHIP`, a real `RELATIONSHIP`, or a `MAP`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'object :: ANY',
          name: 'object',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'key :: STRING',
          name: 'key',
          type: 'STRING',
        },
      ],
      signature: 'apoc.any.property(object :: ANY, key :: STRING) :: ANY',
      returnDescription: 'ANY',
      aggregating: false,
    },
    {
      name: 'apoc.bitwise.op',
      category: '',
      description: 'Returns the result of the bitwise operation',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'a :: INTEGER',
          name: 'a',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'operator :: STRING',
          name: 'operator',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'b :: INTEGER',
          name: 'b',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.bitwise.op(a :: INTEGER, operator :: STRING, b :: INTEGER) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.coll.avg',
      category: '',
      description:
        'Returns the average of the numbers in the `LIST<INTEGER | FLOAT>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<INTEGER | FLOAT>',
          name: 'coll',
          type: 'LIST<INTEGER | FLOAT>',
        },
      ],
      signature: 'apoc.coll.avg(coll :: LIST<INTEGER | FLOAT>) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'apoc.coll.combinations',
      category: '',
      description:
        'Returns a collection of all combinations of `LIST<ANY>` elements between the selection size `minSelect` and `maxSelect` (default: `minSelect`).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'minSelect :: INTEGER',
          name: 'minSelect',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=-1, type=INTEGER}',
          description: 'maxSelect = -1 :: INTEGER',
          name: 'maxSelect',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.coll.combinations(coll :: LIST<ANY>, minSelect :: INTEGER, maxSelect = -1 :: INTEGER) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.contains',
      category: '',
      description:
        'Returns whether or not the given value exists in the given collection (using a HashSet).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
      ],
      signature:
        'apoc.coll.contains(coll :: LIST<ANY>, value :: ANY) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'apoc.coll.containsAll',
      category: '',
      description:
        'Returns whether or not all of the given values exist in the given collection (using a HashSet).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll1 :: LIST<ANY>',
          name: 'coll1',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'coll2 :: LIST<ANY>',
          name: 'coll2',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'apoc.coll.containsAll(coll1 :: LIST<ANY>, coll2 :: LIST<ANY>) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'apoc.coll.containsAllSorted',
      category: '',
      description:
        'Returns whether or not all of the given values in the second `LIST<ANY>` exist in an already sorted collection (using a binary search).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll1 :: LIST<ANY>',
          name: 'coll1',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'coll2 :: LIST<ANY>',
          name: 'coll2',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'apoc.coll.containsAllSorted(coll1 :: LIST<ANY>, coll2 :: LIST<ANY>) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'apoc.coll.containsDuplicates',
      category: '',
      description: 'Returns true if a collection contains duplicate elements.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'apoc.coll.containsDuplicates(coll :: LIST<ANY>) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'apoc.coll.containsSorted',
      category: '',
      description:
        'Returns whether or not the given value exists in an already sorted collection (using a binary search).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
      ],
      signature:
        'apoc.coll.containsSorted(coll :: LIST<ANY>, value :: ANY) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'apoc.coll.different',
      category: '',
      description:
        'Returns true if all the values in the given `LIST<ANY>` are unique.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'apoc.coll.different(coll :: LIST<ANY>) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'apoc.coll.disjunction',
      category: '',
      description: 'Returns the disjunct set from two `LIST<ANY>` values.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'list1 :: LIST<ANY>',
          name: 'list1',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'list2 :: LIST<ANY>',
          name: 'list2',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'apoc.coll.disjunction(list1 :: LIST<ANY>, list2 :: LIST<ANY>) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.dropDuplicateNeighbors',
      category: '',
      description: 'Removes duplicate consecutive objects in the `LIST<ANY>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'list :: LIST<ANY>',
          name: 'list',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'apoc.coll.dropDuplicateNeighbors(list :: LIST<ANY>) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.duplicates',
      category: '',
      description:
        'Returns a `LIST<ANY>` of duplicate items in the collection.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'apoc.coll.duplicates(coll :: LIST<ANY>) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.duplicatesWithCount',
      category: '',
      description:
        'Returns a `LIST<ANY>` of duplicate items in the collection and their count, keyed by `item` and `count`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'apoc.coll.duplicatesWithCount(coll :: LIST<ANY>) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.fill',
      category: '',
      description: 'Returns a `LIST<ANY>` with the given count of items.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'items :: STRING',
          name: 'items',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'count :: INTEGER',
          name: 'count',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.coll.fill(items :: STRING, count :: INTEGER) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.flatten',
      category: '',
      description:
        'Flattens the given `LIST<ANY>` (to flatten nested `LIST<ANY>` values, set recursive to true).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=false, type=BOOLEAN}',
          description: 'recursive = false :: BOOLEAN',
          name: 'recursive',
          type: 'BOOLEAN',
        },
      ],
      signature:
        'apoc.coll.flatten(coll :: LIST<ANY>, recursive = false :: BOOLEAN) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.frequencies',
      category: '',
      description:
        'Returns a `LIST<ANY>` of frequencies of the items in the collection, keyed by `item` and `count`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'apoc.coll.frequencies(coll :: LIST<ANY>) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.frequenciesAsMap',
      category: '',
      description:
        'Returns a `MAP` of frequencies of the items in the collection, keyed by `item` and `count`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'apoc.coll.frequenciesAsMap(coll :: LIST<ANY>) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.coll.indexOf',
      category: '',
      description:
        'Returns the index for the first occurrence of the specified value in the `LIST<ANY>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
      ],
      signature:
        'apoc.coll.indexOf(coll :: LIST<ANY>, value :: ANY) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.coll.insert',
      category: '',
      description:
        'Inserts a value into the specified index in the `LIST<ANY>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'index :: INTEGER',
          name: 'index',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
      ],
      signature:
        'apoc.coll.insert(coll :: LIST<ANY>, index :: INTEGER, value :: ANY) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.insertAll',
      category: '',
      description:
        'Inserts all of the values into the `LIST<ANY>`, starting at the specified index.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'index :: INTEGER',
          name: 'index',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'values :: LIST<ANY>',
          name: 'values',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'apoc.coll.insertAll(coll :: LIST<ANY>, index :: INTEGER, values :: LIST<ANY>) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.intersection',
      category: '',
      description:
        'Returns the distinct intersection of two `LIST<ANY>` values.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'list1 :: LIST<ANY>',
          name: 'list1',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'list2 :: LIST<ANY>',
          name: 'list2',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'apoc.coll.intersection(list1 :: LIST<ANY>, list2 :: LIST<ANY>) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.isEqualCollection',
      category: '',
      description:
        'Returns true if the two collections contain the same elements with the same cardinality in any order (using a HashMap).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'values :: LIST<ANY>',
          name: 'values',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'apoc.coll.isEqualCollection(coll :: LIST<ANY>, values :: LIST<ANY>) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'apoc.coll.max',
      category: '',
      description:
        'Returns the maximum of all values in the given `LIST<ANY>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'values :: LIST<ANY>',
          name: 'values',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'apoc.coll.max(values :: LIST<ANY>) :: ANY',
      returnDescription: 'ANY',
      aggregating: false,
    },
    {
      name: 'apoc.coll.min',
      category: '',
      description:
        'Returns the minimum of all values in the given `LIST<ANY>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'values :: LIST<ANY>',
          name: 'values',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'apoc.coll.min(values :: LIST<ANY>) :: ANY',
      returnDescription: 'ANY',
      aggregating: false,
    },
    {
      name: 'apoc.coll.occurrences',
      category: '',
      description: 'Returns the count of the given item in the collection.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'item :: ANY',
          name: 'item',
          type: 'ANY',
        },
      ],
      signature:
        'apoc.coll.occurrences(coll :: LIST<ANY>, item :: ANY) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.coll.pairWithOffset',
      category: '',
      description: 'Returns a `LIST<ANY>` of pairs defined by the offset.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'offset :: INTEGER',
          name: 'offset',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.coll.pairWithOffset(coll :: LIST<ANY>, offset :: INTEGER) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.pairs',
      category: '',
      description:
        'Returns a `LIST<ANY>` of adjacent elements in the `LIST<ANY>` ([1,2],[2,3],[3,null]).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'list :: LIST<ANY>',
          name: 'list',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'apoc.coll.pairs(list :: LIST<ANY>) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.pairsMin',
      category: '',
      description:
        'Returns `LIST<ANY>` values of adjacent elements in the `LIST<ANY>` ([1,2],[2,3]), skipping the final element.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'list :: LIST<ANY>',
          name: 'list',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'apoc.coll.pairsMin(list :: LIST<ANY>) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.partition',
      category: '',
      description:
        'Partitions the original `LIST<ANY>` into a new `LIST<ANY>` of the given batch size.\nThe final `LIST<ANY>` may be smaller than the given batch size.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.coll.partition(coll :: LIST<ANY>, batchSize :: INTEGER) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.randomItem',
      category: '',
      description:
        'Returns a random item from the `LIST<ANY>`, or null on `LIST<NOTHING>` or `LIST<NULL>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'apoc.coll.randomItem(coll :: LIST<ANY>) :: ANY',
      returnDescription: 'ANY',
      aggregating: false,
    },
    {
      name: 'apoc.coll.randomItems',
      category: '',
      description:
        'Returns a `LIST<ANY>` of `itemCount` random items from the original `LIST<ANY>` (optionally allowing elements in the original `LIST<ANY>` to be selected more than once).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'itemCount :: INTEGER',
          name: 'itemCount',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=false, type=BOOLEAN}',
          description: 'allowRepick = false :: BOOLEAN',
          name: 'allowRepick',
          type: 'BOOLEAN',
        },
      ],
      signature:
        'apoc.coll.randomItems(coll :: LIST<ANY>, itemCount :: INTEGER, allowRepick = false :: BOOLEAN) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.remove',
      category: '',
      description:
        'Removes a range of values from the `LIST<ANY>`, beginning at position index for the given length of values.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'index :: INTEGER',
          name: 'index',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=1, type=INTEGER}',
          description: 'length = 1 :: INTEGER',
          name: 'length',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.coll.remove(coll :: LIST<ANY>, index :: INTEGER, length = 1 :: INTEGER) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.removeAll',
      category: '',
      description:
        'Returns the first `LIST<ANY>` with all elements also present in the second `LIST<ANY>` removed.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'list1 :: LIST<ANY>',
          name: 'list1',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'list2 :: LIST<ANY>',
          name: 'list2',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'apoc.coll.removeAll(list1 :: LIST<ANY>, list2 :: LIST<ANY>) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.runningTotal',
      category: '',
      description: 'Returns an accumulative `LIST<INTEGER | FLOAT>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'list :: LIST<INTEGER | FLOAT>',
          name: 'list',
          type: 'LIST<INTEGER | FLOAT>',
        },
      ],
      signature:
        'apoc.coll.runningTotal(list :: LIST<INTEGER | FLOAT>) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.set',
      category: '',
      description: 'Sets the element at the given index to the new value.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'index :: INTEGER',
          name: 'index',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
      ],
      signature:
        'apoc.coll.set(coll :: LIST<ANY>, index :: INTEGER, value :: ANY) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.shuffle',
      category: '',
      description: 'Returns the `LIST<ANY>` shuffled.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'apoc.coll.shuffle(coll :: LIST<ANY>) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.sort',
      category: '',
      description: 'Sorts the given `LIST<ANY>` into ascending order.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'apoc.coll.sort(coll :: LIST<ANY>) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.sortMaps',
      category: '',
      description:
        'Sorts the given `LIST<MAP<STRING, ANY>>` into descending order, based on the `MAP` property indicated by `prop`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'list :: LIST<MAP>',
          name: 'list',
          type: 'LIST<MAP>',
        },
        {
          isDeprecated: false,
          description: 'prop :: STRING',
          name: 'prop',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.coll.sortMaps(list :: LIST<MAP>, prop :: STRING) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.sortMulti',
      category: '',
      description:
        'Sorts the given `LIST<MAP<STRING, ANY>>` by the given fields.\nTo indicate that a field should be sorted according to ascending values, prefix it with a caret (^).\nIt is also possible to add limits to the `LIST<MAP<STRING, ANY>>` and to skip values.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<MAP>',
          name: 'coll',
          type: 'LIST<MAP>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=[], type=LIST<STRING>}',
          description: 'orderFields = [] :: LIST<STRING>',
          name: 'orderFields',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=-1, type=INTEGER}',
          description: 'limit = -1 :: INTEGER',
          name: 'limit',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=0, type=INTEGER}',
          description: 'skip = 0 :: INTEGER',
          name: 'skip',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.coll.sortMulti(coll :: LIST<MAP>, orderFields = [] :: LIST<STRING>, limit = -1 :: INTEGER, skip = 0 :: INTEGER) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.sortNodes',
      category: '',
      description:
        'Sorts the given `LIST<NODE>` by the property of the nodes into descending order.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<NODE>',
          name: 'coll',
          type: 'LIST<NODE>',
        },
        {
          isDeprecated: false,
          description: 'prop :: STRING',
          name: 'prop',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.coll.sortNodes(coll :: LIST<NODE>, prop :: STRING) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.sortText',
      category: '',
      description: 'Sorts the given `LIST<STRING>` into ascending order.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<STRING>',
          name: 'coll',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'conf = {} :: MAP',
          name: 'conf',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.coll.sortText(coll :: LIST<STRING>, conf = {} :: MAP) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.stdev',
      category: '',
      description:
        'Returns sample or population standard deviation with `isBiasCorrected` true or false respectively.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'list :: LIST<INTEGER | FLOAT>',
          name: 'list',
          type: 'LIST<INTEGER | FLOAT>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=true, type=BOOLEAN}',
          description: 'isBiasCorrected = true :: BOOLEAN',
          name: 'isBiasCorrected',
          type: 'BOOLEAN',
        },
      ],
      signature:
        'apoc.coll.stdev(list :: LIST<INTEGER | FLOAT>, isBiasCorrected = true :: BOOLEAN) :: INTEGER | FLOAT',
      returnDescription: 'INTEGER | FLOAT',
      aggregating: false,
    },
    {
      name: 'apoc.coll.subtract',
      category: '',
      description:
        'Returns the first `LIST<ANY>` as a set with all the elements of the second `LIST<ANY>` removed.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'list1 :: LIST<ANY>',
          name: 'list1',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'list2 :: LIST<ANY>',
          name: 'list2',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'apoc.coll.subtract(list1 :: LIST<ANY>, list2 :: LIST<ANY>) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.sum',
      category: '',
      description:
        'Returns the sum of all the `INTEGER | FLOAT` in the `LIST<INTEGER | FLOAT>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<INTEGER | FLOAT>',
          name: 'coll',
          type: 'LIST<INTEGER | FLOAT>',
        },
      ],
      signature: 'apoc.coll.sum(coll :: LIST<INTEGER | FLOAT>) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'apoc.coll.sumLongs',
      category: '',
      description:
        'Returns the sum of all the `INTEGER | FLOAT` in the `LIST<INTEGER | FLOAT>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<INTEGER | FLOAT>',
          name: 'coll',
          type: 'LIST<INTEGER | FLOAT>',
        },
      ],
      signature: 'apoc.coll.sumLongs(coll :: LIST<INTEGER | FLOAT>) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.coll.toSet',
      category: '',
      description: 'Returns a unique `LIST<ANY>` from the given `LIST<ANY>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'apoc.coll.toSet(coll :: LIST<ANY>) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.union',
      category: '',
      description:
        'Returns the distinct union of the two given `LIST<ANY>` values.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'list1 :: LIST<ANY>',
          name: 'list1',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'list2 :: LIST<ANY>',
          name: 'list2',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'apoc.coll.union(list1 :: LIST<ANY>, list2 :: LIST<ANY>) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.unionAll',
      category: '',
      description:
        'Returns the full union of the two given `LIST<ANY>` values (duplicates included).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'list1 :: LIST<ANY>',
          name: 'list1',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'list2 :: LIST<ANY>',
          name: 'list2',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'apoc.coll.unionAll(list1 :: LIST<ANY>, list2 :: LIST<ANY>) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.coll.zip',
      category: '',
      description:
        'Returns the two given `LIST<ANY>` values zipped together as a `LIST<LIST<ANY>>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'list1 :: LIST<ANY>',
          name: 'list1',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'list2 :: LIST<ANY>',
          name: 'list2',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'apoc.coll.zip(list1 :: LIST<ANY>, list2 :: LIST<ANY>) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.convert.fromJsonList',
      category: '',
      description: 'Converts the given JSON list into a Cypher `LIST<STRING>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'list :: STRING',
          name: 'list',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'path =  :: STRING',
          name: 'path',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=null, type=LIST<STRING>}',
          description: 'pathOptions = null :: LIST<STRING>',
          name: 'pathOptions',
          type: 'LIST<STRING>',
        },
      ],
      signature:
        'apoc.convert.fromJsonList(list :: STRING, path =  :: STRING, pathOptions = null :: LIST<STRING>) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.convert.fromJsonMap',
      category: '',
      description: 'Converts the given JSON map into a Cypher `MAP`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'map :: STRING',
          name: 'map',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'path =  :: STRING',
          name: 'path',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=null, type=LIST<STRING>}',
          description: 'pathOptions = null :: LIST<STRING>',
          name: 'pathOptions',
          type: 'LIST<STRING>',
        },
      ],
      signature:
        'apoc.convert.fromJsonMap(map :: STRING, path =  :: STRING, pathOptions = null :: LIST<STRING>) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.convert.getJsonProperty',
      category: '',
      description:
        'Converts a serialized JSON object from the property of the given `NODE` into the equivalent Cypher structure (e.g. `MAP`, `LIST<ANY>`).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'key :: STRING',
          name: 'key',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'path =  :: STRING',
          name: 'path',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=null, type=LIST<STRING>}',
          description: 'pathOptions = null :: LIST<STRING>',
          name: 'pathOptions',
          type: 'LIST<STRING>',
        },
      ],
      signature:
        'apoc.convert.getJsonProperty(node :: NODE, key :: STRING, path =  :: STRING, pathOptions = null :: LIST<STRING>) :: ANY',
      returnDescription: 'ANY',
      aggregating: false,
    },
    {
      name: 'apoc.convert.getJsonPropertyMap',
      category: '',
      description:
        'Converts a serialized JSON object from the property of the given `NODE` into a Cypher `MAP`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'key :: STRING',
          name: 'key',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'path =  :: STRING',
          name: 'path',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=null, type=LIST<STRING>}',
          description: 'pathOptions = null :: LIST<STRING>',
          name: 'pathOptions',
          type: 'LIST<STRING>',
        },
      ],
      signature:
        'apoc.convert.getJsonPropertyMap(node :: NODE, key :: STRING, path =  :: STRING, pathOptions = null :: LIST<STRING>) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.convert.toJson',
      category: '',
      description: 'Serializes the given JSON value.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
      ],
      signature: 'apoc.convert.toJson(value :: ANY) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.convert.toList',
      category: '',
      description: 'Converts the given value into a `LIST<ANY>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
      ],
      signature: 'apoc.convert.toList(value :: ANY) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.convert.toMap',
      category: '',
      description: 'Converts the given value into a `MAP`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'map :: ANY',
          name: 'map',
          type: 'ANY',
        },
      ],
      signature: 'apoc.convert.toMap(map :: ANY) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.convert.toNode',
      category: '',
      description: 'Converts the given value into a `NODE`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'node :: ANY',
          name: 'node',
          type: 'ANY',
        },
      ],
      signature: 'apoc.convert.toNode(node :: ANY) :: NODE',
      returnDescription: 'NODE',
      aggregating: false,
    },
    {
      name: 'apoc.convert.toNodeList',
      category: '',
      description: 'Converts the given value into a `LIST<NODE>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'list :: ANY',
          name: 'list',
          type: 'ANY',
        },
      ],
      signature: 'apoc.convert.toNodeList(list :: ANY) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.convert.toRelationship',
      category: '',
      description: 'Converts the given value into a `RELATIONSHIP`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'rel :: ANY',
          name: 'rel',
          type: 'ANY',
        },
      ],
      signature: 'apoc.convert.toRelationship(rel :: ANY) :: RELATIONSHIP',
      returnDescription: 'RELATIONSHIP',
      aggregating: false,
    },
    {
      name: 'apoc.convert.toRelationshipList',
      category: '',
      description: 'Converts the given value into a `LIST<RELATIONSHIP>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'relList :: ANY',
          name: 'relList',
          type: 'ANY',
        },
      ],
      signature: 'apoc.convert.toRelationshipList(relList :: ANY) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.convert.toSet',
      category: '',
      description:
        'Converts the given value into a set represented in Cypher as a `LIST<ANY>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'list :: ANY',
          name: 'list',
          type: 'ANY',
        },
      ],
      signature: 'apoc.convert.toSet(list :: ANY) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.convert.toSortedJsonMap',
      category: '',
      description:
        'Converts a serialized JSON object from the property of a given `NODE` into a Cypher `MAP`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=true, type=BOOLEAN}',
          description: 'ignoreCase = true :: BOOLEAN',
          name: 'ignoreCase',
          type: 'BOOLEAN',
        },
      ],
      signature:
        'apoc.convert.toSortedJsonMap(value :: ANY, ignoreCase = true :: BOOLEAN) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.create.uuid',
      category: '',
      description: 'Returns a UUID.',
      isBuiltIn: false,
      argumentDescription: [],
      signature: 'apoc.create.uuid() :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.create.uuidBase64',
      category: '',
      description: 'Returns a UUID encoded with base64.',
      isBuiltIn: false,
      argumentDescription: [],
      signature: 'apoc.create.uuidBase64() :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.create.uuidBase64ToHex',
      category: '',
      description:
        'Takes the given base64 encoded UUID and returns it as a hexadecimal `STRING`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'base64Uuid :: STRING',
          name: 'base64Uuid',
          type: 'STRING',
        },
      ],
      signature: 'apoc.create.uuidBase64ToHex(base64Uuid :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.create.uuidHexToBase64',
      category: '',
      description:
        'Takes the given UUID represented as a hexadecimal `STRING` and returns it encoded with base64.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'uuid :: STRING',
          name: 'uuid',
          type: 'STRING',
        },
      ],
      signature: 'apoc.create.uuidHexToBase64(uuid :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.create.vNode',
      category: '',
      description: 'Returns a virtual `NODE`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'labels :: LIST<STRING>',
          name: 'labels',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'props = {} :: MAP',
          name: 'props',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.create.vNode(labels :: LIST<STRING>, props = {} :: MAP) :: NODE',
      returnDescription: 'NODE',
      aggregating: false,
    },
    {
      name: 'apoc.create.vRelationship',
      category: '',
      description: 'Returns a virtual `RELATIONSHIP`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'from :: NODE',
          name: 'from',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'relType :: STRING',
          name: 'relType',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'props :: MAP',
          name: 'props',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'to :: NODE',
          name: 'to',
          type: 'NODE',
        },
      ],
      signature:
        'apoc.create.vRelationship(from :: NODE, relType :: STRING, props :: MAP, to :: NODE) :: RELATIONSHIP',
      returnDescription: 'RELATIONSHIP',
      aggregating: false,
    },
    {
      name: 'apoc.create.virtual.fromNode',
      category: '',
      description:
        'Returns a virtual `NODE` from the given existing `NODE`. The virtual `NODE` only contains the requested properties.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'propertyNames :: LIST<STRING>',
          name: 'propertyNames',
          type: 'LIST<STRING>',
        },
      ],
      signature:
        'apoc.create.virtual.fromNode(node :: NODE, propertyNames :: LIST<STRING>) :: NODE',
      returnDescription: 'NODE',
      aggregating: false,
    },
    {
      name: 'apoc.cypher.runFirstColumnMany',
      category: '',
      description:
        'Runs the given statement with the given parameters and returns the first column collected into a `LIST<ANY>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'statement :: STRING',
          name: 'statement',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'params :: MAP',
          name: 'params',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.cypher.runFirstColumnMany(statement :: STRING, params :: MAP) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.cypher.runFirstColumnSingle',
      category: '',
      description:
        'Runs the given statement with the given parameters and returns the first element of the first column.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'statement :: STRING',
          name: 'statement',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'params :: MAP',
          name: 'params',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.cypher.runFirstColumnSingle(statement :: STRING, params :: MAP) :: ANY',
      returnDescription: 'ANY',
      aggregating: false,
    },
    {
      name: 'apoc.data.url',
      category: '',
      description: 'Turns a URL into a `MAP`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'url :: STRING',
          name: 'url',
          type: 'STRING',
        },
      ],
      signature: 'apoc.data.url(url :: STRING) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.date.add',
      category: '',
      description: 'Adds a unit of specified time to the given timestamp.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'unit :: STRING',
          name: 'unit',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'addValue :: INTEGER',
          name: 'addValue',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'addUnit :: STRING',
          name: 'addUnit',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.date.add(time :: INTEGER, unit :: STRING, addValue :: INTEGER, addUnit :: STRING) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.date.convert',
      category: '',
      description:
        'Converts the given timestamp from one time unit into a timestamp of a different time unit.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'unit :: STRING',
          name: 'unit',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'toUnit :: STRING',
          name: 'toUnit',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.date.convert(time :: INTEGER, unit :: STRING, toUnit :: STRING) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.date.convertFormat',
      category: '',
      description:
        'Converts a `STRING` of one type of date format into a `STRING` of another type of date format.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'temporal :: STRING',
          name: 'temporal',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'currentFormat :: STRING',
          name: 'currentFormat',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=yyyy-MM-dd, type=STRING}',
          description: 'convertTo = yyyy-MM-dd :: STRING',
          name: 'convertTo',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.date.convertFormat(temporal :: STRING, currentFormat :: STRING, convertTo = yyyy-MM-dd :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.date.currentTimestamp',
      category: '',
      description: 'Returns the current Unix epoch timestamp in milliseconds.',
      isBuiltIn: false,
      argumentDescription: [],
      signature: 'apoc.date.currentTimestamp() :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.date.field',
      category: '',
      description: 'Returns the value of one field from the given date time.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=d, type=STRING}',
          description: 'unit = d :: STRING',
          name: 'unit',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=UTC, type=STRING}',
          description: 'timezone = UTC :: STRING',
          name: 'timezone',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.date.field(time :: INTEGER, unit = d :: STRING, timezone = UTC :: STRING) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.date.fields',
      category: '',
      description:
        'Splits the given date into fields returning a `MAP` containing the values of each field.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'date :: STRING',
          name: 'date',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=yyyy-MM-dd HH:mm:ss, type=STRING}',
          description: 'pattern = yyyy-MM-dd HH:mm:ss :: STRING',
          name: 'pattern',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.date.fields(date :: STRING, pattern = yyyy-MM-dd HH:mm:ss :: STRING) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.date.format',
      category: '',
      description:
        'Returns a `STRING` representation of the time value.\nThe time unit (default: ms), date format (default: ISO), and time zone (default: current time zone) can all be changed.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=ms, type=STRING}',
          description: 'unit = ms :: STRING',
          name: 'unit',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=yyyy-MM-dd HH:mm:ss, type=STRING}',
          description: 'format = yyyy-MM-dd HH:mm:ss :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'timezone =  :: STRING',
          name: 'timezone',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.date.format(time :: INTEGER, unit = ms :: STRING, format = yyyy-MM-dd HH:mm:ss :: STRING, timezone =  :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.date.fromISO8601',
      category: '',
      description:
        'Converts the given date `STRING` (ISO8601) to an `INTEGER` representing the time value in milliseconds.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'time :: STRING',
          name: 'time',
          type: 'STRING',
        },
      ],
      signature: 'apoc.date.fromISO8601(time :: STRING) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.date.parse',
      category: '',
      description:
        'Parses the given date `STRING` from a specified format into the specified time unit.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'time :: STRING',
          name: 'time',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=ms, type=STRING}',
          description: 'unit = ms :: STRING',
          name: 'unit',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=yyyy-MM-dd HH:mm:ss, type=STRING}',
          description: 'format = yyyy-MM-dd HH:mm:ss :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'timezone =  :: STRING',
          name: 'timezone',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.date.parse(time :: STRING, unit = ms :: STRING, format = yyyy-MM-dd HH:mm:ss :: STRING, timezone =  :: STRING) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.date.systemTimezone',
      category: '',
      description:
        'Returns the display name of the system time zone (e.g. Europe/London).',
      isBuiltIn: false,
      argumentDescription: [],
      signature: 'apoc.date.systemTimezone() :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.date.toISO8601',
      category: '',
      description:
        'Returns a `STRING` representation of a specified time value in the ISO8601 format.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=ms, type=STRING}',
          description: 'unit = ms :: STRING',
          name: 'unit',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.date.toISO8601(time :: INTEGER, unit = ms :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.date.toYears',
      category: '',
      description:
        'Converts the given timestamp or the given date into a `FLOAT` representing years.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=yyyy-MM-dd HH:mm:ss, type=STRING}',
          description: 'format = yyyy-MM-dd HH:mm:ss :: STRING',
          name: 'format',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.date.toYears(value :: ANY, format = yyyy-MM-dd HH:mm:ss :: STRING) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'apoc.diff.nodes',
      category: '',
      description:
        'Returns a `MAP` detailing the differences between the two given `NODE` values.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'leftNode :: NODE',
          name: 'leftNode',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'rightNode :: NODE',
          name: 'rightNode',
          type: 'NODE',
        },
      ],
      signature: 'apoc.diff.nodes(leftNode :: NODE, rightNode :: NODE) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.hashing.fingerprint',
      category: '',
      description:
        'Calculates a MD5 checksum over a `NODE` or `RELATIONSHIP` (identical entities share the same checksum).\nUnsuitable for cryptographic use-cases.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'object :: ANY',
          name: 'object',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=[], type=LIST<STRING>}',
          description: 'excludedPropertyKeys = [] :: LIST<STRING>',
          name: 'excludedPropertyKeys',
          type: 'LIST<STRING>',
        },
      ],
      signature:
        'apoc.hashing.fingerprint(object :: ANY, excludedPropertyKeys = [] :: LIST<STRING>) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.hashing.fingerprintGraph',
      category: '',
      description:
        'Calculates a MD5 checksum over the full graph.\nThis function uses in-memory data structures.\nUnsuitable for cryptographic use-cases.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=[], type=LIST<STRING>}',
          description: 'propertyExcludes = [] :: LIST<STRING>',
          name: 'propertyExcludes',
          type: 'LIST<STRING>',
        },
      ],
      signature:
        'apoc.hashing.fingerprintGraph(propertyExcludes = [] :: LIST<STRING>) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.hashing.fingerprinting',
      category: '',
      description:
        'Calculates a MD5 checksum over a `NODE` or `RELATIONSHIP` (identical entities share the same checksum).\nUnlike `apoc.hashing.fingerprint()`, this function supports a number of config parameters.\nUnsuitable for cryptographic use-cases.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'object :: ANY',
          name: 'object',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.hashing.fingerprinting(object :: ANY, config = {} :: MAP) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.json.path',
      category: '',
      description: 'Returns the given JSON path.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'json :: STRING',
          name: 'json',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=$, type=STRING}',
          description: 'path = $ :: STRING',
          name: 'path',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=null, type=LIST<STRING>}',
          description: 'pathOptions = null :: LIST<STRING>',
          name: 'pathOptions',
          type: 'LIST<STRING>',
        },
      ],
      signature:
        'apoc.json.path(json :: STRING, path = $ :: STRING, pathOptions = null :: LIST<STRING>) :: ANY',
      returnDescription: 'ANY',
      aggregating: false,
    },
    {
      name: 'apoc.label.exists',
      category: '',
      description:
        'Returns true or false depending on whether or not the given label exists.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'node :: ANY',
          name: 'node',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'label :: STRING',
          name: 'label',
          type: 'STRING',
        },
      ],
      signature: 'apoc.label.exists(node :: ANY, label :: STRING) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'apoc.map.clean',
      category: '',
      description:
        'Filters the keys and values contained in the given `LIST<ANY>` values.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'map :: MAP',
          name: 'map',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'keys :: LIST<STRING>',
          name: 'keys',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'values :: LIST<ANY>',
          name: 'values',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'apoc.map.clean(map :: MAP, keys :: LIST<STRING>, values :: LIST<ANY>) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.map.flatten',
      category: '',
      description:
        'Flattens nested items in the given `MAP`.\nThis function is the reverse of the `apoc.map.unflatten` function.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'map :: MAP',
          name: 'map',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=., type=STRING}',
          description: 'delimiter = . :: STRING',
          name: 'delimiter',
          type: 'STRING',
        },
      ],
      signature: 'apoc.map.flatten(map :: MAP, delimiter = . :: STRING) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.map.fromLists',
      category: '',
      description:
        'Creates a `MAP` from the keys and values in the given `LIST<ANY>` values.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'keys :: LIST<STRING>',
          name: 'keys',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'values :: LIST<ANY>',
          name: 'values',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'apoc.map.fromLists(keys :: LIST<STRING>, values :: LIST<ANY>) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.map.fromNodes',
      category: '',
      description:
        'Returns a `MAP` of the given prop to the node of the given label.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'label :: STRING',
          name: 'label',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'prop :: STRING',
          name: 'prop',
          type: 'STRING',
        },
      ],
      signature: 'apoc.map.fromNodes(label :: STRING, prop :: STRING) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.map.fromPairs',
      category: '',
      description:
        'Creates a `MAP` from the given `LIST<LIST<ANY>>` of key-value pairs.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'pairs :: LIST<LIST<ANY>>',
          name: 'pairs',
          type: 'LIST<LIST<ANY>>',
        },
      ],
      signature: 'apoc.map.fromPairs(pairs :: LIST<LIST<ANY>>) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.map.fromValues',
      category: '',
      description:
        'Creates a `MAP` from the alternating keys and values in the given `LIST<ANY>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'values :: LIST<ANY>',
          name: 'values',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'apoc.map.fromValues(values :: LIST<ANY>) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.map.get',
      category: '',
      description:
        'Returns a value for the given key.\nIf the given key does not exist, or lacks a default value, this function will throw an exception.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'map :: MAP',
          name: 'map',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'key :: STRING',
          name: 'key',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=null, type=ANY}',
          description: 'value = null :: ANY',
          name: 'value',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=true, type=BOOLEAN}',
          description: 'fail = true :: BOOLEAN',
          name: 'fail',
          type: 'BOOLEAN',
        },
      ],
      signature:
        'apoc.map.get(map :: MAP, key :: STRING, value = null :: ANY, fail = true :: BOOLEAN) :: ANY',
      returnDescription: 'ANY',
      aggregating: false,
    },
    {
      name: 'apoc.map.groupBy',
      category: '',
      description:
        'Creates a `MAP` of the `LIST<ANY>` keyed by the given property, with single values.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'values :: LIST<ANY>',
          name: 'values',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'key :: STRING',
          name: 'key',
          type: 'STRING',
        },
      ],
      signature: 'apoc.map.groupBy(values :: LIST<ANY>, key :: STRING) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.map.groupByMulti',
      category: '',
      description:
        'Creates a `MAP` of the `LIST<ANY>` values keyed by the given property, with the `LIST<ANY>` values.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'values :: LIST<ANY>',
          name: 'values',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'key :: STRING',
          name: 'key',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.map.groupByMulti(values :: LIST<ANY>, key :: STRING) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.map.merge',
      category: '',
      description: 'Merges the two given `MAP` values into one `MAP`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'map1 :: MAP',
          name: 'map1',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'map2 :: MAP',
          name: 'map2',
          type: 'MAP',
        },
      ],
      signature: 'apoc.map.merge(map1 :: MAP, map2 :: MAP) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.map.mergeList',
      category: '',
      description:
        'Merges all `MAP` values in the given `LIST<MAP<STRING, ANY>>` into one `MAP`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'maps :: LIST<MAP>',
          name: 'maps',
          type: 'LIST<MAP>',
        },
      ],
      signature: 'apoc.map.mergeList(maps :: LIST<MAP>) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.map.mget',
      category: '',
      description:
        'Returns a `LIST<ANY>` for the given keys.\nIf one of the keys does not exist, or lacks a default value, this function will throw an exception.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'map :: MAP',
          name: 'map',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'keys :: LIST<STRING>',
          name: 'keys',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=[], type=LIST<ANY>}',
          description: 'values = [] :: LIST<ANY>',
          name: 'values',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=true, type=BOOLEAN}',
          description: 'fail = true :: BOOLEAN',
          name: 'fail',
          type: 'BOOLEAN',
        },
      ],
      signature:
        'apoc.map.mget(map :: MAP, keys :: LIST<STRING>, values = [] :: LIST<ANY>, fail = true :: BOOLEAN) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.map.removeKey',
      category: '',
      description:
        'Removes the given key from the `MAP` (recursively if recursive is true).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'map :: MAP',
          name: 'map',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'key :: STRING',
          name: 'key',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.map.removeKey(map :: MAP, key :: STRING, config = {} :: MAP) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.map.removeKeys',
      category: '',
      description:
        'Removes the given keys from the `MAP` (recursively if recursive is true).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'map :: MAP',
          name: 'map',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'keys :: LIST<STRING>',
          name: 'keys',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.map.removeKeys(map :: MAP, keys :: LIST<STRING>, config = {} :: MAP) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.map.setEntry',
      category: '',
      description: 'Adds or updates the given entry in the `MAP`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'map :: MAP',
          name: 'map',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'key :: STRING',
          name: 'key',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
      ],
      signature:
        'apoc.map.setEntry(map :: MAP, key :: STRING, value :: ANY) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.map.setKey',
      category: '',
      description: 'Adds or updates the given entry in the `MAP`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'map :: MAP',
          name: 'map',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'key :: STRING',
          name: 'key',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
      ],
      signature:
        'apoc.map.setKey(map :: MAP, key :: STRING, value :: ANY) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.map.setLists',
      category: '',
      description:
        'Adds or updates the given keys/value pairs provided in `LIST<ANY>` format (e.g. [key1, key2],[value1, value2]) in a `MAP`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'map :: MAP',
          name: 'map',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'keys :: LIST<STRING>',
          name: 'keys',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'values :: LIST<ANY>',
          name: 'values',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'apoc.map.setLists(map :: MAP, keys :: LIST<STRING>, values :: LIST<ANY>) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.map.setPairs',
      category: '',
      description:
        'Adds or updates the given key/value pairs (e.g. [key1,value1],[key2,value2]) in a `MAP`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'map :: MAP',
          name: 'map',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'pairs :: LIST<LIST<ANY>>',
          name: 'pairs',
          type: 'LIST<LIST<ANY>>',
        },
      ],
      signature:
        'apoc.map.setPairs(map :: MAP, pairs :: LIST<LIST<ANY>>) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.map.setValues',
      category: '',
      description:
        'Adds or updates the alternating key/value pairs (e.g. [key1,value1,key2,value2]) in a `MAP`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'map :: MAP',
          name: 'map',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'pairs :: LIST<ANY>',
          name: 'pairs',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'apoc.map.setValues(map :: MAP, pairs :: LIST<ANY>) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.map.sortedProperties',
      category: '',
      description:
        'Returns a `LIST<ANY>` of key/value pairs.\nThe pairs are sorted by alphabetically by key, with optional case sensitivity.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'map :: MAP',
          name: 'map',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=true, type=BOOLEAN}',
          description: 'ignoreCase = true :: BOOLEAN',
          name: 'ignoreCase',
          type: 'BOOLEAN',
        },
      ],
      signature:
        'apoc.map.sortedProperties(map :: MAP, ignoreCase = true :: BOOLEAN) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.map.submap',
      category: '',
      description:
        'Returns a sub-map for the given keys.\nIf one of the keys does not exist, or lacks a default value, this function will throw an exception.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'map :: MAP',
          name: 'map',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'keys :: LIST<STRING>',
          name: 'keys',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=[], type=LIST<ANY>}',
          description: 'values = [] :: LIST<ANY>',
          name: 'values',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=true, type=BOOLEAN}',
          description: 'fail = true :: BOOLEAN',
          name: 'fail',
          type: 'BOOLEAN',
        },
      ],
      signature:
        'apoc.map.submap(map :: MAP, keys :: LIST<STRING>, values = [] :: LIST<ANY>, fail = true :: BOOLEAN) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.map.unflatten',
      category: '',
      description:
        'Unflattens items in the given `MAP` to nested items.\nThis function is the reverse of the `apoc.map.flatten` function.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'map :: MAP',
          name: 'map',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=., type=STRING}',
          description: 'delimiter = . :: STRING',
          name: 'delimiter',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.map.unflatten(map :: MAP, delimiter = . :: STRING) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.map.updateTree',
      category: '',
      description:
        'Adds the data `MAP` on each level of the nested tree, where the key-value pairs match.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'tree :: MAP',
          name: 'tree',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'key :: STRING',
          name: 'key',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'data :: LIST<LIST<ANY>>',
          name: 'data',
          type: 'LIST<LIST<ANY>>',
        },
      ],
      signature:
        'apoc.map.updateTree(tree :: MAP, key :: STRING, data :: LIST<LIST<ANY>>) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.map.values',
      category: '',
      description:
        'Returns a `LIST<ANY>` indicated by the given keys (returns a null value if a given key is missing).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'map :: MAP',
          name: 'map',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=[], type=LIST<STRING>}',
          description: 'keys = [] :: LIST<STRING>',
          name: 'keys',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=false, type=BOOLEAN}',
          description: 'addNullsForMissing = false :: BOOLEAN',
          name: 'addNullsForMissing',
          type: 'BOOLEAN',
        },
      ],
      signature:
        'apoc.map.values(map :: MAP, keys = [] :: LIST<STRING>, addNullsForMissing = false :: BOOLEAN) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.math.cosh',
      category: '',
      description: 'Returns the hyperbolic cosine.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: FLOAT',
          name: 'value',
          type: 'FLOAT',
        },
      ],
      signature: 'apoc.math.cosh(value :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'apoc.math.coth',
      category: '',
      description: 'Returns the hyperbolic cotangent.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: FLOAT',
          name: 'value',
          type: 'FLOAT',
        },
      ],
      signature: 'apoc.math.coth(value :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'apoc.math.csch',
      category: '',
      description: 'Returns the hyperbolic cosecant.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: FLOAT',
          name: 'value',
          type: 'FLOAT',
        },
      ],
      signature: 'apoc.math.csch(value :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'apoc.math.maxByte',
      category: '',
      description: 'Returns the maximum value of a byte.',
      isBuiltIn: false,
      argumentDescription: [],
      signature: 'apoc.math.maxByte() :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.math.maxDouble',
      category: '',
      description: 'Returns the largest positive finite value of type double.',
      isBuiltIn: false,
      argumentDescription: [],
      signature: 'apoc.math.maxDouble() :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'apoc.math.maxInt',
      category: '',
      description: 'Returns the maximum value of an integer.',
      isBuiltIn: false,
      argumentDescription: [],
      signature: 'apoc.math.maxInt() :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.math.maxLong',
      category: '',
      description: 'Returns the maximum value of a long.',
      isBuiltIn: false,
      argumentDescription: [],
      signature: 'apoc.math.maxLong() :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.math.minByte',
      category: '',
      description: 'Returns the minimum value of a byte.',
      isBuiltIn: false,
      argumentDescription: [],
      signature: 'apoc.math.minByte() :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.math.minDouble',
      category: '',
      description:
        'Returns the smallest positive non-zero value of type double.',
      isBuiltIn: false,
      argumentDescription: [],
      signature: 'apoc.math.minDouble() :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'apoc.math.minInt',
      category: '',
      description: 'Returns the minimum value of an integer.',
      isBuiltIn: false,
      argumentDescription: [],
      signature: 'apoc.math.minInt() :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.math.minLong',
      category: '',
      description: 'Returns the minimum value of a long.',
      isBuiltIn: false,
      argumentDescription: [],
      signature: 'apoc.math.minLong() :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.math.sech',
      category: '',
      description: 'Returns the hyperbolic secant of the given value.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: FLOAT',
          name: 'value',
          type: 'FLOAT',
        },
      ],
      signature: 'apoc.math.sech(value :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'apoc.math.sigmoid',
      category: '',
      description: 'Returns the sigmoid of the given value.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: FLOAT',
          name: 'value',
          type: 'FLOAT',
        },
      ],
      signature: 'apoc.math.sigmoid(value :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'apoc.math.sigmoidPrime',
      category: '',
      description:
        'Returns the sigmoid prime [ sigmoid(val) * (1 - sigmoid(val)) ] of the given value.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: FLOAT',
          name: 'value',
          type: 'FLOAT',
        },
      ],
      signature: 'apoc.math.sigmoidPrime(value :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'apoc.math.sinh',
      category: '',
      description: 'Returns the hyperbolic sine of the given value.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: FLOAT',
          name: 'value',
          type: 'FLOAT',
        },
      ],
      signature: 'apoc.math.sinh(value :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'apoc.math.tanh',
      category: '',
      description: 'Returns the hyperbolic tangent of the given value.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: FLOAT',
          name: 'value',
          type: 'FLOAT',
        },
      ],
      signature: 'apoc.math.tanh(value :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'apoc.meta.cypher.isType',
      category: '',
      description: 'Returns true if the given value matches the given type.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'type :: STRING',
          name: 'type',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.meta.cypher.isType(value :: ANY, type :: STRING) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'apoc.meta.cypher.type',
      category: '',
      description: 'Returns the type name of the given value.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
      ],
      signature: 'apoc.meta.cypher.type(value :: ANY) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.meta.cypher.types',
      category: '',
      description:
        'Returns a `MAP` containing the type names of the given values.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'props :: ANY',
          name: 'props',
          type: 'ANY',
        },
      ],
      signature: 'apoc.meta.cypher.types(props :: ANY) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.meta.nodes.count',
      category: '',
      description:
        'Returns the sum of the `NODE` values with the given labels in the `LIST<STRING>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=[], type=LIST<STRING>}',
          description: 'nodes = [] :: LIST<STRING>',
          name: 'nodes',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.meta.nodes.count(nodes = [] :: LIST<STRING>, config = {} :: MAP) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.node.degree',
      category: '',
      description: 'Returns the total degrees of the given `NODE`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'relTypes =  :: STRING',
          name: 'relTypes',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.node.degree(node :: NODE, relTypes =  :: STRING) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.node.degree.in',
      category: '',
      description:
        'Returns the total number of incoming `RELATIONSHIP` values connected to the given `NODE`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'relTypes =  :: STRING',
          name: 'relTypes',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.node.degree.in(node :: NODE, relTypes =  :: STRING) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.node.degree.out',
      category: '',
      description:
        'Returns the total number of outgoing `RELATIONSHIP` values from the given `NODE`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'relTypes =  :: STRING',
          name: 'relTypes',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.node.degree.out(node :: NODE, relTypes =  :: STRING) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.node.id',
      category: '',
      description: 'Returns the id for the given virtual `NODE`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      signature: 'apoc.node.id(node :: NODE) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.node.labels',
      category: '',
      description: 'Returns the labels for the given virtual `NODE`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      signature: 'apoc.node.labels(node :: NODE) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.node.relationship.exists',
      category: '',
      description:
        'Returns a `BOOLEAN` based on whether the given `NODE` has a connecting `RELATIONSHIP` (or whether the given `NODE` has a connecting `RELATIONSHIP` of the given type and direction).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'relTypes =  :: STRING',
          name: 'relTypes',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.node.relationship.exists(node :: NODE, relTypes =  :: STRING) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'apoc.node.relationship.types',
      category: '',
      description:
        'Returns a `LIST<STRING>` of distinct `RELATIONSHIP` types for the given `NODE`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'relTypes =  :: STRING',
          name: 'relTypes',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.node.relationship.types(node :: NODE, relTypes =  :: STRING) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.node.relationships.exist',
      category: '',
      description:
        'Returns a `BOOLEAN` based on whether the given `NODE` has connecting `RELATIONSHIP` values (or whether the given `NODE` has connecting `RELATIONSHIP` values of the given type and direction).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'relTypes =  :: STRING',
          name: 'relTypes',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.node.relationships.exist(node :: NODE, relTypes =  :: STRING) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'apoc.nodes.connected',
      category: '',
      description:
        'Returns true when a given `NODE` is directly connected to another given `NODE`.\nThis function is optimized for dense nodes.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'startNode :: NODE',
          name: 'startNode',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'endNode :: NODE',
          name: 'endNode',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'types =  :: STRING',
          name: 'types',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.nodes.connected(startNode :: NODE, endNode :: NODE, types =  :: STRING) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'apoc.nodes.isDense',
      category: '',
      description: 'Returns true if the given `NODE` is a dense node.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      signature: 'apoc.nodes.isDense(node :: NODE) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'apoc.nodes.relationship.types',
      category: '',
      description:
        'Returns a `LIST<STRING>` of distinct `RELATIONSHIP` types from the given `LIST<NODE>` values.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: ANY',
          name: 'nodes',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'types =  :: STRING',
          name: 'types',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.nodes.relationship.types(nodes :: ANY, types =  :: STRING) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.nodes.relationships.exist',
      category: '',
      description:
        'Returns a `BOOLEAN` based on whether or not the given `NODE` values have the given `RELATIONSHIP` values.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: ANY',
          name: 'nodes',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'types =  :: STRING',
          name: 'types',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.nodes.relationships.exist(nodes :: ANY, types =  :: STRING) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.number.arabicToRoman',
      category: '',
      description: 'Converts the given Arabic numbers to Roman numbers.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'number :: ANY',
          name: 'number',
          type: 'ANY',
        },
      ],
      signature: 'apoc.number.arabicToRoman(number :: ANY) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.number.exact.add',
      category: '',
      description:
        'Returns the result of adding the two given large numbers (using Java BigDecimal).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'stringA :: STRING',
          name: 'stringA',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'stringB :: STRING',
          name: 'stringB',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.number.exact.add(stringA :: STRING, stringB :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.number.exact.div',
      category: '',
      description:
        'Returns the result of dividing a given large number with another given large number (using Java BigDecimal).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'stringA :: STRING',
          name: 'stringA',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'stringB :: STRING',
          name: 'stringB',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=0, type=INTEGER}',
          description: 'precision = 0 :: INTEGER',
          name: 'precision',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=HALF_UP, type=STRING}',
          description: 'roundingMode = HALF_UP :: STRING',
          name: 'roundingMode',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.number.exact.div(stringA :: STRING, stringB :: STRING, precision = 0 :: INTEGER, roundingMode = HALF_UP :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.number.exact.mul',
      category: '',
      description:
        'Returns the result of multiplying two given large numbers (using Java BigDecimal).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'stringA :: STRING',
          name: 'stringA',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'stringB :: STRING',
          name: 'stringB',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=0, type=INTEGER}',
          description: 'precision = 0 :: INTEGER',
          name: 'precision',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=HALF_UP, type=STRING}',
          description: 'roundingMode = HALF_UP :: STRING',
          name: 'roundingMode',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.number.exact.mul(stringA :: STRING, stringB :: STRING, precision = 0 :: INTEGER, roundingMode = HALF_UP :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.number.exact.sub',
      category: '',
      description:
        'Returns the result of subtracting a given large number from another given large number (using Java BigDecimal).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'stringA :: STRING',
          name: 'stringA',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'stringB :: STRING',
          name: 'stringB',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.number.exact.sub(stringA :: STRING, stringB :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.number.exact.toExact',
      category: '',
      description:
        'Returns the exact value of the given number (using Java BigDecimal).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'number :: INTEGER',
          name: 'number',
          type: 'INTEGER',
        },
      ],
      signature: 'apoc.number.exact.toExact(number :: INTEGER) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.number.exact.toFloat',
      category: '',
      description:
        'Returns the `FLOAT` of the given large number (using Java BigDecimal).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'string :: STRING',
          name: 'string',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=0, type=INTEGER}',
          description: 'precision = 0 :: INTEGER',
          name: 'precision',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=HALF_UP, type=STRING}',
          description: 'roundingMode = HALF_UP :: STRING',
          name: 'roundingMode',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.number.exact.toFloat(string :: STRING, precision = 0 :: INTEGER, roundingMode = HALF_UP :: STRING) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'apoc.number.exact.toInteger',
      category: '',
      description:
        'Returns the `INTEGER` of the given large number (using Java BigDecimal).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'string :: STRING',
          name: 'string',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=0, type=INTEGER}',
          description: 'precision = 0 :: INTEGER',
          name: 'precision',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=HALF_UP, type=STRING}',
          description: 'roundingMode = HALF_UP :: STRING',
          name: 'roundingMode',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.number.exact.toInteger(string :: STRING, precision = 0 :: INTEGER, roundingMode = HALF_UP :: STRING) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.number.format',
      category: '',
      description:
        'Formats the given `INTEGER` or `FLOAT` using the given pattern and language to produce a `STRING`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'number :: ANY',
          name: 'number',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'pattern =  :: STRING',
          name: 'pattern',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'language =  :: STRING',
          name: 'language',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.number.format(number :: ANY, pattern =  :: STRING, language =  :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.number.parseFloat',
      category: '',
      description:
        'Parses the given `STRING` using the given pattern and language to produce a `FLOAT`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'pattern =  :: STRING',
          name: 'pattern',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'language =  :: STRING',
          name: 'language',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.number.parseFloat(text :: STRING, pattern =  :: STRING, language =  :: STRING) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'apoc.number.parseInt',
      category: '',
      description:
        'Parses the given `STRING` using the given pattern and language to produce a `INTEGER`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'pattern =  :: STRING',
          name: 'pattern',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'language =  :: STRING',
          name: 'language',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.number.parseInt(text :: STRING, pattern =  :: STRING, language =  :: STRING) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.number.romanToArabic',
      category: '',
      description: 'Converts the given Roman numbers to Arabic numbers.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'romanNumber :: STRING',
          name: 'romanNumber',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.number.romanToArabic(romanNumber :: STRING) :: INTEGER | FLOAT',
      returnDescription: 'INTEGER | FLOAT',
      aggregating: false,
    },
    {
      name: 'apoc.path.combine',
      category: '',
      description: 'Combines the two given `PATH` values into one `PATH`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'path1 :: PATH',
          name: 'path1',
          type: 'PATH',
        },
        {
          isDeprecated: false,
          description: 'path2 :: PATH',
          name: 'path2',
          type: 'PATH',
        },
      ],
      signature: 'apoc.path.combine(path1 :: PATH, path2 :: PATH) :: PATH',
      returnDescription: 'PATH',
      aggregating: false,
    },
    {
      name: 'apoc.path.create',
      category: '',
      description:
        'Returns a `PATH` from the given start `NODE` and `LIST<RELATIONSHIP>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'startNode :: NODE',
          name: 'startNode',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=[], type=LIST<RELATIONSHIP>}',
          description: 'rels = [] :: LIST<RELATIONSHIP>',
          name: 'rels',
          type: 'LIST<RELATIONSHIP>',
        },
      ],
      signature:
        'apoc.path.create(startNode :: NODE, rels = [] :: LIST<RELATIONSHIP>) :: PATH',
      returnDescription: 'PATH',
      aggregating: false,
    },
    {
      name: 'apoc.path.elements',
      category: '',
      description:
        'Converts the given `PATH` into a `LIST<NODE | RELATIONSHIP>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'path :: PATH',
          name: 'path',
          type: 'PATH',
        },
      ],
      signature: 'apoc.path.elements(path :: PATH) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.path.slice',
      category: '',
      description:
        'Returns a new `PATH` of the given length, taken from the given `PATH` at the given offset.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'path :: PATH',
          name: 'path',
          type: 'PATH',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=0, type=INTEGER}',
          description: 'offset = 0 :: INTEGER',
          name: 'offset',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=-1, type=INTEGER}',
          description: 'length = -1 :: INTEGER',
          name: 'length',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.path.slice(path :: PATH, offset = 0 :: INTEGER, length = -1 :: INTEGER) :: PATH',
      returnDescription: 'PATH',
      aggregating: false,
    },
    {
      name: 'apoc.rel.endNode',
      category: '',
      description:
        'Returns the end `NODE` for the given virtual `RELATIONSHIP`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'rel :: RELATIONSHIP',
          name: 'rel',
          type: 'RELATIONSHIP',
        },
      ],
      signature: 'apoc.rel.endNode(rel :: RELATIONSHIP) :: NODE',
      returnDescription: 'NODE',
      aggregating: false,
    },
    {
      name: 'apoc.rel.id',
      category: '',
      description: 'Returns the id for the given virtual `RELATIONSHIP`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'rel :: RELATIONSHIP',
          name: 'rel',
          type: 'RELATIONSHIP',
        },
      ],
      signature: 'apoc.rel.id(rel :: RELATIONSHIP) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.rel.startNode',
      category: '',
      description:
        'Returns the start `NODE` for the given virtual `RELATIONSHIP`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'rel :: RELATIONSHIP',
          name: 'rel',
          type: 'RELATIONSHIP',
        },
      ],
      signature: 'apoc.rel.startNode(rel :: RELATIONSHIP) :: NODE',
      returnDescription: 'NODE',
      aggregating: false,
    },
    {
      name: 'apoc.rel.type',
      category: '',
      description: 'Returns the type for the given virtual `RELATIONSHIP`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'rel :: RELATIONSHIP',
          name: 'rel',
          type: 'RELATIONSHIP',
        },
      ],
      signature: 'apoc.rel.type(rel :: RELATIONSHIP) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.schema.node.constraintExists',
      category: '',
      description:
        'Returns a `BOOLEAN` depending on whether or not a constraint exists for the given `NODE` label with the given property names.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'labelName :: STRING',
          name: 'labelName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'propertyName :: LIST<STRING>',
          name: 'propertyName',
          type: 'LIST<STRING>',
        },
      ],
      signature:
        'apoc.schema.node.constraintExists(labelName :: STRING, propertyName :: LIST<STRING>) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'apoc.schema.node.indexExists',
      category: '',
      description:
        'Returns a `BOOLEAN` depending on whether or not an index exists for the given `NODE` label with the given property names.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'labelName :: STRING',
          name: 'labelName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'propertyName :: LIST<STRING>',
          name: 'propertyName',
          type: 'LIST<STRING>',
        },
      ],
      signature:
        'apoc.schema.node.indexExists(labelName :: STRING, propertyName :: LIST<STRING>) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'apoc.schema.relationship.constraintExists',
      category: '',
      description:
        'Returns a `BOOLEAN` depending on whether or not a constraint exists for the given `RELATIONSHIP` type with the given property names.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'type :: STRING',
          name: 'type',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'propertyName :: LIST<STRING>',
          name: 'propertyName',
          type: 'LIST<STRING>',
        },
      ],
      signature:
        'apoc.schema.relationship.constraintExists(type :: STRING, propertyName :: LIST<STRING>) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'apoc.schema.relationship.indexExists',
      category: '',
      description:
        'Returns a `BOOLEAN` depending on whether or not an index exists for the given `RELATIONSHIP` type with the given property names.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'type :: STRING',
          name: 'type',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'propertyName :: LIST<STRING>',
          name: 'propertyName',
          type: 'LIST<STRING>',
        },
      ],
      signature:
        'apoc.schema.relationship.indexExists(type :: STRING, propertyName :: LIST<STRING>) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'apoc.scoring.existence',
      category: '',
      description: 'Returns the given score if true, 0 if false.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'score :: INTEGER',
          name: 'score',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'exists :: BOOLEAN',
          name: 'exists',
          type: 'BOOLEAN',
        },
      ],
      signature:
        'apoc.scoring.existence(score :: INTEGER, exists :: BOOLEAN) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'apoc.scoring.pareto',
      category: '',
      description:
        'Applies a Pareto scoring function over the given `INTEGER` values.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'minimumThreshold :: INTEGER',
          name: 'minimumThreshold',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'eightyPercentValue :: INTEGER',
          name: 'eightyPercentValue',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'maximumValue :: INTEGER',
          name: 'maximumValue',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'score :: INTEGER',
          name: 'score',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.scoring.pareto(minimumThreshold :: INTEGER, eightyPercentValue :: INTEGER, maximumValue :: INTEGER, score :: INTEGER) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'apoc.temporal.format',
      category: '',
      description:
        'Formats the given temporal value into the given time format.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'temporal :: ANY',
          name: 'temporal',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=yyyy-MM-dd, type=STRING}',
          description: 'format = yyyy-MM-dd :: STRING',
          name: 'format',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.temporal.format(temporal :: ANY, format = yyyy-MM-dd :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.temporal.formatDuration',
      category: '',
      description: 'Formats the given duration into the given time format.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: ANY',
          name: 'input',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.temporal.formatDuration(input :: ANY, format :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.temporal.toZonedTemporal',
      category: '',
      description:
        'Parses the given date `STRING` using the specified format into the given time zone.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'time :: STRING',
          name: 'time',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=yyyy-MM-dd HH:mm:ss, type=STRING}',
          description: 'format = yyyy-MM-dd HH:mm:ss :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=UTC, type=STRING}',
          description: 'timezone = UTC :: STRING',
          name: 'timezone',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.temporal.toZonedTemporal(time :: STRING, format = yyyy-MM-dd HH:mm:ss :: STRING, timezone = UTC :: STRING) :: ZONED DATETIME',
      returnDescription: 'ZONED DATETIME',
      aggregating: false,
    },
    {
      name: 'apoc.text.base64Decode',
      category: '',
      description: 'Decodes the given Base64 encoded `STRING`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
      ],
      signature: 'apoc.text.base64Decode(text :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.base64Encode',
      category: '',
      description: 'Encodes the given `STRING` with Base64.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
      ],
      signature: 'apoc.text.base64Encode(text :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.base64UrlDecode',
      category: '',
      description: 'Decodes the given Base64 encoded URL.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'url :: STRING',
          name: 'url',
          type: 'STRING',
        },
      ],
      signature: 'apoc.text.base64UrlDecode(url :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.base64UrlEncode',
      category: '',
      description: 'Encodes the given URL with Base64.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'url :: STRING',
          name: 'url',
          type: 'STRING',
        },
      ],
      signature: 'apoc.text.base64UrlEncode(url :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.byteCount',
      category: '',
      description: 'Returns the size of the given `STRING` in bytes.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=UTF-8, type=STRING}',
          description: 'charset = UTF-8 :: STRING',
          name: 'charset',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.text.byteCount(text :: STRING, charset = UTF-8 :: STRING) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.text.bytes',
      category: '',
      description: 'Returns the given `STRING` as bytes.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=UTF-8, type=STRING}',
          description: 'charset = UTF-8 :: STRING',
          name: 'charset',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.text.bytes(text :: STRING, charset = UTF-8 :: STRING) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.text.camelCase',
      category: '',
      description: 'Converts the given `STRING` to camel case.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
      ],
      signature: 'apoc.text.camelCase(text :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.capitalize',
      category: '',
      description: 'Capitalizes the first letter of the given `STRING`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
      ],
      signature: 'apoc.text.capitalize(text :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.capitalizeAll',
      category: '',
      description:
        'Capitalizes the first letter of every word in the given `STRING`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
      ],
      signature: 'apoc.text.capitalizeAll(text :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.charAt',
      category: '',
      description:
        'Returns the `INTEGER` value of the character at the given index.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'index :: INTEGER',
          name: 'index',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.text.charAt(text :: STRING, index :: INTEGER) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.text.clean',
      category: '',
      description:
        'Strips the given `STRING` of everything except alpha numeric characters and converts it to lower case.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
      ],
      signature: 'apoc.text.clean(text :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.code',
      category: '',
      description: 'Converts the `INTEGER` value into a `STRING`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'codepoint :: INTEGER',
          name: 'codepoint',
          type: 'INTEGER',
        },
      ],
      signature: 'apoc.text.code(codepoint :: INTEGER) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.compareCleaned',
      category: '',
      description:
        'Compares two given `STRING` values stripped of everything except alpha numeric characters converted to lower case.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text1 :: STRING',
          name: 'text1',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'text2 :: STRING',
          name: 'text2',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.text.compareCleaned(text1 :: STRING, text2 :: STRING) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'apoc.text.decapitalize',
      category: '',
      description:
        'Turns the first letter of the given `STRING` from upper case to lower case.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
      ],
      signature: 'apoc.text.decapitalize(text :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.decapitalizeAll',
      category: '',
      description:
        'Turns the first letter of every word in the given `STRING` to lower case.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
      ],
      signature: 'apoc.text.decapitalizeAll(text :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.distance',
      category: '',
      description:
        'Compares the two given `STRING` values using the Levenshtein distance algorithm.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text1 :: STRING',
          name: 'text1',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'text2 :: STRING',
          name: 'text2',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.text.distance(text1 :: STRING, text2 :: STRING) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.text.doubleMetaphone',
      category: '',
      description:
        'Returns the double metaphone phonetic encoding of all words in the given `STRING` value.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: STRING',
          name: 'value',
          type: 'STRING',
        },
      ],
      signature: 'apoc.text.doubleMetaphone(value :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.format',
      category: '',
      description: 'Formats the given `STRING` with the given parameters.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'params :: LIST<ANY>',
          name: 'params',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=en, type=STRING}',
          description: 'language = en :: STRING',
          name: 'language',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.text.format(text :: STRING, params :: LIST<ANY>, language = en :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.fuzzyMatch',
      category: '',
      description:
        'Performs a fuzzy match search of the two given `STRING` values.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text1 :: STRING',
          name: 'text1',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'text2 :: STRING',
          name: 'text2',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.text.fuzzyMatch(text1 :: STRING, text2 :: STRING) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'apoc.text.hammingDistance',
      category: '',
      description:
        'Compares the two given `STRING` values using the Hamming distance algorithm.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text1 :: STRING',
          name: 'text1',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'text2 :: STRING',
          name: 'text2',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.text.hammingDistance(text1 :: STRING, text2 :: STRING) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.text.hexCharAt',
      category: '',
      description:
        'Returns the hexadecimal value of the given `STRING` at the given index.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'index :: INTEGER',
          name: 'index',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.text.hexCharAt(text :: STRING, index :: INTEGER) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.hexValue',
      category: '',
      description: 'Returns the hexadecimal value of the given value.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: INTEGER',
          name: 'value',
          type: 'INTEGER',
        },
      ],
      signature: 'apoc.text.hexValue(value :: INTEGER) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.indexOf',
      category: '',
      description:
        'Returns the first occurrence of the lookup `STRING` in the given `STRING`, or -1 if not found.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'lookup :: STRING',
          name: 'lookup',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=0, type=INTEGER}',
          description: 'from = 0 :: INTEGER',
          name: 'from',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=-1, type=INTEGER}',
          description: 'to = -1 :: INTEGER',
          name: 'to',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.text.indexOf(text :: STRING, lookup :: STRING, from = 0 :: INTEGER, to = -1 :: INTEGER) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.text.indexesOf',
      category: '',
      description:
        'Returns all occurrences of the lookup `STRING` in the given `STRING`, or an empty list if not found.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'lookup :: STRING',
          name: 'lookup',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=0, type=INTEGER}',
          description: 'from = 0 :: INTEGER',
          name: 'from',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=-1, type=INTEGER}',
          description: 'to = -1 :: INTEGER',
          name: 'to',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.text.indexesOf(text :: STRING, lookup :: STRING, from = 0 :: INTEGER, to = -1 :: INTEGER) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.text.jaroWinklerDistance',
      category: '',
      description:
        'Compares the two given `STRING` values using the Jaro-Winkler distance algorithm.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text1 :: STRING',
          name: 'text1',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'text2 :: STRING',
          name: 'text2',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.text.jaroWinklerDistance(text1 :: STRING, text2 :: STRING) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'apoc.text.join',
      category: '',
      description: 'Joins the given `STRING` values using the given delimiter.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'texts :: LIST<STRING>',
          name: 'texts',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'delimiter :: STRING',
          name: 'delimiter',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.text.join(texts :: LIST<STRING>, delimiter :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.levenshteinDistance',
      category: '',
      description:
        'Compares the given `STRING` values using the Levenshtein distance algorithm.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text1 :: STRING',
          name: 'text1',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'text2 :: STRING',
          name: 'text2',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.text.levenshteinDistance(text1 :: STRING, text2 :: STRING) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'apoc.text.levenshteinSimilarity',
      category: '',
      description:
        'Returns the similarity (a value within 0 and 1) between the two given `STRING` values based on the Levenshtein distance algorithm.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text1 :: STRING',
          name: 'text1',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'text2 :: STRING',
          name: 'text2',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.text.levenshteinSimilarity(text1 :: STRING, text2 :: STRING) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'apoc.text.lpad',
      category: '',
      description: 'Left pads the given `STRING` by the given width.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'count :: INTEGER',
          name: 'count',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value= , type=STRING}',
          description: 'delimiter =   :: STRING',
          name: 'delimiter',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.text.lpad(text :: STRING, count :: INTEGER, delimiter =   :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.phonetic',
      category: '',
      description:
        'Returns the US_ENGLISH phonetic soundex encoding of all words of the `STRING`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
      ],
      signature: 'apoc.text.phonetic(text :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.random',
      category: '',
      description:
        'Generates a random `STRING` to the given length using a length parameter and an optional `STRING` of valid characters.\nUnsuitable for cryptographic use-cases.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'length :: INTEGER',
          name: 'length',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=A-Za-z0-9, type=STRING}',
          description: 'valid = A-Za-z0-9 :: STRING',
          name: 'valid',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.text.random(length :: INTEGER, valid = A-Za-z0-9 :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.regexGroups',
      category: '',
      description:
        'Returns all groups matching the given regular expression in the given text.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'regex :: STRING',
          name: 'regex',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.text.regexGroups(text :: STRING, regex :: STRING) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.text.regreplace',
      category: '',
      description:
        'Finds and replaces all matches found by the given regular expression with the given replacement.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'regex :: STRING',
          name: 'regex',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'replacement :: STRING',
          name: 'replacement',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.text.regreplace(text :: STRING, regex :: STRING, replacement :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.repeat',
      category: '',
      description:
        'Returns the result of the given item multiplied by the given count.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'item :: STRING',
          name: 'item',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'count :: INTEGER',
          name: 'count',
          type: 'INTEGER',
        },
      ],
      signature: 'apoc.text.repeat(item :: STRING, count :: INTEGER) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.replace',
      category: '',
      description:
        'Finds and replaces all matches found by the given regular expression with the given replacement.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'regex :: STRING',
          name: 'regex',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'replacement :: STRING',
          name: 'replacement',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.text.replace(text :: STRING, regex :: STRING, replacement :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.rpad',
      category: '',
      description: 'Right pads the given `STRING` by the given width.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'count :: INTEGER',
          name: 'count',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value= , type=STRING}',
          description: 'delimiter =   :: STRING',
          name: 'delimiter',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.text.rpad(text :: STRING, count :: INTEGER, delimiter =   :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.slug',
      category: '',
      description:
        'Replaces the whitespace in the given `STRING` with the given delimiter.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=-, type=STRING}',
          description: 'delimiter = - :: STRING',
          name: 'delimiter',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.text.slug(text :: STRING, delimiter = - :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.snakeCase',
      category: '',
      description: 'Converts the given `STRING` to snake case.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
      ],
      signature: 'apoc.text.snakeCase(text :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.sorensenDiceSimilarity',
      category: '',
      description:
        'Compares the two given `STRING` values using the Sørensen–Dice coefficient formula, with the provided IETF language tag.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text1 :: STRING',
          name: 'text1',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'text2 :: STRING',
          name: 'text2',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=en, type=STRING}',
          description: 'languageTag = en :: STRING',
          name: 'languageTag',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.text.sorensenDiceSimilarity(text1 :: STRING, text2 :: STRING, languageTag = en :: STRING) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'apoc.text.split',
      category: '',
      description:
        'Splits the given `STRING` using a given regular expression as a separator.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'regex :: STRING',
          name: 'regex',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=0, type=INTEGER}',
          description: 'limit = 0 :: INTEGER',
          name: 'limit',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.text.split(text :: STRING, regex :: STRING, limit = 0 :: INTEGER) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'apoc.text.swapCase',
      category: '',
      description: 'Swaps the cases in the given `STRING`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
      ],
      signature: 'apoc.text.swapCase(text :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.toCypher',
      category: '',
      description: 'Converts the given value to a Cypher property `STRING`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.text.toCypher(value :: ANY, config = {} :: MAP) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.toUpperCase',
      category: '',
      description: 'Converts the given `STRING` to upper case.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
      ],
      signature: 'apoc.text.toUpperCase(text :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.upperCamelCase',
      category: '',
      description: 'Converts the given `STRING` to upper camel case.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
      ],
      signature: 'apoc.text.upperCamelCase(text :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.urldecode',
      category: '',
      description: 'Decodes the given URL encoded `STRING`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
      ],
      signature: 'apoc.text.urldecode(text :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.text.urlencode',
      category: '',
      description: 'Encodes the given URL `STRING`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
      ],
      signature: 'apoc.text.urlencode(text :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.util.compress',
      category: '',
      description: 'Zips the given `STRING`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'data :: STRING',
          name: 'data',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.util.compress(data :: STRING, config = {} :: MAP) :: BYTEARRAY',
      returnDescription: 'BYTEARRAY',
      aggregating: false,
    },
    {
      name: 'apoc.util.decompress',
      category: '',
      description: 'Unzips the given byte array.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'data :: BYTEARRAY',
          name: 'data',
          type: 'BYTEARRAY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.util.decompress(data :: BYTEARRAY, config = {} :: MAP) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.util.md5',
      category: '',
      description:
        'Returns the MD5 checksum of the concatenation of all `STRING` values in the given `LIST<ANY>`.\nMD5 is a weak hashing algorithm which is unsuitable for cryptographic use-cases.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'values :: LIST<ANY>',
          name: 'values',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'apoc.util.md5(values :: LIST<ANY>) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.util.sha1',
      category: '',
      description:
        'Returns the SHA1 of the concatenation of all `STRING` values in the given `LIST<ANY>`.\nSHA1 is a weak hashing algorithm which is unsuitable for cryptographic use-cases.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'values :: LIST<ANY>',
          name: 'values',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'apoc.util.sha1(values :: LIST<ANY>) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.util.sha256',
      category: '',
      description:
        'Returns the SHA256 of the concatenation of all `STRING` values in the given `LIST<ANY>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'values :: LIST<ANY>',
          name: 'values',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'apoc.util.sha256(values :: LIST<ANY>) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.util.sha384',
      category: '',
      description:
        'Returns the SHA384 of the concatenation of all `STRING` values in the given `LIST<ANY>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'values :: LIST<ANY>',
          name: 'values',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'apoc.util.sha384(values :: LIST<ANY>) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.util.sha512',
      category: '',
      description:
        'Returns the SHA512 of the concatenation of all `STRING` values in the `LIST<ANY>`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'values :: LIST<ANY>',
          name: 'values',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'apoc.util.sha512(values :: LIST<ANY>) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.util.validatePredicate',
      category: '',
      description:
        'If the given predicate is true an exception is thrown, otherwise it returns true (for use inside `WHERE` subclauses).',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'predicate :: BOOLEAN',
          name: 'predicate',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'message :: STRING',
          name: 'message',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'params :: LIST<ANY>',
          name: 'params',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'apoc.util.validatePredicate(predicate :: BOOLEAN, message :: STRING, params :: LIST<ANY>) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'apoc.version',
      category: '',
      description: 'Returns the APOC version currently installed.',
      isBuiltIn: false,
      argumentDescription: [],
      signature: 'apoc.version() :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'apoc.xml.parse',
      category: '',
      description: 'Parses the given XML `STRING` as a `MAP`.',
      isBuiltIn: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'data :: STRING',
          name: 'data',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=/, type=STRING}',
          description: 'path = / :: STRING',
          name: 'path',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=false, type=BOOLEAN}',
          description: 'simple = false :: BOOLEAN',
          name: 'simple',
          type: 'BOOLEAN',
        },
      ],
      signature:
        'apoc.xml.parse(data :: STRING, path = / :: STRING, config = {} :: MAP, simple = false :: BOOLEAN) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'asin',
      category: 'Trigonometric',
      description: 'Returns the arcsine of a `FLOAT` in radians.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: FLOAT',
          name: 'input',
          type: 'FLOAT',
        },
      ],
      signature: 'asin(input :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'atan',
      category: 'Trigonometric',
      description: 'Returns the arctangent of a `FLOAT` in radians.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: FLOAT',
          name: 'input',
          type: 'FLOAT',
        },
      ],
      signature: 'atan(input :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'atan2',
      category: 'Trigonometric',
      description:
        'Returns the arctangent2 of a set of coordinates in radians.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'y :: FLOAT',
          name: 'y',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: 'x :: FLOAT',
          name: 'x',
          type: 'FLOAT',
        },
      ],
      signature: 'atan2(y :: FLOAT, x :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'avg',
      category: 'Aggregating',
      description:
        'Returns the average of a set of `INTEGER`, `FLOAT` or `DURATION` values.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: INTEGER | FLOAT | DURATION',
          name: 'input',
          type: 'INTEGER | FLOAT | DURATION',
        },
      ],
      signature:
        'avg(input :: INTEGER | FLOAT | DURATION) :: INTEGER | FLOAT | DURATION',
      returnDescription: 'INTEGER | FLOAT | DURATION',
      aggregating: true,
    },
    {
      name: 'ceil',
      category: 'Numeric',
      description:
        'Returns the smallest `FLOAT` that is greater than or equal to a number and equal to an `INTEGER`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: FLOAT',
          name: 'input',
          type: 'FLOAT',
        },
      ],
      signature: 'ceil(input :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'char_length',
      category: 'Scalar',
      description: 'Returns the number of Unicode characters in a `STRING`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: STRING',
          name: 'input',
          type: 'STRING',
        },
      ],
      signature: 'char_length(input :: STRING) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'character_length',
      category: 'Scalar',
      description: 'Returns the number of Unicode characters in a `STRING`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: STRING',
          name: 'input',
          type: 'STRING',
        },
      ],
      signature: 'character_length(input :: STRING) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'coalesce',
      category: 'Scalar',
      description: 'Returns the first non-null value in a list of expressions.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: ANY',
          name: 'input',
          type: 'ANY',
        },
      ],
      signature: 'coalesce(input :: ANY) :: ANY',
      returnDescription: 'ANY',
      aggregating: false,
    },
    {
      name: 'collect',
      category: 'Aggregating',
      description:
        'Returns a list containing the values returned by an expression.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: ANY',
          name: 'input',
          type: 'ANY',
        },
      ],
      signature: 'collect(input :: ANY) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: true,
    },
    {
      name: 'cos',
      category: 'Trigonometric',
      description: 'Returns the cosine of a `FLOAT`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: FLOAT',
          name: 'input',
          type: 'FLOAT',
        },
      ],
      signature: 'cos(input :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'cot',
      category: 'Trigonometric',
      description: 'Returns the cotangent of a `FLOAT`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: FLOAT',
          name: 'input',
          type: 'FLOAT',
        },
      ],
      signature: 'cot(input :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'count',
      category: 'Aggregating',
      description: 'Returns the number of values or rows.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: ANY',
          name: 'input',
          type: 'ANY',
        },
      ],
      signature: 'count(input :: ANY) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: true,
    },
    {
      name: 'date',
      category: 'Temporal',
      description: 'Creates a `DATE` instant.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'input',
          type: 'ANY',
        },
      ],
      signature: 'date(input = DEFAULT_TEMPORAL_ARGUMENT :: ANY) :: DATE',
      returnDescription: 'DATE',
      aggregating: false,
    },
    {
      name: 'date.realtime',
      category: 'Temporal',
      description:
        'Returns the current `DATE` instant using the realtime clock.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'timezone',
          type: 'ANY',
        },
      ],
      signature:
        'date.realtime(timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY) :: DATE',
      returnDescription: 'DATE',
      aggregating: false,
    },
    {
      name: 'date.statement',
      category: 'Temporal',
      description:
        'Returns the current `DATE` instant using the statement clock.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'timezone',
          type: 'ANY',
        },
      ],
      signature:
        'date.statement(timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY) :: DATE',
      returnDescription: 'DATE',
      aggregating: false,
    },
    {
      name: 'date.transaction',
      category: 'Temporal',
      description:
        'Returns the current `DATE` instant using the transaction clock.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'timezone',
          type: 'ANY',
        },
      ],
      signature:
        'date.transaction(timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY) :: DATE',
      returnDescription: 'DATE',
      aggregating: false,
    },
    {
      name: 'date.truncate',
      category: 'Temporal',
      description:
        'Truncates the given temporal value to a `DATE` instant using the specified unit.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'unit :: STRING',
          name: 'unit',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'input',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=null, type=MAP}',
          description: 'fields = null :: MAP',
          name: 'fields',
          type: 'MAP',
        },
      ],
      signature:
        'date.truncate(unit :: STRING, input = DEFAULT_TEMPORAL_ARGUMENT :: ANY, fields = null :: MAP) :: DATE',
      returnDescription: 'DATE',
      aggregating: false,
    },
    {
      name: 'datetime',
      category: 'Temporal',
      description: 'Creates a `ZONED DATETIME` instant.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'input',
          type: 'ANY',
        },
      ],
      signature:
        'datetime(input = DEFAULT_TEMPORAL_ARGUMENT :: ANY) :: ZONED DATETIME',
      returnDescription: 'ZONED DATETIME',
      aggregating: false,
    },
    {
      name: 'datetime.fromepoch',
      category: 'Temporal',
      description:
        'Creates a `ZONED DATETIME` given the seconds and nanoseconds since the start of the epoch.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'seconds :: INTEGER | FLOAT',
          name: 'seconds',
          type: 'INTEGER | FLOAT',
        },
        {
          isDeprecated: false,
          description: 'nanoseconds :: INTEGER | FLOAT',
          name: 'nanoseconds',
          type: 'INTEGER | FLOAT',
        },
      ],
      signature:
        'datetime.fromepoch(seconds :: INTEGER | FLOAT, nanoseconds :: INTEGER | FLOAT) :: ZONED DATETIME',
      returnDescription: 'ZONED DATETIME',
      aggregating: false,
    },
    {
      name: 'datetime.fromepochmillis',
      category: 'Temporal',
      description:
        'Creates a `ZONED DATETIME` given the milliseconds since the start of the epoch.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'milliseconds :: INTEGER | FLOAT',
          name: 'milliseconds',
          type: 'INTEGER | FLOAT',
        },
      ],
      signature:
        'datetime.fromepochmillis(milliseconds :: INTEGER | FLOAT) :: ZONED DATETIME',
      returnDescription: 'ZONED DATETIME',
      aggregating: false,
    },
    {
      name: 'datetime.realtime',
      category: 'Temporal',
      description:
        'Returns the current `ZONED DATETIME` instant using the realtime clock.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'timezone',
          type: 'ANY',
        },
      ],
      signature:
        'datetime.realtime(timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY) :: ZONED DATETIME',
      returnDescription: 'ZONED DATETIME',
      aggregating: false,
    },
    {
      name: 'datetime.statement',
      category: 'Temporal',
      description:
        'Returns the current `ZONED DATETIME` instant using the statement clock.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'timezone',
          type: 'ANY',
        },
      ],
      signature:
        'datetime.statement(timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY) :: ZONED DATETIME',
      returnDescription: 'ZONED DATETIME',
      aggregating: false,
    },
    {
      name: 'datetime.transaction',
      category: 'Temporal',
      description:
        'Returns the current `ZONED DATETIME` instant using the transaction clock.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'timezone',
          type: 'ANY',
        },
      ],
      signature:
        'datetime.transaction(timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY) :: ZONED DATETIME',
      returnDescription: 'ZONED DATETIME',
      aggregating: false,
    },
    {
      name: 'datetime.truncate',
      category: 'Temporal',
      description:
        'Truncates the given temporal value to a `ZONED DATETIME` instant using the specified unit.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'unit :: STRING',
          name: 'unit',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'input',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=null, type=MAP}',
          description: 'fields = null :: MAP',
          name: 'fields',
          type: 'MAP',
        },
      ],
      signature:
        'datetime.truncate(unit :: STRING, input = DEFAULT_TEMPORAL_ARGUMENT :: ANY, fields = null :: MAP) :: ZONED DATETIME',
      returnDescription: 'ZONED DATETIME',
      aggregating: false,
    },
    {
      name: 'db.nameFromElementId',
      category: 'Database',
      description: 'Resolves the database name for the given element id',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'elementId :: STRING',
          name: 'elementId',
          type: 'STRING',
        },
      ],
      signature: 'db.nameFromElementId(elementId :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'degrees',
      category: 'Trigonometric',
      description: 'Converts radians to degrees.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: FLOAT',
          name: 'input',
          type: 'FLOAT',
        },
      ],
      signature: 'degrees(input :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'duration',
      category: 'Temporal',
      description: 'Creates a `DURATION` value.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: ANY',
          name: 'input',
          type: 'ANY',
        },
      ],
      signature: 'duration(input :: ANY) :: DURATION',
      returnDescription: 'DURATION',
      aggregating: false,
    },
    {
      name: 'duration.between',
      category: 'Temporal',
      description:
        'Computes the `DURATION` between the `from` instant (inclusive) and the `to` instant (exclusive) in logical units.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'from :: ANY',
          name: 'from',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'to :: ANY',
          name: 'to',
          type: 'ANY',
        },
      ],
      signature: 'duration.between(from :: ANY, to :: ANY) :: DURATION',
      returnDescription: 'DURATION',
      aggregating: false,
    },
    {
      name: 'duration.inDays',
      category: 'Temporal',
      description:
        'Computes the `DURATION` between the `from` instant (inclusive) and the `to` instant (exclusive) in days.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'from :: ANY',
          name: 'from',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'to :: ANY',
          name: 'to',
          type: 'ANY',
        },
      ],
      signature: 'duration.inDays(from :: ANY, to :: ANY) :: DURATION',
      returnDescription: 'DURATION',
      aggregating: false,
    },
    {
      name: 'duration.inMonths',
      category: 'Temporal',
      description:
        'Computes the `DURATION` between the `from` instant (inclusive) and the `to` instant (exclusive) in months.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'from :: ANY',
          name: 'from',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'to :: ANY',
          name: 'to',
          type: 'ANY',
        },
      ],
      signature: 'duration.inMonths(from :: ANY, to :: ANY) :: DURATION',
      returnDescription: 'DURATION',
      aggregating: false,
    },
    {
      name: 'duration.inSeconds',
      category: 'Temporal',
      description:
        'Computes the `DURATION` between the `from` instant (inclusive) and the `to` instant (exclusive) in seconds.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'from :: ANY',
          name: 'from',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'to :: ANY',
          name: 'to',
          type: 'ANY',
        },
      ],
      signature: 'duration.inSeconds(from :: ANY, to :: ANY) :: DURATION',
      returnDescription: 'DURATION',
      aggregating: false,
    },
    {
      name: 'e',
      category: 'Logarithmic',
      description: 'Returns the base of the natural logarithm, e.',
      isBuiltIn: true,
      argumentDescription: [],
      signature: 'e() :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'elementId',
      category: 'Scalar',
      description: 'Returns the element id of a `NODE` or `RELATIONSHIP`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: NODE | RELATIONSHIP',
          name: 'input',
          type: 'NODE | RELATIONSHIP',
        },
      ],
      signature: 'elementId(input :: NODE | RELATIONSHIP) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'endNode',
      category: 'Scalar',
      description: 'Returns the end `NODE` of a `RELATIONSHIP`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: RELATIONSHIP',
          name: 'input',
          type: 'RELATIONSHIP',
        },
      ],
      signature: 'endNode(input :: RELATIONSHIP) :: NODE',
      returnDescription: 'NODE',
      aggregating: false,
    },
    {
      name: 'exists',
      category: 'Predicate',
      description:
        'Returns true if a match for the pattern exists in the graph.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: ANY',
          name: 'input',
          type: 'ANY',
        },
      ],
      signature: 'exists(input :: ANY) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'exp',
      category: 'Logarithmic',
      description:
        'Returns e^n, where e is the base of the natural logarithm, and n is the value of the argument expression.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: FLOAT',
          name: 'input',
          type: 'FLOAT',
        },
      ],
      signature: 'exp(input :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'file',
      category: 'Scalar',
      description:
        'Returns the absolute path of the file that LOAD CSV is using.',
      isBuiltIn: true,
      argumentDescription: [],
      signature: 'file() :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'floor',
      category: 'Numeric',
      description:
        'Returns the largest `FLOAT` that is less than or equal to a number and equal to an `INTEGER`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: FLOAT',
          name: 'input',
          type: 'FLOAT',
        },
      ],
      signature: 'floor(input :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'graph.names',
      category: 'Graph',
      description: 'Lists the names of graphs in the current database.',
      isBuiltIn: true,
      argumentDescription: [],
      signature: 'graph.names() :: LIST<STRING>',
      returnDescription: 'LIST<STRING>',
      aggregating: false,
    },
    {
      name: 'graph.propertiesByName',
      category: 'Graph',
      description: 'Returns the `MAP` of properties associated with a graph.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'graphName :: STRING',
          name: 'graphName',
          type: 'STRING',
        },
      ],
      signature: 'graph.propertiesByName(graphName :: STRING) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'haversin',
      category: 'Trigonometric',
      description: 'Returns half the versine of a number.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: FLOAT',
          name: 'input',
          type: 'FLOAT',
        },
      ],
      signature: 'haversin(input :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'head',
      category: 'Scalar',
      description: 'Returns the first element in a `LIST<ANY>`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'list :: LIST<ANY>',
          name: 'list',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'head(list :: LIST<ANY>) :: ANY',
      returnDescription: 'ANY',
      aggregating: false,
    },
    {
      name: 'id',
      category: 'Scalar',
      description: 'Returns the id of a `NODE` or `RELATIONSHIP`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: NODE | RELATIONSHIP',
          name: 'input',
          type: 'NODE | RELATIONSHIP',
        },
      ],
      signature: 'id(input :: NODE | RELATIONSHIP) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'isEmpty',
      category: 'Predicate',
      description: 'Checks whether a `STRING`, `MAP` or `LIST<ANY>` is empty.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: STRING | MAP | LIST<ANY>',
          name: 'input',
          type: 'STRING | MAP | LIST<ANY>',
        },
      ],
      signature: 'isEmpty(input :: STRING | MAP | LIST<ANY>) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'isNaN',
      category: 'Numeric',
      description: 'Returns whether the given `INTEGER` or `FLOAT` is NaN.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: INTEGER | FLOAT',
          name: 'input',
          type: 'INTEGER | FLOAT',
        },
      ],
      signature: 'isNaN(input :: INTEGER | FLOAT) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'keys',
      category: 'List',
      description:
        'Returns a `LIST<STRING>` containing the `STRING` representations for all the property names of a `NODE`, `RELATIONSHIP` or `MAP`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: NODE | RELATIONSHIP | MAP',
          name: 'input',
          type: 'NODE | RELATIONSHIP | MAP',
        },
      ],
      signature: 'keys(input :: NODE | RELATIONSHIP | MAP) :: LIST<STRING>',
      returnDescription: 'LIST<STRING>',
      aggregating: false,
    },
    {
      name: 'labels',
      category: 'List',
      description:
        'Returns a `LIST<STRING>` containing the `STRING` representations for all the labels of a `NODE`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: NODE',
          name: 'input',
          type: 'NODE',
        },
      ],
      signature: 'labels(input :: NODE) :: LIST<STRING>',
      returnDescription: 'LIST<STRING>',
      aggregating: false,
    },
    {
      name: 'last',
      category: 'Scalar',
      description: 'Returns the last element in a `LIST<ANY>`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'list :: LIST<ANY>',
          name: 'list',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'last(list :: LIST<ANY>) :: ANY',
      returnDescription: 'ANY',
      aggregating: false,
    },
    {
      name: 'left',
      category: 'String',
      description:
        'Returns a `STRING` containing the specified number (`INTEGER`) of leftmost characters in the given `STRING`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'original :: STRING',
          name: 'original',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'length :: INTEGER',
          name: 'length',
          type: 'INTEGER',
        },
      ],
      signature: 'left(original :: STRING, length :: INTEGER) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'length',
      category: 'Scalar',
      description: 'Returns the length of a `PATH`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: PATH',
          name: 'input',
          type: 'PATH',
        },
      ],
      signature: 'length(input :: PATH) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'linenumber',
      category: 'Scalar',
      description: 'Returns the line number that LOAD CSV is currently using.',
      isBuiltIn: true,
      argumentDescription: [],
      signature: 'linenumber() :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'localdatetime',
      category: 'Temporal',
      description: 'Creates a `LOCAL DATETIME` instant.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'input',
          type: 'ANY',
        },
      ],
      signature:
        'localdatetime(input = DEFAULT_TEMPORAL_ARGUMENT :: ANY) :: LOCAL DATETIME',
      returnDescription: 'LOCAL DATETIME',
      aggregating: false,
    },
    {
      name: 'localdatetime.realtime',
      category: 'Temporal',
      description:
        'Returns the current `LOCAL DATETIME` instant using the realtime clock.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'timezone',
          type: 'ANY',
        },
      ],
      signature:
        'localdatetime.realtime(timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY) :: LOCAL DATETIME',
      returnDescription: 'LOCAL DATETIME',
      aggregating: false,
    },
    {
      name: 'localdatetime.statement',
      category: 'Temporal',
      description:
        'Returns the current `LOCAL DATETIME` instant using the statement clock.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'timezone',
          type: 'ANY',
        },
      ],
      signature:
        'localdatetime.statement(timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY) :: LOCAL DATETIME',
      returnDescription: 'LOCAL DATETIME',
      aggregating: false,
    },
    {
      name: 'localdatetime.transaction',
      category: 'Temporal',
      description:
        'Returns the current `LOCAL DATETIME` instant using the transaction clock.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'timezone',
          type: 'ANY',
        },
      ],
      signature:
        'localdatetime.transaction(timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY) :: LOCAL DATETIME',
      returnDescription: 'LOCAL DATETIME',
      aggregating: false,
    },
    {
      name: 'localdatetime.truncate',
      category: 'Temporal',
      description:
        'Truncates the given temporal value to a `LOCAL DATETIME` instant using the specified unit.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'unit :: STRING',
          name: 'unit',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'input',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=null, type=MAP}',
          description: 'fields = null :: MAP',
          name: 'fields',
          type: 'MAP',
        },
      ],
      signature:
        'localdatetime.truncate(unit :: STRING, input = DEFAULT_TEMPORAL_ARGUMENT :: ANY, fields = null :: MAP) :: LOCAL DATETIME',
      returnDescription: 'LOCAL DATETIME',
      aggregating: false,
    },
    {
      name: 'localtime',
      category: 'Temporal',
      description: 'Creates a `LOCAL TIME` instant.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'input',
          type: 'ANY',
        },
      ],
      signature:
        'localtime(input = DEFAULT_TEMPORAL_ARGUMENT :: ANY) :: LOCAL TIME',
      returnDescription: 'LOCAL TIME',
      aggregating: false,
    },
    {
      name: 'localtime.realtime',
      category: 'Temporal',
      description:
        'Returns the current `LOCAL TIME` instant using the realtime clock.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'timezone',
          type: 'ANY',
        },
      ],
      signature:
        'localtime.realtime(timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY) :: LOCAL TIME',
      returnDescription: 'LOCAL TIME',
      aggregating: false,
    },
    {
      name: 'localtime.statement',
      category: 'Temporal',
      description:
        'Returns the current `LOCAL TIME` instant using the statement clock.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'timezone',
          type: 'ANY',
        },
      ],
      signature:
        'localtime.statement(timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY) :: LOCAL TIME',
      returnDescription: 'LOCAL TIME',
      aggregating: false,
    },
    {
      name: 'localtime.transaction',
      category: 'Temporal',
      description:
        'Returns the current `LOCAL TIME` instant using the transaction clock.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'timezone',
          type: 'ANY',
        },
      ],
      signature:
        'localtime.transaction(timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY) :: LOCAL TIME',
      returnDescription: 'LOCAL TIME',
      aggregating: false,
    },
    {
      name: 'localtime.truncate',
      category: 'Temporal',
      description:
        'Truncates the given temporal value to a `LOCAL TIME` instant using the specified unit.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'unit :: STRING',
          name: 'unit',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'input',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=null, type=MAP}',
          description: 'fields = null :: MAP',
          name: 'fields',
          type: 'MAP',
        },
      ],
      signature:
        'localtime.truncate(unit :: STRING, input = DEFAULT_TEMPORAL_ARGUMENT :: ANY, fields = null :: MAP) :: LOCAL TIME',
      returnDescription: 'LOCAL TIME',
      aggregating: false,
    },
    {
      name: 'log',
      category: 'Logarithmic',
      description: 'Returns the natural logarithm of a `FLOAT`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: FLOAT',
          name: 'input',
          type: 'FLOAT',
        },
      ],
      signature: 'log(input :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'log10',
      category: 'Logarithmic',
      description: 'Returns the common logarithm (base 10) of a `FLOAT`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: FLOAT',
          name: 'input',
          type: 'FLOAT',
        },
      ],
      signature: 'log10(input :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'ltrim',
      category: 'String',
      description:
        'Returns the given `STRING` with leading whitespace removed.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: STRING',
          name: 'input',
          type: 'STRING',
        },
      ],
      signature: 'ltrim(input :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'max',
      category: 'Aggregating',
      description: 'Returns the maximum value in a set of values.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: ANY',
          name: 'input',
          type: 'ANY',
        },
      ],
      signature: 'max(input :: ANY) :: ANY',
      returnDescription: 'ANY',
      aggregating: true,
    },
    {
      name: 'min',
      category: 'Aggregating',
      description: 'Returns the minimum value in a set of values.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: ANY',
          name: 'input',
          type: 'ANY',
        },
      ],
      signature: 'min(input :: ANY) :: ANY',
      returnDescription: 'ANY',
      aggregating: true,
    },
    {
      name: 'nodes',
      category: 'List',
      description:
        'Returns a `LIST<NODE>` containing all the `NODE` values in a `PATH`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: PATH',
          name: 'input',
          type: 'PATH',
        },
      ],
      signature: 'nodes(input :: PATH) :: LIST<NODE>',
      returnDescription: 'LIST<NODE>',
      aggregating: false,
    },
    {
      name: 'none',
      category: 'Predicate',
      description:
        'Returns true if the predicate holds for no element in the given `LIST<ANY>`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'variable :: ANY',
          name: 'variable',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'list :: LIST<ANY>',
          name: 'list',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'none(variable :: VARIABLE IN list :: LIST<ANY> WHERE predicate :: ANY) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'nullIf',
      category: 'Scalar',
      description:
        'Returns null if the two given parameters are equivalent, otherwise returns the value of the first parameter.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'v1 :: ANY',
          name: 'v1',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'v2 :: ANY',
          name: 'v2',
          type: 'ANY',
        },
      ],
      signature: 'nullIf(v1 :: ANY, v2 :: ANY) :: ANY',
      returnDescription: 'ANY',
      aggregating: false,
    },
    {
      name: 'percentileCont',
      category: 'Aggregating',
      description:
        'Returns the percentile of a value over a group using linear interpolation.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: FLOAT',
          name: 'input',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: 'percentile :: FLOAT',
          name: 'percentile',
          type: 'FLOAT',
        },
      ],
      signature: 'percentileCont(input :: FLOAT, percentile :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: true,
    },
    {
      name: 'percentileDisc',
      category: 'Aggregating',
      description:
        'Returns the nearest `INTEGER` or `FLOAT` value to the given percentile over a group using a rounding method.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: INTEGER | FLOAT',
          name: 'input',
          type: 'INTEGER | FLOAT',
        },
        {
          isDeprecated: false,
          description: 'percentile :: FLOAT',
          name: 'percentile',
          type: 'FLOAT',
        },
      ],
      signature:
        'percentileDisc(input :: INTEGER | FLOAT, percentile :: FLOAT) :: INTEGER | FLOAT',
      returnDescription: 'INTEGER | FLOAT',
      aggregating: true,
    },
    {
      name: 'pi',
      category: 'Trigonometric',
      description: 'Returns the mathematical constant pi.',
      isBuiltIn: true,
      argumentDescription: [],
      signature: 'pi() :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'point',
      category: 'Spatial',
      description:
        'Returns a 2D or 3D point object, given two or respectively three coordinate values in the Cartesian coordinate system or WGS 84 geographic coordinate system.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: MAP',
          name: 'input',
          type: 'MAP',
        },
      ],
      signature: 'point(input :: MAP) :: POINT',
      returnDescription: 'POINT',
      aggregating: false,
    },
    {
      name: 'point.distance',
      category: 'Spatial',
      description:
        'Returns a `FLOAT` representing the geodesic distance between any two points in the same CRS.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'from :: POINT',
          name: 'from',
          type: 'POINT',
        },
        {
          isDeprecated: false,
          description: 'to :: POINT',
          name: 'to',
          type: 'POINT',
        },
      ],
      signature: 'point.distance(from :: POINT, to :: POINT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'point.withinBBox',
      category: 'Spatial',
      description:
        'Returns true if the provided point is within the bounding box defined by the two provided points.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'point :: POINT',
          name: 'point',
          type: 'POINT',
        },
        {
          isDeprecated: false,
          description: 'lowerLeft :: POINT',
          name: 'lowerLeft',
          type: 'POINT',
        },
        {
          isDeprecated: false,
          description: 'upperRight :: POINT',
          name: 'upperRight',
          type: 'POINT',
        },
      ],
      signature:
        'point.withinBBox(point :: POINT, lowerLeft :: POINT, upperRight :: POINT) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'properties',
      category: 'Scalar',
      description:
        'Returns a `MAP` containing all the properties of a `NODE`, `RELATIONSHIP` or `MAP`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: NODE | RELATIONSHIP | MAP',
          name: 'input',
          type: 'NODE | RELATIONSHIP | MAP',
        },
      ],
      signature: 'properties(input :: NODE | RELATIONSHIP | MAP) :: MAP',
      returnDescription: 'MAP',
      aggregating: false,
    },
    {
      name: 'radians',
      category: 'Trigonometric',
      description: 'Converts degrees to radians.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: FLOAT',
          name: 'input',
          type: 'FLOAT',
        },
      ],
      signature: 'radians(input :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'rand',
      category: 'Numeric',
      description:
        'Returns a random `FLOAT` in the range from 0 (inclusive) to 1 (exclusive).',
      isBuiltIn: true,
      argumentDescription: [],
      signature: 'rand() :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'randomUUID',
      category: 'Scalar',
      description: 'Generates a random UUID.',
      isBuiltIn: true,
      argumentDescription: [],
      signature: 'randomUUID() :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'range',
      category: 'List',
      description:
        'Returns a `LIST<INTEGER>` comprising all `INTEGER` values within a specified range.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'start :: INTEGER',
          name: 'start',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'end :: INTEGER',
          name: 'end',
          type: 'INTEGER',
        },
      ],
      signature: 'range(start :: INTEGER, end :: INTEGER) :: LIST<INTEGER>',
      returnDescription: 'LIST<INTEGER>',
      aggregating: false,
    },
    {
      name: 'range',
      category: 'List',
      description:
        'Returns a `LIST<INTEGER>` comprising all `INTEGER` values within a specified range created with step length.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'start :: INTEGER',
          name: 'start',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'end :: INTEGER',
          name: 'end',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'step :: INTEGER',
          name: 'step',
          type: 'INTEGER',
        },
      ],
      signature:
        'range(start :: INTEGER, end :: INTEGER, step :: INTEGER) :: LIST<INTEGER>',
      returnDescription: 'LIST<INTEGER>',
      aggregating: false,
    },
    {
      name: 'reduce',
      category: 'List',
      description:
        'Runs an expression against individual elements of a `LIST<ANY>`, storing the result of the expression in an accumulator.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'accumulator :: ANY',
          name: 'accumulator',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'variable :: LIST<ANY>',
          name: 'variable',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'reduce(accumulator :: VARIABLE = initial :: ANY, variable :: VARIABLE IN list :: LIST<ANY> | expression :: ANY) :: ANY',
      returnDescription: 'ANY',
      aggregating: false,
    },
    {
      name: 'relationships',
      category: 'List',
      description:
        'Returns a `LIST<RELATIONSHIP>` containing all the `RELATIONSHIP` values in a `PATH`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: PATH',
          name: 'input',
          type: 'PATH',
        },
      ],
      signature: 'relationships(input :: PATH) :: LIST<RELATIONSHIP>',
      returnDescription: 'LIST<RELATIONSHIP>',
      aggregating: false,
    },
    {
      name: 'replace',
      category: 'String',
      description:
        'Returns a `STRING` in which all occurrences of a specified search `STRING` in the given `STRING` have been replaced by another (specified) replacement `STRING`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'original :: STRING',
          name: 'original',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'search :: STRING',
          name: 'search',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'replace :: STRING',
          name: 'replace',
          type: 'STRING',
        },
      ],
      signature:
        'replace(original :: STRING, search :: STRING, replace :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'reverse',
      category: 'String',
      description:
        'Returns a `STRING` or `LIST<ANY>` in which the order of all characters or elements in the given `STRING` or `LIST<ANY>` have been reversed.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: STRING | LIST<ANY>',
          name: 'input',
          type: 'STRING | LIST<ANY>',
        },
      ],
      signature: 'reverse(input :: STRING | LIST<ANY>) :: STRING | LIST<ANY>',
      returnDescription: 'STRING | LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'right',
      category: 'String',
      description:
        'Returns a `STRING` containing the specified number of rightmost characters in the given `STRING`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'original :: STRING',
          name: 'original',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'length :: INTEGER',
          name: 'length',
          type: 'INTEGER',
        },
      ],
      signature: 'right(original :: STRING, length :: INTEGER) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'round',
      category: 'Numeric',
      description:
        'Returns the value of a number rounded to the nearest `INTEGER`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: FLOAT',
          name: 'input',
          type: 'FLOAT',
        },
      ],
      signature: 'round(input :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'round',
      category: 'Numeric',
      description:
        'Returns the value of a number rounded to the specified precision using rounding mode HALF_UP.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: FLOAT',
          name: 'value',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: 'precision :: INTEGER | FLOAT',
          name: 'precision',
          type: 'INTEGER | FLOAT',
        },
      ],
      signature: 'round(value :: FLOAT, precision :: INTEGER | FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'round',
      category: 'Numeric',
      description:
        'Returns the value of a number rounded to the specified precision with the specified rounding mode.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'value :: FLOAT',
          name: 'value',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: 'precision :: INTEGER | FLOAT',
          name: 'precision',
          type: 'INTEGER | FLOAT',
        },
        {
          isDeprecated: false,
          description: 'mode :: STRING',
          name: 'mode',
          type: 'STRING',
        },
      ],
      signature:
        'round(value :: FLOAT, precision :: INTEGER | FLOAT, mode :: STRING) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'rtrim',
      category: 'String',
      description:
        'Returns the given `STRING` with trailing whitespace removed.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: STRING',
          name: 'input',
          type: 'STRING',
        },
      ],
      signature: 'rtrim(input :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'sign',
      category: 'Numeric',
      description:
        'Returns the signum of an `INTEGER` or `FLOAT`: 0 if the number is 0, -1 for any negative number, and 1 for any positive number.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: INTEGER | FLOAT',
          name: 'input',
          type: 'INTEGER | FLOAT',
        },
      ],
      signature: 'sign(input :: INTEGER | FLOAT) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'sin',
      category: 'Trigonometric',
      description: 'Returns the sine of a `FLOAT`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: FLOAT',
          name: 'input',
          type: 'FLOAT',
        },
      ],
      signature: 'sin(input :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'single',
      category: 'Predicate',
      description:
        'Returns true if the predicate holds for exactly one of the elements in the given `LIST<ANY>`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'variable :: ANY',
          name: 'variable',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'list :: LIST<ANY>',
          name: 'list',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'single(variable :: VARIABLE IN list :: LIST<ANY> WHERE predicate :: ANY) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'size',
      category: 'Scalar',
      description:
        'Returns the number of items in a `LIST<ANY>` or the number of Unicode characters in a `STRING`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: STRING | LIST<ANY>',
          name: 'input',
          type: 'STRING | LIST<ANY>',
        },
      ],
      signature: 'size(input :: STRING | LIST<ANY>) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'split',
      category: 'String',
      description:
        'Returns a `LIST<STRING>` resulting from the splitting of the given `STRING` around matches of the given delimiter(s).',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'original :: STRING',
          name: 'original',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'splitDelimiters :: STRING | LIST<STRING>',
          name: 'splitDelimiters',
          type: 'STRING | LIST<STRING>',
        },
      ],
      signature:
        'split(original :: STRING, splitDelimiters :: STRING | LIST<STRING>) :: LIST<STRING>',
      returnDescription: 'LIST<STRING>',
      aggregating: false,
    },
    {
      name: 'sqrt',
      category: 'Logarithmic',
      description: 'Returns the square root of a `FLOAT`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: FLOAT',
          name: 'input',
          type: 'FLOAT',
        },
      ],
      signature: 'sqrt(input :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'startNode',
      category: 'Scalar',
      description: 'Returns the start `NODE` of a `RELATIONSHIP`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: RELATIONSHIP',
          name: 'input',
          type: 'RELATIONSHIP',
        },
      ],
      signature: 'startNode(input :: RELATIONSHIP) :: NODE',
      returnDescription: 'NODE',
      aggregating: false,
    },
    {
      name: 'stdev',
      category: 'Aggregating',
      description:
        'Returns the standard deviation for the given value over a group for a sample of a population.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: FLOAT',
          name: 'input',
          type: 'FLOAT',
        },
      ],
      signature: 'stdev(input :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: true,
    },
    {
      name: 'stdevp',
      category: 'Aggregating',
      description:
        'Returns the standard deviation for the given value over a group for an entire population.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: FLOAT',
          name: 'input',
          type: 'FLOAT',
        },
      ],
      signature: 'stdevp(input :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: true,
    },
    {
      name: 'substring',
      category: 'String',
      description:
        'Returns a substring of the given `STRING`, beginning with a 0-based index start.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'original :: STRING',
          name: 'original',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'start :: INTEGER',
          name: 'start',
          type: 'INTEGER',
        },
      ],
      signature: 'substring(original :: STRING, start :: INTEGER) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'substring',
      category: 'String',
      description:
        'Returns a substring of a given `length` from the given `STRING`, beginning with a 0-based index start.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'original :: STRING',
          name: 'original',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'start :: INTEGER',
          name: 'start',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'length :: INTEGER',
          name: 'length',
          type: 'INTEGER',
        },
      ],
      signature:
        'substring(original :: STRING, start :: INTEGER, length :: INTEGER) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'sum',
      category: 'Aggregating',
      description:
        'Returns the sum of a set of `INTEGER`, `FLOAT` or `DURATION` values',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: INTEGER | FLOAT | DURATION',
          name: 'input',
          type: 'INTEGER | FLOAT | DURATION',
        },
      ],
      signature:
        'sum(input :: INTEGER | FLOAT | DURATION) :: INTEGER | FLOAT | DURATION',
      returnDescription: 'INTEGER | FLOAT | DURATION',
      aggregating: true,
    },
    {
      name: 'tail',
      category: 'List',
      description: 'Returns all but the first element in a `LIST<ANY>`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: LIST<ANY>',
          name: 'input',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'tail(input :: LIST<ANY>) :: LIST<ANY>',
      returnDescription: 'LIST<ANY>',
      aggregating: false,
    },
    {
      name: 'tan',
      category: 'Trigonometric',
      description: 'Returns the tangent of a `FLOAT`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: FLOAT',
          name: 'input',
          type: 'FLOAT',
        },
      ],
      signature: 'tan(input :: FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'time',
      category: 'Temporal',
      description: 'Creates a `ZONED TIME` instant.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'input',
          type: 'ANY',
        },
      ],
      signature: 'time(input = DEFAULT_TEMPORAL_ARGUMENT :: ANY) :: ZONED TIME',
      returnDescription: 'ZONED TIME',
      aggregating: false,
    },
    {
      name: 'time.realtime',
      category: 'Temporal',
      description:
        'Returns the current `ZONED TIME` instant using the realtime clock.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'timezone',
          type: 'ANY',
        },
      ],
      signature:
        'time.realtime(timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY) :: ZONED TIME',
      returnDescription: 'ZONED TIME',
      aggregating: false,
    },
    {
      name: 'time.statement',
      category: 'Temporal',
      description:
        'Returns the current `ZONED TIME` instant using the statement clock.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'timezone',
          type: 'ANY',
        },
      ],
      signature:
        'time.statement(timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY) :: ZONED TIME',
      returnDescription: 'ZONED TIME',
      aggregating: false,
    },
    {
      name: 'time.transaction',
      category: 'Temporal',
      description:
        'Returns the current `ZONED TIME` instant using the transaction clock.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'timezone',
          type: 'ANY',
        },
      ],
      signature:
        'time.transaction(timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY) :: ZONED TIME',
      returnDescription: 'ZONED TIME',
      aggregating: false,
    },
    {
      name: 'time.truncate',
      category: 'Temporal',
      description:
        'Truncates the given temporal value to a `ZONED TIME` instant using the specified unit.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'unit :: STRING',
          name: 'unit',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=DEFAULT_TEMPORAL_ARGUMENT, type=ANY}',
          description: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY',
          name: 'input',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=null, type=MAP}',
          description: 'fields = null :: MAP',
          name: 'fields',
          type: 'MAP',
        },
      ],
      signature:
        'time.truncate(unit :: STRING, input = DEFAULT_TEMPORAL_ARGUMENT :: ANY, fields = null :: MAP) :: ZONED TIME',
      returnDescription: 'ZONED TIME',
      aggregating: false,
    },
    {
      name: 'timestamp',
      category: 'Scalar',
      description:
        'Returns the difference, measured in milliseconds, between the current time and midnight, January 1, 1970 UTC',
      isBuiltIn: true,
      argumentDescription: [],
      signature: 'timestamp() :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'toBoolean',
      category: 'Scalar',
      description:
        'Converts a `BOOLEAN`, `STRING` or `INTEGER` value to a `BOOLEAN` value. For `INTEGER` values, 0 is defined to be false and any other `INTEGER` is defined to be true.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: BOOLEAN | STRING | INTEGER',
          name: 'input',
          type: 'BOOLEAN | STRING | INTEGER',
        },
      ],
      signature: 'toBoolean(input :: BOOLEAN | STRING | INTEGER) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'toBooleanList',
      category: 'List',
      description:
        'Converts a `LIST<ANY>` of values to a `LIST<BOOLEAN>` values. If any values are not convertible to `BOOLEAN` they will be null in the `LIST<BOOLEAN>` returned.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: LIST<ANY>',
          name: 'input',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'toBooleanList(input :: LIST<ANY>) :: LIST<BOOLEAN>',
      returnDescription: 'LIST<BOOLEAN>',
      aggregating: false,
    },
    {
      name: 'toBooleanOrNull',
      category: 'Scalar',
      description:
        'Converts a value to a `BOOLEAN` value, or null if the value cannot be converted.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: ANY',
          name: 'input',
          type: 'ANY',
        },
      ],
      signature: 'toBooleanOrNull(input :: ANY) :: BOOLEAN',
      returnDescription: 'BOOLEAN',
      aggregating: false,
    },
    {
      name: 'toFloat',
      category: 'Scalar',
      description:
        'Converts a `STRING`, `INTEGER` or `FLOAT` value to a `FLOAT` value.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: STRING | INTEGER | FLOAT',
          name: 'input',
          type: 'STRING | INTEGER | FLOAT',
        },
      ],
      signature: 'toFloat(input :: STRING | INTEGER | FLOAT) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'toFloatList',
      category: 'List',
      description:
        'Converts a `LIST<ANY>` to a `LIST<FLOAT>` values. If any values are not convertible to `FLOAT` they will be null in the `LIST<FLOAT>` returned.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: LIST<ANY>',
          name: 'input',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'toFloatList(input :: LIST<ANY>) :: LIST<FLOAT>',
      returnDescription: 'LIST<FLOAT>',
      aggregating: false,
    },
    {
      name: 'toFloatOrNull',
      category: 'Scalar',
      description:
        'Converts a value to a `FLOAT` value, or null if the value cannot be converted.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: ANY',
          name: 'input',
          type: 'ANY',
        },
      ],
      signature: 'toFloatOrNull(input :: ANY) :: FLOAT',
      returnDescription: 'FLOAT',
      aggregating: false,
    },
    {
      name: 'toInteger',
      category: 'Scalar',
      description:
        'Converts a `BOOLEAN`, `STRING`, `INTEGER` or `FLOAT` value to an `INTEGER` value. For `BOOLEAN` values, true is defined to be 1 and false is defined to be 0.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: BOOLEAN | STRING | INTEGER | FLOAT',
          name: 'input',
          type: 'BOOLEAN | STRING | INTEGER | FLOAT',
        },
      ],
      signature:
        'toInteger(input :: BOOLEAN | STRING | INTEGER | FLOAT) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'toIntegerList',
      category: 'List',
      description:
        'Converts a `LIST<ANY>` to a `LIST<INTEGER>` values. If any values are not convertible to `INTEGER` they will be null in the `LIST<INTEGER>` returned.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: LIST<ANY>',
          name: 'input',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'toIntegerList(input :: LIST<ANY>) :: LIST<INTEGER>',
      returnDescription: 'LIST<INTEGER>',
      aggregating: false,
    },
    {
      name: 'toIntegerOrNull',
      category: 'Scalar',
      description:
        'Converts a value to an `INTEGER` value, or null if the value cannot be converted.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: ANY',
          name: 'input',
          type: 'ANY',
        },
      ],
      signature: 'toIntegerOrNull(input :: ANY) :: INTEGER',
      returnDescription: 'INTEGER',
      aggregating: false,
    },
    {
      name: 'toLower',
      category: 'String',
      description: 'Returns the given `STRING` in lowercase.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: STRING',
          name: 'input',
          type: 'STRING',
        },
      ],
      signature: 'toLower(input :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'toString',
      category: 'String',
      description:
        'Converts an `INTEGER`, `FLOAT`, `BOOLEAN`, `POINT` or temporal type (i.e. `DATE`, `ZONED TIME`, `LOCAL TIME`, `ZONED DATETIME`, `LOCAL DATETIME` or `DURATION`) value to a `STRING`.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: ANY',
          name: 'input',
          type: 'ANY',
        },
      ],
      signature: 'toString(input :: ANY) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'toStringList',
      category: 'List',
      description:
        'Converts a `LIST<ANY>` to a `LIST<STRING>` values. If any values are not convertible to `STRING` they will be null in the `LIST<STRING>` returned.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: LIST<ANY>',
          name: 'input',
          type: 'LIST<ANY>',
        },
      ],
      signature: 'toStringList(input :: LIST<ANY>) :: LIST<STRING>',
      returnDescription: 'LIST<STRING>',
      aggregating: false,
    },
    {
      name: 'toStringOrNull',
      category: 'String',
      description:
        'Converts an `INTEGER`, `FLOAT`, `BOOLEAN`, `POINT` or temporal type (i.e. `DATE`, `ZONED TIME`, `LOCAL TIME`, `ZONED DATETIME`, `LOCAL DATETIME` or `DURATION`) value to a `STRING`, or null if the value cannot be converted.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: ANY',
          name: 'input',
          type: 'ANY',
        },
      ],
      signature: 'toStringOrNull(input :: ANY) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'toUpper',
      category: 'String',
      description: 'Returns the given `STRING` in uppercase.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: STRING',
          name: 'input',
          type: 'STRING',
        },
      ],
      signature: 'toUpper(input :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'trim',
      category: 'String',
      description:
        'Returns the given `STRING` with leading and trailing whitespace removed.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: STRING',
          name: 'input',
          type: 'STRING',
        },
      ],
      signature: 'trim(input :: STRING) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'type',
      category: 'Scalar',
      description:
        'Returns a `STRING` representation of the `RELATIONSHIP` type.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: RELATIONSHIP',
          name: 'input',
          type: 'RELATIONSHIP',
        },
      ],
      signature: 'type(input :: RELATIONSHIP) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
    {
      name: 'valueType',
      category: 'Scalar',
      description:
        'Returns a `STRING` representation of the most precise value type that the given expression evaluates to.',
      isBuiltIn: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'input :: ANY',
          name: 'input',
          type: 'ANY',
        },
      ],
      signature: 'valueType(input :: ANY) :: STRING',
      returnDescription: 'STRING',
      aggregating: false,
    },
  ],
  rawProcedures: [
    {
      name: 'apoc.algo.aStar',
      description:
        'Runs the A* search algorithm to find the optimal path between two `NODE` values, using the given `RELATIONSHIP` property name for the cost function.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'startNode :: NODE',
          name: 'startNode',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'endNode :: NODE',
          name: 'endNode',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'relTypesAndDirections :: STRING',
          name: 'relTypesAndDirections',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'weightPropertyName :: STRING',
          name: 'weightPropertyName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'latPropertyName :: STRING',
          name: 'latPropertyName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'lonPropertyName :: STRING',
          name: 'lonPropertyName',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.algo.aStar(startNode :: NODE, endNode :: NODE, relTypesAndDirections :: STRING, weightPropertyName :: STRING, latPropertyName :: STRING, lonPropertyName :: STRING) :: (path :: PATH, weight :: FLOAT)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'path :: PATH',
          name: 'path',
          type: 'PATH',
        },
        {
          isDeprecated: false,
          description: 'weight :: FLOAT',
          name: 'weight',
          type: 'FLOAT',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.algo.aStarConfig',
      description:
        'Runs the A* search algorithm to find the optimal path between two `NODE` values, using the given `RELATIONSHIP` property name for the cost function.\nThis procedure looks for weight, latitude and longitude properties in the config.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'startNode :: NODE',
          name: 'startNode',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'endNode :: NODE',
          name: 'endNode',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'relTypesAndDirections :: STRING',
          name: 'relTypesAndDirections',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'config :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.algo.aStarConfig(startNode :: NODE, endNode :: NODE, relTypesAndDirections :: STRING, config :: MAP) :: (path :: PATH, weight :: FLOAT)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'path :: PATH',
          name: 'path',
          type: 'PATH',
        },
        {
          isDeprecated: false,
          description: 'weight :: FLOAT',
          name: 'weight',
          type: 'FLOAT',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.algo.allSimplePaths',
      description:
        'Runs a search algorithm to find all of the simple paths between the given `RELATIONSHIP` values, up to a max depth described by `maxNodes`.\nThe returned paths will not contain loops.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'startNode :: NODE',
          name: 'startNode',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'endNode :: NODE',
          name: 'endNode',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'relTypesAndDirections :: STRING',
          name: 'relTypesAndDirections',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'maxNodes :: INTEGER',
          name: 'maxNodes',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.algo.allSimplePaths(startNode :: NODE, endNode :: NODE, relTypesAndDirections :: STRING, maxNodes :: INTEGER) :: (path :: PATH)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'path :: PATH',
          name: 'path',
          type: 'PATH',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.algo.cover',
      description:
        'Returns all `RELATIONSHIP` values connecting the given set of `NODE` values.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: ANY',
          name: 'nodes',
          type: 'ANY',
        },
      ],
      signature: 'apoc.algo.cover(nodes :: ANY) :: (rel :: RELATIONSHIP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'rel :: RELATIONSHIP',
          name: 'rel',
          type: 'RELATIONSHIP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.algo.dijkstra',
      description:
        "Runs Dijkstra's algorithm using the given `RELATIONSHIP` property as the cost function.",
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'startNode :: NODE',
          name: 'startNode',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'endNode :: NODE',
          name: 'endNode',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'relTypesAndDirections :: STRING',
          name: 'relTypesAndDirections',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'weightPropertyName :: STRING',
          name: 'weightPropertyName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=NaN, type=FLOAT}',
          description: 'defaultWeight = NaN :: FLOAT',
          name: 'defaultWeight',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=1, type=INTEGER}',
          description: 'numberOfWantedPaths = 1 :: INTEGER',
          name: 'numberOfWantedPaths',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.algo.dijkstra(startNode :: NODE, endNode :: NODE, relTypesAndDirections :: STRING, weightPropertyName :: STRING, defaultWeight = NaN :: FLOAT, numberOfWantedPaths = 1 :: INTEGER) :: (path :: PATH, weight :: FLOAT)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'path :: PATH',
          name: 'path',
          type: 'PATH',
        },
        {
          isDeprecated: false,
          description: 'weight :: FLOAT',
          name: 'weight',
          type: 'FLOAT',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.atomic.add',
      description:
        'Sets the given property to the sum of itself and the given `INTEGER` or `FLOAT` value.\nThe procedure then sets the property to the returned sum.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'container :: ANY',
          name: 'container',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'propertyName :: STRING',
          name: 'propertyName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'number :: INTEGER | FLOAT',
          name: 'number',
          type: 'INTEGER | FLOAT',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=5, type=INTEGER}',
          description: 'retryAttempts = 5 :: INTEGER',
          name: 'retryAttempts',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.atomic.add(container :: ANY, propertyName :: STRING, number :: INTEGER | FLOAT, retryAttempts = 5 :: INTEGER) :: (container :: ANY, property :: STRING, oldValue :: ANY, newValue :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'container :: ANY',
          name: 'container',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'property :: STRING',
          name: 'property',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'oldValue :: ANY',
          name: 'oldValue',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'newValue :: ANY',
          name: 'newValue',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.atomic.concat',
      description:
        'Sets the given property to the concatenation of itself and the `STRING` value.\nThe procedure then sets the property to the returned `STRING`.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'container :: ANY',
          name: 'container',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'propertyName :: STRING',
          name: 'propertyName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'string :: STRING',
          name: 'string',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=5, type=INTEGER}',
          description: 'retryAttempts = 5 :: INTEGER',
          name: 'retryAttempts',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.atomic.concat(container :: ANY, propertyName :: STRING, string :: STRING, retryAttempts = 5 :: INTEGER) :: (container :: ANY, property :: STRING, oldValue :: ANY, newValue :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'container :: ANY',
          name: 'container',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'property :: STRING',
          name: 'property',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'oldValue :: ANY',
          name: 'oldValue',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'newValue :: ANY',
          name: 'newValue',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.atomic.insert',
      description:
        'Inserts a value at position into the `LIST<ANY>` value of a property.\nThe procedure then sets the result back on the property.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'container :: ANY',
          name: 'container',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'propertyName :: STRING',
          name: 'propertyName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'position :: INTEGER',
          name: 'position',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=5, type=INTEGER}',
          description: 'retryAttempts = 5 :: INTEGER',
          name: 'retryAttempts',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.atomic.insert(container :: ANY, propertyName :: STRING, position :: INTEGER, value :: ANY, retryAttempts = 5 :: INTEGER) :: (container :: ANY, property :: STRING, oldValue :: ANY, newValue :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'container :: ANY',
          name: 'container',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'property :: STRING',
          name: 'property',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'oldValue :: ANY',
          name: 'oldValue',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'newValue :: ANY',
          name: 'newValue',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.atomic.remove',
      description:
        'Removes the element at position from the `LIST<ANY>` value of a property.\nThe procedure then sets the property to the resulting `LIST<ANY>` value.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'container :: ANY',
          name: 'container',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'propertyName :: STRING',
          name: 'propertyName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'position :: INTEGER',
          name: 'position',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=5, type=INTEGER}',
          description: 'retryAttempts = 5 :: INTEGER',
          name: 'retryAttempts',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.atomic.remove(container :: ANY, propertyName :: STRING, position :: INTEGER, retryAttempts = 5 :: INTEGER) :: (container :: ANY, property :: STRING, oldValue :: ANY, newValue :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'container :: ANY',
          name: 'container',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'property :: STRING',
          name: 'property',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'oldValue :: ANY',
          name: 'oldValue',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'newValue :: ANY',
          name: 'newValue',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.atomic.subtract',
      description:
        'Sets the property of a value to itself minus the given `INTEGER` or `FLOAT` value.\nThe procedure then sets the property to the returned sum.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'container :: ANY',
          name: 'container',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'propertyName :: STRING',
          name: 'propertyName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'number :: INTEGER | FLOAT',
          name: 'number',
          type: 'INTEGER | FLOAT',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=5, type=INTEGER}',
          description: 'retryAttempts = 5 :: INTEGER',
          name: 'retryAttempts',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.atomic.subtract(container :: ANY, propertyName :: STRING, number :: INTEGER | FLOAT, retryAttempts = 5 :: INTEGER) :: (container :: ANY, property :: STRING, oldValue :: ANY, newValue :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'container :: ANY',
          name: 'container',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'property :: STRING',
          name: 'property',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'oldValue :: ANY',
          name: 'oldValue',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'newValue :: ANY',
          name: 'newValue',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.atomic.update',
      description: 'Updates the value of a property with a Cypher operation.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'container :: ANY',
          name: 'container',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'propertyName :: STRING',
          name: 'propertyName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'operation :: STRING',
          name: 'operation',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=5, type=INTEGER}',
          description: 'retryAttempts = 5 :: INTEGER',
          name: 'retryAttempts',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.atomic.update(container :: ANY, propertyName :: STRING, operation :: STRING, retryAttempts = 5 :: INTEGER) :: (container :: ANY, property :: STRING, oldValue :: ANY, newValue :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'container :: ANY',
          name: 'container',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'property :: STRING',
          name: 'property',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'oldValue :: ANY',
          name: 'oldValue',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'newValue :: ANY',
          name: 'newValue',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.case',
      description:
        'For each pair of conditional and read-only queries in the given `LIST<ANY>`, this procedure will run the first query for which the conditional is evaluated to true. If none of the conditionals are true, the `ELSE` query will run instead.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'conditionals :: LIST<ANY>',
          name: 'conditionals',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'elseQuery =  :: STRING',
          name: 'elseQuery',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'params = {} :: MAP',
          name: 'params',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.case(conditionals :: LIST<ANY>, elseQuery =  :: STRING, params = {} :: MAP) :: (value :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: MAP',
          name: 'value',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.coll.elements',
      description:
        'Deconstructs a `LIST<ANY>` into identifiers indicating their specific type.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=-1, type=INTEGER}',
          description: 'limit = -1 :: INTEGER',
          name: 'limit',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=0, type=INTEGER}',
          description: 'offset = 0 :: INTEGER',
          name: 'offset',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.coll.elements(coll :: LIST<ANY>, limit = -1 :: INTEGER, offset = 0 :: INTEGER) :: (_1 :: ANY, _2 :: ANY, _3 :: ANY, _4 :: ANY, _5 :: ANY, _6 :: ANY, _7 :: ANY, _8 :: ANY, _9 :: ANY, _10 :: ANY, _1s :: STRING, _2s :: STRING, _3s :: STRING, _4s :: STRING, _5s :: STRING, _6s :: STRING, _7s :: STRING, _8s :: STRING, _9s :: STRING, _10s :: STRING, _1i :: INTEGER, _2i :: INTEGER, _3i :: INTEGER, _4i :: INTEGER, _5i :: INTEGER, _6i :: INTEGER, _7i :: INTEGER, _8i :: INTEGER, _9i :: INTEGER, _10i :: INTEGER, _1f :: FLOAT, _2f :: FLOAT, _3f :: FLOAT, _4f :: FLOAT, _5f :: FLOAT, _6f :: FLOAT, _7f :: FLOAT, _8f :: FLOAT, _9f :: FLOAT, _10f :: FLOAT, _1b :: BOOLEAN, _2b :: BOOLEAN, _3b :: BOOLEAN, _4b :: BOOLEAN, _5b :: BOOLEAN, _6b :: BOOLEAN, _7b :: BOOLEAN, _8b :: BOOLEAN, _9b :: BOOLEAN, _10b :: BOOLEAN, _1l :: LIST<ANY>, _2l :: LIST<ANY>, _3l :: LIST<ANY>, _4l :: LIST<ANY>, _5l :: LIST<ANY>, _6l :: LIST<ANY>, _7l :: LIST<ANY>, _8l :: LIST<ANY>, _9l :: LIST<ANY>, _10l :: LIST<ANY>, _1m :: MAP, _2m :: MAP, _3m :: MAP, _4m :: MAP, _5m :: MAP, _6m :: MAP, _7m :: MAP, _8m :: MAP, _9m :: MAP, _10m :: MAP, _1n :: NODE, _2n :: NODE, _3n :: NODE, _4n :: NODE, _5n :: NODE, _6n :: NODE, _7n :: NODE, _8n :: NODE, _9n :: NODE, _10n :: NODE, _1r :: RELATIONSHIP, _2r :: RELATIONSHIP, _3r :: RELATIONSHIP, _4r :: RELATIONSHIP, _5r :: RELATIONSHIP, _6r :: RELATIONSHIP, _7r :: RELATIONSHIP, _8r :: RELATIONSHIP, _9r :: RELATIONSHIP, _10r :: RELATIONSHIP, _1p :: PATH, _2p :: PATH, _3p :: PATH, _4p :: PATH, _5p :: PATH, _6p :: PATH, _7p :: PATH, _8p :: PATH, _9p :: PATH, _10p :: PATH, elements :: INTEGER)',
      returnDescription: [
        {
          isDeprecated: false,
          description: '_1 :: ANY',
          name: '_1',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: '_2 :: ANY',
          name: '_2',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: '_3 :: ANY',
          name: '_3',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: '_4 :: ANY',
          name: '_4',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: '_5 :: ANY',
          name: '_5',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: '_6 :: ANY',
          name: '_6',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: '_7 :: ANY',
          name: '_7',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: '_8 :: ANY',
          name: '_8',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: '_9 :: ANY',
          name: '_9',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: '_10 :: ANY',
          name: '_10',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: '_1s :: STRING',
          name: '_1s',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: '_2s :: STRING',
          name: '_2s',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: '_3s :: STRING',
          name: '_3s',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: '_4s :: STRING',
          name: '_4s',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: '_5s :: STRING',
          name: '_5s',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: '_6s :: STRING',
          name: '_6s',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: '_7s :: STRING',
          name: '_7s',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: '_8s :: STRING',
          name: '_8s',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: '_9s :: STRING',
          name: '_9s',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: '_10s :: STRING',
          name: '_10s',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: '_1i :: INTEGER',
          name: '_1i',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: '_2i :: INTEGER',
          name: '_2i',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: '_3i :: INTEGER',
          name: '_3i',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: '_4i :: INTEGER',
          name: '_4i',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: '_5i :: INTEGER',
          name: '_5i',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: '_6i :: INTEGER',
          name: '_6i',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: '_7i :: INTEGER',
          name: '_7i',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: '_8i :: INTEGER',
          name: '_8i',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: '_9i :: INTEGER',
          name: '_9i',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: '_10i :: INTEGER',
          name: '_10i',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: '_1f :: FLOAT',
          name: '_1f',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: '_2f :: FLOAT',
          name: '_2f',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: '_3f :: FLOAT',
          name: '_3f',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: '_4f :: FLOAT',
          name: '_4f',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: '_5f :: FLOAT',
          name: '_5f',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: '_6f :: FLOAT',
          name: '_6f',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: '_7f :: FLOAT',
          name: '_7f',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: '_8f :: FLOAT',
          name: '_8f',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: '_9f :: FLOAT',
          name: '_9f',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: '_10f :: FLOAT',
          name: '_10f',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: '_1b :: BOOLEAN',
          name: '_1b',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: '_2b :: BOOLEAN',
          name: '_2b',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: '_3b :: BOOLEAN',
          name: '_3b',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: '_4b :: BOOLEAN',
          name: '_4b',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: '_5b :: BOOLEAN',
          name: '_5b',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: '_6b :: BOOLEAN',
          name: '_6b',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: '_7b :: BOOLEAN',
          name: '_7b',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: '_8b :: BOOLEAN',
          name: '_8b',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: '_9b :: BOOLEAN',
          name: '_9b',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: '_10b :: BOOLEAN',
          name: '_10b',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: '_1l :: LIST<ANY>',
          name: '_1l',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: '_2l :: LIST<ANY>',
          name: '_2l',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: '_3l :: LIST<ANY>',
          name: '_3l',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: '_4l :: LIST<ANY>',
          name: '_4l',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: '_5l :: LIST<ANY>',
          name: '_5l',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: '_6l :: LIST<ANY>',
          name: '_6l',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: '_7l :: LIST<ANY>',
          name: '_7l',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: '_8l :: LIST<ANY>',
          name: '_8l',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: '_9l :: LIST<ANY>',
          name: '_9l',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: '_10l :: LIST<ANY>',
          name: '_10l',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: '_1m :: MAP',
          name: '_1m',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: '_2m :: MAP',
          name: '_2m',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: '_3m :: MAP',
          name: '_3m',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: '_4m :: MAP',
          name: '_4m',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: '_5m :: MAP',
          name: '_5m',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: '_6m :: MAP',
          name: '_6m',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: '_7m :: MAP',
          name: '_7m',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: '_8m :: MAP',
          name: '_8m',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: '_9m :: MAP',
          name: '_9m',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: '_10m :: MAP',
          name: '_10m',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: '_1n :: NODE',
          name: '_1n',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: '_2n :: NODE',
          name: '_2n',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: '_3n :: NODE',
          name: '_3n',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: '_4n :: NODE',
          name: '_4n',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: '_5n :: NODE',
          name: '_5n',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: '_6n :: NODE',
          name: '_6n',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: '_7n :: NODE',
          name: '_7n',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: '_8n :: NODE',
          name: '_8n',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: '_9n :: NODE',
          name: '_9n',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: '_10n :: NODE',
          name: '_10n',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: '_1r :: RELATIONSHIP',
          name: '_1r',
          type: 'RELATIONSHIP',
        },
        {
          isDeprecated: false,
          description: '_2r :: RELATIONSHIP',
          name: '_2r',
          type: 'RELATIONSHIP',
        },
        {
          isDeprecated: false,
          description: '_3r :: RELATIONSHIP',
          name: '_3r',
          type: 'RELATIONSHIP',
        },
        {
          isDeprecated: false,
          description: '_4r :: RELATIONSHIP',
          name: '_4r',
          type: 'RELATIONSHIP',
        },
        {
          isDeprecated: false,
          description: '_5r :: RELATIONSHIP',
          name: '_5r',
          type: 'RELATIONSHIP',
        },
        {
          isDeprecated: false,
          description: '_6r :: RELATIONSHIP',
          name: '_6r',
          type: 'RELATIONSHIP',
        },
        {
          isDeprecated: false,
          description: '_7r :: RELATIONSHIP',
          name: '_7r',
          type: 'RELATIONSHIP',
        },
        {
          isDeprecated: false,
          description: '_8r :: RELATIONSHIP',
          name: '_8r',
          type: 'RELATIONSHIP',
        },
        {
          isDeprecated: false,
          description: '_9r :: RELATIONSHIP',
          name: '_9r',
          type: 'RELATIONSHIP',
        },
        {
          isDeprecated: false,
          description: '_10r :: RELATIONSHIP',
          name: '_10r',
          type: 'RELATIONSHIP',
        },
        {
          isDeprecated: false,
          description: '_1p :: PATH',
          name: '_1p',
          type: 'PATH',
        },
        {
          isDeprecated: false,
          description: '_2p :: PATH',
          name: '_2p',
          type: 'PATH',
        },
        {
          isDeprecated: false,
          description: '_3p :: PATH',
          name: '_3p',
          type: 'PATH',
        },
        {
          isDeprecated: false,
          description: '_4p :: PATH',
          name: '_4p',
          type: 'PATH',
        },
        {
          isDeprecated: false,
          description: '_5p :: PATH',
          name: '_5p',
          type: 'PATH',
        },
        {
          isDeprecated: false,
          description: '_6p :: PATH',
          name: '_6p',
          type: 'PATH',
        },
        {
          isDeprecated: false,
          description: '_7p :: PATH',
          name: '_7p',
          type: 'PATH',
        },
        {
          isDeprecated: false,
          description: '_8p :: PATH',
          name: '_8p',
          type: 'PATH',
        },
        {
          isDeprecated: false,
          description: '_9p :: PATH',
          name: '_9p',
          type: 'PATH',
        },
        {
          isDeprecated: false,
          description: '_10p :: PATH',
          name: '_10p',
          type: 'PATH',
        },
        {
          isDeprecated: false,
          description: 'elements :: INTEGER',
          name: 'elements',
          type: 'INTEGER',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.coll.pairWithOffset',
      description: 'Returns a `LIST<ANY>` of pairs defined by the offset.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'offset :: INTEGER',
          name: 'offset',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.coll.pairWithOffset(coll :: LIST<ANY>, offset :: INTEGER) :: (value :: LIST<ANY>)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: LIST<ANY>',
          name: 'value',
          type: 'LIST<ANY>',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.coll.partition',
      description:
        'Partitions the original `LIST<ANY>` into a new `LIST<ANY>` of the given batch size.\nThe final `LIST<ANY>` may be smaller than the given batch size.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.coll.partition(coll :: LIST<ANY>, batchSize :: INTEGER) :: (value :: LIST<ANY>)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: LIST<ANY>',
          name: 'value',
          type: 'LIST<ANY>',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.coll.split',
      description:
        'Splits a collection by the given value.\nThe value itself will not be part of the resulting `LIST<ANY>` values.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'coll :: LIST<ANY>',
          name: 'coll',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
      ],
      signature:
        'apoc.coll.split(coll :: LIST<ANY>, value :: ANY) :: (value :: LIST<ANY>)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: LIST<ANY>',
          name: 'value',
          type: 'LIST<ANY>',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.coll.zipToRows',
      description:
        'Returns the two `LIST<ANY>` values zipped together, with one row per zipped pair.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'list1 :: LIST<ANY>',
          name: 'list1',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'list2 :: LIST<ANY>',
          name: 'list2',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'apoc.coll.zipToRows(list1 :: LIST<ANY>, list2 :: LIST<ANY>) :: (value :: LIST<ANY>)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: LIST<ANY>',
          name: 'value',
          type: 'LIST<ANY>',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.convert.setJsonProperty',
      description:
        'Serializes the given JSON object and sets it as a property on the given `NODE`.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'key :: STRING',
          name: 'key',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
      ],
      signature:
        'apoc.convert.setJsonProperty(node :: NODE, key :: STRING, value :: ANY)',
      returnDescription: [],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.convert.toTree',
      description:
        'Returns a stream of `MAP` values, representing the given `PATH` values as a tree with at least one root.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'paths :: LIST<PATH>',
          name: 'paths',
          type: 'LIST<PATH>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=true, type=BOOLEAN}',
          description: 'lowerCaseRels = true :: BOOLEAN',
          name: 'lowerCaseRels',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.convert.toTree(paths :: LIST<PATH>, lowerCaseRels = true :: BOOLEAN, config = {} :: MAP) :: (value :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: MAP',
          name: 'value',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.create.addLabels',
      description: 'Adds the given labels to the given `NODE` values.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: ANY',
          name: 'nodes',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'labels :: LIST<STRING>',
          name: 'labels',
          type: 'LIST<STRING>',
        },
      ],
      signature:
        'apoc.create.addLabels(nodes :: ANY, labels :: LIST<STRING>) :: (node :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.create.clonePathToVirtual',
      description:
        'Takes the given `PATH` and returns a virtual representation of it.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'path :: PATH',
          name: 'path',
          type: 'PATH',
        },
      ],
      signature:
        'apoc.create.clonePathToVirtual(path :: PATH) :: (path :: PATH)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'path :: PATH',
          name: 'path',
          type: 'PATH',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.create.clonePathsToVirtual',
      description:
        'Takes the given `LIST<PATH>` and returns a virtual representation of them.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'paths :: LIST<PATH>',
          name: 'paths',
          type: 'LIST<PATH>',
        },
      ],
      signature:
        'apoc.create.clonePathsToVirtual(paths :: LIST<PATH>) :: (path :: PATH)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'path :: PATH',
          name: 'path',
          type: 'PATH',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.create.node',
      description: 'Creates a `NODE` with the given dynamic labels.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'labels :: LIST<STRING>',
          name: 'labels',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'props :: MAP',
          name: 'props',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.create.node(labels :: LIST<STRING>, props :: MAP) :: (node :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.create.nodes',
      description: 'Creates `NODE` values with the given dynamic labels.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'labels :: LIST<STRING>',
          name: 'labels',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'props :: LIST<MAP>',
          name: 'props',
          type: 'LIST<MAP>',
        },
      ],
      signature:
        'apoc.create.nodes(labels :: LIST<STRING>, props :: LIST<MAP>) :: (node :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.create.relationship',
      description:
        'Creates a `RELATIONSHIP` with the given dynamic relationship type.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'from :: NODE',
          name: 'from',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'relType :: STRING',
          name: 'relType',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'props :: MAP',
          name: 'props',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'to :: NODE',
          name: 'to',
          type: 'NODE',
        },
      ],
      signature:
        'apoc.create.relationship(from :: NODE, relType :: STRING, props :: MAP, to :: NODE) :: (rel :: RELATIONSHIP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'rel :: RELATIONSHIP',
          name: 'rel',
          type: 'RELATIONSHIP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.create.removeLabels',
      description: 'Removes the given labels from the given `NODE` values.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: ANY',
          name: 'nodes',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'labels :: LIST<STRING>',
          name: 'labels',
          type: 'LIST<STRING>',
        },
      ],
      signature:
        'apoc.create.removeLabels(nodes :: ANY, labels :: LIST<STRING>) :: (node :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.create.removeProperties',
      description: 'Removes the given properties from the given `NODE` values.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: ANY',
          name: 'nodes',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'keys :: LIST<STRING>',
          name: 'keys',
          type: 'LIST<STRING>',
        },
      ],
      signature:
        'apoc.create.removeProperties(nodes :: ANY, keys :: LIST<STRING>) :: (node :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.create.removeRelProperties',
      description:
        'Removes the given properties from the given `RELATIONSHIP` values.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'rels :: ANY',
          name: 'rels',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'keys :: LIST<STRING>',
          name: 'keys',
          type: 'LIST<STRING>',
        },
      ],
      signature:
        'apoc.create.removeRelProperties(rels :: ANY, keys :: LIST<STRING>) :: (rel :: RELATIONSHIP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'rel :: RELATIONSHIP',
          name: 'rel',
          type: 'RELATIONSHIP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.create.setLabels',
      description:
        'Sets the given labels to the given `NODE` values. Non-matching labels are removed from the nodes.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: ANY',
          name: 'nodes',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'labels :: LIST<STRING>',
          name: 'labels',
          type: 'LIST<STRING>',
        },
      ],
      signature:
        'apoc.create.setLabels(nodes :: ANY, labels :: LIST<STRING>) :: (node :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.create.setProperties',
      description: 'Sets the given properties to the given `NODE` values.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: ANY',
          name: 'nodes',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'keys :: LIST<STRING>',
          name: 'keys',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'values :: LIST<ANY>',
          name: 'values',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'apoc.create.setProperties(nodes :: ANY, keys :: LIST<STRING>, values :: LIST<ANY>) :: (node :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.create.setProperty',
      description: 'Sets the given property to the given `NODE` values.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: ANY',
          name: 'nodes',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'key :: STRING',
          name: 'key',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
      ],
      signature:
        'apoc.create.setProperty(nodes :: ANY, key :: STRING, value :: ANY) :: (node :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.create.setRelProperties',
      description: 'Sets the given properties on the `RELATIONSHIP` values.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'rels :: ANY',
          name: 'rels',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'keys :: LIST<STRING>',
          name: 'keys',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'values :: LIST<ANY>',
          name: 'values',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'apoc.create.setRelProperties(rels :: ANY, keys :: LIST<STRING>, values :: LIST<ANY>) :: (rel :: RELATIONSHIP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'rel :: RELATIONSHIP',
          name: 'rel',
          type: 'RELATIONSHIP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.create.setRelProperty',
      description: 'Sets the given property on the `RELATIONSHIP` values.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'rels :: ANY',
          name: 'rels',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'key :: STRING',
          name: 'key',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
      ],
      signature:
        'apoc.create.setRelProperty(rels :: ANY, key :: STRING, value :: ANY) :: (rel :: RELATIONSHIP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'rel :: RELATIONSHIP',
          name: 'rel',
          type: 'RELATIONSHIP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.create.uuids',
      description: 'Returns a stream of UUIDs.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'count :: INTEGER',
          name: 'count',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.create.uuids(count :: INTEGER) :: (row :: INTEGER, uuid :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'row :: INTEGER',
          name: 'row',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'uuid :: STRING',
          name: 'uuid',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: true,
      },
    },
    {
      name: 'apoc.create.vNode',
      description: 'Returns a virtual `NODE`.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'labels :: LIST<STRING>',
          name: 'labels',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'props :: MAP',
          name: 'props',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.create.vNode(labels :: LIST<STRING>, props :: MAP) :: (node :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.create.vNodes',
      description: 'Returns virtual `NODE` values.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'labels :: LIST<STRING>',
          name: 'labels',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'props :: LIST<MAP>',
          name: 'props',
          type: 'LIST<MAP>',
        },
      ],
      signature:
        'apoc.create.vNodes(labels :: LIST<STRING>, props :: LIST<MAP>) :: (node :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.create.vRelationship',
      description: 'Returns a virtual `RELATIONSHIP`.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'from :: NODE',
          name: 'from',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'relType :: STRING',
          name: 'relType',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'props :: MAP',
          name: 'props',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'to :: NODE',
          name: 'to',
          type: 'NODE',
        },
      ],
      signature:
        'apoc.create.vRelationship(from :: NODE, relType :: STRING, props :: MAP, to :: NODE) :: (rel :: RELATIONSHIP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'rel :: RELATIONSHIP',
          name: 'rel',
          type: 'RELATIONSHIP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.create.virtualPath',
      description: 'Returns a virtual `PATH`.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'labelsN :: LIST<STRING>',
          name: 'labelsN',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'n :: MAP',
          name: 'n',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'relType :: STRING',
          name: 'relType',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'props :: MAP',
          name: 'props',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'labelsM :: LIST<STRING>',
          name: 'labelsM',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'm :: MAP',
          name: 'm',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.create.virtualPath(labelsN :: LIST<STRING>, n :: MAP, relType :: STRING, props :: MAP, labelsM :: LIST<STRING>, m :: MAP) :: (from :: NODE, rel :: RELATIONSHIP, to :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'from :: NODE',
          name: 'from',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'rel :: RELATIONSHIP',
          name: 'rel',
          type: 'RELATIONSHIP',
        },
        {
          isDeprecated: false,
          description: 'to :: NODE',
          name: 'to',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.cypher.doIt',
      description:
        'Runs a dynamically constructed statement with the given parameters. This procedure allows for both read and write statements.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'statement :: STRING',
          name: 'statement',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'params :: MAP',
          name: 'params',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.cypher.doIt(statement :: STRING, params :: MAP) :: (value :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: MAP',
          name: 'value',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.cypher.run',
      description:
        'Runs a dynamically constructed read-only statement with the given parameters.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'statement :: STRING',
          name: 'statement',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'params :: MAP',
          name: 'params',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.cypher.run(statement :: STRING, params :: MAP) :: (value :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: MAP',
          name: 'value',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.cypher.runMany',
      description:
        'Runs each semicolon separated statement and returns a summary of the statement outcomes.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'statement :: STRING',
          name: 'statement',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'params :: MAP',
          name: 'params',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.cypher.runMany(statement :: STRING, params :: MAP, config = {} :: MAP) :: (row :: INTEGER, result :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'row :: INTEGER',
          name: 'row',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'result :: MAP',
          name: 'result',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.cypher.runManyReadOnly',
      description:
        'Runs each semicolon separated read-only statement and returns a summary of the statement outcomes.',
      mode: 'READ',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'statement :: STRING',
          name: 'statement',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'params :: MAP',
          name: 'params',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.cypher.runManyReadOnly(statement :: STRING, params :: MAP, config = {} :: MAP) :: (row :: INTEGER, result :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'row :: INTEGER',
          name: 'row',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'result :: MAP',
          name: 'result',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.cypher.runSchema',
      description:
        'Runs the given query schema statement with the given parameters.',
      mode: 'SCHEMA',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'statement :: STRING',
          name: 'statement',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'params :: MAP',
          name: 'params',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.cypher.runSchema(statement :: STRING, params :: MAP) :: (value :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: MAP',
          name: 'value',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.cypher.runTimeboxed',
      description:
        'Terminates a Cypher statement if it has not finished before the set timeout (ms).',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'statement :: STRING',
          name: 'statement',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'params :: MAP',
          name: 'params',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'timeout :: INTEGER',
          name: 'timeout',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.cypher.runTimeboxed(statement :: STRING, params :: MAP, timeout :: INTEGER) :: (value :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: MAP',
          name: 'value',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.cypher.runWrite',
      description: 'Alias for `apoc.cypher.doIt`.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'statement :: STRING',
          name: 'statement',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'params :: MAP',
          name: 'params',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.cypher.runWrite(statement :: STRING, params :: MAP) :: (value :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: MAP',
          name: 'value',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.do.case',
      description:
        'For each pair of conditional queries in the given `LIST<ANY>`, this procedure will run the first query for which the conditional is evaluated to true.\nIf none of the conditionals are true, the `ELSE` query will run instead.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'conditionals :: LIST<ANY>',
          name: 'conditionals',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'elseQuery =  :: STRING',
          name: 'elseQuery',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'params = {} :: MAP',
          name: 'params',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.do.case(conditionals :: LIST<ANY>, elseQuery =  :: STRING, params = {} :: MAP) :: (value :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: MAP',
          name: 'value',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.do.when',
      description:
        'Runs the given read/write `ifQuery` if the conditional has evaluated to true, otherwise the `elseQuery` will run.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'condition :: BOOLEAN',
          name: 'condition',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'ifQuery :: STRING',
          name: 'ifQuery',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'elseQuery =  :: STRING',
          name: 'elseQuery',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'params = {} :: MAP',
          name: 'params',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.do.when(condition :: BOOLEAN, ifQuery :: STRING, elseQuery =  :: STRING, params = {} :: MAP) :: (value :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: MAP',
          name: 'value',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.example.movies',
      description: 'Seeds the database with the Neo4j movie dataset.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [],
      signature:
        'apoc.example.movies() :: (file :: STRING, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, batches :: INTEGER, done :: BOOLEAN, data :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'data :: ANY',
          name: 'data',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.export.arrow.all',
      description: 'Exports the full database as an arrow file.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.export.arrow.all(file :: STRING, config = {} :: MAP) :: (file :: STRING, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, batches :: INTEGER, done :: BOOLEAN, data :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'data :: ANY',
          name: 'data',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.export.arrow.graph',
      description: 'Exports the given graph as an arrow file.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'graph :: ANY',
          name: 'graph',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.export.arrow.graph(file :: STRING, graph :: ANY, config = {} :: MAP) :: (file :: STRING, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, batches :: INTEGER, done :: BOOLEAN, data :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'data :: ANY',
          name: 'data',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.export.arrow.query',
      description:
        'Exports the results from the given Cypher query as an arrow file.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'query :: STRING',
          name: 'query',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.export.arrow.query(file :: STRING, query :: STRING, config = {} :: MAP) :: (file :: STRING, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, batches :: INTEGER, done :: BOOLEAN, data :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'data :: ANY',
          name: 'data',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.export.arrow.stream.all',
      description: 'Exports the full database as an arrow byte array.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.export.arrow.stream.all(config = {} :: MAP) :: (value :: BYTEARRAY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: BYTEARRAY',
          name: 'value',
          type: 'BYTEARRAY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.export.arrow.stream.graph',
      description: 'Exports the given graph as an arrow byte array.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'graph :: ANY',
          name: 'graph',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.export.arrow.stream.graph(graph :: ANY, config = {} :: MAP) :: (value :: BYTEARRAY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: BYTEARRAY',
          name: 'value',
          type: 'BYTEARRAY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.export.arrow.stream.query',
      description: 'Exports the given Cypher query as an arrow byte array.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'query :: STRING',
          name: 'query',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.export.arrow.stream.query(query :: STRING, config = {} :: MAP) :: (value :: BYTEARRAY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: BYTEARRAY',
          name: 'value',
          type: 'BYTEARRAY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.export.csv.all',
      description: 'Exports the full database to the provided CSV file.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'config :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.export.csv.all(file :: STRING, config :: MAP) :: (file :: STRING, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, batches :: INTEGER, done :: BOOLEAN, data :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'data :: ANY',
          name: 'data',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.export.csv.data',
      description:
        'Exports the given `NODE` and `RELATIONSHIP` values to the provided CSV file.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
        {
          isDeprecated: false,
          description: 'rels :: LIST<RELATIONSHIP>',
          name: 'rels',
          type: 'LIST<RELATIONSHIP>',
        },
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'config :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.export.csv.data(nodes :: LIST<NODE>, rels :: LIST<RELATIONSHIP>, file :: STRING, config :: MAP) :: (file :: STRING, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, batches :: INTEGER, done :: BOOLEAN, data :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'data :: ANY',
          name: 'data',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.export.csv.graph',
      description: 'Exports the given graph to the provided CSV file.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'graph :: MAP',
          name: 'graph',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'config :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.export.csv.graph(graph :: MAP, file :: STRING, config :: MAP) :: (file :: STRING, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, batches :: INTEGER, done :: BOOLEAN, data :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'data :: ANY',
          name: 'data',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.export.csv.query',
      description:
        'Exports the results from running the given Cypher query to the provided CSV file.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'query :: STRING',
          name: 'query',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'config :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.export.csv.query(query :: STRING, file :: STRING, config :: MAP) :: (file :: STRING, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, batches :: INTEGER, done :: BOOLEAN, data :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'data :: ANY',
          name: 'data',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.export.cypher.all',
      description:
        'Exports the full database (incl. indexes) as Cypher statements to the provided file (default: Cypher Shell).',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'file =  :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.export.cypher.all(file =  :: STRING, config = {} :: MAP) :: (file :: STRING, batches :: INTEGER, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, cypherStatements :: ANY, nodeStatements :: ANY, relationshipStatements :: ANY, schemaStatements :: ANY, cleanupStatements :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'cypherStatements :: ANY',
          name: 'cypherStatements',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'nodeStatements :: ANY',
          name: 'nodeStatements',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'relationshipStatements :: ANY',
          name: 'relationshipStatements',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'schemaStatements :: ANY',
          name: 'schemaStatements',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'cleanupStatements :: ANY',
          name: 'cleanupStatements',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.export.cypher.data',
      description:
        'Exports the given `NODE` and `RELATIONSHIP` values (incl. indexes) as Cypher statements to the provided file (default: Cypher Shell).',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
        {
          isDeprecated: false,
          description: 'rels :: LIST<RELATIONSHIP>',
          name: 'rels',
          type: 'LIST<RELATIONSHIP>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'file =  :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.export.cypher.data(nodes :: LIST<NODE>, rels :: LIST<RELATIONSHIP>, file =  :: STRING, config = {} :: MAP) :: (file :: STRING, batches :: INTEGER, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, cypherStatements :: ANY, nodeStatements :: ANY, relationshipStatements :: ANY, schemaStatements :: ANY, cleanupStatements :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'cypherStatements :: ANY',
          name: 'cypherStatements',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'nodeStatements :: ANY',
          name: 'nodeStatements',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'relationshipStatements :: ANY',
          name: 'relationshipStatements',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'schemaStatements :: ANY',
          name: 'schemaStatements',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'cleanupStatements :: ANY',
          name: 'cleanupStatements',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.export.cypher.graph',
      description:
        'Exports the given graph (incl. indexes) as Cypher statements to the provided file (default: Cypher Shell).',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'graph :: MAP',
          name: 'graph',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'file =  :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.export.cypher.graph(graph :: MAP, file =  :: STRING, config = {} :: MAP) :: (file :: STRING, batches :: INTEGER, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, cypherStatements :: ANY, nodeStatements :: ANY, relationshipStatements :: ANY, schemaStatements :: ANY, cleanupStatements :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'cypherStatements :: ANY',
          name: 'cypherStatements',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'nodeStatements :: ANY',
          name: 'nodeStatements',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'relationshipStatements :: ANY',
          name: 'relationshipStatements',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'schemaStatements :: ANY',
          name: 'schemaStatements',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'cleanupStatements :: ANY',
          name: 'cleanupStatements',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.export.cypher.query',
      description:
        'Exports the `NODE` and `RELATIONSHIP` values from the given Cypher query (incl. indexes) as Cypher statements to the provided file (default: Cypher Shell).',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'statement :: STRING',
          name: 'statement',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'file =  :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.export.cypher.query(statement :: STRING, file =  :: STRING, config = {} :: MAP) :: (file :: STRING, batches :: INTEGER, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, cypherStatements :: ANY, nodeStatements :: ANY, relationshipStatements :: ANY, schemaStatements :: ANY, cleanupStatements :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'cypherStatements :: ANY',
          name: 'cypherStatements',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'nodeStatements :: ANY',
          name: 'nodeStatements',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'relationshipStatements :: ANY',
          name: 'relationshipStatements',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'schemaStatements :: ANY',
          name: 'schemaStatements',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'cleanupStatements :: ANY',
          name: 'cleanupStatements',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.export.cypher.schema',
      description:
        'Exports all schema indexes and constraints to Cypher statements.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'file =  :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.export.cypher.schema(file =  :: STRING, config = {} :: MAP) :: (file :: STRING, batches :: INTEGER, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, cypherStatements :: ANY, nodeStatements :: ANY, relationshipStatements :: ANY, schemaStatements :: ANY, cleanupStatements :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'cypherStatements :: ANY',
          name: 'cypherStatements',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'nodeStatements :: ANY',
          name: 'nodeStatements',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'relationshipStatements :: ANY',
          name: 'relationshipStatements',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'schemaStatements :: ANY',
          name: 'schemaStatements',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'cleanupStatements :: ANY',
          name: 'cleanupStatements',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.export.graphml.all',
      description: 'Exports the full database to the provided GraphML file.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'config :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.export.graphml.all(file :: STRING, config :: MAP) :: (file :: STRING, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, batches :: INTEGER, done :: BOOLEAN, data :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'data :: ANY',
          name: 'data',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.export.graphml.data',
      description:
        'Exports the given `NODE` and `RELATIONSHIP` values to the provided GraphML file.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
        {
          isDeprecated: false,
          description: 'rels :: LIST<RELATIONSHIP>',
          name: 'rels',
          type: 'LIST<RELATIONSHIP>',
        },
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'config :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.export.graphml.data(nodes :: LIST<NODE>, rels :: LIST<RELATIONSHIP>, file :: STRING, config :: MAP) :: (file :: STRING, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, batches :: INTEGER, done :: BOOLEAN, data :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'data :: ANY',
          name: 'data',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.export.graphml.graph',
      description: 'Exports the given graph to the provided GraphML file.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'graph :: MAP',
          name: 'graph',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'config :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.export.graphml.graph(graph :: MAP, file :: STRING, config :: MAP) :: (file :: STRING, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, batches :: INTEGER, done :: BOOLEAN, data :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'data :: ANY',
          name: 'data',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.export.graphml.query',
      description:
        'Exports the given `NODE` and `RELATIONSHIP` values from the Cypher statement to the provided GraphML file.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'statement :: STRING',
          name: 'statement',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'config :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.export.graphml.query(statement :: STRING, file :: STRING, config :: MAP) :: (file :: STRING, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, batches :: INTEGER, done :: BOOLEAN, data :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'data :: ANY',
          name: 'data',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.export.json.all',
      description: 'Exports the full database to the provided JSON file.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.export.json.all(file :: STRING, config = {} :: MAP) :: (file :: STRING, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, batches :: INTEGER, done :: BOOLEAN, data :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'data :: ANY',
          name: 'data',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.export.json.data',
      description:
        'Exports the given `NODE` and `RELATIONSHIP` values to the provided JSON file.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
        {
          isDeprecated: false,
          description: 'rels :: LIST<RELATIONSHIP>',
          name: 'rels',
          type: 'LIST<RELATIONSHIP>',
        },
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.export.json.data(nodes :: LIST<NODE>, rels :: LIST<RELATIONSHIP>, file :: STRING, config = {} :: MAP) :: (file :: STRING, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, batches :: INTEGER, done :: BOOLEAN, data :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'data :: ANY',
          name: 'data',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.export.json.graph',
      description: 'Exports the given graph to the provided JSON file.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'graph :: MAP',
          name: 'graph',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.export.json.graph(graph :: MAP, file :: STRING, config = {} :: MAP) :: (file :: STRING, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, batches :: INTEGER, done :: BOOLEAN, data :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'data :: ANY',
          name: 'data',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.export.json.query',
      description:
        'Exports the results from the Cypher statement to the provided JSON file.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'statement :: STRING',
          name: 'statement',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.export.json.query(statement :: STRING, file :: STRING, config = {} :: MAP) :: (file :: STRING, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, batches :: INTEGER, done :: BOOLEAN, data :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'data :: ANY',
          name: 'data',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.graph.from',
      description:
        'Generates a virtual sub-graph by extracting all of the `NODE` and `RELATIONSHIP` values from the given data.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'data :: ANY',
          name: 'data',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'props :: MAP',
          name: 'props',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.graph.from(data :: ANY, name :: STRING, props :: MAP) :: (graph :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'graph :: MAP',
          name: 'graph',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.graph.fromCypher',
      description:
        'Generates a virtual sub-graph by extracting all of the `NODE` and `RELATIONSHIP` values from the data returned by the given Cypher statement.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'statement :: STRING',
          name: 'statement',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'params :: MAP',
          name: 'params',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'props :: MAP',
          name: 'props',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.graph.fromCypher(statement :: STRING, params :: MAP, name :: STRING, props :: MAP) :: (graph :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'graph :: MAP',
          name: 'graph',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.graph.fromDB',
      description:
        'Generates a virtual sub-graph by extracting all of the `NODE` and `RELATIONSHIP` values from the data returned by the given database.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'props :: MAP',
          name: 'props',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.graph.fromDB(name :: STRING, props :: MAP) :: (graph :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'graph :: MAP',
          name: 'graph',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.graph.fromData',
      description:
        'Generates a virtual sub-graph by extracting all of the `NODE` and `RELATIONSHIP` values from the given data.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
        {
          isDeprecated: false,
          description: 'rels :: LIST<RELATIONSHIP>',
          name: 'rels',
          type: 'LIST<RELATIONSHIP>',
        },
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'props :: MAP',
          name: 'props',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.graph.fromData(nodes :: LIST<NODE>, rels :: LIST<RELATIONSHIP>, name :: STRING, props :: MAP) :: (graph :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'graph :: MAP',
          name: 'graph',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.graph.fromDocument',
      description:
        'Generates a virtual sub-graph by extracting all of the `NODE` and `RELATIONSHIP` values from the data returned by the given JSON file.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'json :: ANY',
          name: 'json',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.graph.fromDocument(json :: ANY, config = {} :: MAP) :: (graph :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'graph :: MAP',
          name: 'graph',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.graph.fromPath',
      description:
        'Generates a virtual sub-graph by extracting all of the `NODE` and `RELATIONSHIP` values from the data returned by the given `PATH`.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'path :: PATH',
          name: 'path',
          type: 'PATH',
        },
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'props :: MAP',
          name: 'props',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.graph.fromPath(path :: PATH, name :: STRING, props :: MAP) :: (graph :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'graph :: MAP',
          name: 'graph',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.graph.fromPaths',
      description:
        'Generates a virtual sub-graph by extracting all of the `NODE` and `RELATIONSHIP` values from the data returned by the given `PATH` values.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'paths :: LIST<PATH>',
          name: 'paths',
          type: 'LIST<PATH>',
        },
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'props :: MAP',
          name: 'props',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.graph.fromPaths(paths :: LIST<PATH>, name :: STRING, props :: MAP) :: (graph :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'graph :: MAP',
          name: 'graph',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.graph.validateDocument',
      description:
        'Validates the JSON file and returns the result of the validation.',
      mode: 'READ',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'json :: ANY',
          name: 'json',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.graph.validateDocument(json :: ANY, config = {} :: MAP) :: (row :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'row :: MAP',
          name: 'row',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.help',
      description:
        'Returns descriptions of the available APOC procedures and functions. If a keyword is provided, it will return only those procedures and functions that have the keyword in their name.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'proc :: STRING',
          name: 'proc',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.help(proc :: STRING) :: (type :: STRING, name :: STRING, text :: STRING, signature :: STRING, roles :: LIST<STRING>, writes :: BOOLEAN, core :: BOOLEAN, isDeprecated :: BOOLEAN)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'type :: STRING',
          name: 'type',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'text :: STRING',
          name: 'text',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'signature :: STRING',
          name: 'signature',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'roles :: LIST<STRING>',
          name: 'roles',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'writes :: BOOLEAN',
          name: 'writes',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'core :: BOOLEAN',
          name: 'core',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'isDeprecated :: BOOLEAN',
          name: 'isDeprecated',
          type: 'BOOLEAN',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.import.csv',
      description:
        'Imports `NODE` and `RELATIONSHIP` values with the given labels and types from the provided CSV file.',
      mode: 'SCHEMA',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<MAP>',
          name: 'nodes',
          type: 'LIST<MAP>',
        },
        {
          isDeprecated: false,
          description: 'rels :: LIST<MAP>',
          name: 'rels',
          type: 'LIST<MAP>',
        },
        {
          isDeprecated: false,
          description: 'config :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.import.csv(nodes :: LIST<MAP>, rels :: LIST<MAP>, config :: MAP) :: (file :: STRING, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, batches :: INTEGER, done :: BOOLEAN, data :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'data :: ANY',
          name: 'data',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.import.graphml',
      description: 'Imports a graph from the provided GraphML file.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'urlOrBinaryFile :: ANY',
          name: 'urlOrBinaryFile',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'config :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.import.graphml(urlOrBinaryFile :: ANY, config :: MAP) :: (file :: STRING, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, batches :: INTEGER, done :: BOOLEAN, data :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'data :: ANY',
          name: 'data',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.import.json',
      description: 'Imports a graph from the provided JSON file.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'urlOrBinaryFile :: ANY',
          name: 'urlOrBinaryFile',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.import.json(urlOrBinaryFile :: ANY, config = {} :: MAP) :: (file :: STRING, source :: STRING, format :: STRING, nodes :: INTEGER, relationships :: INTEGER, properties :: INTEGER, time :: INTEGER, rows :: INTEGER, batchSize :: INTEGER, batches :: INTEGER, done :: BOOLEAN, data :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'source :: STRING',
          name: 'source',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'format :: STRING',
          name: 'format',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodes :: INTEGER',
          name: 'nodes',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relationships :: INTEGER',
          name: 'relationships',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'properties :: INTEGER',
          name: 'properties',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'time :: INTEGER',
          name: 'time',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rows :: INTEGER',
          name: 'rows',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'data :: ANY',
          name: 'data',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.import.xml',
      description: 'Imports a graph from the provided XML file.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'urlOrBinary :: ANY',
          name: 'urlOrBinary',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.import.xml(urlOrBinary :: ANY, config = {} :: MAP) :: (node :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.load.arrow',
      description:
        'Imports `NODE` and `RELATIONSHIP` values from the provided arrow file.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'file :: STRING',
          name: 'file',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.load.arrow(file :: STRING, config = {} :: MAP) :: (value :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: MAP',
          name: 'value',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.load.arrow.stream',
      description:
        'Imports `NODE` and `RELATIONSHIP` values from the provided arrow byte array.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'source :: BYTEARRAY',
          name: 'source',
          type: 'BYTEARRAY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.load.arrow.stream(source :: BYTEARRAY, config = {} :: MAP) :: (value :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: MAP',
          name: 'value',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.load.json',
      description:
        'Imports JSON file as a stream of values if the given JSON file is a `LIST<ANY>`.\nIf the given JSON file is a `MAP`, this procedure imports a single value instead.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'urlOrKeyOrBinary :: ANY',
          name: 'urlOrKeyOrBinary',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'path =  :: STRING',
          name: 'path',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.load.json(urlOrKeyOrBinary :: ANY, path =  :: STRING, config = {} :: MAP) :: (value :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: MAP',
          name: 'value',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.load.jsonArray',
      description:
        'Loads array from a JSON URL (e.g. web-API) to then import the given JSON file as a stream of values.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'url :: STRING',
          name: 'url',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'path =  :: STRING',
          name: 'path',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.load.jsonArray(url :: STRING, path =  :: STRING, config = {} :: MAP) :: (value :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.load.jsonParams',
      description:
        'Loads parameters from a JSON URL (e.g. web-API) as a stream of values if the given JSON file is a `LIST<ANY>`.\nIf the given JSON file is a `MAP`, this procedure imports a single value instead.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'urlOrKeyOrBinary :: ANY',
          name: 'urlOrKeyOrBinary',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'headers :: MAP',
          name: 'headers',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'payload :: STRING',
          name: 'payload',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'path =  :: STRING',
          name: 'path',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.load.jsonParams(urlOrKeyOrBinary :: ANY, headers :: MAP, payload :: STRING, path =  :: STRING, config = {} :: MAP) :: (value :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: MAP',
          name: 'value',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.load.xml',
      description:
        'Loads a single nested `MAP` from an XML URL (e.g. web-API).',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'urlOrBinary :: ANY',
          name: 'urlOrBinary',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=/, type=STRING}',
          description: 'path = / :: STRING',
          name: 'path',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=false, type=BOOLEAN}',
          description: 'simple = false :: BOOLEAN',
          name: 'simple',
          type: 'BOOLEAN',
        },
      ],
      signature:
        'apoc.load.xml(urlOrBinary :: ANY, path = / :: STRING, config = {} :: MAP, simple = false :: BOOLEAN) :: (value :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: MAP',
          name: 'value',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.lock.all',
      description:
        'Acquires a write lock on the given `NODE` and `RELATIONSHIP` values.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
        {
          isDeprecated: false,
          description: 'rels :: LIST<RELATIONSHIP>',
          name: 'rels',
          type: 'LIST<RELATIONSHIP>',
        },
      ],
      signature:
        'apoc.lock.all(nodes :: LIST<NODE>, rels :: LIST<RELATIONSHIP>)',
      returnDescription: [],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.lock.nodes',
      description: 'Acquires a write lock on the given `NODE` values.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
      ],
      signature: 'apoc.lock.nodes(nodes :: LIST<NODE>)',
      returnDescription: [],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.lock.read.nodes',
      description: 'Acquires a read lock on the given `NODE` values.',
      mode: 'READ',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
      ],
      signature: 'apoc.lock.read.nodes(nodes :: LIST<NODE>)',
      returnDescription: [],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.lock.read.rels',
      description: 'Acquires a read lock on the given `RELATIONSHIP` values.',
      mode: 'READ',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'rels :: LIST<RELATIONSHIP>',
          name: 'rels',
          type: 'LIST<RELATIONSHIP>',
        },
      ],
      signature: 'apoc.lock.read.rels(rels :: LIST<RELATIONSHIP>)',
      returnDescription: [],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.lock.rels',
      description: 'Acquires a write lock on the given `RELATIONSHIP` values.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'rels :: LIST<RELATIONSHIP>',
          name: 'rels',
          type: 'LIST<RELATIONSHIP>',
        },
      ],
      signature: 'apoc.lock.rels(rels :: LIST<RELATIONSHIP>)',
      returnDescription: [],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.log.stream',
      description:
        'Returns the file contents from the given log, optionally returning only the last n lines.\nThis procedure requires users to have an admin role.',
      mode: 'DBMS',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'path :: STRING',
          name: 'path',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.log.stream(path :: STRING, config = {} :: MAP) :: (lineNo :: INTEGER, line :: STRING, path :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'lineNo :: INTEGER',
          name: 'lineNo',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'line :: STRING',
          name: 'line',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'path :: STRING',
          name: 'path',
          type: 'STRING',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.math.regr',
      description:
        'Returns the coefficient of determination (R-squared) for the values of propertyY and propertyX in the given label.',
      mode: 'READ',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'label :: STRING',
          name: 'label',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'propertyY :: STRING',
          name: 'propertyY',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'propertyX :: STRING',
          name: 'propertyX',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.math.regr(label :: STRING, propertyY :: STRING, propertyX :: STRING) :: (r2 :: FLOAT, avgX :: FLOAT, avgY :: FLOAT, slope :: FLOAT)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'r2 :: FLOAT',
          name: 'r2',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: 'avgX :: FLOAT',
          name: 'avgX',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: 'avgY :: FLOAT',
          name: 'avgY',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: 'slope :: FLOAT',
          name: 'slope',
          type: 'FLOAT',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.merge.node',
      description:
        'Merges the given `NODE` values with the given dynamic labels.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'labels :: LIST<STRING>',
          name: 'labels',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'identProps :: MAP',
          name: 'identProps',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'onCreateProps = {} :: MAP',
          name: 'onCreateProps',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'onMatchProps = {} :: MAP',
          name: 'onMatchProps',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.merge.node(labels :: LIST<STRING>, identProps :: MAP, onCreateProps = {} :: MAP, onMatchProps = {} :: MAP) :: (node :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.merge.node.eager',
      description:
        'Merges the given `NODE` values with the given dynamic labels eagerly.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'labels :: LIST<STRING>',
          name: 'labels',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'identProps :: MAP',
          name: 'identProps',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'onCreateProps = {} :: MAP',
          name: 'onCreateProps',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'onMatchProps = {} :: MAP',
          name: 'onMatchProps',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.merge.node.eager(labels :: LIST<STRING>, identProps :: MAP, onCreateProps = {} :: MAP, onMatchProps = {} :: MAP) :: (node :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.merge.nodeWithStats',
      description:
        'Merges the given `NODE` values with the given dynamic labels. Provides queryStatistics in the result.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'labels :: LIST<STRING>',
          name: 'labels',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'identProps :: MAP',
          name: 'identProps',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'onCreateProps = {} :: MAP',
          name: 'onCreateProps',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'onMatchProps = {} :: MAP',
          name: 'onMatchProps',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.merge.nodeWithStats(labels :: LIST<STRING>, identProps :: MAP, onCreateProps = {} :: MAP, onMatchProps = {} :: MAP) :: (stats :: MAP, node :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'stats :: MAP',
          name: 'stats',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.merge.nodeWithStats.eager',
      description:
        'Merges the given `NODE` values with the given dynamic labels eagerly. Provides queryStatistics in the result.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'labels :: LIST<STRING>',
          name: 'labels',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'identProps :: MAP',
          name: 'identProps',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'onCreateProps = {} :: MAP',
          name: 'onCreateProps',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'onMatchProps = {} :: MAP',
          name: 'onMatchProps',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.merge.nodeWithStats.eager(labels :: LIST<STRING>, identProps :: MAP, onCreateProps = {} :: MAP, onMatchProps = {} :: MAP) :: (stats :: MAP, node :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'stats :: MAP',
          name: 'stats',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.merge.relationship',
      description:
        'Merges the given `RELATIONSHIP` values with the given dynamic types/properties.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'startNode :: NODE',
          name: 'startNode',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'relType :: STRING',
          name: 'relType',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'identProps :: MAP',
          name: 'identProps',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'onCreateProps :: MAP',
          name: 'onCreateProps',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'endNode :: NODE',
          name: 'endNode',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'onMatchProps = {} :: MAP',
          name: 'onMatchProps',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.merge.relationship(startNode :: NODE, relType :: STRING, identProps :: MAP, onCreateProps :: MAP, endNode :: NODE, onMatchProps = {} :: MAP) :: (rel :: RELATIONSHIP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'rel :: RELATIONSHIP',
          name: 'rel',
          type: 'RELATIONSHIP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.merge.relationship.eager',
      description:
        'Merges the given `RELATIONSHIP` values with the given dynamic types/properties eagerly.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'startNode :: NODE',
          name: 'startNode',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'relType :: STRING',
          name: 'relType',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'identProps :: MAP',
          name: 'identProps',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'onCreateProps :: MAP',
          name: 'onCreateProps',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'endNode :: NODE',
          name: 'endNode',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'onMatchProps = {} :: MAP',
          name: 'onMatchProps',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.merge.relationship.eager(startNode :: NODE, relType :: STRING, identProps :: MAP, onCreateProps :: MAP, endNode :: NODE, onMatchProps = {} :: MAP) :: (rel :: RELATIONSHIP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'rel :: RELATIONSHIP',
          name: 'rel',
          type: 'RELATIONSHIP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.merge.relationshipWithStats',
      description:
        'Merges the given `RELATIONSHIP` values with the given dynamic types/properties. Provides queryStatistics in the result.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'startNode :: NODE',
          name: 'startNode',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'relType :: STRING',
          name: 'relType',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'identProps :: MAP',
          name: 'identProps',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'onCreateProps :: MAP',
          name: 'onCreateProps',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'endNode :: NODE',
          name: 'endNode',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'onMatchProps = {} :: MAP',
          name: 'onMatchProps',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.merge.relationshipWithStats(startNode :: NODE, relType :: STRING, identProps :: MAP, onCreateProps :: MAP, endNode :: NODE, onMatchProps = {} :: MAP) :: (stats :: MAP, rel :: RELATIONSHIP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'stats :: MAP',
          name: 'stats',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'rel :: RELATIONSHIP',
          name: 'rel',
          type: 'RELATIONSHIP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.merge.relationshipWithStats.eager',
      description:
        'Merges the given `RELATIONSHIP` values with the given dynamic types/properties eagerly. Provides queryStatistics in the result.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'startNode :: NODE',
          name: 'startNode',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'relType :: STRING',
          name: 'relType',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'identProps :: MAP',
          name: 'identProps',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'onCreateProps :: MAP',
          name: 'onCreateProps',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'endNode :: NODE',
          name: 'endNode',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'onMatchProps = {} :: MAP',
          name: 'onMatchProps',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.merge.relationshipWithStats.eager(startNode :: NODE, relType :: STRING, identProps :: MAP, onCreateProps :: MAP, endNode :: NODE, onMatchProps = {} :: MAP) :: (stats :: MAP, rel :: RELATIONSHIP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'stats :: MAP',
          name: 'stats',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'rel :: RELATIONSHIP',
          name: 'rel',
          type: 'RELATIONSHIP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.meta.data',
      description: 'Examines the full graph and returns a table of metadata.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.meta.data(config = {} :: MAP) :: (label :: STRING, property :: STRING, count :: INTEGER, unique :: BOOLEAN, index :: BOOLEAN, existence :: BOOLEAN, type :: STRING, array :: BOOLEAN, sample :: LIST<ANY>, left :: INTEGER, right :: INTEGER, other :: LIST<STRING>, otherLabels :: LIST<STRING>, elementType :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'label :: STRING',
          name: 'label',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'property :: STRING',
          name: 'property',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'count :: INTEGER',
          name: 'count',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'unique :: BOOLEAN',
          name: 'unique',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'index :: BOOLEAN',
          name: 'index',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'existence :: BOOLEAN',
          name: 'existence',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'type :: STRING',
          name: 'type',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'array :: BOOLEAN',
          name: 'array',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'sample :: LIST<ANY>',
          name: 'sample',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'left :: INTEGER',
          name: 'left',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'right :: INTEGER',
          name: 'right',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'other :: LIST<STRING>',
          name: 'other',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'otherLabels :: LIST<STRING>',
          name: 'otherLabels',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'elementType :: STRING',
          name: 'elementType',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.meta.data.of',
      description:
        'Examines the given sub-graph and returns a table of metadata.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'graph :: ANY',
          name: 'graph',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.meta.data.of(graph :: ANY, config = {} :: MAP) :: (label :: STRING, property :: STRING, count :: INTEGER, unique :: BOOLEAN, index :: BOOLEAN, existence :: BOOLEAN, type :: STRING, array :: BOOLEAN, sample :: LIST<ANY>, left :: INTEGER, right :: INTEGER, other :: LIST<STRING>, otherLabels :: LIST<STRING>, elementType :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'label :: STRING',
          name: 'label',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'property :: STRING',
          name: 'property',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'count :: INTEGER',
          name: 'count',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'unique :: BOOLEAN',
          name: 'unique',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'index :: BOOLEAN',
          name: 'index',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'existence :: BOOLEAN',
          name: 'existence',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'type :: STRING',
          name: 'type',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'array :: BOOLEAN',
          name: 'array',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'sample :: LIST<ANY>',
          name: 'sample',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'left :: INTEGER',
          name: 'left',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'right :: INTEGER',
          name: 'right',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'other :: LIST<STRING>',
          name: 'other',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'otherLabels :: LIST<STRING>',
          name: 'otherLabels',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'elementType :: STRING',
          name: 'elementType',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.meta.graph',
      description: 'Examines the full graph and returns a meta-graph.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.meta.graph(config = {} :: MAP) :: (nodes :: LIST<NODE>, relationships :: LIST<RELATIONSHIP>)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
        {
          isDeprecated: false,
          description: 'relationships :: LIST<RELATIONSHIP>',
          name: 'relationships',
          type: 'LIST<RELATIONSHIP>',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.meta.graph.of',
      description: 'Examines the given sub-graph and returns a meta-graph.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=ANY}',
          description: 'graph = {} :: ANY',
          name: 'graph',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.meta.graph.of(graph = {} :: ANY, config = {} :: MAP) :: (nodes :: LIST<NODE>, relationships :: LIST<RELATIONSHIP>)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
        {
          isDeprecated: false,
          description: 'relationships :: LIST<RELATIONSHIP>',
          name: 'relationships',
          type: 'LIST<RELATIONSHIP>',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.meta.graphSample',
      description:
        'Examines the full graph and returns a meta-graph.\nUnlike `apoc.meta.graph`, this procedure does not filter away non-existing paths.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.meta.graphSample(config = {} :: MAP) :: (nodes :: LIST<NODE>, relationships :: LIST<RELATIONSHIP>)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
        {
          isDeprecated: false,
          description: 'relationships :: LIST<RELATIONSHIP>',
          name: 'relationships',
          type: 'LIST<RELATIONSHIP>',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.meta.nodeTypeProperties',
      description:
        'Examines the full graph and returns a table of metadata with information about the `NODE` values therein.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.meta.nodeTypeProperties(config = {} :: MAP) :: (nodeType :: STRING, nodeLabels :: LIST<STRING>, propertyName :: STRING, propertyTypes :: LIST<STRING>, mandatory :: BOOLEAN, propertyObservations :: INTEGER, totalObservations :: INTEGER)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'nodeType :: STRING',
          name: 'nodeType',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodeLabels :: LIST<STRING>',
          name: 'nodeLabels',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'propertyName :: STRING',
          name: 'propertyName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'propertyTypes :: LIST<STRING>',
          name: 'propertyTypes',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'mandatory :: BOOLEAN',
          name: 'mandatory',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'propertyObservations :: INTEGER',
          name: 'propertyObservations',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'totalObservations :: INTEGER',
          name: 'totalObservations',
          type: 'INTEGER',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.meta.relTypeProperties',
      description:
        'Examines the full graph and returns a table of metadata with information about the `RELATIONSHIP` values therein.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.meta.relTypeProperties(config = {} :: MAP) :: (relType :: STRING, sourceNodeLabels :: LIST<STRING>, targetNodeLabels :: LIST<STRING>, propertyName :: STRING, propertyTypes :: LIST<STRING>, mandatory :: BOOLEAN, propertyObservations :: INTEGER, totalObservations :: INTEGER)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'relType :: STRING',
          name: 'relType',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'sourceNodeLabels :: LIST<STRING>',
          name: 'sourceNodeLabels',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'targetNodeLabels :: LIST<STRING>',
          name: 'targetNodeLabels',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'propertyName :: STRING',
          name: 'propertyName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'propertyTypes :: LIST<STRING>',
          name: 'propertyTypes',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'mandatory :: BOOLEAN',
          name: 'mandatory',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'propertyObservations :: INTEGER',
          name: 'propertyObservations',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'totalObservations :: INTEGER',
          name: 'totalObservations',
          type: 'INTEGER',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.meta.schema',
      description:
        'Examines the given sub-graph and returns metadata as a `MAP`.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature: 'apoc.meta.schema(config = {} :: MAP) :: (value :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: MAP',
          name: 'value',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.meta.stats',
      description:
        'Returns the metadata stored in the transactional database statistics.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [],
      signature:
        'apoc.meta.stats() :: (labelCount :: INTEGER, relTypeCount :: INTEGER, propertyKeyCount :: INTEGER, nodeCount :: INTEGER, relCount :: INTEGER, labels :: MAP, relTypes :: MAP, relTypesCount :: MAP, stats :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'labelCount :: INTEGER',
          name: 'labelCount',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relTypeCount :: INTEGER',
          name: 'relTypeCount',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'propertyKeyCount :: INTEGER',
          name: 'propertyKeyCount',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'nodeCount :: INTEGER',
          name: 'nodeCount',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relCount :: INTEGER',
          name: 'relCount',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'labels :: MAP',
          name: 'labels',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'relTypes :: MAP',
          name: 'relTypes',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'relTypesCount :: MAP',
          name: 'relTypesCount',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'stats :: MAP',
          name: 'stats',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.meta.subGraph',
      description: 'Examines the given sub-graph and returns a meta-graph.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'config :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.meta.subGraph(config :: MAP) :: (nodes :: LIST<NODE>, relationships :: LIST<RELATIONSHIP>)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
        {
          isDeprecated: false,
          description: 'relationships :: LIST<RELATIONSHIP>',
          name: 'relationships',
          type: 'LIST<RELATIONSHIP>',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.neighbors.athop',
      description:
        'Returns all `NODE` values connected by the given `RELATIONSHIP` types at the specified distance.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'relTypes =  :: STRING',
          name: 'relTypes',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=1, type=INTEGER}',
          description: 'distance = 1 :: INTEGER',
          name: 'distance',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.neighbors.athop(node :: NODE, relTypes =  :: STRING, distance = 1 :: INTEGER) :: (node :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.neighbors.athop.count',
      description:
        'Returns the count of all `NODE` values connected by the given `RELATIONSHIP` types at the specified distance.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'relTypes =  :: STRING',
          name: 'relTypes',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=1, type=INTEGER}',
          description: 'distance = 1 :: INTEGER',
          name: 'distance',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.neighbors.athop.count(node :: NODE, relTypes =  :: STRING, distance = 1 :: INTEGER) :: (value :: INTEGER)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: INTEGER',
          name: 'value',
          type: 'INTEGER',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.neighbors.byhop',
      description:
        'Returns all `NODE` values connected by the given `RELATIONSHIP` types within the specified distance. Returns `LIST<NODE>` values, where each `PATH` of `NODE` values represents one row of the `LIST<NODE>` values.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'relTypes =  :: STRING',
          name: 'relTypes',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=1, type=INTEGER}',
          description: 'distance = 1 :: INTEGER',
          name: 'distance',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.neighbors.byhop(node :: NODE, relTypes =  :: STRING, distance = 1 :: INTEGER) :: (nodes :: LIST<NODE>)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.neighbors.byhop.count',
      description:
        'Returns the count of all `NODE` values connected by the given `RELATIONSHIP` types within the specified distance.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'relTypes =  :: STRING',
          name: 'relTypes',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=1, type=INTEGER}',
          description: 'distance = 1 :: INTEGER',
          name: 'distance',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.neighbors.byhop.count(node :: NODE, relTypes =  :: STRING, distance = 1 :: INTEGER) :: (value :: LIST<ANY>)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: LIST<ANY>',
          name: 'value',
          type: 'LIST<ANY>',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.neighbors.tohop',
      description:
        'Returns all `NODE` values connected by the given `RELATIONSHIP` types within the specified distance.\n`NODE` values are returned individually for each row.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'relTypes =  :: STRING',
          name: 'relTypes',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=1, type=INTEGER}',
          description: 'distance = 1 :: INTEGER',
          name: 'distance',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.neighbors.tohop(node :: NODE, relTypes =  :: STRING, distance = 1 :: INTEGER) :: (node :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.neighbors.tohop.count',
      description:
        'Returns the count of all `NODE` values connected by the given `RELATIONSHIP` values in the pattern within the specified distance.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'relTypes =  :: STRING',
          name: 'relTypes',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=1, type=INTEGER}',
          description: 'distance = 1 :: INTEGER',
          name: 'distance',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.neighbors.tohop.count(node :: NODE, relTypes =  :: STRING, distance = 1 :: INTEGER) :: (value :: INTEGER)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: INTEGER',
          name: 'value',
          type: 'INTEGER',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.nodes.collapse',
      description:
        'Merges `NODE` values together in the given `LIST<NODE>`.\nThe `NODE` values are then combined to become one `NODE`, with all labels of the previous `NODE` values attached to it, and all `RELATIONSHIP` values pointing to it.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.nodes.collapse(nodes :: LIST<NODE>, config = {} :: MAP) :: (from :: NODE, rel :: RELATIONSHIP, to :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'from :: NODE',
          name: 'from',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'rel :: RELATIONSHIP',
          name: 'rel',
          type: 'RELATIONSHIP',
        },
        {
          isDeprecated: false,
          description: 'to :: NODE',
          name: 'to',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.nodes.cycles',
      description:
        'Detects all `PATH` cycles in the given `LIST<NODE>`.\nThis procedure can be limited on `RELATIONSHIP` values as well.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.nodes.cycles(nodes :: LIST<NODE>, config = {} :: MAP) :: (path :: PATH)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'path :: PATH',
          name: 'path',
          type: 'PATH',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.nodes.delete',
      description: 'Deletes all `NODE` values with the given ids.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: ANY',
          name: 'nodes',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.nodes.delete(nodes :: ANY, batchSize :: INTEGER) :: (value :: INTEGER)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: INTEGER',
          name: 'value',
          type: 'INTEGER',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.nodes.get',
      description: 'Returns all `NODE` values with the given ids.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: ANY',
          name: 'nodes',
          type: 'ANY',
        },
      ],
      signature: 'apoc.nodes.get(nodes :: ANY) :: (node :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.nodes.group',
      description:
        'Allows for the aggregation of `NODE` values based on the given properties.\nThis procedure returns virtual `NODE` values.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'labels :: LIST<STRING>',
          name: 'labels',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'groupByProperties :: LIST<STRING>',
          name: 'groupByProperties',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          default:
            'DefaultParameterValue{value=[{*=count}, {*=count}], type=LIST<MAP>}',
          description: 'aggregations = [{*=count}, {*=count}] :: LIST<MAP>',
          name: 'aggregations',
          type: 'LIST<MAP>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.nodes.group(labels :: LIST<STRING>, groupByProperties :: LIST<STRING>, aggregations = [{*=count}, {*=count}] :: LIST<MAP>, config = {} :: MAP) :: (nodes :: LIST<NODE>, relationships :: LIST<RELATIONSHIP>, node :: NODE, relationship :: RELATIONSHIP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
        {
          isDeprecated: false,
          description: 'relationships :: LIST<RELATIONSHIP>',
          name: 'relationships',
          type: 'LIST<RELATIONSHIP>',
        },
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'relationship :: RELATIONSHIP',
          name: 'relationship',
          type: 'RELATIONSHIP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.nodes.link',
      description:
        'Creates a linked list of the given `NODE` values connected by the given `RELATIONSHIP` type.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
        {
          isDeprecated: false,
          description: 'type :: STRING',
          name: 'type',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.nodes.link(nodes :: LIST<NODE>, type :: STRING, config = {} :: MAP)',
      returnDescription: [],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.nodes.rels',
      description: 'Returns all `RELATIONSHIP` values with the given ids.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'rels :: ANY',
          name: 'rels',
          type: 'ANY',
        },
      ],
      signature: 'apoc.nodes.rels(rels :: ANY) :: (rel :: RELATIONSHIP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'rel :: RELATIONSHIP',
          name: 'rel',
          type: 'RELATIONSHIP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.path.expand',
      description:
        'Returns `PATH` values expanded from the start `NODE` following the given `RELATIONSHIP` types from min-depth to max-depth.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'startNode :: ANY',
          name: 'startNode',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'relFilter :: STRING',
          name: 'relFilter',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'labelFilter :: STRING',
          name: 'labelFilter',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'minDepth :: INTEGER',
          name: 'minDepth',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'maxDepth :: INTEGER',
          name: 'maxDepth',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.path.expand(startNode :: ANY, relFilter :: STRING, labelFilter :: STRING, minDepth :: INTEGER, maxDepth :: INTEGER) :: (path :: PATH)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'path :: PATH',
          name: 'path',
          type: 'PATH',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.path.expandConfig',
      description:
        'Returns `PATH` values expanded from the start `NODE` with the given `RELATIONSHIP` types from min-depth to max-depth.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'startNode :: ANY',
          name: 'startNode',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'config :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.path.expandConfig(startNode :: ANY, config :: MAP) :: (path :: PATH)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'path :: PATH',
          name: 'path',
          type: 'PATH',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.path.spanningTree',
      description:
        'Returns spanning tree `PATH` values expanded from the start `NODE` following the given `RELATIONSHIP` types to max-depth.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'startNode :: ANY',
          name: 'startNode',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'config :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.path.spanningTree(startNode :: ANY, config :: MAP) :: (path :: PATH)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'path :: PATH',
          name: 'path',
          type: 'PATH',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.path.subgraphAll',
      description:
        'Returns the sub-graph reachable from the start `NODE` following the given `RELATIONSHIP` types to max-depth.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'startNode :: ANY',
          name: 'startNode',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'config :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.path.subgraphAll(startNode :: ANY, config :: MAP) :: (nodes :: LIST<NODE>, relationships :: LIST<RELATIONSHIP>)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
        {
          isDeprecated: false,
          description: 'relationships :: LIST<RELATIONSHIP>',
          name: 'relationships',
          type: 'LIST<RELATIONSHIP>',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.path.subgraphNodes',
      description:
        'Returns the `NODE` values in the sub-graph reachable from the start `NODE` following the given `RELATIONSHIP` types to max-depth.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'startNode :: ANY',
          name: 'startNode',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'config :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.path.subgraphNodes(startNode :: ANY, config :: MAP) :: (node :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.periodic.cancel',
      description: 'Cancels the given background job.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.periodic.cancel(name :: STRING) :: (name :: STRING, delay :: INTEGER, rate :: INTEGER, done :: BOOLEAN, cancelled :: BOOLEAN)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'delay :: INTEGER',
          name: 'delay',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rate :: INTEGER',
          name: 'rate',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'cancelled :: BOOLEAN',
          name: 'cancelled',
          type: 'BOOLEAN',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.periodic.commit',
      description: 'Runs the given statement in separate batched transactions.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'statement :: STRING',
          name: 'statement',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'params = {} :: MAP',
          name: 'params',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.periodic.commit(statement :: STRING, params = {} :: MAP) :: (updates :: INTEGER, executions :: INTEGER, runtime :: INTEGER, batches :: INTEGER, failedBatches :: INTEGER, batchErrors :: MAP, failedCommits :: INTEGER, commitErrors :: MAP, wasTerminated :: BOOLEAN)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'updates :: INTEGER',
          name: 'updates',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'executions :: INTEGER',
          name: 'executions',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'runtime :: INTEGER',
          name: 'runtime',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'failedBatches :: INTEGER',
          name: 'failedBatches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'batchErrors :: MAP',
          name: 'batchErrors',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'failedCommits :: INTEGER',
          name: 'failedCommits',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'commitErrors :: MAP',
          name: 'commitErrors',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'wasTerminated :: BOOLEAN',
          name: 'wasTerminated',
          type: 'BOOLEAN',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.periodic.countdown',
      description:
        'Runs a repeatedly called background statement until it returns 0.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'statement :: STRING',
          name: 'statement',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'delay :: INTEGER',
          name: 'delay',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.periodic.countdown(name :: STRING, statement :: STRING, delay :: INTEGER) :: (name :: STRING, delay :: INTEGER, rate :: INTEGER, done :: BOOLEAN, cancelled :: BOOLEAN)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'delay :: INTEGER',
          name: 'delay',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rate :: INTEGER',
          name: 'rate',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'cancelled :: BOOLEAN',
          name: 'cancelled',
          type: 'BOOLEAN',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.periodic.iterate',
      description:
        'Runs the second statement for each item returned by the first statement.\nThis procedure returns the number of batches and the total number of processed rows.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'cypherIterate :: STRING',
          name: 'cypherIterate',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'cypherAction :: STRING',
          name: 'cypherAction',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'config :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.periodic.iterate(cypherIterate :: STRING, cypherAction :: STRING, config :: MAP) :: (batches :: INTEGER, total :: INTEGER, timeTaken :: INTEGER, committedOperations :: INTEGER, failedOperations :: INTEGER, failedBatches :: INTEGER, retries :: INTEGER, errorMessages :: MAP, batch :: MAP, operations :: MAP, wasTerminated :: BOOLEAN, failedParams :: MAP, updateStatistics :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'total :: INTEGER',
          name: 'total',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'timeTaken :: INTEGER',
          name: 'timeTaken',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'committedOperations :: INTEGER',
          name: 'committedOperations',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'failedOperations :: INTEGER',
          name: 'failedOperations',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'failedBatches :: INTEGER',
          name: 'failedBatches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'retries :: INTEGER',
          name: 'retries',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'errorMessages :: MAP',
          name: 'errorMessages',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'batch :: MAP',
          name: 'batch',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'operations :: MAP',
          name: 'operations',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'wasTerminated :: BOOLEAN',
          name: 'wasTerminated',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'failedParams :: MAP',
          name: 'failedParams',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'updateStatistics :: MAP',
          name: 'updateStatistics',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.periodic.list',
      description: 'Returns a `LIST<ANY>` of all background jobs.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [],
      signature:
        'apoc.periodic.list() :: (name :: STRING, delay :: INTEGER, rate :: INTEGER, done :: BOOLEAN, cancelled :: BOOLEAN)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'delay :: INTEGER',
          name: 'delay',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rate :: INTEGER',
          name: 'rate',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'cancelled :: BOOLEAN',
          name: 'cancelled',
          type: 'BOOLEAN',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.periodic.repeat',
      description:
        'Runs a repeatedly called background job.\nTo stop this procedure, use `apoc.periodic.cancel`.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'statement :: STRING',
          name: 'statement',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'rate :: INTEGER',
          name: 'rate',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.periodic.repeat(name :: STRING, statement :: STRING, rate :: INTEGER, config = {} :: MAP) :: (name :: STRING, delay :: INTEGER, rate :: INTEGER, done :: BOOLEAN, cancelled :: BOOLEAN)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'delay :: INTEGER',
          name: 'delay',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rate :: INTEGER',
          name: 'rate',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'cancelled :: BOOLEAN',
          name: 'cancelled',
          type: 'BOOLEAN',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.periodic.submit',
      description:
        'Creates a background job which runs the given Cypher statement once.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'statement :: STRING',
          name: 'statement',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'params = {} :: MAP',
          name: 'params',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.periodic.submit(name :: STRING, statement :: STRING, params = {} :: MAP) :: (name :: STRING, delay :: INTEGER, rate :: INTEGER, done :: BOOLEAN, cancelled :: BOOLEAN)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'delay :: INTEGER',
          name: 'delay',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'rate :: INTEGER',
          name: 'rate',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'done :: BOOLEAN',
          name: 'done',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'cancelled :: BOOLEAN',
          name: 'cancelled',
          type: 'BOOLEAN',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.periodic.truncate',
      description:
        'Removes all entities (and optionally indexes and constraints) from the database using the `apoc.periodic.iterate` procedure.',
      mode: 'SCHEMA',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature: 'apoc.periodic.truncate(config = {} :: MAP)',
      returnDescription: [],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.refactor.categorize',
      description:
        'Creates new category `NODE` values from `NODE` values in the graph with the specified `sourceKey` as one of its property keys.\nThe new category `NODE` values are then connected to the original `NODE` values with a `RELATIONSHIP` of the given type.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'sourceKey :: STRING',
          name: 'sourceKey',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'type :: STRING',
          name: 'type',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'outgoing :: BOOLEAN',
          name: 'outgoing',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'label :: STRING',
          name: 'label',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'targetKey :: STRING',
          name: 'targetKey',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'copiedKeys :: LIST<STRING>',
          name: 'copiedKeys',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'batchSize :: INTEGER',
          name: 'batchSize',
          type: 'INTEGER',
        },
      ],
      signature:
        'apoc.refactor.categorize(sourceKey :: STRING, type :: STRING, outgoing :: BOOLEAN, label :: STRING, targetKey :: STRING, copiedKeys :: LIST<STRING>, batchSize :: INTEGER)',
      returnDescription: [],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.refactor.cloneNodes',
      description:
        'Clones the given `NODE` values with their labels and properties.\nIt is possible to skip any `NODE` properties using skipProperties (note: this only skips properties on `NODE` values and not their `RELATIONSHIP` values).',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=false, type=BOOLEAN}',
          description: 'withRelationships = false :: BOOLEAN',
          name: 'withRelationships',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=[], type=LIST<STRING>}',
          description: 'skipProperties = [] :: LIST<STRING>',
          name: 'skipProperties',
          type: 'LIST<STRING>',
        },
      ],
      signature:
        'apoc.refactor.cloneNodes(nodes :: LIST<NODE>, withRelationships = false :: BOOLEAN, skipProperties = [] :: LIST<STRING>) :: (input :: INTEGER, output :: NODE, error :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'input :: INTEGER',
          name: 'input',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'output :: NODE',
          name: 'output',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'error :: STRING',
          name: 'error',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.refactor.cloneSubgraph',
      description:
        'Clones the given `NODE` values with their labels and properties (optionally skipping any properties in the `skipProperties` `LIST<STRING>` via the config `MAP`), and clones the given `RELATIONSHIP` values.\nIf no `RELATIONSHIP` values are provided, all existing `RELATIONSHIP` values between the given `NODE` values will be cloned.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=[], type=LIST<RELATIONSHIP>}',
          description: 'rels = [] :: LIST<RELATIONSHIP>',
          name: 'rels',
          type: 'LIST<RELATIONSHIP>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.refactor.cloneSubgraph(nodes :: LIST<NODE>, rels = [] :: LIST<RELATIONSHIP>, config = {} :: MAP) :: (input :: INTEGER, output :: NODE, error :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'input :: INTEGER',
          name: 'input',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'output :: NODE',
          name: 'output',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'error :: STRING',
          name: 'error',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.refactor.cloneSubgraphFromPaths',
      description:
        'Clones a sub-graph defined by the given `LIST<PATH>` values.\nIt is possible to skip any `NODE` properties using the `skipProperties` `LIST<STRING>` via the config `MAP`.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'paths :: LIST<PATH>',
          name: 'paths',
          type: 'LIST<PATH>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.refactor.cloneSubgraphFromPaths(paths :: LIST<PATH>, config = {} :: MAP) :: (input :: INTEGER, output :: NODE, error :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'input :: INTEGER',
          name: 'input',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'output :: NODE',
          name: 'output',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'error :: STRING',
          name: 'error',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.refactor.collapseNode',
      description:
        'Collapses the given `NODE` and replaces it with a `RELATIONSHIP` of the given type.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: ANY',
          name: 'nodes',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'relType :: STRING',
          name: 'relType',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.refactor.collapseNode(nodes :: ANY, relType :: STRING) :: (input :: INTEGER, output :: RELATIONSHIP, error :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'input :: INTEGER',
          name: 'input',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'output :: RELATIONSHIP',
          name: 'output',
          type: 'RELATIONSHIP',
        },
        {
          isDeprecated: false,
          description: 'error :: STRING',
          name: 'error',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.refactor.deleteAndReconnect',
      description:
        'Removes the given `NODE` values from the `PATH` and reconnects the remaining `NODE` values.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'path :: PATH',
          name: 'path',
          type: 'PATH',
        },
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.refactor.deleteAndReconnect(path :: PATH, nodes :: LIST<NODE>, config = {} :: MAP) :: (nodes :: LIST<NODE>, relationships :: LIST<RELATIONSHIP>)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
        {
          isDeprecated: false,
          description: 'relationships :: LIST<RELATIONSHIP>',
          name: 'relationships',
          type: 'LIST<RELATIONSHIP>',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.refactor.extractNode',
      description:
        'Expands the given `RELATIONSHIP` VALUES into intermediate `NODE` VALUES.\nThe intermediate `NODE` values are connected by the given `outType` and `inType`.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'rels :: ANY',
          name: 'rels',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'labels :: LIST<STRING>',
          name: 'labels',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'outType :: STRING',
          name: 'outType',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'inType :: STRING',
          name: 'inType',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.refactor.extractNode(rels :: ANY, labels :: LIST<STRING>, outType :: STRING, inType :: STRING) :: (input :: INTEGER, output :: NODE, error :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'input :: INTEGER',
          name: 'input',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'output :: NODE',
          name: 'output',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'error :: STRING',
          name: 'error',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.refactor.from',
      description:
        'Redirects the given `RELATIONSHIP` to the given start `NODE`.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'rel :: RELATIONSHIP',
          name: 'rel',
          type: 'RELATIONSHIP',
        },
        {
          isDeprecated: false,
          description: 'newNode :: NODE',
          name: 'newNode',
          type: 'NODE',
        },
      ],
      signature:
        'apoc.refactor.from(rel :: RELATIONSHIP, newNode :: NODE) :: (input :: INTEGER, output :: RELATIONSHIP, error :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'input :: INTEGER',
          name: 'input',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'output :: RELATIONSHIP',
          name: 'output',
          type: 'RELATIONSHIP',
        },
        {
          isDeprecated: false,
          description: 'error :: STRING',
          name: 'error',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.refactor.invert',
      description: 'Inverts the direction of the given `RELATIONSHIP`.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'rel :: RELATIONSHIP',
          name: 'rel',
          type: 'RELATIONSHIP',
        },
      ],
      signature:
        'apoc.refactor.invert(rel :: RELATIONSHIP) :: (input :: INTEGER, output :: RELATIONSHIP, error :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'input :: INTEGER',
          name: 'input',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'output :: RELATIONSHIP',
          name: 'output',
          type: 'RELATIONSHIP',
        },
        {
          isDeprecated: false,
          description: 'error :: STRING',
          name: 'error',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.refactor.mergeNodes',
      description:
        'Merges the given `LIST<NODE>` onto the first `NODE` in the `LIST<NODE>`.\nAll `RELATIONSHIP` values are merged onto that `NODE` as well.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.refactor.mergeNodes(nodes :: LIST<NODE>, config = {} :: MAP) :: (node :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.refactor.mergeRelationships',
      description:
        'Merges the given `LIST<RELATIONSHIP>` onto the first `RELATIONSHIP` in the `LIST<RELATIONSHIP>`.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'rels :: LIST<RELATIONSHIP>',
          name: 'rels',
          type: 'LIST<RELATIONSHIP>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.refactor.mergeRelationships(rels :: LIST<RELATIONSHIP>, config = {} :: MAP) :: (rel :: RELATIONSHIP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'rel :: RELATIONSHIP',
          name: 'rel',
          type: 'RELATIONSHIP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.refactor.normalizeAsBoolean',
      description: 'Refactors the given property to a `BOOLEAN`.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'entity :: ANY',
          name: 'entity',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'propertyKey :: STRING',
          name: 'propertyKey',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'trueValues :: LIST<ANY>',
          name: 'trueValues',
          type: 'LIST<ANY>',
        },
        {
          isDeprecated: false,
          description: 'falseValues :: LIST<ANY>',
          name: 'falseValues',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'apoc.refactor.normalizeAsBoolean(entity :: ANY, propertyKey :: STRING, trueValues :: LIST<ANY>, falseValues :: LIST<ANY>)',
      returnDescription: [],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.refactor.rename.label',
      description:
        'Renames the given label from `oldLabel` to `newLabel` for all `NODE` values.\nIf a `LIST<NODE>` is provided, the renaming is applied to the `NODE` values within this `LIST<NODE>` only.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'oldLabel :: STRING',
          name: 'oldLabel',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'newLabel :: STRING',
          name: 'newLabel',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=[], type=LIST<NODE>}',
          description: 'nodes = [] :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
      ],
      signature:
        'apoc.refactor.rename.label(oldLabel :: STRING, newLabel :: STRING, nodes = [] :: LIST<NODE>) :: (batches :: INTEGER, total :: INTEGER, timeTaken :: INTEGER, committedOperations :: INTEGER, failedOperations :: INTEGER, failedBatches :: INTEGER, retries :: INTEGER, errorMessages :: MAP, batch :: MAP, operations :: MAP, constraints :: LIST<STRING>, indexes :: LIST<STRING>)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'total :: INTEGER',
          name: 'total',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'timeTaken :: INTEGER',
          name: 'timeTaken',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'committedOperations :: INTEGER',
          name: 'committedOperations',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'failedOperations :: INTEGER',
          name: 'failedOperations',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'failedBatches :: INTEGER',
          name: 'failedBatches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'retries :: INTEGER',
          name: 'retries',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'errorMessages :: MAP',
          name: 'errorMessages',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'batch :: MAP',
          name: 'batch',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'operations :: MAP',
          name: 'operations',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'constraints :: LIST<STRING>',
          name: 'constraints',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'indexes :: LIST<STRING>',
          name: 'indexes',
          type: 'LIST<STRING>',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.refactor.rename.nodeProperty',
      description:
        'Renames the given property from `oldName` to `newName` for all `NODE` values.\nIf a `LIST<NODE>` is provided, the renaming is applied to the `NODE` values within this `LIST<NODE>` only.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'oldName :: STRING',
          name: 'oldName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'newName :: STRING',
          name: 'newName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=[], type=LIST<NODE>}',
          description: 'nodes = [] :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.refactor.rename.nodeProperty(oldName :: STRING, newName :: STRING, nodes = [] :: LIST<NODE>, config = {} :: MAP) :: (batches :: INTEGER, total :: INTEGER, timeTaken :: INTEGER, committedOperations :: INTEGER, failedOperations :: INTEGER, failedBatches :: INTEGER, retries :: INTEGER, errorMessages :: MAP, batch :: MAP, operations :: MAP, constraints :: LIST<STRING>, indexes :: LIST<STRING>)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'total :: INTEGER',
          name: 'total',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'timeTaken :: INTEGER',
          name: 'timeTaken',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'committedOperations :: INTEGER',
          name: 'committedOperations',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'failedOperations :: INTEGER',
          name: 'failedOperations',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'failedBatches :: INTEGER',
          name: 'failedBatches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'retries :: INTEGER',
          name: 'retries',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'errorMessages :: MAP',
          name: 'errorMessages',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'batch :: MAP',
          name: 'batch',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'operations :: MAP',
          name: 'operations',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'constraints :: LIST<STRING>',
          name: 'constraints',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'indexes :: LIST<STRING>',
          name: 'indexes',
          type: 'LIST<STRING>',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.refactor.rename.type',
      description:
        'Renames all `RELATIONSHIP` values with type `oldType` to `newType`.\nIf a `LIST<RELATIONSHIP>` is provided, the renaming is applied to the `RELATIONSHIP` values within this `LIST<RELATIONSHIP>` only.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'oldType :: STRING',
          name: 'oldType',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'newType :: STRING',
          name: 'newType',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=[], type=LIST<RELATIONSHIP>}',
          description: 'rels = [] :: LIST<RELATIONSHIP>',
          name: 'rels',
          type: 'LIST<RELATIONSHIP>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.refactor.rename.type(oldType :: STRING, newType :: STRING, rels = [] :: LIST<RELATIONSHIP>, config = {} :: MAP) :: (batches :: INTEGER, total :: INTEGER, timeTaken :: INTEGER, committedOperations :: INTEGER, failedOperations :: INTEGER, failedBatches :: INTEGER, retries :: INTEGER, errorMessages :: MAP, batch :: MAP, operations :: MAP, constraints :: LIST<STRING>, indexes :: LIST<STRING>)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'total :: INTEGER',
          name: 'total',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'timeTaken :: INTEGER',
          name: 'timeTaken',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'committedOperations :: INTEGER',
          name: 'committedOperations',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'failedOperations :: INTEGER',
          name: 'failedOperations',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'failedBatches :: INTEGER',
          name: 'failedBatches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'retries :: INTEGER',
          name: 'retries',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'errorMessages :: MAP',
          name: 'errorMessages',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'batch :: MAP',
          name: 'batch',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'operations :: MAP',
          name: 'operations',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'constraints :: LIST<STRING>',
          name: 'constraints',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'indexes :: LIST<STRING>',
          name: 'indexes',
          type: 'LIST<STRING>',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.refactor.rename.typeProperty',
      description:
        'Renames the given property from `oldName` to `newName` for all `RELATIONSHIP` values.\nIf a `LIST<RELATIONSHIP>` is provided, the renaming is applied to the `RELATIONSHIP` values within this `LIST<RELATIONSHIP>` only.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'oldName :: STRING',
          name: 'oldName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'newName :: STRING',
          name: 'newName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=[], type=LIST<RELATIONSHIP>}',
          description: 'rels = [] :: LIST<RELATIONSHIP>',
          name: 'rels',
          type: 'LIST<RELATIONSHIP>',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.refactor.rename.typeProperty(oldName :: STRING, newName :: STRING, rels = [] :: LIST<RELATIONSHIP>, config = {} :: MAP) :: (batches :: INTEGER, total :: INTEGER, timeTaken :: INTEGER, committedOperations :: INTEGER, failedOperations :: INTEGER, failedBatches :: INTEGER, retries :: INTEGER, errorMessages :: MAP, batch :: MAP, operations :: MAP, constraints :: LIST<STRING>, indexes :: LIST<STRING>)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'batches :: INTEGER',
          name: 'batches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'total :: INTEGER',
          name: 'total',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'timeTaken :: INTEGER',
          name: 'timeTaken',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'committedOperations :: INTEGER',
          name: 'committedOperations',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'failedOperations :: INTEGER',
          name: 'failedOperations',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'failedBatches :: INTEGER',
          name: 'failedBatches',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'retries :: INTEGER',
          name: 'retries',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'errorMessages :: MAP',
          name: 'errorMessages',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'batch :: MAP',
          name: 'batch',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'operations :: MAP',
          name: 'operations',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'constraints :: LIST<STRING>',
          name: 'constraints',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'indexes :: LIST<STRING>',
          name: 'indexes',
          type: 'LIST<STRING>',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.refactor.setType',
      description: 'Changes the type of the given `RELATIONSHIP`.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'rel :: RELATIONSHIP',
          name: 'rel',
          type: 'RELATIONSHIP',
        },
        {
          isDeprecated: false,
          description: 'newType :: STRING',
          name: 'newType',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.refactor.setType(rel :: RELATIONSHIP, newType :: STRING) :: (input :: INTEGER, output :: RELATIONSHIP, error :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'input :: INTEGER',
          name: 'input',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'output :: RELATIONSHIP',
          name: 'output',
          type: 'RELATIONSHIP',
        },
        {
          isDeprecated: false,
          description: 'error :: STRING',
          name: 'error',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.refactor.to',
      description:
        'Redirects the given `RELATIONSHIP` to the given end `NODE`.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'rel :: RELATIONSHIP',
          name: 'rel',
          type: 'RELATIONSHIP',
        },
        {
          isDeprecated: false,
          description: 'endNode :: NODE',
          name: 'endNode',
          type: 'NODE',
        },
      ],
      signature:
        'apoc.refactor.to(rel :: RELATIONSHIP, endNode :: NODE) :: (input :: INTEGER, output :: RELATIONSHIP, error :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'input :: INTEGER',
          name: 'input',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'output :: RELATIONSHIP',
          name: 'output',
          type: 'RELATIONSHIP',
        },
        {
          isDeprecated: false,
          description: 'error :: STRING',
          name: 'error',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.schema.assert',
      description:
        'Drops all other existing indexes and constraints when `dropExisting` is `true` (default is `true`).\nAsserts at the end of the operation that the given indexes and unique constraints are there.',
      mode: 'SCHEMA',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'indexes :: MAP',
          name: 'indexes',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'constraints :: MAP',
          name: 'constraints',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=true, type=BOOLEAN}',
          description: 'dropExisting = true :: BOOLEAN',
          name: 'dropExisting',
          type: 'BOOLEAN',
        },
      ],
      signature:
        'apoc.schema.assert(indexes :: MAP, constraints :: MAP, dropExisting = true :: BOOLEAN) :: (label :: ANY, key :: STRING, keys :: LIST<STRING>, unique :: BOOLEAN, action :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'label :: ANY',
          name: 'label',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'key :: STRING',
          name: 'key',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'keys :: LIST<STRING>',
          name: 'keys',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'unique :: BOOLEAN',
          name: 'unique',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'action :: STRING',
          name: 'action',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.schema.nodes',
      description:
        'Returns all indexes and constraints information for all `NODE` labels in the database.\nIt is possible to define a set of labels to include or exclude in the config parameters.',
      mode: 'SCHEMA',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.schema.nodes(config = {} :: MAP) :: (name :: STRING, label :: ANY, properties :: LIST<STRING>, status :: STRING, type :: STRING, failure :: STRING, populationProgress :: FLOAT, size :: INTEGER, valuesSelectivity :: FLOAT, userDescription :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'label :: ANY',
          name: 'label',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'properties :: LIST<STRING>',
          name: 'properties',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'status :: STRING',
          name: 'status',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'type :: STRING',
          name: 'type',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'failure :: STRING',
          name: 'failure',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'populationProgress :: FLOAT',
          name: 'populationProgress',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: 'size :: INTEGER',
          name: 'size',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'valuesSelectivity :: FLOAT',
          name: 'valuesSelectivity',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: 'userDescription :: STRING',
          name: 'userDescription',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.schema.properties.distinct',
      description:
        'Returns all distinct `NODE` property values for the given key.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'label :: STRING',
          name: 'label',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'key :: STRING',
          name: 'key',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.schema.properties.distinct(label :: STRING, key :: STRING) :: (value :: LIST<ANY>)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: LIST<ANY>',
          name: 'value',
          type: 'LIST<ANY>',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.schema.properties.distinctCount',
      description:
        'Returns all distinct property values and counts for the given key.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'label =  :: STRING',
          name: 'label',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'key =  :: STRING',
          name: 'key',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.schema.properties.distinctCount(label =  :: STRING, key =  :: STRING) :: (label :: STRING, key :: STRING, value :: ANY, count :: INTEGER)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'label :: STRING',
          name: 'label',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'key :: STRING',
          name: 'key',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'count :: INTEGER',
          name: 'count',
          type: 'INTEGER',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.schema.relationships',
      description:
        'Returns the indexes and constraints information for all the relationship types in the database.\nIt is possible to define a set of relationship types to include or exclude in the config parameters.',
      mode: 'SCHEMA',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.schema.relationships(config = {} :: MAP) :: (name :: STRING, type :: STRING, properties :: LIST<STRING>, status :: STRING, relationshipType :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'type :: STRING',
          name: 'type',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'properties :: LIST<STRING>',
          name: 'properties',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'status :: STRING',
          name: 'status',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'relationshipType :: ANY',
          name: 'relationshipType',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.search.multiSearchReduced',
      description:
        'Returns a reduced representation of the `NODE` values found after a parallel search over multiple indexes.\nThe reduced `NODE` values representation includes: node id, node labels, and the searched properties.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'labelPropertyMap :: ANY',
          name: 'labelPropertyMap',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'operator :: STRING',
          name: 'operator',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'value :: STRING',
          name: 'value',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.search.multiSearchReduced(labelPropertyMap :: ANY, operator :: STRING, value :: STRING) :: (id :: INTEGER, labels :: LIST<STRING>, values :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'id :: INTEGER',
          name: 'id',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'labels :: LIST<STRING>',
          name: 'labels',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'values :: MAP',
          name: 'values',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.search.node',
      description:
        'Returns all the distinct `NODE` values found after a parallel search over multiple indexes.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'labelPropertyMap :: ANY',
          name: 'labelPropertyMap',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'operator :: STRING',
          name: 'operator',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'value :: STRING',
          name: 'value',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.search.node(labelPropertyMap :: ANY, operator :: STRING, value :: STRING) :: (node :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.search.nodeAll',
      description:
        'Returns all the `NODE` values found after a parallel search over multiple indexes.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'labelPropertyMap :: ANY',
          name: 'labelPropertyMap',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'operator :: STRING',
          name: 'operator',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'value :: STRING',
          name: 'value',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.search.nodeAll(labelPropertyMap :: ANY, operator :: STRING, value :: STRING) :: (node :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.search.nodeAllReduced',
      description:
        'Returns a reduced representation of the `NODE` values found after a parallel search over multiple indexes.\nThe reduced `NODE` values representation includes: node id, node labels, and the searched properties.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'labelPropertyMap :: ANY',
          name: 'labelPropertyMap',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'operator :: STRING',
          name: 'operator',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
      ],
      signature:
        'apoc.search.nodeAllReduced(labelPropertyMap :: ANY, operator :: STRING, value :: ANY) :: (id :: INTEGER, labels :: LIST<STRING>, values :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'id :: INTEGER',
          name: 'id',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'labels :: LIST<STRING>',
          name: 'labels',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'values :: MAP',
          name: 'values',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.search.nodeReduced',
      description:
        'Returns a reduced representation of the distinct `NODE` values found after a parallel search over multiple indexes.\nThe reduced `NODE` values representation includes: node id, node labels, and the searched properties.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'labelPropertyMap :: ANY',
          name: 'labelPropertyMap',
          type: 'ANY',
        },
        {
          isDeprecated: false,
          description: 'operator :: STRING',
          name: 'operator',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'value :: STRING',
          name: 'value',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.search.nodeReduced(labelPropertyMap :: ANY, operator :: STRING, value :: STRING) :: (id :: INTEGER, labels :: LIST<STRING>, values :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'id :: INTEGER',
          name: 'id',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'labels :: LIST<STRING>',
          name: 'labels',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'values :: MAP',
          name: 'values',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.spatial.geocode',
      description:
        'Returns the geographic location (latitude, longitude, and description) of the given address using a geocoding service (default: OpenStreetMap).',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'location :: STRING',
          name: 'location',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=100, type=INTEGER}',
          description: 'maxResults = 100 :: INTEGER',
          name: 'maxResults',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=false, type=BOOLEAN}',
          description: 'quotaException = false :: BOOLEAN',
          name: 'quotaException',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.spatial.geocode(location :: STRING, maxResults = 100 :: INTEGER, quotaException = false :: BOOLEAN, config = {} :: MAP) :: (location :: MAP, data :: MAP, latitude :: FLOAT, longitude :: FLOAT, description :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'location :: MAP',
          name: 'location',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'data :: MAP',
          name: 'data',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'latitude :: FLOAT',
          name: 'latitude',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: 'longitude :: FLOAT',
          name: 'longitude',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: 'description :: STRING',
          name: 'description',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.spatial.geocodeOnce',
      description:
        'Returns the geographic location (latitude, longitude, and description) of the given address using a geocoding service (default: OpenStreetMap).\nThis procedure returns at most one result.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'location :: STRING',
          name: 'location',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.spatial.geocodeOnce(location :: STRING, config = {} :: MAP) :: (location :: MAP, data :: MAP, latitude :: FLOAT, longitude :: FLOAT, description :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'location :: MAP',
          name: 'location',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'data :: MAP',
          name: 'data',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'latitude :: FLOAT',
          name: 'latitude',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: 'longitude :: FLOAT',
          name: 'longitude',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: 'description :: STRING',
          name: 'description',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.spatial.reverseGeocode',
      description:
        'Returns a textual address from the given geographic location (latitude, longitude) using a geocoding service (default: OpenStreetMap).\nThis procedure returns at most one result.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'latitude :: FLOAT',
          name: 'latitude',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: 'longitude :: FLOAT',
          name: 'longitude',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=false, type=BOOLEAN}',
          description: 'quotaException = false :: BOOLEAN',
          name: 'quotaException',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.spatial.reverseGeocode(latitude :: FLOAT, longitude :: FLOAT, quotaException = false :: BOOLEAN, config = {} :: MAP) :: (location :: MAP, data :: MAP, latitude :: FLOAT, longitude :: FLOAT, description :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'location :: MAP',
          name: 'location',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'data :: MAP',
          name: 'data',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'latitude :: FLOAT',
          name: 'latitude',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: 'longitude :: FLOAT',
          name: 'longitude',
          type: 'FLOAT',
        },
        {
          isDeprecated: false,
          description: 'description :: STRING',
          name: 'description',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.spatial.sortByDistance',
      description:
        'Sorts the given collection of `PATH` values by the sum of their distance based on the latitude/longitude values in the `NODE` values.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'paths :: LIST<PATH>',
          name: 'paths',
          type: 'LIST<PATH>',
        },
      ],
      signature:
        'apoc.spatial.sortByDistance(paths :: LIST<PATH>) :: (path :: PATH, distance :: FLOAT)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'path :: PATH',
          name: 'path',
          type: 'PATH',
        },
        {
          isDeprecated: false,
          description: 'distance :: FLOAT',
          name: 'distance',
          type: 'FLOAT',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.stats.degrees',
      description:
        'Returns the percentile groupings of the degrees on the `NODE` values connected by the given `RELATIONSHIP` types.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'relTypes =  :: STRING',
          name: 'relTypes',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.stats.degrees(relTypes =  :: STRING) :: (type :: STRING, direction :: STRING, total :: INTEGER, p50 :: INTEGER, p75 :: INTEGER, p90 :: INTEGER, p95 :: INTEGER, p99 :: INTEGER, p999 :: INTEGER, max :: INTEGER, min :: INTEGER, mean :: FLOAT)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'type :: STRING',
          name: 'type',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'direction :: STRING',
          name: 'direction',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'total :: INTEGER',
          name: 'total',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'p50 :: INTEGER',
          name: 'p50',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'p75 :: INTEGER',
          name: 'p75',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'p90 :: INTEGER',
          name: 'p90',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'p95 :: INTEGER',
          name: 'p95',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'p99 :: INTEGER',
          name: 'p99',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'p999 :: INTEGER',
          name: 'p999',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'max :: INTEGER',
          name: 'max',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'min :: INTEGER',
          name: 'min',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'mean :: FLOAT',
          name: 'mean',
          type: 'FLOAT',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.text.phoneticDelta',
      description:
        'Returns the US_ENGLISH soundex character difference between the two given `STRING` values.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'text1 :: STRING',
          name: 'text1',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'text2 :: STRING',
          name: 'text2',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.text.phoneticDelta(text1 :: STRING, text2 :: STRING) :: (phonetic1 :: STRING, phonetic2 :: STRING, delta :: INTEGER)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'phonetic1 :: STRING',
          name: 'phonetic1',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'phonetic2 :: STRING',
          name: 'phonetic2',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'delta :: INTEGER',
          name: 'delta',
          type: 'INTEGER',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.trigger.add',
      description:
        "Adds a trigger to the given Cypher statement.\nThe selector for this procedure is {phase:'before/after/rollback/afterAsync'}.",
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'statement :: STRING',
          name: 'statement',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'selector :: MAP',
          name: 'selector',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.trigger.add(name :: STRING, statement :: STRING, selector :: MAP, config = {} :: MAP) :: (name :: STRING, query :: STRING, selector :: MAP, params :: MAP, installed :: BOOLEAN, paused :: BOOLEAN)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'query :: STRING',
          name: 'query',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'selector :: MAP',
          name: 'selector',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'params :: MAP',
          name: 'params',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'installed :: BOOLEAN',
          name: 'installed',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'paused :: BOOLEAN',
          name: 'paused',
          type: 'BOOLEAN',
        },
      ],
      admin: true,
      option: {
        deprecated: true,
      },
    },
    {
      name: 'apoc.trigger.drop',
      description: 'Eventually removes the given trigger.',
      mode: 'WRITE',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'databaseName :: STRING',
          name: 'databaseName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.trigger.drop(databaseName :: STRING, name :: STRING) :: (name :: STRING, query :: STRING, selector :: MAP, params :: MAP, installed :: BOOLEAN, paused :: BOOLEAN)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'query :: STRING',
          name: 'query',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'selector :: MAP',
          name: 'selector',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'params :: MAP',
          name: 'params',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'installed :: BOOLEAN',
          name: 'installed',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'paused :: BOOLEAN',
          name: 'paused',
          type: 'BOOLEAN',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.trigger.dropAll',
      description: 'Eventually removes all triggers from the given database.',
      mode: 'WRITE',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'databaseName :: STRING',
          name: 'databaseName',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.trigger.dropAll(databaseName :: STRING) :: (name :: STRING, query :: STRING, selector :: MAP, params :: MAP, installed :: BOOLEAN, paused :: BOOLEAN)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'query :: STRING',
          name: 'query',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'selector :: MAP',
          name: 'selector',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'params :: MAP',
          name: 'params',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'installed :: BOOLEAN',
          name: 'installed',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'paused :: BOOLEAN',
          name: 'paused',
          type: 'BOOLEAN',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.trigger.install',
      description:
        'Eventually adds a trigger for a given database which is invoked when a successful transaction occurs.',
      mode: 'WRITE',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'databaseName :: STRING',
          name: 'databaseName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'statement :: STRING',
          name: 'statement',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'selector :: MAP',
          name: 'selector',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.trigger.install(databaseName :: STRING, name :: STRING, statement :: STRING, selector :: MAP, config = {} :: MAP) :: (name :: STRING, query :: STRING, selector :: MAP, params :: MAP, installed :: BOOLEAN, paused :: BOOLEAN)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'query :: STRING',
          name: 'query',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'selector :: MAP',
          name: 'selector',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'params :: MAP',
          name: 'params',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'installed :: BOOLEAN',
          name: 'installed',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'paused :: BOOLEAN',
          name: 'paused',
          type: 'BOOLEAN',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.trigger.list',
      description:
        'Lists all currently installed triggers for the session database.',
      mode: 'READ',
      worksOnSystem: false,
      argumentDescription: [],
      signature:
        'apoc.trigger.list() :: (name :: STRING, query :: STRING, selector :: MAP, params :: MAP, installed :: BOOLEAN, paused :: BOOLEAN)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'query :: STRING',
          name: 'query',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'selector :: MAP',
          name: 'selector',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'params :: MAP',
          name: 'params',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'installed :: BOOLEAN',
          name: 'installed',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'paused :: BOOLEAN',
          name: 'paused',
          type: 'BOOLEAN',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.trigger.pause',
      description: 'Pauses the given trigger.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.trigger.pause(name :: STRING) :: (name :: STRING, query :: STRING, selector :: MAP, params :: MAP, installed :: BOOLEAN, paused :: BOOLEAN)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'query :: STRING',
          name: 'query',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'selector :: MAP',
          name: 'selector',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'params :: MAP',
          name: 'params',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'installed :: BOOLEAN',
          name: 'installed',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'paused :: BOOLEAN',
          name: 'paused',
          type: 'BOOLEAN',
        },
      ],
      admin: true,
      option: {
        deprecated: true,
      },
    },
    {
      name: 'apoc.trigger.remove',
      description: 'Removes the given trigger.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.trigger.remove(name :: STRING) :: (name :: STRING, query :: STRING, selector :: MAP, params :: MAP, installed :: BOOLEAN, paused :: BOOLEAN)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'query :: STRING',
          name: 'query',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'selector :: MAP',
          name: 'selector',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'params :: MAP',
          name: 'params',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'installed :: BOOLEAN',
          name: 'installed',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'paused :: BOOLEAN',
          name: 'paused',
          type: 'BOOLEAN',
        },
      ],
      admin: true,
      option: {
        deprecated: true,
      },
    },
    {
      name: 'apoc.trigger.removeAll',
      description: 'Removes all previously added triggers.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [],
      signature:
        'apoc.trigger.removeAll() :: (name :: STRING, query :: STRING, selector :: MAP, params :: MAP, installed :: BOOLEAN, paused :: BOOLEAN)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'query :: STRING',
          name: 'query',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'selector :: MAP',
          name: 'selector',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'params :: MAP',
          name: 'params',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'installed :: BOOLEAN',
          name: 'installed',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'paused :: BOOLEAN',
          name: 'paused',
          type: 'BOOLEAN',
        },
      ],
      admin: true,
      option: {
        deprecated: true,
      },
    },
    {
      name: 'apoc.trigger.resume',
      description: 'Resumes the given paused trigger.',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.trigger.resume(name :: STRING) :: (name :: STRING, query :: STRING, selector :: MAP, params :: MAP, installed :: BOOLEAN, paused :: BOOLEAN)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'query :: STRING',
          name: 'query',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'selector :: MAP',
          name: 'selector',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'params :: MAP',
          name: 'params',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'installed :: BOOLEAN',
          name: 'installed',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'paused :: BOOLEAN',
          name: 'paused',
          type: 'BOOLEAN',
        },
      ],
      admin: true,
      option: {
        deprecated: true,
      },
    },
    {
      name: 'apoc.trigger.show',
      description: 'Lists all eventually installed triggers for a database.',
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'databaseName :: STRING',
          name: 'databaseName',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.trigger.show(databaseName :: STRING) :: (name :: STRING, query :: STRING, selector :: MAP, params :: MAP, installed :: BOOLEAN, paused :: BOOLEAN)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'query :: STRING',
          name: 'query',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'selector :: MAP',
          name: 'selector',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'params :: MAP',
          name: 'params',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'installed :: BOOLEAN',
          name: 'installed',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'paused :: BOOLEAN',
          name: 'paused',
          type: 'BOOLEAN',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.trigger.start',
      description: 'Eventually restarts the given paused trigger.',
      mode: 'WRITE',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'databaseName :: STRING',
          name: 'databaseName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.trigger.start(databaseName :: STRING, name :: STRING) :: (name :: STRING, query :: STRING, selector :: MAP, params :: MAP, installed :: BOOLEAN, paused :: BOOLEAN)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'query :: STRING',
          name: 'query',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'selector :: MAP',
          name: 'selector',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'params :: MAP',
          name: 'params',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'installed :: BOOLEAN',
          name: 'installed',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'paused :: BOOLEAN',
          name: 'paused',
          type: 'BOOLEAN',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.trigger.stop',
      description: 'Eventually stops the given trigger.',
      mode: 'WRITE',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'databaseName :: STRING',
          name: 'databaseName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
      ],
      signature:
        'apoc.trigger.stop(databaseName :: STRING, name :: STRING) :: (name :: STRING, query :: STRING, selector :: MAP, params :: MAP, installed :: BOOLEAN, paused :: BOOLEAN)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'query :: STRING',
          name: 'query',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'selector :: MAP',
          name: 'selector',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'params :: MAP',
          name: 'params',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'installed :: BOOLEAN',
          name: 'installed',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'paused :: BOOLEAN',
          name: 'paused',
          type: 'BOOLEAN',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.util.sleep',
      description:
        'Causes the currently running Cypher to sleep for the given duration of milliseconds (the transaction termination is honored).',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'duration :: INTEGER',
          name: 'duration',
          type: 'INTEGER',
        },
      ],
      signature: 'apoc.util.sleep(duration :: INTEGER)',
      returnDescription: [],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.util.validate',
      description: 'If the given predicate is true an exception is thrown.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'predicate :: BOOLEAN',
          name: 'predicate',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'message :: STRING',
          name: 'message',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'params :: LIST<ANY>',
          name: 'params',
          type: 'LIST<ANY>',
        },
      ],
      signature:
        'apoc.util.validate(predicate :: BOOLEAN, message :: STRING, params :: LIST<ANY>)',
      returnDescription: [],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'apoc.warmup.run',
      description:
        'Loads all `NODE` and `RELATIONSHIP` values in the database into memory.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=false, type=BOOLEAN}',
          description: 'loadProperties = false :: BOOLEAN',
          name: 'loadProperties',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=false, type=BOOLEAN}',
          description: 'loadDynamicProperties = false :: BOOLEAN',
          name: 'loadDynamicProperties',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=false, type=BOOLEAN}',
          description: 'loadIndexes = false :: BOOLEAN',
          name: 'loadIndexes',
          type: 'BOOLEAN',
        },
      ],
      signature:
        'apoc.warmup.run(loadProperties = false :: BOOLEAN, loadDynamicProperties = false :: BOOLEAN, loadIndexes = false :: BOOLEAN) :: (pageSize :: INTEGER, totalTime :: INTEGER, transactionWasTerminated :: BOOLEAN, nodesPerPage :: INTEGER, nodesTotal :: INTEGER, nodePages :: INTEGER, nodesTime :: INTEGER, relsPerPage :: INTEGER, relsTotal :: INTEGER, relPages :: INTEGER, relsTime :: INTEGER, relGroupsPerPage :: INTEGER, relGroupsTotal :: INTEGER, relGroupPages :: INTEGER, relGroupsTime :: INTEGER, propertiesLoaded :: BOOLEAN, dynamicPropertiesLoaded :: BOOLEAN, propsPerPage :: INTEGER, propRecordsTotal :: INTEGER, propPages :: INTEGER, propsTime :: INTEGER, stringPropsPerPage :: INTEGER, stringPropRecordsTotal :: INTEGER, stringPropPages :: INTEGER, stringPropsTime :: INTEGER, arrayPropsPerPage :: INTEGER, arrayPropRecordsTotal :: INTEGER, arrayPropPages :: INTEGER, arrayPropsTime :: INTEGER, indexesLoaded :: BOOLEAN, indexPages :: INTEGER, indexTime :: INTEGER)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'pageSize :: INTEGER',
          name: 'pageSize',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'totalTime :: INTEGER',
          name: 'totalTime',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'transactionWasTerminated :: BOOLEAN',
          name: 'transactionWasTerminated',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'nodesPerPage :: INTEGER',
          name: 'nodesPerPage',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'nodesTotal :: INTEGER',
          name: 'nodesTotal',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'nodePages :: INTEGER',
          name: 'nodePages',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'nodesTime :: INTEGER',
          name: 'nodesTime',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relsPerPage :: INTEGER',
          name: 'relsPerPage',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relsTotal :: INTEGER',
          name: 'relsTotal',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relPages :: INTEGER',
          name: 'relPages',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relsTime :: INTEGER',
          name: 'relsTime',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relGroupsPerPage :: INTEGER',
          name: 'relGroupsPerPage',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relGroupsTotal :: INTEGER',
          name: 'relGroupsTotal',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relGroupPages :: INTEGER',
          name: 'relGroupPages',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'relGroupsTime :: INTEGER',
          name: 'relGroupsTime',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'propertiesLoaded :: BOOLEAN',
          name: 'propertiesLoaded',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'dynamicPropertiesLoaded :: BOOLEAN',
          name: 'dynamicPropertiesLoaded',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'propsPerPage :: INTEGER',
          name: 'propsPerPage',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'propRecordsTotal :: INTEGER',
          name: 'propRecordsTotal',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'propPages :: INTEGER',
          name: 'propPages',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'propsTime :: INTEGER',
          name: 'propsTime',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'stringPropsPerPage :: INTEGER',
          name: 'stringPropsPerPage',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'stringPropRecordsTotal :: INTEGER',
          name: 'stringPropRecordsTotal',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'stringPropPages :: INTEGER',
          name: 'stringPropPages',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'stringPropsTime :: INTEGER',
          name: 'stringPropsTime',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'arrayPropsPerPage :: INTEGER',
          name: 'arrayPropsPerPage',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'arrayPropRecordsTotal :: INTEGER',
          name: 'arrayPropRecordsTotal',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'arrayPropPages :: INTEGER',
          name: 'arrayPropPages',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'arrayPropsTime :: INTEGER',
          name: 'arrayPropsTime',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'indexesLoaded :: BOOLEAN',
          name: 'indexesLoaded',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'indexPages :: INTEGER',
          name: 'indexPages',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'indexTime :: INTEGER',
          name: 'indexTime',
          type: 'INTEGER',
        },
      ],
      admin: false,
      option: {
        deprecated: true,
      },
    },
    {
      name: 'apoc.when',
      description:
        'This procedure will run the read-only `ifQuery` if the conditional has evaluated to true, otherwise the `elseQuery` will run.',
      mode: 'DEFAULT',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'condition :: BOOLEAN',
          name: 'condition',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'ifQuery :: STRING',
          name: 'ifQuery',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'elseQuery =  :: STRING',
          name: 'elseQuery',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'params = {} :: MAP',
          name: 'params',
          type: 'MAP',
        },
      ],
      signature:
        'apoc.when(condition :: BOOLEAN, ifQuery :: STRING, elseQuery =  :: STRING, params = {} :: MAP) :: (value :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: MAP',
          name: 'value',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'cdc.current',
      description:
        'Returns the current change identifier that can be used to stream changes from.',
      mode: 'READ',
      worksOnSystem: false,
      argumentDescription: [],
      signature: 'cdc.current() :: (id :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'id :: STRING',
          name: 'id',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'cdc.earliest',
      description:
        'Returns the earliest change identifier that can be used to stream changes from.',
      mode: 'READ',
      worksOnSystem: false,
      argumentDescription: [],
      signature: 'cdc.earliest() :: (id :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'id :: STRING',
          name: 'id',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'cdc.query',
      description:
        'Query changes happened from the provided change identifier.',
      mode: 'READ',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'from =  :: STRING',
          name: 'from',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=[], type=LIST<MAP>}',
          description: 'selectors = [] :: LIST<MAP>',
          name: 'selectors',
          type: 'LIST<MAP>',
        },
      ],
      signature:
        'cdc.query(from =  :: STRING, selectors = [] :: LIST<MAP>) :: (id :: STRING, txId :: INTEGER, seq :: INTEGER, metadata :: MAP, event :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'id :: STRING',
          name: 'id',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'txId :: INTEGER',
          name: 'txId',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'seq :: INTEGER',
          name: 'seq',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'metadata :: MAP',
          name: 'metadata',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          description: 'event :: MAP',
          name: 'event',
          type: 'MAP',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.awaitIndex',
      description:
        'Wait for an index to come online (for example: CALL db.awaitIndex("MyIndex", 300)).',
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'indexName :: STRING',
          name: 'indexName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=300, type=INTEGER}',
          description: 'timeOutSeconds = 300 :: INTEGER',
          name: 'timeOutSeconds',
          type: 'INTEGER',
        },
      ],
      signature:
        'db.awaitIndex(indexName :: STRING, timeOutSeconds = 300 :: INTEGER)',
      returnDescription: [],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.awaitIndexes',
      description:
        'Wait for all indexes to come online (for example: CALL db.awaitIndexes(300)).',
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=300, type=INTEGER}',
          description: 'timeOutSeconds = 300 :: INTEGER',
          name: 'timeOutSeconds',
          type: 'INTEGER',
        },
      ],
      signature: 'db.awaitIndexes(timeOutSeconds = 300 :: INTEGER)',
      returnDescription: [],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.checkpoint',
      description:
        'Initiate and wait for a new check point, or wait any already on-going check point to complete. Note that this temporarily disables the `db.checkpoint.iops.limit` setting in order to make the check point complete faster. This might cause transaction throughput to degrade slightly, due to increased IO load.',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [],
      signature: 'db.checkpoint() :: (success :: BOOLEAN, message :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'success :: BOOLEAN',
          name: 'success',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'message :: STRING',
          name: 'message',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.clearQueryCaches',
      description: 'Clears all query caches.',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [],
      signature: 'db.clearQueryCaches() :: (value :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'value :: STRING',
          name: 'value',
          type: 'STRING',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.create.setNodeVectorProperty',
      description:
        "Set a vector property on a given node in a more space efficient representation than Cypher's SET.",
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'key :: STRING',
          name: 'key',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'vector :: LIST<FLOAT>',
          name: 'vector',
          type: 'LIST<FLOAT>',
        },
      ],
      signature:
        'db.create.setNodeVectorProperty(node :: NODE, key :: STRING, vector :: LIST<FLOAT>)',
      returnDescription: [],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.create.setVectorProperty',
      description:
        "Set a vector property on a given node in a more space efficient representation than Cypher's SET.",
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'key :: STRING',
          name: 'key',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'vector :: LIST<FLOAT>',
          name: 'vector',
          type: 'LIST<FLOAT>',
        },
      ],
      signature:
        'db.create.setVectorProperty(node :: NODE, key :: STRING, vector :: LIST<FLOAT>) :: (node :: NODE)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
      ],
      admin: false,
      option: {
        deprecated: true,
      },
    },
    {
      name: 'db.createLabel',
      description: 'Create a label',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'newLabel :: STRING',
          name: 'newLabel',
          type: 'STRING',
        },
      ],
      signature: 'db.createLabel(newLabel :: STRING)',
      returnDescription: [],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.createProperty',
      description: 'Create a Property',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'newProperty :: STRING',
          name: 'newProperty',
          type: 'STRING',
        },
      ],
      signature: 'db.createProperty(newProperty :: STRING)',
      returnDescription: [],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.createRelationshipType',
      description: 'Create a RelationshipType',
      mode: 'WRITE',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'newRelationshipType :: STRING',
          name: 'newRelationshipType',
          type: 'STRING',
        },
      ],
      signature: 'db.createRelationshipType(newRelationshipType :: STRING)',
      returnDescription: [],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.index.fulltext.awaitEventuallyConsistentIndexRefresh',
      description:
        'Wait for the updates from recently committed transactions to be applied to any eventually-consistent full-text indexes.',
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [],
      signature: 'db.index.fulltext.awaitEventuallyConsistentIndexRefresh()',
      returnDescription: [],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.index.fulltext.listAvailableAnalyzers',
      description:
        'List the available analyzers that the full-text indexes can be configured with.',
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [],
      signature:
        'db.index.fulltext.listAvailableAnalyzers() :: (analyzer :: STRING, description :: STRING, stopwords :: LIST<STRING>)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'analyzer :: STRING',
          name: 'analyzer',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'description :: STRING',
          name: 'description',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'stopwords :: LIST<STRING>',
          name: 'stopwords',
          type: 'LIST<STRING>',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.index.fulltext.queryNodes',
      description:
        "Query the given full-text index. Returns the matching nodes, and their Lucene query score, ordered by score. Valid keys for the options map are: 'skip' to skip the top N results; 'limit' to limit the number of results returned; 'analyzer' to use the specified analyzer as a search analyzer for this query.",
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'indexName :: STRING',
          name: 'indexName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'queryString :: STRING',
          name: 'queryString',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'options = {} :: MAP',
          name: 'options',
          type: 'MAP',
        },
      ],
      signature:
        'db.index.fulltext.queryNodes(indexName :: STRING, queryString :: STRING, options = {} :: MAP) :: (node :: NODE, score :: FLOAT)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'score :: FLOAT',
          name: 'score',
          type: 'FLOAT',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.index.fulltext.queryRelationships',
      description:
        "Query the given full-text index. Returns the matching relationships, and their Lucene query score, ordered by score. Valid keys for the options map are: 'skip' to skip the top N results; 'limit' to limit the number of results returned; 'analyzer' to use the specified analyzer as search analyzer for this query.",
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'indexName :: STRING',
          name: 'indexName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'queryString :: STRING',
          name: 'queryString',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'options = {} :: MAP',
          name: 'options',
          type: 'MAP',
        },
      ],
      signature:
        'db.index.fulltext.queryRelationships(indexName :: STRING, queryString :: STRING, options = {} :: MAP) :: (relationship :: RELATIONSHIP, score :: FLOAT)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'relationship :: RELATIONSHIP',
          name: 'relationship',
          type: 'RELATIONSHIP',
        },
        {
          isDeprecated: false,
          description: 'score :: FLOAT',
          name: 'score',
          type: 'FLOAT',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.index.vector.createNodeIndex',
      description:
        "Create a named node vector index for the given label and property for a specified vector dimensionality.\nValid similarity functions are 'EUCLIDEAN' and 'COSINE', and are case-insensitive.\nUse the `db.index.vector.queryNodes` procedure to query the named index.\n",
      mode: 'SCHEMA',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'indexName :: STRING',
          name: 'indexName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'label :: STRING',
          name: 'label',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'propertyKey :: STRING',
          name: 'propertyKey',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'vectorDimension :: INTEGER',
          name: 'vectorDimension',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'vectorSimilarityFunction :: STRING',
          name: 'vectorSimilarityFunction',
          type: 'STRING',
        },
      ],
      signature:
        'db.index.vector.createNodeIndex(indexName :: STRING, label :: STRING, propertyKey :: STRING, vectorDimension :: INTEGER, vectorSimilarityFunction :: STRING)',
      returnDescription: [],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.index.vector.queryNodes',
      description:
        'Query the given vector index.\nReturns requested number of nearest neighbors to the provided query vector,\nand their similarity score to that query vector, based on the configured similarity function for the index.\nThe similarity score is a value between [0, 1]; where 0 indicates least similar, 1 most similar.\n',
      mode: 'READ',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'indexName :: STRING',
          name: 'indexName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'numberOfNearestNeighbours :: INTEGER',
          name: 'numberOfNearestNeighbours',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'query :: LIST<FLOAT>',
          name: 'query',
          type: 'LIST<FLOAT>',
        },
      ],
      signature:
        'db.index.vector.queryNodes(indexName :: STRING, numberOfNearestNeighbours :: INTEGER, query :: LIST<FLOAT>) :: (node :: NODE, score :: FLOAT)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'node :: NODE',
          name: 'node',
          type: 'NODE',
        },
        {
          isDeprecated: false,
          description: 'score :: FLOAT',
          name: 'score',
          type: 'FLOAT',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.info',
      description: 'Provides information regarding the database.',
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [],
      signature:
        'db.info() :: (id :: STRING, name :: STRING, creationDate :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'id :: STRING',
          name: 'id',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'creationDate :: STRING',
          name: 'creationDate',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.labels',
      description:
        "List all labels attached to nodes within a database according to the user's access rights. The procedure returns empty results if the user is not authorized to view those labels.",
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [],
      signature: 'db.labels() :: (label :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'label :: STRING',
          name: 'label',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.listLocks',
      description: 'List all locks at this database.',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [],
      signature:
        'db.listLocks() :: (mode :: STRING, resourceType :: STRING, resourceId :: INTEGER, transactionId :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'mode :: STRING',
          name: 'mode',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'resourceType :: STRING',
          name: 'resourceType',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'resourceId :: INTEGER',
          name: 'resourceId',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'transactionId :: STRING',
          name: 'transactionId',
          type: 'STRING',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.ping',
      description:
        'This procedure can be used by client side tooling to test whether they are correctly connected to a database. The procedure is available in all databases and always returns true. A faulty connection can be detected by not being able to call this procedure.',
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [],
      signature: 'db.ping() :: (success :: BOOLEAN)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'success :: BOOLEAN',
          name: 'success',
          type: 'BOOLEAN',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.prepareForReplanning',
      description:
        'Triggers an index resample and waits for it to complete, and after that clears query caches. After this procedure has finished queries will be planned using the latest database statistics.',
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=300, type=INTEGER}',
          description: 'timeOutSeconds = 300 :: INTEGER',
          name: 'timeOutSeconds',
          type: 'INTEGER',
        },
      ],
      signature: 'db.prepareForReplanning(timeOutSeconds = 300 :: INTEGER)',
      returnDescription: [],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.propertyKeys',
      description: 'List all property keys in the database.',
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [],
      signature: 'db.propertyKeys() :: (propertyKey :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'propertyKey :: STRING',
          name: 'propertyKey',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.relationshipTypes',
      description:
        "List all types attached to relationships within a database according to the user's access rights. The procedure returns empty results if the user is not authorized to view those relationship types.",
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [],
      signature: 'db.relationshipTypes() :: (relationshipType :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'relationshipType :: STRING',
          name: 'relationshipType',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.resampleIndex',
      description:
        'Schedule resampling of an index (for example: CALL db.resampleIndex("MyIndex")).',
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'indexName :: STRING',
          name: 'indexName',
          type: 'STRING',
        },
      ],
      signature: 'db.resampleIndex(indexName :: STRING)',
      returnDescription: [],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.resampleOutdatedIndexes',
      description: 'Schedule resampling of all outdated indexes.',
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [],
      signature: 'db.resampleOutdatedIndexes()',
      returnDescription: [],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.schema.nodeTypeProperties',
      description:
        'Show the derived property schema of the nodes in tabular form.',
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [],
      signature:
        'db.schema.nodeTypeProperties() :: (nodeType :: STRING, nodeLabels :: LIST<STRING>, propertyName :: STRING, propertyTypes :: LIST<STRING>, mandatory :: BOOLEAN)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'nodeType :: STRING',
          name: 'nodeType',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nodeLabels :: LIST<STRING>',
          name: 'nodeLabels',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'propertyName :: STRING',
          name: 'propertyName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'propertyTypes :: LIST<STRING>',
          name: 'propertyTypes',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'mandatory :: BOOLEAN',
          name: 'mandatory',
          type: 'BOOLEAN',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.schema.relTypeProperties',
      description:
        'Show the derived property schema of the relationships in tabular form.',
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [],
      signature:
        'db.schema.relTypeProperties() :: (relType :: STRING, propertyName :: STRING, propertyTypes :: LIST<STRING>, mandatory :: BOOLEAN)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'relType :: STRING',
          name: 'relType',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'propertyName :: STRING',
          name: 'propertyName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'propertyTypes :: LIST<STRING>',
          name: 'propertyTypes',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'mandatory :: BOOLEAN',
          name: 'mandatory',
          type: 'BOOLEAN',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.schema.visualization',
      description:
        'Visualizes the schema of the data based on available statistics. A new node is returned for each label. The properties represented on the node include: `name` (label name), `indexes` (list of indexes), and `constraints` (list of constraints). A relationship of a given type is returned for all possible combinations of start and end nodes. The properties represented on the relationship include: `name` (type name). Note that this may include additional relationships that do not exist in the data due to the information available in the count store. ',
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [],
      signature:
        'db.schema.visualization() :: (nodes :: LIST<NODE>, relationships :: LIST<RELATIONSHIP>)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'nodes :: LIST<NODE>',
          name: 'nodes',
          type: 'LIST<NODE>',
        },
        {
          isDeprecated: false,
          description: 'relationships :: LIST<RELATIONSHIP>',
          name: 'relationships',
          type: 'LIST<RELATIONSHIP>',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.stats.clear',
      description:
        "Clear collected data of a given data section. Valid sections are 'QUERIES'",
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'section :: STRING',
          name: 'section',
          type: 'STRING',
        },
      ],
      signature:
        'db.stats.clear(section :: STRING) :: (section :: STRING, success :: BOOLEAN, message :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'section :: STRING',
          name: 'section',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'success :: BOOLEAN',
          name: 'success',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'message :: STRING',
          name: 'message',
          type: 'STRING',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.stats.collect',
      description:
        "Start data collection of a given data section. Valid sections are 'QUERIES'",
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'section :: STRING',
          name: 'section',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'db.stats.collect(section :: STRING, config = {} :: MAP) :: (section :: STRING, success :: BOOLEAN, message :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'section :: STRING',
          name: 'section',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'success :: BOOLEAN',
          name: 'success',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'message :: STRING',
          name: 'message',
          type: 'STRING',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.stats.retrieve',
      description:
        "Retrieve statistical data about the current database. Valid sections are 'GRAPH COUNTS', 'TOKENS', 'QUERIES', 'META'",
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'section :: STRING',
          name: 'section',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'db.stats.retrieve(section :: STRING, config = {} :: MAP) :: (section :: STRING, data :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'section :: STRING',
          name: 'section',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'data :: MAP',
          name: 'data',
          type: 'MAP',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.stats.retrieveAllAnonymized',
      description:
        'Retrieve all available statistical data about the current database, in an anonymized form.',
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'graphToken :: STRING',
          name: 'graphToken',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value={}, type=MAP}',
          description: 'config = {} :: MAP',
          name: 'config',
          type: 'MAP',
        },
      ],
      signature:
        'db.stats.retrieveAllAnonymized(graphToken :: STRING, config = {} :: MAP) :: (section :: STRING, data :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'section :: STRING',
          name: 'section',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'data :: MAP',
          name: 'data',
          type: 'MAP',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.stats.status',
      description:
        'Retrieve the status of all available collector daemons, for this database.',
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [],
      signature:
        'db.stats.status() :: (section :: STRING, status :: STRING, data :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'section :: STRING',
          name: 'section',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'status :: STRING',
          name: 'status',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'data :: MAP',
          name: 'data',
          type: 'MAP',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'db.stats.stop',
      description:
        "Stop data collection of a given data section. Valid sections are 'QUERIES'",
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'section :: STRING',
          name: 'section',
          type: 'STRING',
        },
      ],
      signature:
        'db.stats.stop(section :: STRING) :: (section :: STRING, success :: BOOLEAN, message :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'section :: STRING',
          name: 'section',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'success :: BOOLEAN',
          name: 'success',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'message :: STRING',
          name: 'message',
          type: 'STRING',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.checkConfigValue',
      description: 'Check if a potential config setting value is valid.',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'setting :: STRING',
          name: 'setting',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'value :: STRING',
          name: 'value',
          type: 'STRING',
        },
      ],
      signature:
        'dbms.checkConfigValue(setting :: STRING, value :: STRING) :: (valid :: BOOLEAN, message :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'valid :: BOOLEAN',
          name: 'valid',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'message :: STRING',
          name: 'message',
          type: 'STRING',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.cluster.checkConnectivity',
      description:
        "Check the connectivity of this instance to other cluster members. Not all ports are relevant to all members. Valid values for 'port-name' are: [CLUSTER, RAFT]",
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=null, type=STRING}',
          description: 'port-name = null :: STRING',
          name: 'port-name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=null, type=STRING}',
          description: 'server = null :: STRING',
          name: 'server',
          type: 'STRING',
        },
      ],
      signature:
        'dbms.cluster.checkConnectivity(port-name = null :: STRING, server = null :: STRING) :: (serverId :: STRING, mode-constraint :: STRING, port-name :: STRING, port-address :: STRING, result :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'serverId :: STRING',
          name: 'serverId',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'mode-constraint :: STRING',
          name: 'mode-constraint',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'port-name :: STRING',
          name: 'port-name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'port-address :: STRING',
          name: 'port-address',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'result :: STRING',
          name: 'result',
          type: 'STRING',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.cluster.cordonServer',
      description:
        'Mark a server in the topology as not suitable for new allocations. It will not force current allocations off the server. This is useful when deallocating databases when you have multiple unavailable servers.',
      mode: 'WRITE',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'server :: STRING',
          name: 'server',
          type: 'STRING',
        },
      ],
      signature: 'dbms.cluster.cordonServer(server :: STRING)',
      returnDescription: [],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.cluster.protocols',
      description: 'Overview of installed protocols',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [],
      signature:
        'dbms.cluster.protocols() :: (orientation :: STRING, remoteAddress :: STRING, applicationProtocol :: STRING, applicationProtocolVersion :: INTEGER, modifierProtocols :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'orientation :: STRING',
          name: 'orientation',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'remoteAddress :: STRING',
          name: 'remoteAddress',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'applicationProtocol :: STRING',
          name: 'applicationProtocol',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'applicationProtocolVersion :: INTEGER',
          name: 'applicationProtocolVersion',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'modifierProtocols :: STRING',
          name: 'modifierProtocols',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.cluster.readReplicaToggle',
      description:
        'The toggle can pause or resume read replica (deprecated in favor of dbms.cluster.secondaryReplicationDisable)',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'databaseName :: STRING',
          name: 'databaseName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'pause :: BOOLEAN',
          name: 'pause',
          type: 'BOOLEAN',
        },
      ],
      signature:
        'dbms.cluster.readReplicaToggle(databaseName :: STRING, pause :: BOOLEAN) :: (state :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'state :: STRING',
          name: 'state',
          type: 'STRING',
        },
      ],
      admin: true,
      option: {
        deprecated: true,
      },
    },
    {
      name: 'dbms.cluster.routing.getRoutingTable',
      description:
        "Returns the advertised bolt capable endpoints for a given database, divided by each endpoint's capabilities. For example, an endpoint may serve read queries, write queries, and/or future `getRoutingTable` requests.",
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'context :: MAP',
          name: 'context',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=null, type=STRING}',
          description: 'database = null :: STRING',
          name: 'database',
          type: 'STRING',
        },
      ],
      signature:
        'dbms.cluster.routing.getRoutingTable(context :: MAP, database = null :: STRING) :: (ttl :: INTEGER, servers :: LIST<MAP>)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'ttl :: INTEGER',
          name: 'ttl',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'servers :: LIST<MAP>',
          name: 'servers',
          type: 'LIST<MAP>',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.cluster.secondaryReplicationDisable',
      description:
        'The toggle can pause or resume the secondary replication process.',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'databaseName :: STRING',
          name: 'databaseName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'pause :: BOOLEAN',
          name: 'pause',
          type: 'BOOLEAN',
        },
      ],
      signature:
        'dbms.cluster.secondaryReplicationDisable(databaseName :: STRING, pause :: BOOLEAN) :: (state :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'state :: STRING',
          name: 'state',
          type: 'STRING',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.cluster.setAutomaticallyEnableFreeServers',
      description:
        'With this method you can set whether free servers are automatically enabled.',
      mode: 'WRITE',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'autoEnable :: BOOLEAN',
          name: 'autoEnable',
          type: 'BOOLEAN',
        },
      ],
      signature:
        'dbms.cluster.setAutomaticallyEnableFreeServers(autoEnable :: BOOLEAN)',
      returnDescription: [],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.cluster.uncordonServer',
      description: "Remove the cordon on a server, returning it to 'enabled'.",
      mode: 'WRITE',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'server :: STRING',
          name: 'server',
          type: 'STRING',
        },
      ],
      signature: 'dbms.cluster.uncordonServer(server :: STRING)',
      returnDescription: [],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.components',
      description: 'List DBMS components and their versions.',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [],
      signature:
        'dbms.components() :: (name :: STRING, versions :: LIST<STRING>, edition :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'versions :: LIST<STRING>',
          name: 'versions',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'edition :: STRING',
          name: 'edition',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.info',
      description: 'Provides information regarding the DBMS.',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [],
      signature:
        'dbms.info() :: (id :: STRING, name :: STRING, creationDate :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'id :: STRING',
          name: 'id',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'creationDate :: STRING',
          name: 'creationDate',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.killConnection',
      description: 'Kill network connection with the given connection id.',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'id :: STRING',
          name: 'id',
          type: 'STRING',
        },
      ],
      signature:
        'dbms.killConnection(id :: STRING) :: (connectionId :: STRING, username :: STRING, message :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'connectionId :: STRING',
          name: 'connectionId',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'username :: STRING',
          name: 'username',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'message :: STRING',
          name: 'message',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.killConnections',
      description:
        'Kill all network connections with the given connection ids.',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'ids :: LIST<STRING>',
          name: 'ids',
          type: 'LIST<STRING>',
        },
      ],
      signature:
        'dbms.killConnections(ids :: LIST<STRING>) :: (connectionId :: STRING, username :: STRING, message :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'connectionId :: STRING',
          name: 'connectionId',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'username :: STRING',
          name: 'username',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'message :: STRING',
          name: 'message',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.listActiveLocks',
      description:
        'List the active lock requests granted for the transaction executing the query with the given query id.',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'queryId :: STRING',
          name: 'queryId',
          type: 'STRING',
        },
      ],
      signature:
        'dbms.listActiveLocks(queryId :: STRING) :: (mode :: STRING, resourceType :: STRING, resourceId :: INTEGER)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'mode :: STRING',
          name: 'mode',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'resourceType :: STRING',
          name: 'resourceType',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'resourceId :: INTEGER',
          name: 'resourceId',
          type: 'INTEGER',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.listCapabilities',
      description: 'List capabilities.',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [],
      signature:
        'dbms.listCapabilities() :: (name :: STRING, description :: STRING, value :: ANY)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'description :: STRING',
          name: 'description',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'value :: ANY',
          name: 'value',
          type: 'ANY',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.listConfig',
      description: 'List the currently active configuration settings of Neo4j.',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=, type=STRING}',
          description: 'searchString =  :: STRING',
          name: 'searchString',
          type: 'STRING',
        },
      ],
      signature:
        'dbms.listConfig(searchString =  :: STRING) :: (name :: STRING, description :: STRING, value :: STRING, dynamic :: BOOLEAN, defaultValue :: STRING, startupValue :: STRING, explicitlySet :: BOOLEAN, validValues :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'description :: STRING',
          name: 'description',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'value :: STRING',
          name: 'value',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'dynamic :: BOOLEAN',
          name: 'dynamic',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'defaultValue :: STRING',
          name: 'defaultValue',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'startupValue :: STRING',
          name: 'startupValue',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'explicitlySet :: BOOLEAN',
          name: 'explicitlySet',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'validValues :: STRING',
          name: 'validValues',
          type: 'STRING',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.listConnections',
      description:
        'List all accepted network connections at this instance that are visible to the user.',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [],
      signature:
        'dbms.listConnections() :: (connectionId :: STRING, connectTime :: STRING, connector :: STRING, username :: STRING, userAgent :: STRING, serverAddress :: STRING, clientAddress :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'connectionId :: STRING',
          name: 'connectionId',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'connectTime :: STRING',
          name: 'connectTime',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'connector :: STRING',
          name: 'connector',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'username :: STRING',
          name: 'username',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'userAgent :: STRING',
          name: 'userAgent',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'serverAddress :: STRING',
          name: 'serverAddress',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'clientAddress :: STRING',
          name: 'clientAddress',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.listPools',
      description:
        'List all memory pools, including sub pools, currently registered at this instance that are visible to the user.',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [],
      signature:
        'dbms.listPools() :: (pool :: STRING, databaseName :: STRING, heapMemoryUsed :: STRING, heapMemoryUsedBytes :: STRING, nativeMemoryUsed :: STRING, nativeMemoryUsedBytes :: STRING, freeMemory :: STRING, freeMemoryBytes :: STRING, totalPoolMemory :: STRING, totalPoolMemoryBytes :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'pool :: STRING',
          name: 'pool',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'databaseName :: STRING',
          name: 'databaseName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'heapMemoryUsed :: STRING',
          name: 'heapMemoryUsed',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'heapMemoryUsedBytes :: STRING',
          name: 'heapMemoryUsedBytes',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nativeMemoryUsed :: STRING',
          name: 'nativeMemoryUsed',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'nativeMemoryUsedBytes :: STRING',
          name: 'nativeMemoryUsedBytes',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'freeMemory :: STRING',
          name: 'freeMemory',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'freeMemoryBytes :: STRING',
          name: 'freeMemoryBytes',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'totalPoolMemory :: STRING',
          name: 'totalPoolMemory',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'totalPoolMemoryBytes :: STRING',
          name: 'totalPoolMemoryBytes',
          type: 'STRING',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.quarantineDatabase',
      description: 'Place a database into quarantine or remove it from it.',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'databaseName :: STRING',
          name: 'databaseName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'setStatus :: BOOLEAN',
          name: 'setStatus',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=No reason given, type=STRING}',
          description: 'reason = No reason given :: STRING',
          name: 'reason',
          type: 'STRING',
        },
      ],
      signature:
        'dbms.quarantineDatabase(databaseName :: STRING, setStatus :: BOOLEAN, reason = No reason given :: STRING) :: (databaseName :: STRING, quarantined :: BOOLEAN, result :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'databaseName :: STRING',
          name: 'databaseName',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'quarantined :: BOOLEAN',
          name: 'quarantined',
          type: 'BOOLEAN',
        },
        {
          isDeprecated: false,
          description: 'result :: STRING',
          name: 'result',
          type: 'STRING',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.queryJmx',
      description:
        'Query JMX management data by domain and name. For instance, use `*:*` to find all JMX beans.',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'query :: STRING',
          name: 'query',
          type: 'STRING',
        },
      ],
      signature:
        'dbms.queryJmx(query :: STRING) :: (name :: STRING, description :: STRING, attributes :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'name :: STRING',
          name: 'name',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'description :: STRING',
          name: 'description',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'attributes :: MAP',
          name: 'attributes',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.routing.getRoutingTable',
      description:
        "Returns the advertised bolt capable endpoints for a given database, divided by each endpoint's capabilities. For example, an endpoint may serve read queries, write queries, and/or future `getRoutingTable` requests.",
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'context :: MAP',
          name: 'context',
          type: 'MAP',
        },
        {
          isDeprecated: false,
          default: 'DefaultParameterValue{value=null, type=STRING}',
          description: 'database = null :: STRING',
          name: 'database',
          type: 'STRING',
        },
      ],
      signature:
        'dbms.routing.getRoutingTable(context :: MAP, database = null :: STRING) :: (ttl :: INTEGER, servers :: LIST<MAP>)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'ttl :: INTEGER',
          name: 'ttl',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'servers :: LIST<MAP>',
          name: 'servers',
          type: 'LIST<MAP>',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.scheduler.failedJobs',
      description:
        'List failed job runs. There is a limit for amount of historical data.',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [],
      signature:
        'dbms.scheduler.failedJobs() :: (jobId :: STRING, group :: STRING, database :: STRING, submitter :: STRING, description :: STRING, type :: STRING, submitted :: STRING, executionStart :: STRING, failureTime :: STRING, failureDescription :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'jobId :: STRING',
          name: 'jobId',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'group :: STRING',
          name: 'group',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'database :: STRING',
          name: 'database',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'submitter :: STRING',
          name: 'submitter',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'description :: STRING',
          name: 'description',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'type :: STRING',
          name: 'type',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'submitted :: STRING',
          name: 'submitted',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'executionStart :: STRING',
          name: 'executionStart',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'failureTime :: STRING',
          name: 'failureTime',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'failureDescription :: STRING',
          name: 'failureDescription',
          type: 'STRING',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.scheduler.groups',
      description:
        'List the job groups that are active in the database internal job scheduler.',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [],
      signature:
        'dbms.scheduler.groups() :: (group :: STRING, threads :: INTEGER)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'group :: STRING',
          name: 'group',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'threads :: INTEGER',
          name: 'threads',
          type: 'INTEGER',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.scheduler.jobs',
      description:
        'List all jobs that are active in the database internal job scheduler.',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [],
      signature:
        'dbms.scheduler.jobs() :: (jobId :: STRING, group :: STRING, submitted :: STRING, database :: STRING, submitter :: STRING, description :: STRING, type :: STRING, scheduledAt :: STRING, period :: STRING, state :: STRING, currentStateDescription :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'jobId :: STRING',
          name: 'jobId',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'group :: STRING',
          name: 'group',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'submitted :: STRING',
          name: 'submitted',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'database :: STRING',
          name: 'database',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'submitter :: STRING',
          name: 'submitter',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'description :: STRING',
          name: 'description',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'type :: STRING',
          name: 'type',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'scheduledAt :: STRING',
          name: 'scheduledAt',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'period :: STRING',
          name: 'period',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'state :: STRING',
          name: 'state',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'currentStateDescription :: STRING',
          name: 'currentStateDescription',
          type: 'STRING',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.security.clearAuthCache',
      description: 'Clears authentication and authorization cache.',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [],
      signature: 'dbms.security.clearAuthCache()',
      returnDescription: [],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.setConfigValue',
      description:
        'Update a given setting value. Passing an empty value results in removing the configured value and falling back to the default value. Changes do not persist and are lost if the server is restarted. In a clustered environment, `dbms.setConfigValue` affects only the cluster member it is run against.',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'setting :: STRING',
          name: 'setting',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'value :: STRING',
          name: 'value',
          type: 'STRING',
        },
      ],
      signature: 'dbms.setConfigValue(setting :: STRING, value :: STRING)',
      returnDescription: [],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.setDatabaseAllocator',
      description:
        'With this method you can set the allocator that is responsible for selecting servers for hosting databases.',
      mode: 'WRITE',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'allocator :: STRING',
          name: 'allocator',
          type: 'STRING',
        },
      ],
      signature: 'dbms.setDatabaseAllocator(allocator :: STRING)',
      returnDescription: [],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.setDefaultAllocationNumbers',
      description:
        'With this method you can set the default number of primaries and secondaries.',
      mode: 'WRITE',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'primaries :: INTEGER',
          name: 'primaries',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'secondaries :: INTEGER',
          name: 'secondaries',
          type: 'INTEGER',
        },
      ],
      signature:
        'dbms.setDefaultAllocationNumbers(primaries :: INTEGER, secondaries :: INTEGER)',
      returnDescription: [],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.setDefaultDatabase',
      description:
        'Change the default database to the provided value. The database must exist and the old default database must be stopped.',
      mode: 'WRITE',
      worksOnSystem: true,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'databaseName :: STRING',
          name: 'databaseName',
          type: 'STRING',
        },
      ],
      signature:
        'dbms.setDefaultDatabase(databaseName :: STRING) :: (result :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'result :: STRING',
          name: 'result',
          type: 'STRING',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.showCurrentUser',
      description: 'Show the current user.',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [],
      signature:
        'dbms.showCurrentUser() :: (username :: STRING, roles :: LIST<STRING>, flags :: LIST<STRING>)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'username :: STRING',
          name: 'username',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'roles :: LIST<STRING>',
          name: 'roles',
          type: 'LIST<STRING>',
        },
        {
          isDeprecated: false,
          description: 'flags :: LIST<STRING>',
          name: 'flags',
          type: 'LIST<STRING>',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.showTopologyGraphConfig',
      description:
        'With this method the configuration of the Topology Graph can be displayed.',
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [],
      signature:
        'dbms.showTopologyGraphConfig() :: (allocator :: STRING, defaultPrimariesCount :: INTEGER, defaultSecondariesCount :: INTEGER, defaultDatabase :: STRING, autoEnableFreeServers :: BOOLEAN)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'allocator :: STRING',
          name: 'allocator',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'defaultPrimariesCount :: INTEGER',
          name: 'defaultPrimariesCount',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'defaultSecondariesCount :: INTEGER',
          name: 'defaultSecondariesCount',
          type: 'INTEGER',
        },
        {
          isDeprecated: false,
          description: 'defaultDatabase :: STRING',
          name: 'defaultDatabase',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'autoEnableFreeServers :: BOOLEAN',
          name: 'autoEnableFreeServers',
          type: 'BOOLEAN',
        },
      ],
      admin: true,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'dbms.upgrade',
      description:
        'Upgrade the system database schema if it is not the current schema.',
      mode: 'WRITE',
      worksOnSystem: true,
      argumentDescription: [],
      signature:
        'dbms.upgrade() :: (status :: STRING, upgradeResult :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'status :: STRING',
          name: 'status',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'upgradeResult :: STRING',
          name: 'upgradeResult',
          type: 'STRING',
        },
      ],
      admin: true,
      option: {
        deprecated: true,
      },
    },
    {
      name: 'dbms.upgradeStatus',
      description:
        'Report the current status of the system database sub-graph schema.',
      mode: 'READ',
      worksOnSystem: true,
      argumentDescription: [],
      signature:
        'dbms.upgradeStatus() :: (status :: STRING, description :: STRING, resolution :: STRING)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'status :: STRING',
          name: 'status',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'description :: STRING',
          name: 'description',
          type: 'STRING',
        },
        {
          isDeprecated: false,
          description: 'resolution :: STRING',
          name: 'resolution',
          type: 'STRING',
        },
      ],
      admin: true,
      option: {
        deprecated: true,
      },
    },
    {
      name: 'tx.getMetaData',
      description: 'Provides attached transaction metadata.',
      mode: 'DBMS',
      worksOnSystem: true,
      argumentDescription: [],
      signature: 'tx.getMetaData() :: (metadata :: MAP)',
      returnDescription: [
        {
          isDeprecated: false,
          description: 'metadata :: MAP',
          name: 'metadata',
          type: 'MAP',
        },
      ],
      admin: false,
      option: {
        deprecated: false,
      },
    },
    {
      name: 'tx.setMetaData',
      description:
        'Attaches a map of data to the transaction. The data will be printed when listing queries, and inserted into the query log.',
      mode: 'DBMS',
      worksOnSystem: false,
      argumentDescription: [
        {
          isDeprecated: false,
          description: 'data :: MAP',
          name: 'data',
          type: 'MAP',
        },
      ],
      signature: 'tx.setMetaData(data :: MAP)',
      returnDescription: [],
      admin: false,
      option: {
        deprecated: false,
      },
    },
  ],
  labels: [
    'Actor',
    'Airport',
    'Apple',
    'Aquarium',
    'Arena',
    'Backpack',
    'Bag',
    'Ball',
    'Bar',
    'Beach',
    'Bed',
    'Bicycle',
    'Bird',
    'Book',
    'Book',
    'Bottle',
    'Bridge',
    'Cafe',
    'Canyon',
    'Car',
    'Cat',
    'Cave',
    'Chair',
    'Church',
    'Cinema',
    'City',
    'Clock',
    'Coat',
    'Computer',
    'Concert',
    'Country',
    'Cup',
    'Desert',
    'Dog',
    'Door',
    'Elephant',
    'Factory',
    'Farm',
    'Festival',
    'Field',
    'Fish',
    'Flower',
    'Forest',
    'Fork',
    'Garden',
    'Genre',
    'Glacier',
    'Glass',
    'Greeting',
    'Gym',
    'Hat',
    'Hill',
    'Hospital',
    'Hotel',
    'House',
    'Island',
    'Knife',
    'Lake',
    'Library',
    'Mall',
    'Map',
    'Meeting',
    'Moon',
    'Mosque',
    'Mountain',
    'Movie',
    'Museum',
    'Notebook',
    'Ocean',
    'Office',
    'Orchard',
    'Pants',
    'Paper',
    'Park',
    'Party',
    'Path',
    'Pen',
    'Pencil',
    'Person',
    'Phone',
    'Plate',
    'Playground',
    'Pool',
    'Restaurant',
    'River',
    'Riverbank',
    'Road',
    'School',
    'Shirt',
    'Shoe',
    'Shop',
    'Spoon',
    'Stadium',
    'Star',
    'Sun',
    'Supermarket',
    'Table',
    'Television',
    'Temple',
    'Theater',
    'Tree',
    'User',
    'Valley',
    'Visualisation',
    'Volcano',
    'Wedding',
    'Window',
    'Zoo',
    'longlabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothree',
    'longlabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothree',
    'longlabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothree',
    'longlabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothree',
    'longlabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothree',
    'longlabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothree',
  ],
  relationshipTypes: [
    'ACTED_IN',
    'DIRECTED',
    'FOLLOWS',
    'PRODUCED',
    'REVIEWED',
    'WROTE',
    'RUNS',
    'JUMPS',
    'SWIMS',
    'THINKS',
    'WRITES',
    'READS',
    'SINGS',
    'DANCES',
    'PLAYS',
    'WALKS',
    'TALKS',
    'LISTENS',
    'SCREAMS',
    'LAUGHS',
    'CRIES',
    'EATS',
    'DRINKS',
    'SLEEPS',
    'WORKS',
    'STUDIES',
    'WATCHES',
    'OBSERVES',
    'BUILDS',
    'CREATES',
    'DESTROYS',
    'REPAIRS',
    'OPENS',
    'CLOSES',
    'PUSHES',
    'PULLS',
    'LIFTS',
    'DROPS',
    'CATCHES',
    'THROWS',
    'CLIMBS',
    'FALLS',
    'FLIES',
    'SWINGS',
    'EXPLORES',
    'DISCOVERS',
    'INVENTS',
    'IMAGINES',
    'REMEMBERS',
    'FORGETS',
    'LOVES',
    'HATES',
    'GIVES',
    'TAKES',
    'SEES',
    'HEARS',
    'SMELLS',
    'TOUCHES',
    'FEELS',
    'LEARNS',
    'TEACHES',
    'GROWS',
    'SHRINKS',
    'FIGHTS',
    'MAKES',
    'PEACE',
    'WINS',
    'LOSES',
    'LEADS',
    'FOLLOWS',
    'CHANGES',
    'STAYS',
    'MOVES',
    'STOPS',
    'GOES',
    'BEGINS',
    'ENDS',
    'IMPROVES',
    'DEGRADES',
    'HELPS',
    'HARMS',
    'SAVES',
    'SPENDS',
    'INCREASES',
    'DECREASES',
    'OPTIMIZES',
    'COMPLICATES',
    'SIMPLIFIES',
    'AMPLIFIES',
    'REDUCES',
    'COMPARES',
    'CONTRASTS',
    'COPIES',
    'PASTES',
    'CUTS',
    'PAINTS',
    'DRAWS',
    'DESIGNS',
    'CALCULATES',
    'MEASURES',
    'WEIGHS',
    'PROGRAMS',
    'CODES',
    'ANALYZES',
    'SOLVES',
    'EXPLAINS',
    'DESCRIBES',
    'DISCUSSES',
    'ARGUES',
    'CONVINCES',
    'PERSUADES',
    'INSPIRES',
    'MOTIVATES',
    'longlabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothree',
    'longlabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothree',
    'longlabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothree',
    'longlabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothree',
    'longlabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothree',
    'longlabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothreelonglabelonetwothreefourfivesixseveneightninetenonetwothree',
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
  databaseNames: [
    'neo4j',
    'oskar',
    'system',
    'Restaurant',
    'Cafe',
    'Bar',
    'Hotel',
    'Supermarket',
    'Mall',
    'Shop',
    'Office',
    'Factory',
    'Gym',
    'Stadium',
  ],
  aliasNames: [
    'alias2',
    'testalias',
    'Bar',
    'Hotel',
    'Supermarket',
    'Mall',
    'Shop',
    'Office',
    'Factory',
    'Gym',
    'Stadium',
  ],
};

const largeQuery = `
CREATE (TheMatrix:Movie {title:'The Matrix', released:1999, tagline:'Welcome to the Real World'})
CREATE (Keanu:Person {name:'Keanu Reeves', born:1964})
CREATE (Carrie:Person {name:'Carrie-Anne Moss', born:1967})
CREATE (Laurence:Person {name:'Laurence Fishburne', born:1961})
CREATE (Hugo:Person {name:'Hugo Weaving', born:1960})
CREATE (LillyW:Person {name:'Lilly Wachowski', born:1967})
CREATE (LanaW:Person {name:'Lana Wachowski', born:1965})
CREATE (JoelS:Person {name:'Joel Silver', born:1952})
CREATE
(Keanu)-[:ACTED_IN {roles:['Neo']}]->(TheMatrix),
(Carrie)-[:ACTED_IN {roles:['Trinity']}]->(TheMatrix),
(Laurence)-[:ACTED_IN {roles:['Morpheus']}]->(TheMatrix),
(Hugo)-[:ACTED_IN {roles:['Agent Smith']}]->(TheMatrix),
(LillyW)-[:DIRECTED]->(TheMatrix),
(LanaW)-[:DIRECTED]->(TheMatrix),
(JoelS)-[:PRODUCED]->(TheMatrix)

CREATE (Emil:Person {name:"Emil Eifrem", born:1978})
CREATE (Emil)-[:ACTED_IN {roles:["Emil"]}]->(TheMatrix)

CREATE (TheMatrixReloaded:Movie {title:'The Matrix Reloaded', released:2003, tagline:'Free your mind'})
CREATE
(Keanu)-[:ACTED_IN {roles:['Neo']}]->(TheMatrixReloaded),
(Carrie)-[:ACTED_IN {roles:['Trinity']}]->(TheMatrixReloaded),
(Laurence)-[:ACTED_IN {roles:['Morpheus']}]->(TheMatrixReloaded),
(Hugo)-[:ACTED_IN {roles:['Agent Smith']}]->(TheMatrixReloaded),
(LillyW)-[:DIRECTED]->(TheMatrixReloaded),
(LanaW)-[:DIRECTED]->(TheMatrixReloaded),
(JoelS)-[:PRODUCED]->(TheMatrixReloaded)

CREATE (TheMatrixRevolutions:Movie {title:'The Matrix Revolutions', released:2003, tagline:'Everything that has a beginning has an end'})
CREATE
(Keanu)-[:ACTED_IN {roles:['Neo']}]->(TheMatrixRevolutions),
(Carrie)-[:ACTED_IN {roles:['Trinity']}]->(TheMatrixRevolutions),
(Laurence)-[:ACTED_IN {roles:['Morpheus']}]->(TheMatrixRevolutions),
(Hugo)-[:ACTED_IN {roles:['Agent Smith']}]->(TheMatrixRevolutions),
(LillyW)-[:DIRECTED]->(TheMatrixRevolutions),
(LanaW)-[:DIRECTED]->(TheMatrixRevolutions),
(JoelS)-[:PRODUCED]->(TheMatrixRevolutions)

CREATE (TheDevilsAdvocate:Movie {title:"The Devil's Advocate", released:1997, tagline:'Evil has its winning ways'})
CREATE (Charlize:Person {name:'Charlize Theron', born:1975})
CREATE (Al:Person {name:'Al Pacino', born:1940})
CREATE (Taylor:Person {name:'Taylor Hackford', born:1944})
CREATE
(Keanu)-[:ACTED_IN {roles:['Kevin Lomax']}]->(TheDevilsAdvocate),
(Charlize)-[:ACTED_IN {roles:['Mary Ann Lomax']}]->(TheDevilsAdvocate),
(Al)-[:ACTED_IN {roles:['John Milton']}]->(TheDevilsAdvocate),
(Taylor)-[:DIRECTED]->(TheDevilsAdvocate)

CREATE (AFewGoodMen:Movie {title:"A Few Good Men", released:1992, tagline:"In the heart of the nation's capital, in a courthouse of the U.S. government, one man will stop at nothing to keep his honor, and one will stop at nothing to find the truth."})
CREATE (TomC:Person {name:'Tom Cruise', born:1962})
CREATE (JackN:Person {name:'Jack Nicholson', born:1937})
CREATE (DemiM:Person {name:'Demi Moore', born:1962})
CREATE (KevinB:Person {name:'Kevin Bacon', born:1958})
CREATE (KieferS:Person {name:'Kiefer Sutherland', born:1966})
CREATE (NoahW:Person {name:'Noah Wyle', born:1971})
CREATE (CubaG:Person {name:'Cuba Gooding Jr.', born:1968})
CREATE (KevinP:Person {name:'Kevin Pollak', born:1957})
CREATE (JTW:Person {name:'J.T. Walsh', born:1943})
CREATE (JamesM:Person {name:'James Marshall', born:1967})
CREATE (ChristopherG:Person {name:'Christopher Guest', born:1948})
CREATE (RobR:Person {name:'Rob Reiner', born:1947})
CREATE (AaronS:Person {name:'Aaron Sorkin', born:1961})
CREATE
(TomC)-[:ACTED_IN {roles:['Lt. Daniel Kaffee']}]->(AFewGoodMen),
(JackN)-[:ACTED_IN {roles:['Col. Nathan R. Jessup']}]->(AFewGoodMen),
(DemiM)-[:ACTED_IN {roles:['Lt. Cdr. JoAnne Galloway']}]->(AFewGoodMen),
(KevinB)-[:ACTED_IN {roles:['Capt. Jack Ross']}]->(AFewGoodMen),
(KieferS)-[:ACTED_IN {roles:['Lt. Jonathan Kendrick']}]->(AFewGoodMen),
(NoahW)-[:ACTED_IN {roles:['Cpl. Jeffrey Barnes']}]->(AFewGoodMen),
(CubaG)-[:ACTED_IN {roles:['Cpl. Carl Hammaker']}]->(AFewGoodMen),
(KevinP)-[:ACTED_IN {roles:['Lt. Sam Weinberg']}]->(AFewGoodMen),
(JTW)-[:ACTED_IN {roles:['Lt. Col. Matthew Andrew Markinson']}]->(AFewGoodMen),
(JamesM)-[:ACTED_IN {roles:['Pfc. Louden Downey']}]->(AFewGoodMen),
(ChristopherG)-[:ACTED_IN {roles:['Dr. Stone']}]->(AFewGoodMen),
(AaronS)-[:ACTED_IN {roles:['Man in Bar']}]->(AFewGoodMen),
(RobR)-[:DIRECTED]->(AFewGoodMen),
(AaronS)-[:WROTE]->(AFewGoodMen)

CREATE (TopGun:Movie {title:"Top Gun", released:1986, tagline:'I feel the need, the need for speed.'})
CREATE (KellyM:Person {name:'Kelly McGillis', born:1957})
CREATE (ValK:Person {name:'Val Kilmer', born:1959})
CREATE (AnthonyE:Person {name:'Anthony Edwards', born:1962})
CREATE (TomS:Person {name:'Tom Skerritt', born:1933})
CREATE (MegR:Person {name:'Meg Ryan', born:1961})
CREATE (TonyS:Person {name:'Tony Scott', born:1944})
CREATE (JimC:Person {name:'Jim Cash', born:1941})
CREATE
(TomC)-[:ACTED_IN {roles:['Maverick']}]->(TopGun),
(KellyM)-[:ACTED_IN {roles:['Charlie']}]->(TopGun),
(ValK)-[:ACTED_IN {roles:['Iceman']}]->(TopGun),
(AnthonyE)-[:ACTED_IN {roles:['Goose']}]->(TopGun),
(TomS)-[:ACTED_IN {roles:['Viper']}]->(TopGun),
(MegR)-[:ACTED_IN {roles:['Carole']}]->(TopGun),
(TonyS)-[:DIRECTED]->(TopGun),
(JimC)-[:WROTE]->(TopGun)

CREATE (JerryMaguire:Movie {title:'Jerry Maguire', released:2000, tagline:'The rest of his life begins now.'})
CREATE (ReneeZ:Person {name:'Renee Zellweger', born:1969})
CREATE (KellyP:Person {name:'Kelly Preston', born:1962})
CREATE (JerryO:Person {name:"Jerry O'Connell", born:1974})
CREATE (JayM:Person {name:'Jay Mohr', born:1970})
CREATE (BonnieH:Person {name:'Bonnie Hunt', born:1961})
CREATE (ReginaK:Person {name:'Regina King', born:1971})
CREATE (JonathanL:Person {name:'Jonathan Lipnicki', born:1996})
CREATE (CameronC:Person {name:'Cameron Crowe', born:1957})
CREATE
(TomC)-[:ACTED_IN {roles:['Jerry Maguire']}]->(JerryMaguire),
(CubaG)-[:ACTED_IN {roles:['Rod Tidwell']}]->(JerryMaguire),
(ReneeZ)-[:ACTED_IN {roles:['Dorothy Boyd']}]->(JerryMaguire),
(KellyP)-[:ACTED_IN {roles:['Avery Bishop']}]->(JerryMaguire),
(JerryO)-[:ACTED_IN {roles:['Frank Cushman']}]->(JerryMaguire),
(JayM)-[:ACTED_IN {roles:['Bob Sugar']}]->(JerryMaguire),
(BonnieH)-[:ACTED_IN {roles:['Laurel Boyd']}]->(JerryMaguire),
(ReginaK)-[:ACTED_IN {roles:['Marcee Tidwell']}]->(JerryMaguire),
(JonathanL)-[:ACTED_IN {roles:['Ray Boyd']}]->(JerryMaguire),
(CameronC)-[:DIRECTED]->(JerryMaguire),
(CameronC)-[:PRODUCED]->(JerryMaguire),
(CameronC)-[:WROTE]->(JerryMaguire)

CREATE (StandByMe:Movie {title:"Stand By Me", released:1986, tagline:"For some, it's the last real taste of innocence, and the first real taste of life. But for everyone, it's the time that memories are made of."})
CREATE (RiverP:Person {name:'River Phoenix', born:1970})
CREATE (CoreyF:Person {name:'Corey Feldman', born:1971})
CREATE (WilW:Person {name:'Wil Wheaton', born:1972})
CREATE (JohnC:Person {name:'John Cusack', born:1966})
CREATE (MarshallB:Person {name:'Marshall Bell', born:1942})
CREATE
(WilW)-[:ACTED_IN {roles:['Gordie Lachance']}]->(StandByMe),
(RiverP)-[:ACTED_IN {roles:['Chris Chambers']}]->(StandByMe),
(JerryO)-[:ACTED_IN {roles:['Vern Tessio']}]->(StandByMe),
(CoreyF)-[:ACTED_IN {roles:['Teddy Duchamp']}]->(StandByMe),
(JohnC)-[:ACTED_IN {roles:['Denny Lachance']}]->(StandByMe),
(KieferS)-[:ACTED_IN {roles:['Ace Merrill']}]->(StandByMe),
(MarshallB)-[:ACTED_IN {roles:['Mr. Lachance']}]->(StandByMe),
(RobR)-[:DIRECTED]->(StandByMe)

CREATE (AsGoodAsItGets:Movie {title:'As Good as It Gets', released:1997, tagline:'A comedy from the heart that goes for the throat.'})
CREATE (HelenH:Person {name:'Helen Hunt', born:1963})
CREATE (GregK:Person {name:'Greg Kinnear', born:1963})
CREATE (JamesB:Person {name:'James L. Brooks', born:1940})
CREATE
(JackN)-[:ACTED_IN {roles:['Melvin Udall']}]->(AsGoodAsItGets),
(HelenH)-[:ACTED_IN {roles:['Carol Connelly']}]->(AsGoodAsItGets),
(GregK)-[:ACTED_IN {roles:['Simon Bishop']}]->(AsGoodAsItGets),
(CubaG)-[:ACTED_IN {roles:['Frank Sachs']}]->(AsGoodAsItGets),
(JamesB)-[:DIRECTED]->(AsGoodAsItGets)

CREATE (WhatDreamsMayCome:Movie {title:'What Dreams May Come', released:1998, tagline:'After life there is more. The end is just the beginning.'})
CREATE (AnnabellaS:Person {name:'Annabella Sciorra', born:1960})
CREATE (MaxS:Person {name:'Max von Sydow', born:1929})
CREATE (WernerH:Person {name:'Werner Herzog', born:1942})
CREATE (Robin:Person {name:'Robin Williams', born:1951})
CREATE (VincentW:Person {name:'Vincent Ward', born:1956})
CREATE
(Robin)-[:ACTED_IN {roles:['Chris Nielsen']}]->(WhatDreamsMayCome),
(CubaG)-[:ACTED_IN {roles:['Albert Lewis']}]->(WhatDreamsMayCome),
(AnnabellaS)-[:ACTED_IN {roles:['Annie Collins-Nielsen']}]->(WhatDreamsMayCome),
(MaxS)-[:ACTED_IN {roles:['The Tracker']}]->(WhatDreamsMayCome),
(WernerH)-[:ACTED_IN {roles:['The Face']}]->(WhatDreamsMayCome),
(VincentW)-[:DIRECTED]->(WhatDreamsMayCome)

CREATE (SnowFallingonCedars:Movie {title:'Snow Falling on Cedars', released:1999, tagline:'First loves last. Forever.'})
CREATE (EthanH:Person {name:'Ethan Hawke', born:1970})
CREATE (RickY:Person {name:'Rick Yune', born:1971})
CREATE (JamesC:Person {name:'James Cromwell', born:1940})
CREATE (ScottH:Person {name:'Scott Hicks', born:1953})
CREATE
(EthanH)-[:ACTED_IN {roles:['Ishmael Chambers']}]->(SnowFallingonCedars),
(RickY)-[:ACTED_IN {roles:['Kazuo Miyamoto']}]->(SnowFallingonCedars),
(MaxS)-[:ACTED_IN {roles:['Nels Gudmundsson']}]->(SnowFallingonCedars),
(JamesC)-[:ACTED_IN {roles:['Judge Fielding']}]->(SnowFallingonCedars),
(ScottH)-[:DIRECTED]->(SnowFallingonCedars)

CREATE (YouveGotMail:Movie {title:"You've Got Mail", released:1998, tagline:'At odds in life... in love on-line.'})
CREATE (ParkerP:Person {name:'Parker Posey', born:1968})
CREATE (DaveC:Person {name:'Dave Chappelle', born:1973})
CREATE (SteveZ:Person {name:'Steve Zahn', born:1967})
CREATE (TomH:Person {name:'Tom Hanks', born:1956})
CREATE (NoraE:Person {name:'Nora Ephron', born:1941})
CREATE
(TomH)-[:ACTED_IN {roles:['Joe Fox']}]->(YouveGotMail),
(MegR)-[:ACTED_IN {roles:['Kathleen Kelly']}]->(YouveGotMail),
(GregK)-[:ACTED_IN {roles:['Frank Navasky']}]->(YouveGotMail),
(ParkerP)-[:ACTED_IN {roles:['Patricia Eden']}]->(YouveGotMail),
(DaveC)-[:ACTED_IN {roles:['Kevin Jackson']}]->(YouveGotMail),
(SteveZ)-[:ACTED_IN {roles:['George Pappas']}]->(YouveGotMail),
(NoraE)-[:DIRECTED]->(YouveGotMail)

CREATE (SleeplessInSeattle:Movie {title:'Sleepless in Seattle', released:1993, tagline:'What if someone you never met, someone you never saw, someone you never knew was the only someone for you?'})
CREATE (RitaW:Person {name:'Rita Wilson', born:1956})
CREATE (BillPull:Person {name:'Bill Pullman', born:1953})
CREATE (VictorG:Person {name:'Victor Garber', born:1949})
CREATE (RosieO:Person {name:"Rosie O'Donnell", born:1962})
CREATE
(TomH)-[:ACTED_IN {roles:['Sam Baldwin']}]->(SleeplessInSeattle),
(MegR)-[:ACTED_IN {roles:['Annie Reed']}]->(SleeplessInSeattle),
(RitaW)-[:ACTED_IN {roles:['Suzy']}]->(SleeplessInSeattle),
(BillPull)-[:ACTED_IN {roles:['Walter']}]->(SleeplessInSeattle),
(VictorG)-[:ACTED_IN {roles:['Greg']}]->(SleeplessInSeattle),
(RosieO)-[:ACTED_IN {roles:['Becky']}]->(SleeplessInSeattle),
(NoraE)-[:DIRECTED]->(SleeplessInSeattle)

CREATE (JoeVersustheVolcano:Movie {title:'Joe Versus the Volcano', released:1990, tagline:'A story of love, lava and burning desire.'})
CREATE (JohnS:Person {name:'John Patrick Stanley', born:1950})
CREATE (Nathan:Person {name:'Nathan Lane', born:1956})
CREATE
(TomH)-[:ACTED_IN {roles:['Joe Banks']}]->(JoeVersustheVolcano),
(MegR)-[:ACTED_IN {roles:['DeDe', 'Angelica Graynamore', 'Patricia Graynamore']}]->(JoeVersustheVolcano),
(Nathan)-[:ACTED_IN {roles:['Baw']}]->(JoeVersustheVolcano),
(JohnS)-[:DIRECTED]->(JoeVersustheVolcano)

CREATE (WhenHarryMetSally:Movie {title:'When Harry Met Sally', released:1998, tagline:'Can two friends sleep together and still love each other in the morning?'})
CREATE (BillyC:Person {name:'Billy Crystal', born:1948})
CREATE (CarrieF:Person {name:'Carrie Fisher', born:1956})
CREATE (BrunoK:Person {name:'Bruno Kirby', born:1949})
CREATE
(BillyC)-[:ACTED_IN {roles:['Harry Burns']}]->(WhenHarryMetSally),
(MegR)-[:ACTED_IN {roles:['Sally Albright']}]->(WhenHarryMetSally),
(CarrieF)-[:ACTED_IN {roles:['Marie']}]->(WhenHarryMetSally),
(BrunoK)-[:ACTED_IN {roles:['Jess']}]->(WhenHarryMetSally),
(RobR)-[:DIRECTED]->(WhenHarryMetSally),
(RobR)-[:PRODUCED]->(WhenHarryMetSally),
(NoraE)-[:PRODUCED]->(WhenHarryMetSally),
(NoraE)-[:WROTE]->(WhenHarryMetSally)

CREATE (ThatThingYouDo:Movie {title:'That Thing You Do', released:1996, tagline:'In every life there comes a time when that thing you dream becomes that thing you do'})
CREATE (LivT:Person {name:'Liv Tyler', born:1977})
CREATE
(TomH)-[:ACTED_IN {roles:['Mr. White']}]->(ThatThingYouDo),
(LivT)-[:ACTED_IN {roles:['Faye Dolan']}]->(ThatThingYouDo),
(Charlize)-[:ACTED_IN {roles:['Tina']}]->(ThatThingYouDo),
(TomH)-[:DIRECTED]->(ThatThingYouDo)

CREATE (TheReplacements:Movie {title:'The Replacements', released:2000, tagline:'Pain heals, Chicks dig scars... Glory lasts forever'})
CREATE (Brooke:Person {name:'Brooke Langton', born:1970})
CREATE (Gene:Person {name:'Gene Hackman', born:1930})
CREATE (Orlando:Person {name:'Orlando Jones', born:1968})
CREATE (Howard:Person {name:'Howard Deutch', born:1950})
CREATE
(Keanu)-[:ACTED_IN {roles:['Shane Falco']}]->(TheReplacements),
(Brooke)-[:ACTED_IN {roles:['Annabelle Farrell']}]->(TheReplacements),
(Gene)-[:ACTED_IN {roles:['Jimmy McGinty']}]->(TheReplacements),
(Orlando)-[:ACTED_IN {roles:['Clifford Franklin']}]->(TheReplacements),
(Howard)-[:DIRECTED]->(TheReplacements)

CREATE (RescueDawn:Movie {title:'RescueDawn', released:2006, tagline:"Based on the extraordinary true story of one man's fight for freedom"})
CREATE (ChristianB:Person {name:'Christian Bale', born:1974})
CREATE (ZachG:Person {name:'Zach Grenier', born:1954})
CREATE
(MarshallB)-[:ACTED_IN {roles:['Admiral']}]->(RescueDawn),
(ChristianB)-[:ACTED_IN {roles:['Dieter Dengler']}]->(RescueDawn),
(ZachG)-[:ACTED_IN {roles:['Squad Leader']}]->(RescueDawn),
(SteveZ)-[:ACTED_IN {roles:['Duane']}]->(RescueDawn),
(WernerH)-[:DIRECTED]->(RescueDawn)

CREATE (TheBirdcage:Movie {title:'The Birdcage', released:1996, tagline:'Come as you are'})
CREATE (MikeN:Person {name:'Mike Nichols', born:1931})
CREATE
(Robin)-[:ACTED_IN {roles:['Armand Goldman']}]->(TheBirdcage),
(Nathan)-[:ACTED_IN {roles:['Albert Goldman']}]->(TheBirdcage),
(Gene)-[:ACTED_IN {roles:['Sen. Kevin Keeley']}]->(TheBirdcage),
(MikeN)-[:DIRECTED]->(TheBirdcage)

CREATE (Unforgiven:Movie {title:'Unforgiven', released:1992, tagline:"It's a hell of a thing, killing a man"})
CREATE (RichardH:Person {name:'Richard Harris', born:1930})
CREATE (ClintE:Person {name:'Clint Eastwood', born:1930})
CREATE
(RichardH)-[:ACTED_IN {roles:['English Bob']}]->(Unforgiven),
(ClintE)-[:ACTED_IN {roles:['Bill Munny']}]->(Unforgiven),
(Gene)-[:ACTED_IN {roles:['Little Bill Daggett']}]->(Unforgiven),
(ClintE)-[:DIRECTED]->(Unforgiven)

CREATE (JohnnyMnemonic:Movie {title:'Johnny Mnemonic', released:1995, tagline:'The hottest data on earth. In the coolest head in town'})
CREATE (Takeshi:Person {name:'Takeshi Kitano', born:1947})
CREATE (Dina:Person {name:'Dina Meyer', born:1968})
CREATE (IceT:Person {name:'Ice-T', born:1958})
CREATE (RobertL:Person {name:'Robert Longo', born:1953})
CREATE
(Keanu)-[:ACTED_IN {roles:['Johnny Mnemonic']}]->(JohnnyMnemonic),
(Takeshi)-[:ACTED_IN {roles:['Takahashi']}]->(JohnnyMnemonic),
(Dina)-[:ACTED_IN {roles:['Jane']}]->(JohnnyMnemonic),
(IceT)-[:ACTED_IN {roles:['J-Bone']}]->(JohnnyMnemonic),
(RobertL)-[:DIRECTED]->(JohnnyMnemonic)

CREATE (CloudAtlas:Movie {title:'Cloud Atlas', released:2012, tagline:'Everything is connected'})
CREATE (HalleB:Person {name:'Halle Berry', born:1966})
CREATE (JimB:Person {name:'Jim Broadbent', born:1949})
CREATE (TomT:Person {name:'Tom Tykwer', born:1965})
CREATE (DavidMitchell:Person {name:'David Mitchell', born:1969})
CREATE (StefanArndt:Person {name:'Stefan Arndt', born:1961})
CREATE
(TomH)-[:ACTED_IN {roles:['Zachry', 'Dr. Henry Goose', 'Isaac Sachs', 'Dermot Hoggins']}]->(CloudAtlas),
(Hugo)-[:ACTED_IN {roles:['Bill Smoke', 'Haskell Moore', 'Tadeusz Kesselring', 'Nurse Noakes', 'Boardman Mephi', 'Old Georgie']}]->(CloudAtlas),
(HalleB)-[:ACTED_IN {roles:['Luisa Rey', 'Jocasta Ayrs', 'Ovid', 'Meronym']}]->(CloudAtlas),
(JimB)-[:ACTED_IN {roles:['Vyvyan Ayrs', 'Captain Molyneux', 'Timothy Cavendish']}]->(CloudAtlas),
(TomT)-[:DIRECTED]->(CloudAtlas),
(LillyW)-[:DIRECTED]->(CloudAtlas),
(LanaW)-[:DIRECTED]->(CloudAtlas),
(DavidMitchell)-[:WROTE]->(CloudAtlas),
(StefanArndt)-[:PRODUCED]->(CloudAtlas)

CREATE (TheDaVinciCode:Movie {title:'The Da Vinci Code', released:2006, tagline:'Break The Codes'})
CREATE (IanM:Person {name:'Ian McKellen', born:1939})
CREATE (AudreyT:Person {name:'Audrey Tautou', born:1976})
CREATE (PaulB:Person {name:'Paul Bettany', born:1971})
CREATE (RonH:Person {name:'Ron Howard', born:1954})
CREATE
(TomH)-[:ACTED_IN {roles:['Dr. Robert Langdon']}]->(TheDaVinciCode),
(IanM)-[:ACTED_IN {roles:['Sir Leight Teabing']}]->(TheDaVinciCode),
(AudreyT)-[:ACTED_IN {roles:['Sophie Neveu']}]->(TheDaVinciCode),
(PaulB)-[:ACTED_IN {roles:['Silas']}]->(TheDaVinciCode),
(RonH)-[:DIRECTED]->(TheDaVinciCode)

CREATE (VforVendetta:Movie {title:'V for Vendetta', released:2006, tagline:'Freedom! Forever!'})
CREATE (NatalieP:Person {name:'Natalie Portman', born:1981})
CREATE (StephenR:Person {name:'Stephen Rea', born:1946})
CREATE (JohnH:Person {name:'John Hurt', born:1940})
CREATE (BenM:Person {name: 'Ben Miles', born:1967})
CREATE
(Hugo)-[:ACTED_IN {roles:['V']}]->(VforVendetta),
(NatalieP)-[:ACTED_IN {roles:['Evey Hammond']}]->(VforVendetta),
(StephenR)-[:ACTED_IN {roles:['Eric Finch']}]->(VforVendetta),
(JohnH)-[:ACTED_IN {roles:['High Chancellor Adam Sutler']}]->(VforVendetta),
(BenM)-[:ACTED_IN {roles:['Dascomb']}]->(VforVendetta),
(JamesM)-[:DIRECTED]->(VforVendetta),
(LillyW)-[:PRODUCED]->(VforVendetta),
(LanaW)-[:PRODUCED]->(VforVendetta),
(JoelS)-[:PRODUCED]->(VforVendetta),
(LillyW)-[:WROTE]->(VforVendetta),
(LanaW)-[:WROTE]->(VforVendetta)

CREATE (SpeedRacer:Movie {title:'Speed Racer', released:2008, tagline:'Speed has no limits'})
CREATE (EmileH:Person {name:'Emile Hirsch', born:1985})
CREATE (JohnG:Person {name:'John Goodman', born:1960})
CREATE (SusanS:Person {name:'Susan Sarandon', born:1946})
CREATE (MatthewF:Person {name:'Matthew Fox', born:1966})
CREATE (ChristinaR:Person {name:'Christina Ricci', born:1980})
CREATE (Rain:Person {name:'Rain', born:1982})
CREATE
(EmileH)-[:ACTED_IN {roles:['Speed Racer']}]->(SpeedRacer),
(JohnG)-[:ACTED_IN {roles:['Pops']}]->(SpeedRacer),
(SusanS)-[:ACTED_IN {roles:['Mom']}]->(SpeedRacer),
(MatthewF)-[:ACTED_IN {roles:['Racer X']}]->(SpeedRacer),
(ChristinaR)-[:ACTED_IN {roles:['Trixie']}]->(SpeedRacer),
(Rain)-[:ACTED_IN {roles:['Taejo Togokahn']}]->(SpeedRacer),
(BenM)-[:ACTED_IN {roles:['Cass Jones']}]->(SpeedRacer),
(LillyW)-[:DIRECTED]->(SpeedRacer),
(LanaW)-[:DIRECTED]->(SpeedRacer),
(LillyW)-[:WROTE]->(SpeedRacer),
(LanaW)-[:WROTE]->(SpeedRacer),
(JoelS)-[:PRODUCED]->(SpeedRacer)

CREATE (NinjaAssassin:Movie {title:'Ninja Assassin', released:2009, tagline:'Prepare to enter a secret world of assassins'})
CREATE (NaomieH:Person {name:'Naomie Harris'})
CREATE
(Rain)-[:ACTED_IN {roles:['Raizo']}]->(NinjaAssassin),
(NaomieH)-[:ACTED_IN {roles:['Mika Coretti']}]->(NinjaAssassin),
(RickY)-[:ACTED_IN {roles:['Takeshi']}]->(NinjaAssassin),
(BenM)-[:ACTED_IN {roles:['Ryan Maslow']}]->(NinjaAssassin),
(JamesM)-[:DIRECTED]->(NinjaAssassin),
(LillyW)-[:PRODUCED]->(NinjaAssassin),
(LanaW)-[:PRODUCED]->(NinjaAssassin),
(JoelS)-[:PRODUCED]->(NinjaAssassin)

CREATE (TheGreenMile:Movie {title:'The Green Mile', released:1999, tagline:"Walk a mile you'll never forget."})
CREATE (MichaelD:Person {name:'Michael Clarke Duncan', born:1957})
CREATE (DavidM:Person {name:'David Morse', born:1953})
CREATE (SamR:Person {name:'Sam Rockwell', born:1968})
CREATE (GaryS:Person {name:'Gary Sinise', born:1955})
CREATE (PatriciaC:Person {name:'Patricia Clarkson', born:1959})
CREATE (FrankD:Person {name:'Frank Darabont', born:1959})
CREATE
(TomH)-[:ACTED_IN {roles:['Paul Edgecomb']}]->(TheGreenMile),
(MichaelD)-[:ACTED_IN {roles:['John Coffey']}]->(TheGreenMile),
(DavidM)-[:ACTED_IN {roles:['Brutus "Brutal" Howell']}]->(TheGreenMile),
(BonnieH)-[:ACTED_IN {roles:['Jan Edgecomb']}]->(TheGreenMile),
(JamesC)-[:ACTED_IN {roles:['Warden Hal Moores']}]->(TheGreenMile),
(SamR)-[:ACTED_IN {roles:['"Wild Bill" Wharton']}]->(TheGreenMile),
(GaryS)-[:ACTED_IN {roles:['Burt Hammersmith']}]->(TheGreenMile),
(PatriciaC)-[:ACTED_IN {roles:['Melinda Moores']}]->(TheGreenMile),
(FrankD)-[:DIRECTED]->(TheGreenMile)

CREATE (FrostNixon:Movie {title:'Frost/Nixon', released:2008, tagline:'400 million people were waiting for the truth.'})
CREATE (FrankL:Person {name:'Frank Langella', born:1938})
CREATE (MichaelS:Person {name:'Michael Sheen', born:1969})
CREATE (OliverP:Person {name:'Oliver Platt', born:1960})
CREATE
(FrankL)-[:ACTED_IN {roles:['Richard Nixon']}]->(FrostNixon),
(MichaelS)-[:ACTED_IN {roles:['David Frost']}]->(FrostNixon),
(KevinB)-[:ACTED_IN {roles:['Jack Brennan']}]->(FrostNixon),
(OliverP)-[:ACTED_IN {roles:['Bob Zelnick']}]->(FrostNixon),
(SamR)-[:ACTED_IN {roles:['James Reston, Jr.']}]->(FrostNixon),
(RonH)-[:DIRECTED]->(FrostNixon)

CREATE (Hoffa:Movie {title:'Hoffa', released:1992, tagline:"He didn't want law. He wanted justice."})
CREATE (DannyD:Person {name:'Danny DeVito', born:1944})
CREATE (JohnR:Person {name:'John C. Reilly', born:1965})
CREATE
(JackN)-[:ACTED_IN {roles:['Hoffa']}]->(Hoffa),
(DannyD)-[:ACTED_IN {roles:['Robert "Bobby" Ciaro']}]->(Hoffa),
(JTW)-[:ACTED_IN {roles:['Frank Fitzsimmons']}]->(Hoffa),
(JohnR)-[:ACTED_IN {roles:['Peter "Pete" Connelly']}]->(Hoffa),
(DannyD)-[:DIRECTED]->(Hoffa)

CREATE (Apollo13:Movie {title:'Apollo 13', released:1995, tagline:'Houston, we have a problem.'})
CREATE (EdH:Person {name:'Ed Harris', born:1950})
CREATE (BillPax:Person {name:'Bill Paxton', born:1955})
CREATE
(TomH)-[:ACTED_IN {roles:['Jim Lovell']}]->(Apollo13),
(KevinB)-[:ACTED_IN {roles:['Jack Swigert']}]->(Apollo13),
(EdH)-[:ACTED_IN {roles:['Gene Kranz']}]->(Apollo13),
(BillPax)-[:ACTED_IN {roles:['Fred Haise']}]->(Apollo13),
(GaryS)-[:ACTED_IN {roles:['Ken Mattingly']}]->(Apollo13),
(RonH)-[:DIRECTED]->(Apollo13)

CREATE (Twister:Movie {title:'Twister', released:1996, tagline:"Don't Breathe. Don't Look Back."})
CREATE (PhilipH:Person {name:'Philip Seymour Hoffman', born:1967})
CREATE (JanB:Person {name:'Jan de Bont', born:1943})
CREATE
(BillPax)-[:ACTED_IN {roles:['Bill Harding']}]->(Twister),
(HelenH)-[:ACTED_IN {roles:['Dr. Jo Harding']}]->(Twister),
(ZachG)-[:ACTED_IN {roles:['Eddie']}]->(Twister),
(PhilipH)-[:ACTED_IN {roles:['Dustin "Dusty" Davis']}]->(Twister),
(JanB)-[:DIRECTED]->(Twister)

CREATE (CastAway:Movie {title:'Cast Away', released:2000, tagline:'At the edge of the world, his journey begins.'})
CREATE (RobertZ:Person {name:'Robert Zemeckis', born:1951})
CREATE
(TomH)-[:ACTED_IN {roles:['Chuck Noland']}]->(CastAway),
(HelenH)-[:ACTED_IN {roles:['Kelly Frears']}]->(CastAway),
(RobertZ)-[:DIRECTED]->(CastAway)

CREATE (OneFlewOvertheCuckoosNest:Movie {title:"One Flew Over the Cuckoo's Nest", released:1975, tagline:"If he's crazy, what does that make you?"})
CREATE (MilosF:Person {name:'Milos Forman', born:1932})
CREATE
(JackN)-[:ACTED_IN {roles:['Randle McMurphy']}]->(OneFlewOvertheCuckoosNest),
(DannyD)-[:ACTED_IN {roles:['Martini']}]->(OneFlewOvertheCuckoosNest),
(MilosF)-[:DIRECTED]->(OneFlewOvertheCuckoosNest)

CREATE (SomethingsGottaGive:Movie {title:"Something's Gotta Give", released:2003})
CREATE (DianeK:Person {name:'Diane Keaton', born:1946})
CREATE (NancyM:Person {name:'Nancy Meyers', born:1949})
CREATE
(JackN)-[:ACTED_IN {roles:['Harry Sanborn']}]->(SomethingsGottaGive),
(DianeK)-[:ACTED_IN {roles:['Erica Barry']}]->(SomethingsGottaGive),
(Keanu)-[:ACTED_IN {roles:['Julian Mercer']}]->(SomethingsGottaGive),
(NancyM)-[:DIRECTED]->(SomethingsGottaGive),
(NancyM)-[:PRODUCED]->(SomethingsGottaGive),
(NancyM)-[:WROTE]->(SomethingsGottaGive)

CREATE (BicentennialMan:Movie {title:'Bicentennial Man', released:1999, tagline:"One robot's 200 year journey to become an ordinary man."})
CREATE (ChrisC:Person {name:'Chris Columbus', born:1958})
CREATE
(Robin)-[:ACTED_IN {roles:['Andrew Marin']}]->(BicentennialMan),
(OliverP)-[:ACTED_IN {roles:['Rupert Burns']}]->(BicentennialMan),
(ChrisC)-[:DIRECTED]->(BicentennialMan)

CREATE (CharlieWilsonsWar:Movie {title:"Charlie Wilson's War", released:2007, tagline:"A stiff drink. A little mascara. A lot of nerve. Who said they couldn't bring down the Soviet empire."})
CREATE (JuliaR:Person {name:'Julia Roberts', born:1967})
CREATE
(TomH)-[:ACTED_IN {roles:['Rep. Charlie Wilson']}]->(CharlieWilsonsWar),
(JuliaR)-[:ACTED_IN {roles:['Joanne Herring']}]->(CharlieWilsonsWar),
(PhilipH)-[:ACTED_IN {roles:['Gust Avrakotos']}]->(CharlieWilsonsWar),
(MikeN)-[:DIRECTED]->(CharlieWilsonsWar)

CREATE (ThePolarExpress:Movie {title:'The Polar Express', released:2004, tagline:'This Holiday Season... Believe'})
CREATE
(TomH)-[:ACTED_IN {roles:['Hero Boy', 'Father', 'Conductor', 'Hobo', 'Scrooge', 'Santa Claus']}]->(ThePolarExpress),
(RobertZ)-[:DIRECTED]->(ThePolarExpress)

CREATE (ALeagueofTheirOwn:Movie {title:'A League of Their Own', released:1992, tagline:'Once in a lifetime you get a chance to do something different.'})
CREATE (Madonna:Person {name:'Madonna', born:1954})
CREATE (GeenaD:Person {name:'Geena Davis', born:1956})
CREATE (LoriP:Person {name:'Lori Petty', born:1963})
CREATE (PennyM:Person {name:'Penny Marshall', born:1943})
CREATE
(TomH)-[:ACTED_IN {roles:['Jimmy Dugan']}]->(ALeagueofTheirOwn),
(GeenaD)-[:ACTED_IN {roles:['Dottie Hinson']}]->(ALeagueofTheirOwn),
(LoriP)-[:ACTED_IN {roles:['Kit Keller']}]->(ALeagueofTheirOwn),
(RosieO)-[:ACTED_IN {roles:['Doris Murphy']}]->(ALeagueofTheirOwn),
(Madonna)-[:ACTED_IN {roles:['"All the Way" Mae Mordabito']}]->(ALeagueofTheirOwn),
(BillPax)-[:ACTED_IN {roles:['Bob Hinson']}]->(ALeagueofTheirOwn),
(PennyM)-[:DIRECTED]->(ALeagueofTheirOwn)

CREATE (PaulBlythe:Person {name:'Paul Blythe'})
CREATE (AngelaScope:Person {name:'Angela Scope'})
CREATE (JessicaThompson:Person {name:'Jessica Thompson'})
CREATE (JamesThompson:Person {name:'James Thompson'})

CREATE
(JamesThompson)-[:FOLLOWS]->(JessicaThompson),
(AngelaScope)-[:FOLLOWS]->(JessicaThompson),
(PaulBlythe)-[:FOLLOWS]->(AngelaScope)

CREATE
(JessicaThompson)-[:REVIEWED {summary:'An amazing journey', rating:95}]->(CloudAtlas),
(JessicaThompson)-[:REVIEWED {summary:'Silly, but fun', rating:65}]->(TheReplacements),
(JamesThompson)-[:REVIEWED {summary:'The coolest football movie ever', rating:100}]->(TheReplacements),
(AngelaScope)-[:REVIEWED {summary:'Pretty funny at times', rating:62}]->(TheReplacements),
(JessicaThompson)-[:REVIEWED {summary:'Dark, but compelling', rating:85}]->(Unforgiven),
(JessicaThompson)-[:REVIEWED {summary:"Slapstick redeemed only by the Robin Williams and Gene Hackman's stellar performances", rating:45}]->(TheBirdcage),
(JessicaThompson)-[:REVIEWED {summary:'A solid romp', rating:68}]->(TheDaVinciCode),
(JamesThompson)-[:REVIEWED {summary:'Fun, but a little far fetched', rating:65}]->(TheDaVinciCode),
(JessicaThompson)-[:REVIEWED {summary:'You had me at Jerry', rating:92}]->(JerryMaguire)

WITH TomH as a
MATCH (a)-[:ACTED_IN]->(m)<-[:DIRECTED]-(d) RETURN a,m,d LIMIT 10;`;

export const testData = {
  mockSchema,
  largeQuery,
};
