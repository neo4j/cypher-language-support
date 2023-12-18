export const dummyDbSchema = {
  functionSignatures: {
    abs: {
      label: 'abs',
      documentation: 'Returns the absolute value of a floating point number.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT?',
        },
      ],
    },
    acos: {
      label: 'acos',
      documentation: 'Returns the arccosine of a number in radians.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT?',
        },
      ],
    },
    all: {
      label: 'all',
      documentation:
        'Returns true if the predicate holds for all elements in the given list.',
      parameters: [
        {
          label: 'variable',
          documentation: 'variable :: ANY?',
        },
        {
          label: 'list',
          documentation: 'list :: LIST? OF ANY?',
        },
      ],
    },
    any: {
      label: 'any',
      documentation:
        'Returns true if the predicate holds for at least one element in the given list.',
      parameters: [
        {
          label: 'variable',
          documentation: 'variable :: ANY?',
        },
        {
          label: 'list',
          documentation: 'list :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.agg.first': {
      label: 'apoc.agg.first',
      documentation: 'Returns the first value from the given collection.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
      ],
    },
    'apoc.agg.graph': {
      label: 'apoc.agg.graph',
      documentation:
        'Returns all distinct nodes and relationships collected into a map with the keys `nodes` and `relationships`.',
      parameters: [
        {
          label: 'path',
          documentation: 'path :: ANY?',
        },
      ],
    },
    'apoc.agg.last': {
      label: 'apoc.agg.last',
      documentation: 'Returns the last value from the given collection.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
      ],
    },
    'apoc.agg.maxItems': {
      label: 'apoc.agg.maxItems',
      documentation:
        'Returns a map {items:[], value:n} where the `value` key is the maximum value present, and `items` represent all items with the same value.',
      parameters: [
        {
          label: 'items',
          documentation: 'items :: ANY?',
        },
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
        {
          label: 'groupLimit',
          documentation: 'groupLimit = -1 :: INTEGER?',
        },
      ],
    },
    'apoc.agg.median': {
      label: 'apoc.agg.median',
      documentation:
        'Returns the mathematical median for all non-null numeric values.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
      ],
    },
    'apoc.agg.minItems': {
      label: 'apoc.agg.minItems',
      documentation:
        'Returns a map {items:[], value:n} where the `value` key is the minimum value present, and `items` represent all items with the same value.',
      parameters: [
        {
          label: 'items',
          documentation: 'items :: ANY?',
        },
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
        {
          label: 'groupLimit',
          documentation: 'groupLimit = -1 :: INTEGER?',
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
          documentation: 'value :: ANY?',
        },
        {
          label: 'offset',
          documentation: 'offset :: INTEGER?',
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
          documentation: 'value :: NUMBER?',
        },
        {
          label: 'percentiles',
          documentation:
            'percentiles = [0.5, 0.75, 0.9, 0.95, 0.99] :: LIST? OF FLOAT?',
        },
      ],
    },
    'apoc.agg.product': {
      label: 'apoc.agg.product',
      documentation:
        'Returns the product of all non-null numerical values in the collection.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: NUMBER?',
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
          documentation: 'value :: ANY?',
        },
        {
          label: 'from',
          documentation: 'from = 0 :: INTEGER?',
        },
        {
          label: 'to',
          documentation: 'to = -1 :: INTEGER?',
        },
      ],
    },
    'apoc.agg.statistics': {
      label: 'apoc.agg.statistics',
      documentation:
        'Returns the following statistics on the numerical values in the given collection: percentiles, min, minNonZero, max, total, mean, stdev.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: NUMBER?',
        },
        {
          label: 'percentiles',
          documentation:
            'percentiles = [0.5, 0.75, 0.9, 0.95, 0.99] :: LIST? OF FLOAT?',
        },
      ],
    },
    'apoc.any.isDeleted': {
      label: 'apoc.any.isDeleted',
      documentation:
        'Returns true if the given node or relationship no longer exists.',
      parameters: [
        {
          label: 'object',
          documentation: 'object :: ANY?',
        },
      ],
    },
    'apoc.any.properties': {
      label: 'apoc.any.properties',
      documentation:
        'Returns all properties of the given object.\nThe object can be a virtual node, a real node, a virtual relationship, a real relationship, or a map.',
      parameters: [
        {
          label: 'object',
          documentation: 'object :: ANY?',
        },
        {
          label: 'keys',
          documentation: 'keys = null :: LIST? OF STRING?',
        },
      ],
    },
    'apoc.any.property': {
      label: 'apoc.any.property',
      documentation:
        'Returns the property for the given key from an object.\nThe object can be a virtual node, a real node, a virtual relationship, a real relationship, or a map.',
      parameters: [
        {
          label: 'object',
          documentation: 'object :: ANY?',
        },
        {
          label: 'key',
          documentation: 'key :: STRING?',
        },
      ],
    },
    'apoc.bitwise.op': {
      label: 'apoc.bitwise.op',
      documentation: 'Returns the result of the bitwise operation',
      parameters: [
        {
          label: 'a',
          documentation: 'a :: INTEGER?',
        },
        {
          label: 'operator',
          documentation: 'operator :: STRING?',
        },
        {
          label: 'b',
          documentation: 'b :: INTEGER?',
        },
      ],
    },
    'apoc.coll.avg': {
      label: 'apoc.coll.avg',
      documentation: 'Returns the average of the numbers in the list.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF NUMBER?',
        },
      ],
    },
    'apoc.coll.combinations': {
      label: 'apoc.coll.combinations',
      documentation:
        'Returns a collection of all combinations of list elements between the selection size minSelect and maxSelect (default: minSelect).',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
        {
          label: 'minSelect',
          documentation: 'minSelect :: INTEGER?',
        },
        {
          label: 'maxSelect',
          documentation: 'maxSelect = -1 :: INTEGER?',
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
          documentation: 'coll :: LIST? OF ANY?',
        },
        {
          label: 'value',
          documentation: 'value :: ANY?',
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
          documentation: 'coll1 :: LIST? OF ANY?',
        },
        {
          label: 'coll2',
          documentation: 'coll2 :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.coll.containsAllSorted': {
      label: 'apoc.coll.containsAllSorted',
      documentation:
        'Returns whether or not all of the given values in the second list exist in an already sorted collection (using a binary search).',
      parameters: [
        {
          label: 'coll1',
          documentation: 'coll1 :: LIST? OF ANY?',
        },
        {
          label: 'coll2',
          documentation: 'coll2 :: LIST? OF ANY?',
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
          documentation: 'coll :: LIST? OF ANY?',
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
          documentation: 'coll :: LIST? OF ANY?',
        },
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
      ],
    },
    'apoc.coll.different': {
      label: 'apoc.coll.different',
      documentation:
        'Returns true if all the values in the given list are unique.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.coll.disjunction': {
      label: 'apoc.coll.disjunction',
      documentation: 'Returns the disjunct set of two lists.',
      parameters: [
        {
          label: 'list1',
          documentation: 'list1 :: LIST? OF ANY?',
        },
        {
          label: 'list2',
          documentation: 'list2 :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.coll.dropDuplicateNeighbors': {
      label: 'apoc.coll.dropDuplicateNeighbors',
      documentation: 'Removes duplicate consecutive objects in the list.',
      parameters: [
        {
          label: 'list',
          documentation: 'list :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.coll.duplicates': {
      label: 'apoc.coll.duplicates',
      documentation: 'Returns a list of duplicate items in the collection.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.coll.duplicatesWithCount': {
      label: 'apoc.coll.duplicatesWithCount',
      documentation:
        'Returns a list of duplicate items in the collection and their count, keyed by `item` and `count`.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.coll.fill': {
      label: 'apoc.coll.fill',
      documentation: 'Returns a list with the given count of items.',
      parameters: [
        {
          label: 'items',
          documentation: 'items :: STRING?',
        },
        {
          label: 'count',
          documentation: 'count :: INTEGER?',
        },
      ],
    },
    'apoc.coll.flatten': {
      label: 'apoc.coll.flatten',
      documentation:
        'Flattens the given list (to flatten nested lists, set recursive to true).',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
        {
          label: 'recursive',
          documentation: 'recursive = false :: BOOLEAN?',
        },
      ],
    },
    'apoc.coll.frequencies': {
      label: 'apoc.coll.frequencies',
      documentation:
        'Returns a list of frequencies of the items in the collection, keyed by `item` and `count`.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.coll.frequenciesAsMap': {
      label: 'apoc.coll.frequenciesAsMap',
      documentation:
        'Returns a map of frequencies of the items in the collection, keyed by `item` and `count`.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.coll.indexOf': {
      label: 'apoc.coll.indexOf',
      documentation:
        'Returns the index for the first occurrence of the specified value in the list.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
      ],
    },
    'apoc.coll.insert': {
      label: 'apoc.coll.insert',
      documentation: 'Inserts a value into the specified index in the list.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
        {
          label: 'index',
          documentation: 'index :: INTEGER?',
        },
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
      ],
    },
    'apoc.coll.insertAll': {
      label: 'apoc.coll.insertAll',
      documentation:
        'Inserts all of the values into the list, starting at the specified index.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
        {
          label: 'index',
          documentation: 'index :: INTEGER?',
        },
        {
          label: 'values',
          documentation: 'values :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.coll.intersection': {
      label: 'apoc.coll.intersection',
      documentation: 'Returns the distinct intersection of two lists.',
      parameters: [
        {
          label: 'list1',
          documentation: 'list1 :: LIST? OF ANY?',
        },
        {
          label: 'list2',
          documentation: 'list2 :: LIST? OF ANY?',
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
          documentation: 'coll :: LIST? OF ANY?',
        },
        {
          label: 'values',
          documentation: 'values :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.coll.max': {
      label: 'apoc.coll.max',
      documentation: 'Returns the maximum of all values in the given list.',
      parameters: [
        {
          label: 'values',
          documentation: 'values :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.coll.min': {
      label: 'apoc.coll.min',
      documentation: 'Returns the minimum of all values in the given list.',
      parameters: [
        {
          label: 'values',
          documentation: 'values :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.coll.occurrences': {
      label: 'apoc.coll.occurrences',
      documentation: 'Returns the count of the given item in the collection.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
        {
          label: 'item',
          documentation: 'item :: ANY?',
        },
      ],
    },
    'apoc.coll.pairWithOffset': {
      label: 'apoc.coll.pairWithOffset',
      documentation: 'Returns a list of pairs defined by the offset.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
        {
          label: 'offset',
          documentation: 'offset :: INTEGER?',
        },
      ],
    },
    'apoc.coll.pairs': {
      label: 'apoc.coll.pairs',
      documentation:
        'Returns a list of adjacent elements in the list ([1,2],[2,3],[3,null]).',
      parameters: [
        {
          label: 'list',
          documentation: 'list :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.coll.pairsMin': {
      label: 'apoc.coll.pairsMin',
      documentation:
        'Returns lists of adjacent elements in the list ([1,2],[2,3]), skipping the final element.',
      parameters: [
        {
          label: 'list',
          documentation: 'list :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.coll.partition': {
      label: 'apoc.coll.partition',
      documentation:
        'Partitions the original list into sub-lists of the given batch size.\nThe final list may be smaller than the given batch size.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
        {
          label: 'batchSize',
          documentation: 'batchSize :: INTEGER?',
        },
      ],
    },
    'apoc.coll.randomItem': {
      label: 'apoc.coll.randomItem',
      documentation:
        'Returns a random item from the list, or null on an empty or null list.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.coll.randomItems': {
      label: 'apoc.coll.randomItems',
      documentation:
        'Returns a list of itemCount random items from the original list (optionally allowing elements in the original list to be selected more than once).',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
        {
          label: 'itemCount',
          documentation: 'itemCount :: INTEGER?',
        },
        {
          label: 'allowRepick',
          documentation: 'allowRepick = false :: BOOLEAN?',
        },
      ],
    },
    'apoc.coll.remove': {
      label: 'apoc.coll.remove',
      documentation:
        'Removes a range of values from the list, beginning at position index for the given length of values.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
        {
          label: 'index',
          documentation: 'index :: INTEGER?',
        },
        {
          label: 'length',
          documentation: 'length = 1 :: INTEGER?',
        },
      ],
    },
    'apoc.coll.removeAll': {
      label: 'apoc.coll.removeAll',
      documentation:
        'Returns the first list with all elements of the second list removed.',
      parameters: [
        {
          label: 'list1',
          documentation: 'list1 :: LIST? OF ANY?',
        },
        {
          label: 'list2',
          documentation: 'list2 :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.coll.runningTotal': {
      label: 'apoc.coll.runningTotal',
      documentation: 'Returns an accumulative array.',
      parameters: [
        {
          label: 'list',
          documentation: 'list :: LIST? OF NUMBER?',
        },
      ],
    },
    'apoc.coll.set': {
      label: 'apoc.coll.set',
      documentation: 'Sets the element at the given index to the new value.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
        {
          label: 'index',
          documentation: 'index :: INTEGER?',
        },
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
      ],
    },
    'apoc.coll.shuffle': {
      label: 'apoc.coll.shuffle',
      documentation: 'Returns the list shuffled.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.coll.sort': {
      label: 'apoc.coll.sort',
      documentation: 'Sorts the given list into ascending order.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.coll.sortMaps': {
      label: 'apoc.coll.sortMaps',
      documentation:
        'Sorts the given list into ascending order, based on the map property indicated by `prop`.',
      parameters: [
        {
          label: 'list',
          documentation: 'list :: LIST? OF MAP?',
        },
        {
          label: 'prop',
          documentation: 'prop :: STRING?',
        },
      ],
    },
    'apoc.coll.sortMulti': {
      label: 'apoc.coll.sortMulti',
      documentation:
        'Sorts the given list of maps by the given fields.\nTo indicate that a field should be sorted according to ascending values, prefix it with a caret (^).\nIt is also possible to add limits to the list and to skip values.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF MAP?',
        },
        {
          label: 'orderFields',
          documentation: 'orderFields = [] :: LIST? OF STRING?',
        },
        {
          label: 'limit',
          documentation: 'limit = -1 :: INTEGER?',
        },
        {
          label: 'skip',
          documentation: 'skip = 0 :: INTEGER?',
        },
      ],
    },
    'apoc.coll.sortNodes': {
      label: 'apoc.coll.sortNodes',
      documentation:
        'Sorts the given list of nodes by their property into ascending order.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF NODE?',
        },
        {
          label: 'prop',
          documentation: 'prop :: STRING?',
        },
      ],
    },
    'apoc.coll.sortText': {
      label: 'apoc.coll.sortText',
      documentation: 'Sorts the given list of strings into ascending order.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF STRING?',
        },
        {
          label: 'conf',
          documentation: 'conf = {} :: MAP?',
        },
      ],
    },
    'apoc.coll.stdev': {
      label: 'apoc.coll.stdev',
      documentation:
        'Returns sample or population standard deviation with isBiasCorrected true or false respectively.',
      parameters: [
        {
          label: 'list',
          documentation: 'list :: LIST? OF NUMBER?',
        },
        {
          label: 'isBiasCorrected',
          documentation: 'isBiasCorrected = true :: BOOLEAN?',
        },
      ],
    },
    'apoc.coll.subtract': {
      label: 'apoc.coll.subtract',
      documentation:
        'Returns the first list as a set with all the elements of the second list removed.',
      parameters: [
        {
          label: 'list1',
          documentation: 'list1 :: LIST? OF ANY?',
        },
        {
          label: 'list2',
          documentation: 'list2 :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.coll.sum': {
      label: 'apoc.coll.sum',
      documentation: 'Returns the sum of all the numbers in the list.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF NUMBER?',
        },
      ],
    },
    'apoc.coll.sumLongs': {
      label: 'apoc.coll.sumLongs',
      documentation: 'Returns the sum of all the numbers in the list.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF NUMBER?',
        },
      ],
    },
    'apoc.coll.toSet': {
      label: 'apoc.coll.toSet',
      documentation: 'Returns a unique list from the given list.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.coll.union': {
      label: 'apoc.coll.union',
      documentation: 'Returns the distinct union of the two given lists.',
      parameters: [
        {
          label: 'list1',
          documentation: 'list1 :: LIST? OF ANY?',
        },
        {
          label: 'list2',
          documentation: 'list2 :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.coll.unionAll': {
      label: 'apoc.coll.unionAll',
      documentation:
        'Returns the full union of the two given lists (duplicates included).',
      parameters: [
        {
          label: 'list1',
          documentation: 'list1 :: LIST? OF ANY?',
        },
        {
          label: 'list2',
          documentation: 'list2 :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.coll.zip': {
      label: 'apoc.coll.zip',
      documentation:
        'Returns the two given lists zipped together as a list of lists.',
      parameters: [
        {
          label: 'list1',
          documentation: 'list1 :: LIST? OF ANY?',
        },
        {
          label: 'list2',
          documentation: 'list2 :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.convert.fromJsonList': {
      label: 'apoc.convert.fromJsonList',
      documentation: 'Converts the given JSON list into a Cypher list.',
      parameters: [
        {
          label: 'list',
          documentation: 'list :: STRING?',
        },
        {
          label: 'path',
          documentation: 'path =  :: STRING?',
        },
        {
          label: 'pathOptions',
          documentation: 'pathOptions = null :: LIST? OF STRING?',
        },
      ],
    },
    'apoc.convert.fromJsonMap': {
      label: 'apoc.convert.fromJsonMap',
      documentation: 'Converts the given JSON map into a Cypher map.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: STRING?',
        },
        {
          label: 'path',
          documentation: 'path =  :: STRING?',
        },
        {
          label: 'pathOptions',
          documentation: 'pathOptions = null :: LIST? OF STRING?',
        },
      ],
    },
    'apoc.convert.getJsonProperty': {
      label: 'apoc.convert.getJsonProperty',
      documentation:
        'Converts a serialized JSON object from the property of the given node into the equivalent Cypher structure (e.g. map, list).',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE?',
        },
        {
          label: 'key',
          documentation: 'key :: STRING?',
        },
        {
          label: 'path',
          documentation: 'path =  :: STRING?',
        },
        {
          label: 'pathOptions',
          documentation: 'pathOptions = null :: LIST? OF STRING?',
        },
      ],
    },
    'apoc.convert.getJsonPropertyMap': {
      label: 'apoc.convert.getJsonPropertyMap',
      documentation:
        'Converts a serialized JSON object from the property of the given node into a Cypher map.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE?',
        },
        {
          label: 'key',
          documentation: 'key :: STRING?',
        },
        {
          label: 'path',
          documentation: 'path =  :: STRING?',
        },
        {
          label: 'pathOptions',
          documentation: 'pathOptions = null :: LIST? OF STRING?',
        },
      ],
    },
    'apoc.convert.toJson': {
      label: 'apoc.convert.toJson',
      documentation: 'Serializes the given JSON value.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
      ],
    },
    'apoc.convert.toList': {
      label: 'apoc.convert.toList',
      documentation: 'Converts the given value into a list.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
      ],
    },
    'apoc.convert.toMap': {
      label: 'apoc.convert.toMap',
      documentation: 'Converts the given value into a map.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: ANY?',
        },
      ],
    },
    'apoc.convert.toNode': {
      label: 'apoc.convert.toNode',
      documentation: 'Converts the given value into a node.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: ANY?',
        },
      ],
    },
    'apoc.convert.toNodeList': {
      label: 'apoc.convert.toNodeList',
      documentation: 'Converts the given value into a list of nodes.',
      parameters: [
        {
          label: 'list',
          documentation: 'list :: ANY?',
        },
      ],
    },
    'apoc.convert.toRelationship': {
      label: 'apoc.convert.toRelationship',
      documentation: 'Converts the given value into a relationship.',
      parameters: [
        {
          label: 'rel',
          documentation: 'rel :: ANY?',
        },
      ],
    },
    'apoc.convert.toRelationshipList': {
      label: 'apoc.convert.toRelationshipList',
      documentation: 'Converts the given value into a list of relationships.',
      parameters: [
        {
          label: 'relList',
          documentation: 'relList :: ANY?',
        },
      ],
    },
    'apoc.convert.toSet': {
      label: 'apoc.convert.toSet',
      documentation: 'Converts the given value into a set.',
      parameters: [
        {
          label: 'list',
          documentation: 'list :: ANY?',
        },
      ],
    },
    'apoc.convert.toSortedJsonMap': {
      label: 'apoc.convert.toSortedJsonMap',
      documentation:
        'Converts a serialized JSON object from the property of a given node into a Cypher map.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
        {
          label: 'ignoreCase',
          documentation: 'ignoreCase = true :: BOOLEAN?',
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
        'Takes the given base64 encoded UUID and returns it as a hexadecimal string.',
      parameters: [
        {
          label: 'base64Uuid',
          documentation: 'base64Uuid :: STRING?',
        },
      ],
    },
    'apoc.create.uuidHexToBase64': {
      label: 'apoc.create.uuidHexToBase64',
      documentation:
        'Takes the given UUID represented as a hexadecimal string and returns it encoded with base64.',
      parameters: [
        {
          label: 'uuid',
          documentation: 'uuid :: STRING?',
        },
      ],
    },
    'apoc.create.vNode': {
      label: 'apoc.create.vNode',
      documentation: 'Returns a virtual node.',
      parameters: [
        {
          label: 'labels',
          documentation: 'labels :: LIST? OF STRING?',
        },
        {
          label: 'props',
          documentation: 'props = {} :: MAP?',
        },
      ],
    },
    'apoc.create.vRelationship': {
      label: 'apoc.create.vRelationship',
      documentation: 'Returns a virtual relationship.',
      parameters: [
        {
          label: 'from',
          documentation: 'from :: NODE?',
        },
        {
          label: 'relType',
          documentation: 'relType :: STRING?',
        },
        {
          label: 'props',
          documentation: 'props :: MAP?',
        },
        {
          label: 'to',
          documentation: 'to :: NODE?',
        },
      ],
    },
    'apoc.create.virtual.fromNode': {
      label: 'apoc.create.virtual.fromNode',
      documentation: 'Returns a virtual node from the given existing node.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE?',
        },
        {
          label: 'propertyNames',
          documentation: 'propertyNames :: LIST? OF STRING?',
        },
      ],
    },
    'apoc.cypher.runFirstColumnMany': {
      label: 'apoc.cypher.runFirstColumnMany',
      documentation:
        'Runs the given statement with the given parameters and returns the first column collected into a list.',
      parameters: [
        {
          label: 'statement',
          documentation: 'statement :: STRING?',
        },
        {
          label: 'params',
          documentation: 'params :: MAP?',
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
          documentation: 'statement :: STRING?',
        },
        {
          label: 'params',
          documentation: 'params :: MAP?',
        },
      ],
    },
    'apoc.data.url': {
      label: 'apoc.data.url',
      documentation: 'Turns a URL into a map.',
      parameters: [
        {
          label: 'url',
          documentation: 'url :: STRING?',
        },
      ],
    },
    'apoc.date.add': {
      label: 'apoc.date.add',
      documentation: 'Adds a unit of specified time to the given timestamp.',
      parameters: [
        {
          label: 'time',
          documentation: 'time :: INTEGER?',
        },
        {
          label: 'unit',
          documentation: 'unit :: STRING?',
        },
        {
          label: 'addValue',
          documentation: 'addValue :: INTEGER?',
        },
        {
          label: 'addUnit',
          documentation: 'addUnit :: STRING?',
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
          documentation: 'time :: INTEGER?',
        },
        {
          label: 'unit',
          documentation: 'unit :: STRING?',
        },
        {
          label: 'toUnit',
          documentation: 'toUnit :: STRING?',
        },
      ],
    },
    'apoc.date.convertFormat': {
      label: 'apoc.date.convertFormat',
      documentation:
        'Converts a string of one type of date format into a string of another type of date format.',
      parameters: [
        {
          label: 'temporal',
          documentation: 'temporal :: STRING?',
        },
        {
          label: 'currentFormat',
          documentation: 'currentFormat :: STRING?',
        },
        {
          label: 'convertTo',
          documentation: 'convertTo = yyyy-MM-dd :: STRING?',
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
          documentation: 'time :: INTEGER?',
        },
        {
          label: 'unit',
          documentation: 'unit = d :: STRING?',
        },
        {
          label: 'timezone',
          documentation: 'timezone = UTC :: STRING?',
        },
      ],
    },
    'apoc.date.fields': {
      label: 'apoc.date.fields',
      documentation:
        'Splits the given date into fields returning a map containing the values of each field.',
      parameters: [
        {
          label: 'date',
          documentation: 'date :: STRING?',
        },
        {
          label: 'pattern',
          documentation: 'pattern = yyyy-MM-dd HH:mm:ss :: STRING?',
        },
      ],
    },
    'apoc.date.format': {
      label: 'apoc.date.format',
      documentation:
        'Returns a string representation of the time value.\nThe time unit (default: ms), date format (default: ISO), and time zone (default: current time zone) can all be changed.',
      parameters: [
        {
          label: 'time',
          documentation: 'time :: INTEGER?',
        },
        {
          label: 'unit',
          documentation: 'unit = ms :: STRING?',
        },
        {
          label: 'format',
          documentation: 'format = yyyy-MM-dd HH:mm:ss :: STRING?',
        },
        {
          label: 'timezone',
          documentation: 'timezone =  :: STRING?',
        },
      ],
    },
    'apoc.date.fromISO8601': {
      label: 'apoc.date.fromISO8601',
      documentation:
        'Converts the given date string (ISO8601) to an integer representing the time value in milliseconds.',
      parameters: [
        {
          label: 'time',
          documentation: 'time :: STRING?',
        },
      ],
    },
    'apoc.date.parse': {
      label: 'apoc.date.parse',
      documentation:
        'Parses the given date string from a specified format into the specified time unit.',
      parameters: [
        {
          label: 'time',
          documentation: 'time :: STRING?',
        },
        {
          label: 'unit',
          documentation: 'unit = ms :: STRING?',
        },
        {
          label: 'format',
          documentation: 'format = yyyy-MM-dd HH:mm:ss :: STRING?',
        },
        {
          label: 'timezone',
          documentation: 'timezone =  :: STRING?',
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
        'Returns a string representation of a specified time value in the ISO8601 format.',
      parameters: [
        {
          label: 'time',
          documentation: 'time :: INTEGER?',
        },
        {
          label: 'unit',
          documentation: 'unit = ms :: STRING?',
        },
      ],
    },
    'apoc.date.toYears': {
      label: 'apoc.date.toYears',
      documentation:
        'Converts the given timestamp or the given date into a floating point representing years.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
        {
          label: 'format',
          documentation: 'format = yyyy-MM-dd HH:mm:ss :: STRING?',
        },
      ],
    },
    'apoc.diff.nodes': {
      label: 'apoc.diff.nodes',
      documentation:
        'Returns a list detailing the differences between the two given nodes.',
      parameters: [
        {
          label: 'leftNode',
          documentation: 'leftNode :: NODE?',
        },
        {
          label: 'rightNode',
          documentation: 'rightNode :: NODE?',
        },
      ],
    },
    'apoc.hashing.fingerprint': {
      label: 'apoc.hashing.fingerprint',
      documentation:
        'Calculates a MD5 checksum over a node or a relationship (identical entities share the same checksum).\nUnsuitable for cryptographic use-cases.',
      parameters: [
        {
          label: 'object',
          documentation: 'object :: ANY?',
        },
        {
          label: 'excludedPropertyKeys',
          documentation: 'excludedPropertyKeys = [] :: LIST? OF STRING?',
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
          documentation: 'propertyExcludes = [] :: LIST? OF STRING?',
        },
      ],
    },
    'apoc.hashing.fingerprinting': {
      label: 'apoc.hashing.fingerprinting',
      documentation:
        'Calculates a MD5 checksum over a node or a relationship (identical entities share the same checksum).\nUnlike `apoc.hashing.fingerprint()`, this function supports a number of config parameters.\nUnsuitable for cryptographic use-cases.',
      parameters: [
        {
          label: 'object',
          documentation: 'object :: ANY?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.json.path': {
      label: 'apoc.json.path',
      documentation: 'Returns the given JSON path.',
      parameters: [
        {
          label: 'json',
          documentation: 'json :: STRING?',
        },
        {
          label: 'path',
          documentation: 'path = $ :: STRING?',
        },
        {
          label: 'pathOptions',
          documentation: 'pathOptions = null :: LIST? OF STRING?',
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
          documentation: 'node :: ANY?',
        },
        {
          label: 'label',
          documentation: 'label :: STRING?',
        },
      ],
    },
    'apoc.map.clean': {
      label: 'apoc.map.clean',
      documentation:
        'Filters the keys and values contained in the given lists.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP?',
        },
        {
          label: 'keys',
          documentation: 'keys :: LIST? OF STRING?',
        },
        {
          label: 'values',
          documentation: 'values :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.map.flatten': {
      label: 'apoc.map.flatten',
      documentation:
        'Flattens nested items in the given map.\nThis function is the reverse of the `apoc.map.unflatten` function.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP?',
        },
        {
          label: 'delimiter',
          documentation: 'delimiter = . :: STRING?',
        },
      ],
    },
    'apoc.map.fromLists': {
      label: 'apoc.map.fromLists',
      documentation:
        'Creates a map from the keys and values in the given lists.',
      parameters: [
        {
          label: 'keys',
          documentation: 'keys :: LIST? OF STRING?',
        },
        {
          label: 'values',
          documentation: 'values :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.map.fromNodes': {
      label: 'apoc.map.fromNodes',
      documentation:
        'Returns a map of the given prop to the node of the given label.',
      parameters: [
        {
          label: 'label',
          documentation: 'label :: STRING?',
        },
        {
          label: 'prop',
          documentation: 'prop :: STRING?',
        },
      ],
    },
    'apoc.map.fromPairs': {
      label: 'apoc.map.fromPairs',
      documentation: 'Creates a map from the given list of key-value pairs.',
      parameters: [
        {
          label: 'pairs',
          documentation: 'pairs :: LIST? OF LIST? OF ANY?',
        },
      ],
    },
    'apoc.map.fromValues': {
      label: 'apoc.map.fromValues',
      documentation:
        'Creates a map from the alternating keys and values in the given list.',
      parameters: [
        {
          label: 'values',
          documentation: 'values :: LIST? OF ANY?',
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
          documentation: 'map :: MAP?',
        },
        {
          label: 'key',
          documentation: 'key :: STRING?',
        },
        {
          label: 'value',
          documentation: 'value = null :: ANY?',
        },
        {
          label: 'fail',
          documentation: 'fail = true :: BOOLEAN?',
        },
      ],
    },
    'apoc.map.groupBy': {
      label: 'apoc.map.groupBy',
      documentation:
        'Creates a map of the list keyed by the given property, with single values.',
      parameters: [
        {
          label: 'values',
          documentation: 'values :: LIST? OF ANY?',
        },
        {
          label: 'key',
          documentation: 'key :: STRING?',
        },
      ],
    },
    'apoc.map.groupByMulti': {
      label: 'apoc.map.groupByMulti',
      documentation:
        'Creates a map of the lists keyed by the given property, with the list values.',
      parameters: [
        {
          label: 'values',
          documentation: 'values :: LIST? OF ANY?',
        },
        {
          label: 'key',
          documentation: 'key :: STRING?',
        },
      ],
    },
    'apoc.map.merge': {
      label: 'apoc.map.merge',
      documentation: 'Merges the two given maps into one map.',
      parameters: [
        {
          label: 'map1',
          documentation: 'map1 :: MAP?',
        },
        {
          label: 'map2',
          documentation: 'map2 :: MAP?',
        },
      ],
    },
    'apoc.map.mergeList': {
      label: 'apoc.map.mergeList',
      documentation: 'Merges all maps in the given list into one map.',
      parameters: [
        {
          label: 'maps',
          documentation: 'maps :: LIST? OF MAP?',
        },
      ],
    },
    'apoc.map.mget': {
      label: 'apoc.map.mget',
      documentation:
        'Returns a list of values for the given keys.\nIf one of the keys does not exist, or lacks a default value, this function will throw an exception.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP?',
        },
        {
          label: 'keys',
          documentation: 'keys :: LIST? OF STRING?',
        },
        {
          label: 'values',
          documentation: 'values = [] :: LIST? OF ANY?',
        },
        {
          label: 'fail',
          documentation: 'fail = true :: BOOLEAN?',
        },
      ],
    },
    'apoc.map.removeKey': {
      label: 'apoc.map.removeKey',
      documentation:
        'Removes the given key from the map (recursively if recursive is true).',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP?',
        },
        {
          label: 'key',
          documentation: 'key :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.map.removeKeys': {
      label: 'apoc.map.removeKeys',
      documentation:
        'Removes the given keys from the map (recursively if recursive is true).',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP?',
        },
        {
          label: 'keys',
          documentation: 'keys :: LIST? OF STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.map.setEntry': {
      label: 'apoc.map.setEntry',
      documentation: 'Adds or updates the given entry in the map.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP?',
        },
        {
          label: 'key',
          documentation: 'key :: STRING?',
        },
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
      ],
    },
    'apoc.map.setKey': {
      label: 'apoc.map.setKey',
      documentation: 'Adds or updates the given entry in the map.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP?',
        },
        {
          label: 'key',
          documentation: 'key :: STRING?',
        },
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
      ],
    },
    'apoc.map.setLists': {
      label: 'apoc.map.setLists',
      documentation:
        'Adds or updates the given keys/value pairs provided in list format (e.g. [key1, key2],[value1, value2]) in a map.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP?',
        },
        {
          label: 'keys',
          documentation: 'keys :: LIST? OF STRING?',
        },
        {
          label: 'values',
          documentation: 'values :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.map.setPairs': {
      label: 'apoc.map.setPairs',
      documentation:
        'Adds or updates the given key/value pairs (e.g. [key1,value1],[key2,value2]) in a map.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP?',
        },
        {
          label: 'pairs',
          documentation: 'pairs :: LIST? OF LIST? OF ANY?',
        },
      ],
    },
    'apoc.map.setValues': {
      label: 'apoc.map.setValues',
      documentation:
        'Adds or updates the alternating key/value pairs (e.g. [key1,value1,key2,value2]) in a map.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP?',
        },
        {
          label: 'pairs',
          documentation: 'pairs :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.map.sortedProperties': {
      label: 'apoc.map.sortedProperties',
      documentation:
        'Returns a list of key/value pairs.\nThe pairs are sorted by alphabetically by key, with optional case sensitivity.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP?',
        },
        {
          label: 'ignoreCase',
          documentation: 'ignoreCase = true :: BOOLEAN?',
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
          documentation: 'map :: MAP?',
        },
        {
          label: 'keys',
          documentation: 'keys :: LIST? OF STRING?',
        },
        {
          label: 'values',
          documentation: 'values = [] :: LIST? OF ANY?',
        },
        {
          label: 'fail',
          documentation: 'fail = true :: BOOLEAN?',
        },
      ],
    },
    'apoc.map.unflatten': {
      label: 'apoc.map.unflatten',
      documentation:
        'Unflattens items in the given map to nested items.\nThis function is the reverse of the `apoc.map.flatten` function.',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP?',
        },
        {
          label: 'delimiter',
          documentation: 'delimiter = . :: STRING?',
        },
      ],
    },
    'apoc.map.updateTree': {
      label: 'apoc.map.updateTree',
      documentation:
        'Adds the data map on each level of the nested tree, where the key-value pairs match.',
      parameters: [
        {
          label: 'tree',
          documentation: 'tree :: MAP?',
        },
        {
          label: 'key',
          documentation: 'key :: STRING?',
        },
        {
          label: 'data',
          documentation: 'data :: LIST? OF LIST? OF ANY?',
        },
      ],
    },
    'apoc.map.values': {
      label: 'apoc.map.values',
      documentation:
        'Returns a list of values indicated by the given keys (returns a null value if a given key is missing).',
      parameters: [
        {
          label: 'map',
          documentation: 'map :: MAP?',
        },
        {
          label: 'keys',
          documentation: 'keys = [] :: LIST? OF STRING?',
        },
        {
          label: 'addNullsForMissing',
          documentation: 'addNullsForMissing = false :: BOOLEAN?',
        },
      ],
    },
    'apoc.math.cosh': {
      label: 'apoc.math.cosh',
      documentation: 'Returns the hyperbolic cosine.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: FLOAT?',
        },
      ],
    },
    'apoc.math.coth': {
      label: 'apoc.math.coth',
      documentation: 'Returns the hyperbolic cotangent.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: FLOAT?',
        },
      ],
    },
    'apoc.math.csch': {
      label: 'apoc.math.csch',
      documentation: 'Returns the hyperbolic cosecant.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: FLOAT?',
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
          documentation: 'value :: FLOAT?',
        },
      ],
    },
    'apoc.math.sigmoid': {
      label: 'apoc.math.sigmoid',
      documentation: 'Returns the sigmoid of the given value.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: FLOAT?',
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
          documentation: 'value :: FLOAT?',
        },
      ],
    },
    'apoc.math.sinh': {
      label: 'apoc.math.sinh',
      documentation: 'Returns the hyperbolic sine of the given value.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: FLOAT?',
        },
      ],
    },
    'apoc.math.tanh': {
      label: 'apoc.math.tanh',
      documentation: 'Returns the hyperbolic tangent of the given value.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: FLOAT?',
        },
      ],
    },
    'apoc.meta.cypher.isType': {
      label: 'apoc.meta.cypher.isType',
      documentation: 'Returns true if the given value matches the given type.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
        {
          label: 'type',
          documentation: 'type :: STRING?',
        },
      ],
    },
    'apoc.meta.cypher.type': {
      label: 'apoc.meta.cypher.type',
      documentation: 'Returns the type name of the given value.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
      ],
    },
    'apoc.meta.cypher.types': {
      label: 'apoc.meta.cypher.types',
      documentation:
        'Returns a map containing the type names of the given values.',
      parameters: [
        {
          label: 'props',
          documentation: 'props :: ANY?',
        },
      ],
    },
    'apoc.meta.nodes.count': {
      label: 'apoc.meta.nodes.count',
      documentation:
        'Returns the sum of the nodes with the given labels in the list.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes = [] :: LIST? OF STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.node.degree': {
      label: 'apoc.node.degree',
      documentation: 'Returns the total degrees for the given node.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE?',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING?',
        },
      ],
    },
    'apoc.node.degree.in': {
      label: 'apoc.node.degree.in',
      documentation:
        'Returns the total number of incoming relationships to the given node.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE?',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING?',
        },
      ],
    },
    'apoc.node.degree.out': {
      label: 'apoc.node.degree.out',
      documentation:
        'Returns the total number of outgoing relationships from the given node.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE?',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING?',
        },
      ],
    },
    'apoc.node.id': {
      label: 'apoc.node.id',
      documentation: 'Returns the id for the given virtual node.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE?',
        },
      ],
    },
    'apoc.node.labels': {
      label: 'apoc.node.labels',
      documentation: 'Returns the labels for the given virtual node.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE?',
        },
      ],
    },
    'apoc.node.relationship.exists': {
      label: 'apoc.node.relationship.exists',
      documentation:
        'Returns a boolean based on whether the given node has a relationship (or whether the given node has a relationship of the given type and direction).',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE?',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING?',
        },
      ],
    },
    'apoc.node.relationship.types': {
      label: 'apoc.node.relationship.types',
      documentation:
        'Returns a list of distinct relationship types for the given node.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE?',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING?',
        },
      ],
    },
    'apoc.node.relationships.exist': {
      label: 'apoc.node.relationships.exist',
      documentation:
        'Returns a boolean based on whether the given node has relationships (or whether the given nodes has relationships of the given type and direction).',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE?',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING?',
        },
      ],
    },
    'apoc.nodes.connected': {
      label: 'apoc.nodes.connected',
      documentation:
        'Returns true when a given node is directly connected to another given node.\nThis function is optimized for dense nodes.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: NODE?',
        },
        {
          label: 'endNode',
          documentation: 'endNode :: NODE?',
        },
        {
          label: 'types',
          documentation: 'types =  :: STRING?',
        },
      ],
    },
    'apoc.nodes.isDense': {
      label: 'apoc.nodes.isDense',
      documentation: 'Returns true if the given node is a dense node.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE?',
        },
      ],
    },
    'apoc.nodes.relationship.types': {
      label: 'apoc.nodes.relationship.types',
      documentation:
        'Returns a list of distinct relationship types from the given list of nodes.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY?',
        },
        {
          label: 'types',
          documentation: 'types =  :: STRING?',
        },
      ],
    },
    'apoc.nodes.relationships.exist': {
      label: 'apoc.nodes.relationships.exist',
      documentation:
        'Returns a boolean based on whether or not the given nodes have the given relationships.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY?',
        },
        {
          label: 'types',
          documentation: 'types =  :: STRING?',
        },
      ],
    },
    'apoc.number.arabicToRoman': {
      label: 'apoc.number.arabicToRoman',
      documentation: 'Converts the given Arabic numbers to Roman numbers.',
      parameters: [
        {
          label: 'number',
          documentation: 'number :: ANY?',
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
          documentation: 'stringA :: STRING?',
        },
        {
          label: 'stringB',
          documentation: 'stringB :: STRING?',
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
          documentation: 'stringA :: STRING?',
        },
        {
          label: 'stringB',
          documentation: 'stringB :: STRING?',
        },
        {
          label: 'precision',
          documentation: 'precision = 0 :: INTEGER?',
        },
        {
          label: 'roundingMode',
          documentation: 'roundingMode = HALF_UP :: STRING?',
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
          documentation: 'stringA :: STRING?',
        },
        {
          label: 'stringB',
          documentation: 'stringB :: STRING?',
        },
        {
          label: 'precision',
          documentation: 'precision = 0 :: INTEGER?',
        },
        {
          label: 'roundingMode',
          documentation: 'roundingMode = HALF_UP :: STRING?',
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
          documentation: 'stringA :: STRING?',
        },
        {
          label: 'stringB',
          documentation: 'stringB :: STRING?',
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
          documentation: 'number :: INTEGER?',
        },
      ],
    },
    'apoc.number.exact.toFloat': {
      label: 'apoc.number.exact.toFloat',
      documentation:
        'Returns the float value of the given large number (using Java BigDecimal).',
      parameters: [
        {
          label: 'string',
          documentation: 'string :: STRING?',
        },
        {
          label: 'precision',
          documentation: 'precision = 0 :: INTEGER?',
        },
        {
          label: 'roundingMode',
          documentation: 'roundingMode = HALF_UP :: STRING?',
        },
      ],
    },
    'apoc.number.exact.toInteger': {
      label: 'apoc.number.exact.toInteger',
      documentation:
        'Returns the integer value of the given large number (using Java BigDecimal).',
      parameters: [
        {
          label: 'string',
          documentation: 'string :: STRING?',
        },
        {
          label: 'precision',
          documentation: 'precision = 0 :: INTEGER?',
        },
        {
          label: 'roundingMode',
          documentation: 'roundingMode = HALF_UP :: STRING?',
        },
      ],
    },
    'apoc.number.format': {
      label: 'apoc.number.format',
      documentation:
        'Formats the given long or double using the given pattern and language to produce a string.',
      parameters: [
        {
          label: 'number',
          documentation: 'number :: ANY?',
        },
        {
          label: 'pattern',
          documentation: 'pattern =  :: STRING?',
        },
        {
          label: 'language',
          documentation: 'language =  :: STRING?',
        },
      ],
    },
    'apoc.number.parseFloat': {
      label: 'apoc.number.parseFloat',
      documentation:
        'Parses the given string using the given pattern and language to produce a double.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
        {
          label: 'pattern',
          documentation: 'pattern =  :: STRING?',
        },
        {
          label: 'language',
          documentation: 'language =  :: STRING?',
        },
      ],
    },
    'apoc.number.parseInt': {
      label: 'apoc.number.parseInt',
      documentation:
        'Parses the given string using the given pattern and language to produce a long.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
        {
          label: 'pattern',
          documentation: 'pattern =  :: STRING?',
        },
        {
          label: 'language',
          documentation: 'language =  :: STRING?',
        },
      ],
    },
    'apoc.number.romanToArabic': {
      label: 'apoc.number.romanToArabic',
      documentation: 'Converts the given Roman numbers to Arabic numbers.',
      parameters: [
        {
          label: 'romanNumber',
          documentation: 'romanNumber :: STRING?',
        },
      ],
    },
    'apoc.path.combine': {
      label: 'apoc.path.combine',
      documentation: 'Combines the two given paths into one path.',
      parameters: [
        {
          label: 'path1',
          documentation: 'path1 :: PATH?',
        },
        {
          label: 'path2',
          documentation: 'path2 :: PATH?',
        },
      ],
    },
    'apoc.path.create': {
      label: 'apoc.path.create',
      documentation:
        'Returns a path from the given start node and a list of relationships.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: NODE?',
        },
        {
          label: 'rels',
          documentation: 'rels = [] :: LIST? OF RELATIONSHIP?',
        },
      ],
    },
    'apoc.path.elements': {
      label: 'apoc.path.elements',
      documentation:
        'Converts the given path into a list of nodes and relationships.',
      parameters: [
        {
          label: 'path',
          documentation: 'path :: PATH?',
        },
      ],
    },
    'apoc.path.slice': {
      label: 'apoc.path.slice',
      documentation:
        'Returns a sub-path of the given length and offset from the given path.',
      parameters: [
        {
          label: 'path',
          documentation: 'path :: PATH?',
        },
        {
          label: 'offset',
          documentation: 'offset = 0 :: INTEGER?',
        },
        {
          label: 'length',
          documentation: 'length = -1 :: INTEGER?',
        },
      ],
    },
    'apoc.rel.endNode': {
      label: 'apoc.rel.endNode',
      documentation: 'Returns the end node for the given virtual relationship.',
      parameters: [
        {
          label: 'rel',
          documentation: 'rel :: RELATIONSHIP?',
        },
      ],
    },
    'apoc.rel.id': {
      label: 'apoc.rel.id',
      documentation: 'Returns the id for the given virtual relationship.',
      parameters: [
        {
          label: 'rel',
          documentation: 'rel :: RELATIONSHIP?',
        },
      ],
    },
    'apoc.rel.startNode': {
      label: 'apoc.rel.startNode',
      documentation:
        'Returns the start node for the given virtual relationship.',
      parameters: [
        {
          label: 'rel',
          documentation: 'rel :: RELATIONSHIP?',
        },
      ],
    },
    'apoc.rel.type': {
      label: 'apoc.rel.type',
      documentation: 'Returns the type for the given virtual relationship.',
      parameters: [
        {
          label: 'rel',
          documentation: 'rel :: RELATIONSHIP?',
        },
      ],
    },
    'apoc.schema.node.constraintExists': {
      label: 'apoc.schema.node.constraintExists',
      documentation:
        'Returns a boolean depending on whether or not a constraint exists for the given node label with the given property names.',
      parameters: [
        {
          label: 'labelName',
          documentation: 'labelName :: STRING?',
        },
        {
          label: 'propertyName',
          documentation: 'propertyName :: LIST? OF STRING?',
        },
      ],
    },
    'apoc.schema.node.indexExists': {
      label: 'apoc.schema.node.indexExists',
      documentation:
        'Returns a boolean depending on whether or not an index exists for the given node label with the given property names.',
      parameters: [
        {
          label: 'labelName',
          documentation: 'labelName :: STRING?',
        },
        {
          label: 'propertyName',
          documentation: 'propertyName :: LIST? OF STRING?',
        },
      ],
    },
    'apoc.schema.relationship.constraintExists': {
      label: 'apoc.schema.relationship.constraintExists',
      documentation:
        'Returns a boolean depending on whether or not a constraint exists for the given relationship type with the given property names.',
      parameters: [
        {
          label: 'type',
          documentation: 'type :: STRING?',
        },
        {
          label: 'propertyName',
          documentation: 'propertyName :: LIST? OF STRING?',
        },
      ],
    },
    'apoc.schema.relationship.indexExists': {
      label: 'apoc.schema.relationship.indexExists',
      documentation:
        'Returns a boolean depending on whether or not an index exists for the given relationship type with the given property names.',
      parameters: [
        {
          label: 'type',
          documentation: 'type :: STRING?',
        },
        {
          label: 'propertyName',
          documentation: 'propertyName :: LIST? OF STRING?',
        },
      ],
    },
    'apoc.scoring.existence': {
      label: 'apoc.scoring.existence',
      documentation: 'Returns the given score if true, 0 if false.',
      parameters: [
        {
          label: 'score',
          documentation: 'score :: INTEGER?',
        },
        {
          label: 'exists',
          documentation: 'exists :: BOOLEAN?',
        },
      ],
    },
    'apoc.scoring.pareto': {
      label: 'apoc.scoring.pareto',
      documentation:
        'Applies a Pareto scoring function over the given integers.',
      parameters: [
        {
          label: 'minimumThreshold',
          documentation: 'minimumThreshold :: INTEGER?',
        },
        {
          label: 'eightyPercentValue',
          documentation: 'eightyPercentValue :: INTEGER?',
        },
        {
          label: 'maximumValue',
          documentation: 'maximumValue :: INTEGER?',
        },
        {
          label: 'score',
          documentation: 'score :: INTEGER?',
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
          documentation: 'temporal :: ANY?',
        },
        {
          label: 'format',
          documentation: 'format = yyyy-MM-dd :: STRING?',
        },
      ],
    },
    'apoc.temporal.formatDuration': {
      label: 'apoc.temporal.formatDuration',
      documentation: 'Formats the given duration into the given time format.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY?',
        },
        {
          label: 'format',
          documentation: 'format :: STRING?',
        },
      ],
    },
    'apoc.temporal.toZonedTemporal': {
      label: 'apoc.temporal.toZonedTemporal',
      documentation:
        'Parses the given date string using the specified format into the given time zone.',
      parameters: [
        {
          label: 'time',
          documentation: 'time :: STRING?',
        },
        {
          label: 'format',
          documentation: 'format = yyyy-MM-dd HH:mm:ss :: STRING?',
        },
        {
          label: 'timezone',
          documentation: 'timezone = UTC :: STRING?',
        },
      ],
    },
    'apoc.text.base64Decode': {
      label: 'apoc.text.base64Decode',
      documentation: 'Decodes the given Base64 encoded string.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
      ],
    },
    'apoc.text.base64Encode': {
      label: 'apoc.text.base64Encode',
      documentation: 'Encodes the given string with Base64.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
      ],
    },
    'apoc.text.base64UrlDecode': {
      label: 'apoc.text.base64UrlDecode',
      documentation: 'Decodes the given Base64 encoded URL.',
      parameters: [
        {
          label: 'url',
          documentation: 'url :: STRING?',
        },
      ],
    },
    'apoc.text.base64UrlEncode': {
      label: 'apoc.text.base64UrlEncode',
      documentation: 'Encodes the given URL with Base64.',
      parameters: [
        {
          label: 'url',
          documentation: 'url :: STRING?',
        },
      ],
    },
    'apoc.text.byteCount': {
      label: 'apoc.text.byteCount',
      documentation: 'Returns the size of the given string in bytes.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
        {
          label: 'charset',
          documentation: 'charset = UTF-8 :: STRING?',
        },
      ],
    },
    'apoc.text.bytes': {
      label: 'apoc.text.bytes',
      documentation: 'Returns the given string as bytes.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
        {
          label: 'charset',
          documentation: 'charset = UTF-8 :: STRING?',
        },
      ],
    },
    'apoc.text.camelCase': {
      label: 'apoc.text.camelCase',
      documentation: 'Converts the given string to camel case.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
      ],
    },
    'apoc.text.capitalize': {
      label: 'apoc.text.capitalize',
      documentation: 'Capitalizes the first letter of the given string.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
      ],
    },
    'apoc.text.capitalizeAll': {
      label: 'apoc.text.capitalizeAll',
      documentation:
        'Capitalizes the first letter of every word in the given string.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
      ],
    },
    'apoc.text.charAt': {
      label: 'apoc.text.charAt',
      documentation:
        'Returns the long value of the character at the given index.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
        {
          label: 'index',
          documentation: 'index :: INTEGER?',
        },
      ],
    },
    'apoc.text.clean': {
      label: 'apoc.text.clean',
      documentation:
        'Strips the given string of everything except alpha numeric characters and converts it to lower case.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
      ],
    },
    'apoc.text.code': {
      label: 'apoc.text.code',
      documentation: 'Converts the long value into a string.',
      parameters: [
        {
          label: 'codepoint',
          documentation: 'codepoint :: INTEGER?',
        },
      ],
    },
    'apoc.text.compareCleaned': {
      label: 'apoc.text.compareCleaned',
      documentation:
        'Compares two given strings stripped of everything except alpha numeric characters converted to lower case.',
      parameters: [
        {
          label: 'text1',
          documentation: 'text1 :: STRING?',
        },
        {
          label: 'text2',
          documentation: 'text2 :: STRING?',
        },
      ],
    },
    'apoc.text.decapitalize': {
      label: 'apoc.text.decapitalize',
      documentation:
        'Turns the first letter of the given string from upper case to lower case.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
      ],
    },
    'apoc.text.decapitalizeAll': {
      label: 'apoc.text.decapitalizeAll',
      documentation:
        'Turns the first letter of every word in the given string to lower case.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
      ],
    },
    'apoc.text.distance': {
      label: 'apoc.text.distance',
      documentation:
        'Compares the two given strings using the Levenshtein distance algorithm.',
      parameters: [
        {
          label: 'text1',
          documentation: 'text1 :: STRING?',
        },
        {
          label: 'text2',
          documentation: 'text2 :: STRING?',
        },
      ],
    },
    'apoc.text.doubleMetaphone': {
      label: 'apoc.text.doubleMetaphone',
      documentation:
        'Returns the double metaphone phonetic encoding of all words in the given string value.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: STRING?',
        },
      ],
    },
    'apoc.text.format': {
      label: 'apoc.text.format',
      documentation: 'Formats the given string with the given parameters.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
        {
          label: 'params',
          documentation: 'params :: LIST? OF ANY?',
        },
        {
          label: 'language',
          documentation: 'language = en :: STRING?',
        },
      ],
    },
    'apoc.text.fuzzyMatch': {
      label: 'apoc.text.fuzzyMatch',
      documentation: 'Performs a fuzzy match search of the two given strings.',
      parameters: [
        {
          label: 'text1',
          documentation: 'text1 :: STRING?',
        },
        {
          label: 'text2',
          documentation: 'text2 :: STRING?',
        },
      ],
    },
    'apoc.text.hammingDistance': {
      label: 'apoc.text.hammingDistance',
      documentation:
        'Compares the two given strings using the Hamming distance algorithm.',
      parameters: [
        {
          label: 'text1',
          documentation: 'text1 :: STRING?',
        },
        {
          label: 'text2',
          documentation: 'text2 :: STRING?',
        },
      ],
    },
    'apoc.text.hexCharAt': {
      label: 'apoc.text.hexCharAt',
      documentation:
        'Returns the hexadecimal value of the given string at the given index.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
        {
          label: 'index',
          documentation: 'index :: INTEGER?',
        },
      ],
    },
    'apoc.text.hexValue': {
      label: 'apoc.text.hexValue',
      documentation: 'Returns the hexadecimal value of the given value.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: INTEGER?',
        },
      ],
    },
    'apoc.text.indexOf': {
      label: 'apoc.text.indexOf',
      documentation:
        'Returns the first occurrence of the lookup string in the given string, or -1 if not found.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
        {
          label: 'lookup',
          documentation: 'lookup :: STRING?',
        },
        {
          label: 'from',
          documentation: 'from = 0 :: INTEGER?',
        },
        {
          label: 'to',
          documentation: 'to = -1 :: INTEGER?',
        },
      ],
    },
    'apoc.text.indexesOf': {
      label: 'apoc.text.indexesOf',
      documentation:
        'Returns all occurences of the lookup string in the given string, or an empty list if not found.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
        {
          label: 'lookup',
          documentation: 'lookup :: STRING?',
        },
        {
          label: 'from',
          documentation: 'from = 0 :: INTEGER?',
        },
        {
          label: 'to',
          documentation: 'to = -1 :: INTEGER?',
        },
      ],
    },
    'apoc.text.jaroWinklerDistance': {
      label: 'apoc.text.jaroWinklerDistance',
      documentation:
        'compares the two given strings using the Jaro-Winkler distance algorithm.',
      parameters: [
        {
          label: 'text1',
          documentation: 'text1 :: STRING?',
        },
        {
          label: 'text2',
          documentation: 'text2 :: STRING?',
        },
      ],
    },
    'apoc.text.join': {
      label: 'apoc.text.join',
      documentation: 'Joins the given strings using the given delimiter.',
      parameters: [
        {
          label: 'texts',
          documentation: 'texts :: LIST? OF STRING?',
        },
        {
          label: 'delimiter',
          documentation: 'delimiter :: STRING?',
        },
      ],
    },
    'apoc.text.levenshteinDistance': {
      label: 'apoc.text.levenshteinDistance',
      documentation:
        'Compares the given strings using the Levenshtein distance algorithm.',
      parameters: [
        {
          label: 'text1',
          documentation: 'text1 :: STRING?',
        },
        {
          label: 'text2',
          documentation: 'text2 :: STRING?',
        },
      ],
    },
    'apoc.text.levenshteinSimilarity': {
      label: 'apoc.text.levenshteinSimilarity',
      documentation:
        'Returns the similarity (a value within 0 and 1) between the two given strings based on the Levenshtein distance algorithm.',
      parameters: [
        {
          label: 'text1',
          documentation: 'text1 :: STRING?',
        },
        {
          label: 'text2',
          documentation: 'text2 :: STRING?',
        },
      ],
    },
    'apoc.text.lpad': {
      label: 'apoc.text.lpad',
      documentation: 'Left pads the given string by the given width.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
        {
          label: 'count',
          documentation: 'count :: INTEGER?',
        },
        {
          label: 'delimiter',
          documentation: 'delimiter =   :: STRING?',
        },
      ],
    },
    'apoc.text.phonetic': {
      label: 'apoc.text.phonetic',
      documentation:
        'Returns the US_ENGLISH phonetic soundex encoding of all words of the string.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
      ],
    },
    'apoc.text.random': {
      label: 'apoc.text.random',
      documentation:
        'Generates a random string to the given length using a length parameter and an optional string of valid characters.\nUnsuitable for cryptographic use-cases.',
      parameters: [
        {
          label: 'length',
          documentation: 'length :: INTEGER?',
        },
        {
          label: 'valid',
          documentation: 'valid = A-Za-z0-9 :: STRING?',
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
          documentation: 'text :: STRING?',
        },
        {
          label: 'regex',
          documentation: 'regex :: STRING?',
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
          documentation: 'text :: STRING?',
        },
        {
          label: 'regex',
          documentation: 'regex :: STRING?',
        },
        {
          label: 'replacement',
          documentation: 'replacement :: STRING?',
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
          documentation: 'item :: STRING?',
        },
        {
          label: 'count',
          documentation: 'count :: INTEGER?',
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
          documentation: 'text :: STRING?',
        },
        {
          label: 'regex',
          documentation: 'regex :: STRING?',
        },
        {
          label: 'replacement',
          documentation: 'replacement :: STRING?',
        },
      ],
    },
    'apoc.text.rpad': {
      label: 'apoc.text.rpad',
      documentation: 'Right pads the given string by the given width.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
        {
          label: 'count',
          documentation: 'count :: INTEGER?',
        },
        {
          label: 'delimiter',
          documentation: 'delimiter =   :: STRING?',
        },
      ],
    },
    'apoc.text.slug': {
      label: 'apoc.text.slug',
      documentation:
        'Replaces the whitespace in the given string with the given delimiter.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
        {
          label: 'delimiter',
          documentation: 'delimiter = - :: STRING?',
        },
      ],
    },
    'apoc.text.snakeCase': {
      label: 'apoc.text.snakeCase',
      documentation: 'Converts the given string to snake case.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
      ],
    },
    'apoc.text.sorensenDiceSimilarity': {
      label: 'apoc.text.sorensenDiceSimilarity',
      documentation:
        'Compares the two given strings using the Sørensen–Dice coefficient formula, with the provided IETF language tag.',
      parameters: [
        {
          label: 'text1',
          documentation: 'text1 :: STRING?',
        },
        {
          label: 'text2',
          documentation: 'text2 :: STRING?',
        },
        {
          label: 'languageTag',
          documentation: 'languageTag = en :: STRING?',
        },
      ],
    },
    'apoc.text.split': {
      label: 'apoc.text.split',
      documentation:
        'Splits the given string using a given regular expression as a separator.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
        {
          label: 'regex',
          documentation: 'regex :: STRING?',
        },
        {
          label: 'limit',
          documentation: 'limit = 0 :: INTEGER?',
        },
      ],
    },
    'apoc.text.swapCase': {
      label: 'apoc.text.swapCase',
      documentation: 'Swaps the cases in the given string.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
      ],
    },
    'apoc.text.toCypher': {
      label: 'apoc.text.toCypher',
      documentation: 'Converts the given value to a Cypher property string.',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.text.toUpperCase': {
      label: 'apoc.text.toUpperCase',
      documentation: 'Converts the given string to upper case.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
      ],
    },
    'apoc.text.upperCamelCase': {
      label: 'apoc.text.upperCamelCase',
      documentation: 'Converts the given string to upper camel case.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
      ],
    },
    'apoc.text.urldecode': {
      label: 'apoc.text.urldecode',
      documentation: 'Decodes the given URL encoded string.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
      ],
    },
    'apoc.text.urlencode': {
      label: 'apoc.text.urlencode',
      documentation: 'Encodes the given URL string.',
      parameters: [
        {
          label: 'text',
          documentation: 'text :: STRING?',
        },
      ],
    },
    'apoc.util.compress': {
      label: 'apoc.util.compress',
      documentation: 'Zips the given string.',
      parameters: [
        {
          label: 'data',
          documentation: 'data :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.util.decompress': {
      label: 'apoc.util.decompress',
      documentation: 'Unzips the given byte array.',
      parameters: [
        {
          label: 'data',
          documentation: 'data :: BYTEARRAY?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.util.md5': {
      label: 'apoc.util.md5',
      documentation:
        'Returns the MD5 checksum of the concatenation of all string values in the given list.\nMD5 is a weak hashing algorithm which is unsuitable for cryptographic use-cases.',
      parameters: [
        {
          label: 'values',
          documentation: 'values :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.util.sha1': {
      label: 'apoc.util.sha1',
      documentation:
        'Returns the SHA1 of the concatenation of all string values in the given list.\nSHA1 is a weak hashing algorithm which is unsuitable for cryptographic use-cases.',
      parameters: [
        {
          label: 'values',
          documentation: 'values :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.util.sha256': {
      label: 'apoc.util.sha256',
      documentation:
        'Returns the SHA256 of the concatenation of all string values in the given list.',
      parameters: [
        {
          label: 'values',
          documentation: 'values :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.util.sha384': {
      label: 'apoc.util.sha384',
      documentation:
        'Returns the SHA384 of the concatenation of all string values in the given list.',
      parameters: [
        {
          label: 'values',
          documentation: 'values :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.util.sha512': {
      label: 'apoc.util.sha512',
      documentation:
        'Returns the SHA512 of the concatenation of all string values in the list.',
      parameters: [
        {
          label: 'values',
          documentation: 'values :: LIST? OF ANY?',
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
          documentation: 'predicate :: BOOLEAN?',
        },
        {
          label: 'message',
          documentation: 'message :: STRING?',
        },
        {
          label: 'params',
          documentation: 'params :: LIST? OF ANY?',
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
      documentation: 'Parses the given XML string as a map.',
      parameters: [
        {
          label: 'data',
          documentation: 'data :: STRING?',
        },
        {
          label: 'path',
          documentation: 'path = / :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
        {
          label: 'simple',
          documentation: 'simple = false :: BOOLEAN?',
        },
      ],
    },
    asin: {
      label: 'asin',
      documentation: 'Returns the arcsine of a number in radians.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT?',
        },
      ],
    },
    atan: {
      label: 'atan',
      documentation: 'Returns the arctangent of a number in radians.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT?',
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
          documentation: 'y :: FLOAT?',
        },
        {
          label: 'x',
          documentation: 'x :: FLOAT?',
        },
      ],
    },
    avg: {
      label: 'avg',
      documentation: 'Returns the average of a set of duration values.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: DURATION?',
        },
      ],
    },
    ceil: {
      label: 'ceil',
      documentation:
        'Returns the smallest floating point number that is greater than or equal to a number and equal to a mathematical integer.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT?',
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
          documentation: 'input :: ANY?',
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
          documentation: 'input :: ANY?',
        },
      ],
    },
    cos: {
      label: 'cos',
      documentation: 'Returns the cosine  of a number.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT?',
        },
      ],
    },
    cot: {
      label: 'cot',
      documentation: 'Returns the cotangent of a number.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT?',
        },
      ],
    },
    count: {
      label: 'count',
      documentation: 'Returns the number of values or rows.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY?',
        },
      ],
    },
    date: {
      label: 'date',
      documentation: 'Create a Date instant.',
      parameters: [
        {
          label: 'input',
          documentation: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
      ],
    },
    'date.realtime': {
      label: 'date.realtime',
      documentation: 'Get the current Date instant using the realtime clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
      ],
    },
    'date.statement': {
      label: 'date.statement',
      documentation: 'Get the current Date instant using the statement clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
      ],
    },
    'date.transaction': {
      label: 'date.transaction',
      documentation:
        'Get the current Date instant using the transaction clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
      ],
    },
    'date.truncate': {
      label: 'date.truncate',
      documentation:
        'Truncate the input temporal value to a Date instant using the specified unit.',
      parameters: [
        {
          label: 'unit',
          documentation: 'unit :: STRING?',
        },
        {
          label: 'input',
          documentation: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
        {
          label: 'fields',
          documentation: 'fields = null :: MAP?',
        },
      ],
    },
    datetime: {
      label: 'datetime',
      documentation: 'Create a DateTime instant.',
      parameters: [
        {
          label: 'input',
          documentation: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
      ],
    },
    'datetime.fromepoch': {
      label: 'datetime.fromepoch',
      documentation:
        'Create a DateTime given the seconds and nanoseconds since the start of the epoch.',
      parameters: [
        {
          label: 'seconds',
          documentation: 'seconds :: NUMBER?',
        },
        {
          label: 'nanoseconds',
          documentation: 'nanoseconds :: NUMBER?',
        },
      ],
    },
    'datetime.fromepochmillis': {
      label: 'datetime.fromepochmillis',
      documentation:
        'Create a DateTime given the milliseconds since the start of the epoch.',
      parameters: [
        {
          label: 'milliseconds',
          documentation: 'milliseconds :: NUMBER?',
        },
      ],
    },
    'datetime.realtime': {
      label: 'datetime.realtime',
      documentation:
        'Get the current DateTime instant using the realtime clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
      ],
    },
    'datetime.statement': {
      label: 'datetime.statement',
      documentation:
        'Get the current DateTime instant using the statement clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
      ],
    },
    'datetime.transaction': {
      label: 'datetime.transaction',
      documentation:
        'Get the current DateTime instant using the transaction clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
      ],
    },
    'datetime.truncate': {
      label: 'datetime.truncate',
      documentation:
        'Truncate the input temporal value to a DateTime instant using the specified unit.',
      parameters: [
        {
          label: 'unit',
          documentation: 'unit :: STRING?',
        },
        {
          label: 'input',
          documentation: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
        {
          label: 'fields',
          documentation: 'fields = null :: MAP?',
        },
      ],
    },
    degrees: {
      label: 'degrees',
      documentation: 'Converts radians to degrees.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT?',
        },
      ],
    },
    duration: {
      label: 'duration',
      documentation: 'Construct a Duration value.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY?',
        },
      ],
    },
    'duration.between': {
      label: 'duration.between',
      documentation:
        "Compute the duration between the 'from' instant (inclusive) and the 'to' instant (exclusive) in logical units.",
      parameters: [
        {
          label: 'from',
          documentation: 'from :: ANY?',
        },
        {
          label: 'to',
          documentation: 'to :: ANY?',
        },
      ],
    },
    'duration.inDays': {
      label: 'duration.inDays',
      documentation:
        "Compute the duration between the 'from' instant (inclusive) and the 'to' instant (exclusive) in days.",
      parameters: [
        {
          label: 'from',
          documentation: 'from :: ANY?',
        },
        {
          label: 'to',
          documentation: 'to :: ANY?',
        },
      ],
    },
    'duration.inMonths': {
      label: 'duration.inMonths',
      documentation:
        "Compute the duration between the 'from' instant (inclusive) and the 'to' instant (exclusive) in months.",
      parameters: [
        {
          label: 'from',
          documentation: 'from :: ANY?',
        },
        {
          label: 'to',
          documentation: 'to :: ANY?',
        },
      ],
    },
    'duration.inSeconds': {
      label: 'duration.inSeconds',
      documentation:
        "Compute the duration between the 'from' instant (inclusive) and the 'to' instant (exclusive) in seconds.",
      parameters: [
        {
          label: 'from',
          documentation: 'from :: ANY?',
        },
        {
          label: 'to',
          documentation: 'to :: ANY?',
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
      documentation: 'Returns the element id of a relationship.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: RELATIONSHIP?',
        },
      ],
    },
    endNode: {
      label: 'endNode',
      documentation: 'Returns the end node of a relationship.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: RELATIONSHIP?',
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
          documentation: 'input :: ANY?',
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
          documentation: 'input :: FLOAT?',
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
        'Returns the largest floating point number that is less than or equal to a number and equal to a mathematical integer.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT?',
        },
      ],
    },
    'gds.alpha.linkprediction.adamicAdar': {
      label: 'gds.alpha.linkprediction.adamicAdar',
      documentation: 'Given two nodes, calculate Adamic Adar similarity',
      parameters: [
        {
          label: 'node1',
          documentation: 'node1 :: NODE?',
        },
        {
          label: 'node2',
          documentation: 'node2 :: NODE?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'gds.alpha.linkprediction.commonNeighbors': {
      label: 'gds.alpha.linkprediction.commonNeighbors',
      documentation: 'Given two nodes, returns the number of common neighbors',
      parameters: [
        {
          label: 'node1',
          documentation: 'node1 :: NODE?',
        },
        {
          label: 'node2',
          documentation: 'node2 :: NODE?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'gds.alpha.linkprediction.preferentialAttachment': {
      label: 'gds.alpha.linkprediction.preferentialAttachment',
      documentation: 'Given two nodes, calculate Preferential Attachment',
      parameters: [
        {
          label: 'node1',
          documentation: 'node1 :: NODE?',
        },
        {
          label: 'node2',
          documentation: 'node2 :: NODE?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'gds.alpha.linkprediction.resourceAllocation': {
      label: 'gds.alpha.linkprediction.resourceAllocation',
      documentation:
        'Given two nodes, calculate Resource Allocation similarity',
      parameters: [
        {
          label: 'node1',
          documentation: 'node1 :: NODE?',
        },
        {
          label: 'node2',
          documentation: 'node2 :: NODE?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'gds.alpha.linkprediction.sameCommunity': {
      label: 'gds.alpha.linkprediction.sameCommunity',
      documentation:
        'Given two nodes, indicates if they have the same community',
      parameters: [
        {
          label: 'node1',
          documentation: 'node1 :: NODE?',
        },
        {
          label: 'node2',
          documentation: 'node2 :: NODE?',
        },
        {
          label: 'communityProperty',
          documentation: 'communityProperty = community :: STRING?',
        },
      ],
    },
    'gds.alpha.linkprediction.totalNeighbors': {
      label: 'gds.alpha.linkprediction.totalNeighbors',
      documentation: 'Given two nodes, calculate Total Neighbors',
      parameters: [
        {
          label: 'node1',
          documentation: 'node1 :: NODE?',
        },
        {
          label: 'node2',
          documentation: 'node2 :: NODE?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'gds.alpha.ml.oneHotEncoding': {
      label: 'gds.alpha.ml.oneHotEncoding',
      documentation:
        'RETURN gds.alpha.ml.oneHotEncoding(availableValues, selectedValues) - return a list of selected values in a one hot encoding format.',
      parameters: [
        {
          label: 'availableValues',
          documentation: 'availableValues :: LIST? OF ANY?',
        },
        {
          label: 'selectedValues',
          documentation: 'selectedValues :: LIST? OF ANY?',
        },
      ],
    },
    'gds.graph.exists': {
      label: 'gds.graph.exists',
      documentation: 'Checks if a graph exists in the catalog.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
      ],
    },
    'gds.graph.project': {
      label: 'gds.graph.project',
      documentation:
        'Creates a named graph in the catalog for use by algorithms.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'sourceNode',
          documentation: 'sourceNode :: ANY?',
        },
        {
          label: 'targetNode',
          documentation: 'targetNode = null :: ANY?',
        },
        {
          label: 'dataConfig',
          documentation: 'dataConfig = null :: ANY?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = null :: ANY?',
        },
        {
          label: 'alphaMigrationConfig',
          documentation: 'alphaMigrationConfig = null :: ANY?',
        },
      ],
    },
    'gds.isLicensed': {
      label: 'gds.isLicensed',
      documentation:
        'RETURN gds.isLicensed - Return if GDS is licensed. For more details use the procedure gds.license.state.',
      parameters: [],
    },
    'gds.similarity.cosine': {
      label: 'gds.similarity.cosine',
      documentation:
        'RETURN gds.similarity.cosine(vector1, vector2) - Given two collection vectors, calculate cosine similarity',
      parameters: [
        {
          label: 'vector1',
          documentation: 'vector1 :: LIST? OF NUMBER?',
        },
        {
          label: 'vector2',
          documentation: 'vector2 :: LIST? OF NUMBER?',
        },
      ],
    },
    'gds.similarity.euclidean': {
      label: 'gds.similarity.euclidean',
      documentation:
        'RETURN gds.similarity.euclidean(vector1, vector2) - Given two collection vectors, calculate similarity based on euclidean distance',
      parameters: [
        {
          label: 'vector1',
          documentation: 'vector1 :: LIST? OF NUMBER?',
        },
        {
          label: 'vector2',
          documentation: 'vector2 :: LIST? OF NUMBER?',
        },
      ],
    },
    'gds.similarity.euclideanDistance': {
      label: 'gds.similarity.euclideanDistance',
      documentation:
        'RETURN gds.similarity.euclideanDistance(vector1, vector2) - Given two collection vectors, calculate the euclidean distance (square root of the sum of the squared differences)',
      parameters: [
        {
          label: 'vector1',
          documentation: 'vector1 :: LIST? OF NUMBER?',
        },
        {
          label: 'vector2',
          documentation: 'vector2 :: LIST? OF NUMBER?',
        },
      ],
    },
    'gds.similarity.jaccard': {
      label: 'gds.similarity.jaccard',
      documentation:
        'RETURN gds.similarity.jaccard(vector1, vector2) - Given two collection vectors, calculate Jaccard similarity',
      parameters: [
        {
          label: 'vector1',
          documentation: 'vector1 :: LIST? OF NUMBER?',
        },
        {
          label: 'vector2',
          documentation: 'vector2 :: LIST? OF NUMBER?',
        },
      ],
    },
    'gds.similarity.overlap': {
      label: 'gds.similarity.overlap',
      documentation:
        'RETURN gds.similarity.overlap(vector1, vector2) - Given two collection vectors, calculate overlap similarity',
      parameters: [
        {
          label: 'vector1',
          documentation: 'vector1 :: LIST? OF NUMBER?',
        },
        {
          label: 'vector2',
          documentation: 'vector2 :: LIST? OF NUMBER?',
        },
      ],
    },
    'gds.similarity.pearson': {
      label: 'gds.similarity.pearson',
      documentation:
        'RETURN gds.similarity.pearson(vector1, vector2) - Given two collection vectors, calculate pearson similarity',
      parameters: [
        {
          label: 'vector1',
          documentation: 'vector1 :: LIST? OF NUMBER?',
        },
        {
          label: 'vector2',
          documentation: 'vector2 :: LIST? OF NUMBER?',
        },
      ],
    },
    'gds.util.NaN': {
      label: 'gds.util.NaN',
      documentation: 'RETURN gds.util.NaN() - Returns NaN as a Cypher value.',
      parameters: [],
    },
    'gds.util.asNode': {
      label: 'gds.util.asNode',
      documentation:
        'RETURN gds.util.asNode(nodeId) - Return the node objects for the given node id or null if none exists.',
      parameters: [
        {
          label: 'nodeId',
          documentation: 'nodeId :: NUMBER?',
        },
      ],
    },
    'gds.util.asNodes': {
      label: 'gds.util.asNodes',
      documentation:
        'RETURN gds.util.asNodes(nodeIds) - Return the node objects for the given node ids or an empty list if none exists.',
      parameters: [
        {
          label: 'nodeIds',
          documentation: 'nodeIds :: LIST? OF NUMBER?',
        },
      ],
    },
    'gds.util.infinity': {
      label: 'gds.util.infinity',
      documentation:
        'RETURN gds.util.infinity() - Return infinity as a Cypher value.',
      parameters: [],
    },
    'gds.util.isFinite': {
      label: 'gds.util.isFinite',
      documentation:
        'RETURN gds.util.isFinite(value) - Return true iff the given argument is a finite value (not ±Infinity, NaN, or null).',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: NUMBER?',
        },
      ],
    },
    'gds.util.isInfinite': {
      label: 'gds.util.isInfinite',
      documentation:
        'RETURN gds.util.isInfinite(value) - Return true iff the given argument is not a finite value (not ±Infinity, NaN, or null).',
      parameters: [
        {
          label: 'value',
          documentation: 'value :: NUMBER?',
        },
      ],
    },
    'gds.util.nodeProperty': {
      label: 'gds.util.nodeProperty',
      documentation:
        'Returns a node property value from a named in-memory graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'nodeId',
          documentation: 'nodeId :: ANY?',
        },
        {
          label: 'propertyKey',
          documentation: 'propertyKey :: STRING?',
        },
        {
          label: 'nodeLabel',
          documentation: 'nodeLabel = * :: STRING?',
        },
      ],
    },
    'gds.version': {
      label: 'gds.version',
      documentation:
        'RETURN gds.version() | Return the installed graph data science library version.',
      parameters: [],
    },
    'graph.names': {
      label: 'graph.names',
      documentation: 'Lists the names of graph in the current database',
      parameters: [],
    },
    'graph.propertiesByName': {
      label: 'graph.propertiesByName',
      documentation: 'Returns the map of properties associated with a graph',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
      ],
    },
    haversin: {
      label: 'haversin',
      documentation: 'Returns half the versine of a number.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT?',
        },
      ],
    },
    head: {
      label: 'head',
      documentation: 'Returns the first element in a list.',
      parameters: [
        {
          label: 'list',
          documentation: 'list :: LIST? OF ANY?',
        },
      ],
    },
    id: {
      label: 'id',
      documentation: 'Returns the id of a relationship.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: RELATIONSHIP?',
        },
      ],
    },
    isEmpty: {
      label: 'isEmpty',
      documentation: 'Checks whether a string is empty.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: STRING?',
        },
      ],
    },
    isNaN: {
      label: 'isNaN',
      documentation: 'Returns whether the given floating point number is NaN.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT?',
        },
      ],
    },
    keys: {
      label: 'keys',
      documentation:
        'Returns a list containing the string representations for all the property names of a map.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: MAP?',
        },
      ],
    },
    labels: {
      label: 'labels',
      documentation:
        'Returns a list containing the string representations for all the labels of a node.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: NODE?',
        },
      ],
    },
    last: {
      label: 'last',
      documentation: 'Returns the last element in a list.',
      parameters: [
        {
          label: 'list',
          documentation: 'list :: LIST? OF ANY?',
        },
      ],
    },
    left: {
      label: 'left',
      documentation:
        'Returns a string containing the specified number of leftmost characters of the original string.',
      parameters: [
        {
          label: 'original',
          documentation: 'original :: STRING?',
        },
        {
          label: 'length',
          documentation: 'length :: INTEGER?',
        },
      ],
    },
    length: {
      label: 'length',
      documentation: 'Returns the length of a path.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: PATH?',
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
      documentation: 'Create a LocalDateTime instant.',
      parameters: [
        {
          label: 'input',
          documentation: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
      ],
    },
    'localdatetime.realtime': {
      label: 'localdatetime.realtime',
      documentation:
        'Get the current LocalDateTime instant using the realtime clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
      ],
    },
    'localdatetime.statement': {
      label: 'localdatetime.statement',
      documentation:
        'Get the current LocalDateTime instant using the statement clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
      ],
    },
    'localdatetime.transaction': {
      label: 'localdatetime.transaction',
      documentation:
        'Get the current LocalDateTime instant using the transaction clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
      ],
    },
    'localdatetime.truncate': {
      label: 'localdatetime.truncate',
      documentation:
        'Truncate the input temporal value to a LocalDateTime instant using the specified unit.',
      parameters: [
        {
          label: 'unit',
          documentation: 'unit :: STRING?',
        },
        {
          label: 'input',
          documentation: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
        {
          label: 'fields',
          documentation: 'fields = null :: MAP?',
        },
      ],
    },
    localtime: {
      label: 'localtime',
      documentation: 'Create a LocalTime instant.',
      parameters: [
        {
          label: 'input',
          documentation: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
      ],
    },
    'localtime.realtime': {
      label: 'localtime.realtime',
      documentation:
        'Get the current LocalTime instant using the realtime clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
      ],
    },
    'localtime.statement': {
      label: 'localtime.statement',
      documentation:
        'Get the current LocalTime instant using the statement clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
      ],
    },
    'localtime.transaction': {
      label: 'localtime.transaction',
      documentation:
        'Get the current LocalTime instant using the transaction clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
      ],
    },
    'localtime.truncate': {
      label: 'localtime.truncate',
      documentation:
        'Truncate the input temporal value to a LocalTime instant using the specified unit.',
      parameters: [
        {
          label: 'unit',
          documentation: 'unit :: STRING?',
        },
        {
          label: 'input',
          documentation: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
        {
          label: 'fields',
          documentation: 'fields = null :: MAP?',
        },
      ],
    },
    log: {
      label: 'log',
      documentation: 'Returns the natural logarithm of a number.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT?',
        },
      ],
    },
    log10: {
      label: 'log10',
      documentation: 'Returns the common logarithm (base 10) of a number.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT?',
        },
      ],
    },
    ltrim: {
      label: 'ltrim',
      documentation:
        'Returns the original string with leading whitespace removed.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: STRING?',
        },
      ],
    },
    max: {
      label: 'max',
      documentation: 'Returns the maximum value in a set of values.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY?',
        },
      ],
    },
    min: {
      label: 'min',
      documentation: 'Returns the minimum value in a set of values.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY?',
        },
      ],
    },
    nodes: {
      label: 'nodes',
      documentation: 'Returns a list containing all the nodes in a path.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: PATH?',
        },
      ],
    },
    none: {
      label: 'none',
      documentation:
        'Returns true if the predicate holds for no element in the given list.',
      parameters: [
        {
          label: 'variable',
          documentation: 'variable :: ANY?',
        },
        {
          label: 'list',
          documentation: 'list :: LIST? OF ANY?',
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
          documentation: 'input :: FLOAT?',
        },
        {
          label: 'percentile',
          documentation: 'percentile :: FLOAT?',
        },
      ],
    },
    percentileDisc: {
      label: 'percentileDisc',
      documentation:
        'Returns the nearest floating point value to the given percentile over a group using a rounding method.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT?',
        },
        {
          label: 'percentile',
          documentation: 'percentile :: FLOAT?',
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
          documentation: 'input :: MAP?',
        },
      ],
    },
    'point.distance': {
      label: 'point.distance',
      documentation:
        'Returns a floating point number representing the geodesic distance between any two points in the same CRS.',
      parameters: [
        {
          label: 'from',
          documentation: 'from :: POINT?',
        },
        {
          label: 'to',
          documentation: 'to :: POINT?',
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
          documentation: 'point :: POINT?',
        },
        {
          label: 'lowerLeft',
          documentation: 'lowerLeft :: POINT?',
        },
        {
          label: 'upperRight',
          documentation: 'upperRight :: POINT?',
        },
      ],
    },
    properties: {
      label: 'properties',
      documentation: 'Returns a map containing all the properties of a map.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: MAP?',
        },
      ],
    },
    radians: {
      label: 'radians',
      documentation: 'Converts degrees to radians.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT?',
        },
      ],
    },
    rand: {
      label: 'rand',
      documentation:
        'Returns a random floating point number in the range from 0 (inclusive) to 1 (exclusive); i.e. [0,1).',
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
        'Returns a list comprising all integer values within a specified range created with step length.',
      parameters: [
        {
          label: 'start',
          documentation: 'start :: INTEGER?',
        },
        {
          label: 'end',
          documentation: 'end :: INTEGER?',
        },
        {
          label: 'step',
          documentation: 'step :: INTEGER?',
        },
      ],
    },
    reduce: {
      label: 'reduce',
      documentation:
        'Runs an expression against individual elements of a list, storing the result of the expression in an accumulator.',
      parameters: [
        {
          label: 'accumulator',
          documentation: 'accumulator :: ANY?',
        },
        {
          label: 'variable',
          documentation: 'variable :: LIST? OF ANY?',
        },
      ],
    },
    relationships: {
      label: 'relationships',
      documentation:
        'Returns a list containing all the relationships in a path.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: PATH?',
        },
      ],
    },
    replace: {
      label: 'replace',
      documentation:
        'Returns a string in which all occurrences of a specified search string in the original string have been replaced by another (specified) replace string.',
      parameters: [
        {
          label: 'original',
          documentation: 'original :: STRING?',
        },
        {
          label: 'search',
          documentation: 'search :: STRING?',
        },
        {
          label: 'replace',
          documentation: 'replace :: STRING?',
        },
      ],
    },
    reverse: {
      label: 'reverse',
      documentation:
        'Returns a list in which the order of all elements in the original list have been reversed.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: LIST? OF ANY?',
        },
      ],
    },
    right: {
      label: 'right',
      documentation:
        'Returns a string containing the specified number of rightmost characters of the original string.',
      parameters: [
        {
          label: 'original',
          documentation: 'original :: STRING?',
        },
        {
          label: 'length',
          documentation: 'length :: INTEGER?',
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
          documentation: 'value :: FLOAT?',
        },
        {
          label: 'precision',
          documentation: 'precision :: NUMBER?',
        },
        {
          label: 'mode',
          documentation: 'mode :: STRING?',
        },
      ],
    },
    rtrim: {
      label: 'rtrim',
      documentation:
        'Returns the original string with trailing whitespace removed.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: STRING?',
        },
      ],
    },
    sign: {
      label: 'sign',
      documentation:
        'Returns the signum of a floating point number: 0 if the number is 0, -1 for any negative number, and 1 for any positive number.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT?',
        },
      ],
    },
    sin: {
      label: 'sin',
      documentation: 'Returns the sine of a number.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT?',
        },
      ],
    },
    single: {
      label: 'single',
      documentation:
        'Returns true if the predicate holds for exactly one of the elements in the given list.',
      parameters: [
        {
          label: 'variable',
          documentation: 'variable :: ANY?',
        },
        {
          label: 'list',
          documentation: 'list :: LIST? OF ANY?',
        },
      ],
    },
    size: {
      label: 'size',
      documentation: 'Returns the number of Unicode characters in a string.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: STRING?',
        },
      ],
    },
    split: {
      label: 'split',
      documentation:
        'Returns a list of strings resulting from the splitting of the original string around matches of any of the given delimiters.',
      parameters: [
        {
          label: 'original',
          documentation: 'original :: STRING?',
        },
        {
          label: 'splitDelimiters',
          documentation: 'splitDelimiters :: LIST? OF STRING?',
        },
      ],
    },
    sqrt: {
      label: 'sqrt',
      documentation: 'Returns the square root of a number.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT?',
        },
      ],
    },
    startNode: {
      label: 'startNode',
      documentation: 'Returns the start node of a relationship.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: RELATIONSHIP?',
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
          documentation: 'input :: FLOAT?',
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
          documentation: 'input :: FLOAT?',
        },
      ],
    },
    substring: {
      label: 'substring',
      documentation:
        "Returns a substring of length 'length' of the original string, beginning with a 0-based index start.",
      parameters: [
        {
          label: 'original',
          documentation: 'original :: STRING?',
        },
        {
          label: 'start',
          documentation: 'start :: INTEGER?',
        },
        {
          label: 'length',
          documentation: 'length :: INTEGER?',
        },
      ],
    },
    sum: {
      label: 'sum',
      documentation: 'Returns the sum of a set of durations',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: DURATION?',
        },
      ],
    },
    tail: {
      label: 'tail',
      documentation: 'Returns all but the first element in a list.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: LIST? OF ANY?',
        },
      ],
    },
    tan: {
      label: 'tan',
      documentation: 'Returns the tangent of a number.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT?',
        },
      ],
    },
    time: {
      label: 'time',
      documentation: 'Create a Time instant.',
      parameters: [
        {
          label: 'input',
          documentation: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
      ],
    },
    'time.realtime': {
      label: 'time.realtime',
      documentation: 'Get the current Time instant using the realtime clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
      ],
    },
    'time.statement': {
      label: 'time.statement',
      documentation: 'Get the current Time instant using the statement clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
      ],
    },
    'time.transaction': {
      label: 'time.transaction',
      documentation:
        'Get the current Time instant using the transaction clock.',
      parameters: [
        {
          label: 'timezone',
          documentation: 'timezone = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
      ],
    },
    'time.truncate': {
      label: 'time.truncate',
      documentation:
        'Truncate the input temporal value to a Time instant using the specified unit.',
      parameters: [
        {
          label: 'unit',
          documentation: 'unit :: STRING?',
        },
        {
          label: 'input',
          documentation: 'input = DEFAULT_TEMPORAL_ARGUMENT :: ANY?',
        },
        {
          label: 'fields',
          documentation: 'fields = null :: MAP?',
        },
      ],
    },
    toBoolean: {
      label: 'toBoolean',
      documentation:
        'Converts a integer value to a boolean value. 0 is defined to be FALSE and any other integer is defined to be TRUE.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: INTEGER?',
        },
      ],
    },
    toBooleanList: {
      label: 'toBooleanList',
      documentation:
        'Converts a list of values to a list of boolean values. If any values are not convertible to boolean they will be null in the list returned.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: LIST? OF ANY?',
        },
      ],
    },
    toBooleanOrNull: {
      label: 'toBooleanOrNull',
      documentation:
        'Converts a value to a boolean value, or null if the value cannot be converted.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY?',
        },
      ],
    },
    toFloat: {
      label: 'toFloat',
      documentation: 'Converts an integer value to a floating point value.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: NUMBER?',
        },
      ],
    },
    toFloatList: {
      label: 'toFloatList',
      documentation:
        'Converts a list of values to a list of float values. If any values are not convertible to float they will be null in the list returned.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: LIST? OF ANY?',
        },
      ],
    },
    toFloatOrNull: {
      label: 'toFloatOrNull',
      documentation:
        'Converts a value to a floating point value, or null if the value cannot be converted.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY?',
        },
      ],
    },
    toInteger: {
      label: 'toInteger',
      documentation:
        'Converts a boolean to an integer value. TRUE is defined to be 1 and FALSE is defined to be 0.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: BOOLEAN?',
        },
      ],
    },
    toIntegerList: {
      label: 'toIntegerList',
      documentation:
        'Converts a list of values to a list of integer values. If any values are not convertible to integer they will be null in the list returned.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: LIST? OF ANY?',
        },
      ],
    },
    toIntegerOrNull: {
      label: 'toIntegerOrNull',
      documentation:
        'Converts a value to an integer value, or null if the value cannot be converted.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY?',
        },
      ],
    },
    toLower: {
      label: 'toLower',
      documentation: 'Returns the original string in lowercase.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: STRING?',
        },
      ],
    },
    toString: {
      label: 'toString',
      documentation:
        'Converts an integer, float, boolean, point or temporal type (i.e. Date, Time, LocalTime, DateTime, LocalDateTime or Duration) value to a string.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY?',
        },
      ],
    },
    toStringList: {
      label: 'toStringList',
      documentation:
        'Converts a list of values to a list of string values. If any values are not convertible to string they will be null in the list returned.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: LIST? OF ANY?',
        },
      ],
    },
    toStringOrNull: {
      label: 'toStringOrNull',
      documentation:
        'Converts an integer, float, boolean, point or temporal type (i.e. Date, Time, LocalTime, DateTime, LocalDateTime or Duration) value to a string, or null if the value cannot be converted.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: ANY?',
        },
      ],
    },
    toUpper: {
      label: 'toUpper',
      documentation: 'Returns the original string in uppercase.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: STRING?',
        },
      ],
    },
    trim: {
      label: 'trim',
      documentation:
        'Returns the original string with leading and trailing whitespace removed.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: STRING?',
        },
      ],
    },
    type: {
      label: 'type',
      documentation:
        'Returns the string representation of the relationship type.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: RELATIONSHIP?',
        },
      ],
    },
  },
  procedureSignatures: {
    'apoc.algo.aStar': {
      label: 'apoc.algo.aStar',
      documentation:
        'Runs the A* search algorithm to find the optimal path between two nodes, using the given relationship property name for the cost function.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: NODE?',
        },
        {
          label: 'endNode',
          documentation: 'endNode :: NODE?',
        },
        {
          label: 'relTypesAndDirections',
          documentation: 'relTypesAndDirections :: STRING?',
        },
        {
          label: 'weightPropertyName',
          documentation: 'weightPropertyName :: STRING?',
        },
        {
          label: 'latPropertyName',
          documentation: 'latPropertyName :: STRING?',
        },
        {
          label: 'lonPropertyName',
          documentation: 'lonPropertyName :: STRING?',
        },
      ],
    },
    'apoc.algo.aStarConfig': {
      label: 'apoc.algo.aStarConfig',
      documentation:
        'Runs the A* search algorithm to find the optimal path between two nodes, using the given relationship property name for the cost function.\nThis procedure looks for weight, latitude and longitude properties in the config.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: NODE?',
        },
        {
          label: 'endNode',
          documentation: 'endNode :: NODE?',
        },
        {
          label: 'relTypesAndDirections',
          documentation: 'relTypesAndDirections :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config :: MAP?',
        },
      ],
    },
    'apoc.algo.allSimplePaths': {
      label: 'apoc.algo.allSimplePaths',
      documentation:
        'Runs a search algorithm to find all of the simple paths between the given relationships, up to a max depth described by maxNodes.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: NODE?',
        },
        {
          label: 'endNode',
          documentation: 'endNode :: NODE?',
        },
        {
          label: 'relTypesAndDirections',
          documentation: 'relTypesAndDirections :: STRING?',
        },
        {
          label: 'maxNodes',
          documentation: 'maxNodes :: INTEGER?',
        },
      ],
    },
    'apoc.algo.cover': {
      label: 'apoc.algo.cover',
      documentation: 'Returns all relationships between a given set of nodes.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY?',
        },
      ],
    },
    'apoc.algo.dijkstra': {
      label: 'apoc.algo.dijkstra',
      documentation:
        "Runs Dijkstra's algorithm using the given relationship property as the cost function.",
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: NODE?',
        },
        {
          label: 'endNode',
          documentation: 'endNode :: NODE?',
        },
        {
          label: 'relTypesAndDirections',
          documentation: 'relTypesAndDirections :: STRING?',
        },
        {
          label: 'weightPropertyName',
          documentation: 'weightPropertyName :: STRING?',
        },
        {
          label: 'defaultWeight',
          documentation: 'defaultWeight = NaN :: FLOAT?',
        },
        {
          label: 'numberOfWantedPaths',
          documentation: 'numberOfWantedPaths = 1 :: INTEGER?',
        },
      ],
    },
    'apoc.atomic.add': {
      label: 'apoc.atomic.add',
      documentation:
        'Sets the given property to the sum of itself and the number value.\nThe procedure then sets the property to the returned sum.',
      parameters: [
        {
          label: 'container',
          documentation: 'container :: ANY?',
        },
        {
          label: 'propertyName',
          documentation: 'propertyName :: STRING?',
        },
        {
          label: 'number',
          documentation: 'number :: NUMBER?',
        },
        {
          label: 'retryAttempts',
          documentation: 'retryAttempts = 5 :: INTEGER?',
        },
      ],
    },
    'apoc.atomic.concat': {
      label: 'apoc.atomic.concat',
      documentation:
        'Sets the given property to the concatenation of itself and the string value.\nThe procedure then sets the property to the returned string.',
      parameters: [
        {
          label: 'container',
          documentation: 'container :: ANY?',
        },
        {
          label: 'propertyName',
          documentation: 'propertyName :: STRING?',
        },
        {
          label: 'string',
          documentation: 'string :: STRING?',
        },
        {
          label: 'retryAttempts',
          documentation: 'retryAttempts = 5 :: INTEGER?',
        },
      ],
    },
    'apoc.atomic.insert': {
      label: 'apoc.atomic.insert',
      documentation:
        'Inserts a value at position into the array value of a property.\nThe procedure then sets the result back on the property.',
      parameters: [
        {
          label: 'container',
          documentation: 'container :: ANY?',
        },
        {
          label: 'propertyName',
          documentation: 'propertyName :: STRING?',
        },
        {
          label: 'position',
          documentation: 'position :: INTEGER?',
        },
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
        {
          label: 'retryAttempts',
          documentation: 'retryAttempts = 5 :: INTEGER?',
        },
      ],
    },
    'apoc.atomic.remove': {
      label: 'apoc.atomic.remove',
      documentation:
        'Removes the element at position from the array value of a property.\nThe procedure then sets the property to the resulting array value.',
      parameters: [
        {
          label: 'container',
          documentation: 'container :: ANY?',
        },
        {
          label: 'propertyName',
          documentation: 'propertyName :: STRING?',
        },
        {
          label: 'position',
          documentation: 'position :: INTEGER?',
        },
        {
          label: 'retryAttempts',
          documentation: 'retryAttempts = 5 :: INTEGER?',
        },
      ],
    },
    'apoc.atomic.subtract': {
      label: 'apoc.atomic.subtract',
      documentation:
        'Sets the property of a value to itself minus the given number value.\nThe procedure then sets the property to the returned sum.',
      parameters: [
        {
          label: 'container',
          documentation: 'container :: ANY?',
        },
        {
          label: 'propertyName',
          documentation: 'propertyName :: STRING?',
        },
        {
          label: 'number',
          documentation: 'number :: NUMBER?',
        },
        {
          label: 'retryAttempts',
          documentation: 'retryAttempts = 5 :: INTEGER?',
        },
      ],
    },
    'apoc.atomic.update': {
      label: 'apoc.atomic.update',
      documentation: 'Updates the value of a property with a Cypher operation.',
      parameters: [
        {
          label: 'container',
          documentation: 'container :: ANY?',
        },
        {
          label: 'propertyName',
          documentation: 'propertyName :: STRING?',
        },
        {
          label: 'operation',
          documentation: 'operation :: STRING?',
        },
        {
          label: 'retryAttempts',
          documentation: 'retryAttempts = 5 :: INTEGER?',
        },
      ],
    },
    'apoc.case': {
      label: 'apoc.case',
      documentation:
        'For each pair of conditional and read-only queries in the given list, this procedure will run the first query for which the conditional is evaluated to true.',
      parameters: [
        {
          label: 'conditionals',
          documentation: 'conditionals :: LIST? OF ANY?',
        },
        {
          label: 'elseQuery',
          documentation: 'elseQuery =  :: STRING?',
        },
        {
          label: 'params',
          documentation: 'params = {} :: MAP?',
        },
      ],
    },
    'apoc.coll.elements': {
      label: 'apoc.coll.elements',
      documentation:
        'Deconstructs a list of mixed types into identifiers indicating their specific type.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
        {
          label: 'limit',
          documentation: 'limit = -1 :: INTEGER?',
        },
        {
          label: 'offset',
          documentation: 'offset = 0 :: INTEGER?',
        },
      ],
    },
    'apoc.coll.pairWithOffset': {
      label: 'apoc.coll.pairWithOffset',
      documentation: 'Returns a list of pairs defined by the offset.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
        {
          label: 'offset',
          documentation: 'offset :: INTEGER?',
        },
      ],
    },
    'apoc.coll.partition': {
      label: 'apoc.coll.partition',
      documentation:
        'Partitions the original list into sub-lists of the given batch size.\nThe final list may be smaller than the given batch size.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
        {
          label: 'batchSize',
          documentation: 'batchSize :: INTEGER?',
        },
      ],
    },
    'apoc.coll.split': {
      label: 'apoc.coll.split',
      documentation:
        'Splits a collection by the given value. The value itself will not be part of the resulting lists.',
      parameters: [
        {
          label: 'coll',
          documentation: 'coll :: LIST? OF ANY?',
        },
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
      ],
    },
    'apoc.coll.zipToRows': {
      label: 'apoc.coll.zipToRows',
      documentation:
        'Returns the two lists zipped together, with one row per zipped pair.',
      parameters: [
        {
          label: 'list1',
          documentation: 'list1 :: LIST? OF ANY?',
        },
        {
          label: 'list2',
          documentation: 'list2 :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.convert.setJsonProperty': {
      label: 'apoc.convert.setJsonProperty',
      documentation:
        'Serializes the given JSON object and sets it as a property on the given node.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE?',
        },
        {
          label: 'key',
          documentation: 'key :: STRING?',
        },
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
      ],
    },
    'apoc.convert.toTree': {
      label: 'apoc.convert.toTree',
      documentation:
        'Returns a stream of maps, representing the given paths as a tree with at least one root.',
      parameters: [
        {
          label: 'paths',
          documentation: 'paths :: LIST? OF PATH?',
        },
        {
          label: 'lowerCaseRels',
          documentation: 'lowerCaseRels = true :: BOOLEAN?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.create.addLabels': {
      label: 'apoc.create.addLabels',
      documentation: 'Adds the given labels to the given nodes.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY?',
        },
        {
          label: 'labels',
          documentation: 'labels :: LIST? OF STRING?',
        },
      ],
    },
    'apoc.create.clonePathToVirtual': {
      label: 'apoc.create.clonePathToVirtual',
      documentation:
        'Takes the given path and returns a virtual representation of it.',
      parameters: [
        {
          label: 'path',
          documentation: 'path :: PATH?',
        },
      ],
    },
    'apoc.create.clonePathsToVirtual': {
      label: 'apoc.create.clonePathsToVirtual',
      documentation:
        'Takes the given paths and returns a virtual representation of them.',
      parameters: [
        {
          label: 'paths',
          documentation: 'paths :: LIST? OF PATH?',
        },
      ],
    },
    'apoc.create.node': {
      label: 'apoc.create.node',
      documentation: 'Creates a node with the given dynamic labels.',
      parameters: [
        {
          label: 'labels',
          documentation: 'labels :: LIST? OF STRING?',
        },
        {
          label: 'props',
          documentation: 'props :: MAP?',
        },
      ],
    },
    'apoc.create.nodes': {
      label: 'apoc.create.nodes',
      documentation: 'Creates nodes with the given dynamic labels.',
      parameters: [
        {
          label: 'labels',
          documentation: 'labels :: LIST? OF STRING?',
        },
        {
          label: 'props',
          documentation: 'props :: LIST? OF MAP?',
        },
      ],
    },
    'apoc.create.relationship': {
      label: 'apoc.create.relationship',
      documentation:
        'Creates a relationship with the given dynamic relationship type.',
      parameters: [
        {
          label: 'from',
          documentation: 'from :: NODE?',
        },
        {
          label: 'relType',
          documentation: 'relType :: STRING?',
        },
        {
          label: 'props',
          documentation: 'props :: MAP?',
        },
        {
          label: 'to',
          documentation: 'to :: NODE?',
        },
      ],
    },
    'apoc.create.removeLabels': {
      label: 'apoc.create.removeLabels',
      documentation: 'Removes the given labels from the given node(s).',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY?',
        },
        {
          label: 'labels',
          documentation: 'labels :: LIST? OF STRING?',
        },
      ],
    },
    'apoc.create.removeProperties': {
      label: 'apoc.create.removeProperties',
      documentation: 'Removes the given properties from the given node(s).',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY?',
        },
        {
          label: 'keys',
          documentation: 'keys :: LIST? OF STRING?',
        },
      ],
    },
    'apoc.create.removeRelProperties': {
      label: 'apoc.create.removeRelProperties',
      documentation:
        'Removes the given properties from the given relationship(s).',
      parameters: [
        {
          label: 'rels',
          documentation: 'rels :: ANY?',
        },
        {
          label: 'keys',
          documentation: 'keys :: LIST? OF STRING?',
        },
      ],
    },
    'apoc.create.setLabels': {
      label: 'apoc.create.setLabels',
      documentation:
        'Sets the given labels to the given node(s). Non-matching labels are removed from the nodes.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY?',
        },
        {
          label: 'labels',
          documentation: 'labels :: LIST? OF STRING?',
        },
      ],
    },
    'apoc.create.setProperties': {
      label: 'apoc.create.setProperties',
      documentation: 'Sets the given properties to the given node(s).',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY?',
        },
        {
          label: 'keys',
          documentation: 'keys :: LIST? OF STRING?',
        },
        {
          label: 'values',
          documentation: 'values :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.create.setProperty': {
      label: 'apoc.create.setProperty',
      documentation: 'Sets the given property to the given node(s).',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY?',
        },
        {
          label: 'key',
          documentation: 'key :: STRING?',
        },
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
      ],
    },
    'apoc.create.setRelProperties': {
      label: 'apoc.create.setRelProperties',
      documentation: 'Sets the given properties on the relationship(s).',
      parameters: [
        {
          label: 'rels',
          documentation: 'rels :: ANY?',
        },
        {
          label: 'keys',
          documentation: 'keys :: LIST? OF STRING?',
        },
        {
          label: 'values',
          documentation: 'values :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.create.setRelProperty': {
      label: 'apoc.create.setRelProperty',
      documentation: 'Sets the given property on the relationship(s).',
      parameters: [
        {
          label: 'rels',
          documentation: 'rels :: ANY?',
        },
        {
          label: 'key',
          documentation: 'key :: STRING?',
        },
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
      ],
    },
    'apoc.create.uuids': {
      label: 'apoc.create.uuids',
      documentation: 'Returns a stream of UUIDs.',
      parameters: [
        {
          label: 'count',
          documentation: 'count :: INTEGER?',
        },
      ],
    },
    'apoc.create.vNode': {
      label: 'apoc.create.vNode',
      documentation: 'Returns a virtual node.',
      parameters: [
        {
          label: 'labels',
          documentation: 'labels :: LIST? OF STRING?',
        },
        {
          label: 'props',
          documentation: 'props :: MAP?',
        },
      ],
    },
    'apoc.create.vNodes': {
      label: 'apoc.create.vNodes',
      documentation: 'Returns virtual nodes.',
      parameters: [
        {
          label: 'labels',
          documentation: 'labels :: LIST? OF STRING?',
        },
        {
          label: 'props',
          documentation: 'props :: LIST? OF MAP?',
        },
      ],
    },
    'apoc.create.vRelationship': {
      label: 'apoc.create.vRelationship',
      documentation: 'Returns a virtual relationship.',
      parameters: [
        {
          label: 'from',
          documentation: 'from :: NODE?',
        },
        {
          label: 'relType',
          documentation: 'relType :: STRING?',
        },
        {
          label: 'props',
          documentation: 'props :: MAP?',
        },
        {
          label: 'to',
          documentation: 'to :: NODE?',
        },
      ],
    },
    'apoc.create.virtualPath': {
      label: 'apoc.create.virtualPath',
      documentation: 'Returns a virtual path.',
      parameters: [
        {
          label: 'labelsN',
          documentation: 'labelsN :: LIST? OF STRING?',
        },
        {
          label: 'n',
          documentation: 'n :: MAP?',
        },
        {
          label: 'relType',
          documentation: 'relType :: STRING?',
        },
        {
          label: 'props',
          documentation: 'props :: MAP?',
        },
        {
          label: 'labelsM',
          documentation: 'labelsM :: LIST? OF STRING?',
        },
        {
          label: 'm',
          documentation: 'm :: MAP?',
        },
      ],
    },
    'apoc.cypher.doIt': {
      label: 'apoc.cypher.doIt',
      documentation:
        'Runs a dynamically constructed string with the given parameters.',
      parameters: [
        {
          label: 'statement',
          documentation: 'statement :: STRING?',
        },
        {
          label: 'params',
          documentation: 'params :: MAP?',
        },
      ],
    },
    'apoc.cypher.run': {
      label: 'apoc.cypher.run',
      documentation:
        'Runs a dynamically constructed read-only string with the given parameters.',
      parameters: [
        {
          label: 'statement',
          documentation: 'statement :: STRING?',
        },
        {
          label: 'params',
          documentation: 'params :: MAP?',
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
          documentation: 'statement :: STRING?',
        },
        {
          label: 'params',
          documentation: 'params :: MAP?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
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
          documentation: 'statement :: STRING?',
        },
        {
          label: 'params',
          documentation: 'params :: MAP?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
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
          documentation: 'statement :: STRING?',
        },
        {
          label: 'params',
          documentation: 'params :: MAP?',
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
          documentation: 'statement :: STRING?',
        },
        {
          label: 'params',
          documentation: 'params :: MAP?',
        },
        {
          label: 'timeout',
          documentation: 'timeout :: INTEGER?',
        },
      ],
    },
    'apoc.cypher.runWrite': {
      label: 'apoc.cypher.runWrite',
      documentation: 'Alias for `apoc.cypher.doIt`.',
      parameters: [
        {
          label: 'statement',
          documentation: 'statement :: STRING?',
        },
        {
          label: 'params',
          documentation: 'params :: MAP?',
        },
      ],
    },
    'apoc.do.case': {
      label: 'apoc.do.case',
      documentation:
        'For each pair of conditional queries in the given list, this procedure will run the first query for which the conditional is evaluated to true.',
      parameters: [
        {
          label: 'conditionals',
          documentation: 'conditionals :: LIST? OF ANY?',
        },
        {
          label: 'elseQuery',
          documentation: 'elseQuery =  :: STRING?',
        },
        {
          label: 'params',
          documentation: 'params = {} :: MAP?',
        },
      ],
    },
    'apoc.do.when': {
      label: 'apoc.do.when',
      documentation:
        'Runs the given read/write ifQuery if the conditional has evaluated to true, otherwise the elseQuery will run.',
      parameters: [
        {
          label: 'condition',
          documentation: 'condition :: BOOLEAN?',
        },
        {
          label: 'ifQuery',
          documentation: 'ifQuery :: STRING?',
        },
        {
          label: 'elseQuery',
          documentation: 'elseQuery =  :: STRING?',
        },
        {
          label: 'params',
          documentation: 'params = {} :: MAP?',
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
          documentation: 'file :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.export.arrow.graph': {
      label: 'apoc.export.arrow.graph',
      documentation: 'Exports the given graph as an arrow file.',
      parameters: [
        {
          label: 'file',
          documentation: 'file :: STRING?',
        },
        {
          label: 'graph',
          documentation: 'graph :: ANY?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
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
          documentation: 'file :: STRING?',
        },
        {
          label: 'query',
          documentation: 'query :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.export.arrow.stream.all': {
      label: 'apoc.export.arrow.stream.all',
      documentation: 'Exports the full database as an arrow byte array.',
      parameters: [
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.export.arrow.stream.graph': {
      label: 'apoc.export.arrow.stream.graph',
      documentation: 'Exports the given graph as an arrow byte array.',
      parameters: [
        {
          label: 'graph',
          documentation: 'graph :: ANY?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.export.arrow.stream.query': {
      label: 'apoc.export.arrow.stream.query',
      documentation: 'Exports the given Cypher query as an arrow byte array.',
      parameters: [
        {
          label: 'query',
          documentation: 'query :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.export.csv.all': {
      label: 'apoc.export.csv.all',
      documentation: 'Exports the full database to the provided CSV file.',
      parameters: [
        {
          label: 'file',
          documentation: 'file :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config :: MAP?',
        },
      ],
    },
    'apoc.export.csv.data': {
      label: 'apoc.export.csv.data',
      documentation:
        'Exports the given nodes and relationships to the provided CSV file.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST? OF NODE?',
        },
        {
          label: 'rels',
          documentation: 'rels :: LIST? OF RELATIONSHIP?',
        },
        {
          label: 'file',
          documentation: 'file :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config :: MAP?',
        },
      ],
    },
    'apoc.export.csv.graph': {
      label: 'apoc.export.csv.graph',
      documentation: 'Exports the given graph to the provided CSV file.',
      parameters: [
        {
          label: 'graph',
          documentation: 'graph :: MAP?',
        },
        {
          label: 'file',
          documentation: 'file :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config :: MAP?',
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
          documentation: 'query :: STRING?',
        },
        {
          label: 'file',
          documentation: 'file :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config :: MAP?',
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
          documentation: 'file =  :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.export.cypher.data': {
      label: 'apoc.export.cypher.data',
      documentation:
        'Exports the given nodes and relationships (incl. indexes) as Cypher statements to the provided file (default: Cypher Shell).',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST? OF NODE?',
        },
        {
          label: 'rels',
          documentation: 'rels :: LIST? OF RELATIONSHIP?',
        },
        {
          label: 'file',
          documentation: 'file =  :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
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
          documentation: 'graph :: MAP?',
        },
        {
          label: 'file',
          documentation: 'file =  :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.export.cypher.query': {
      label: 'apoc.export.cypher.query',
      documentation:
        'Exports the nodes and relationships from the given Cypher query (incl. indexes) as Cypher statements to the provided file (default: Cypher Shell).',
      parameters: [
        {
          label: 'statement',
          documentation: 'statement :: STRING?',
        },
        {
          label: 'file',
          documentation: 'file =  :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
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
          documentation: 'file =  :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.export.graphml.all': {
      label: 'apoc.export.graphml.all',
      documentation: 'Exports the full database to the provided GraphML file.',
      parameters: [
        {
          label: 'file',
          documentation: 'file :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config :: MAP?',
        },
      ],
    },
    'apoc.export.graphml.data': {
      label: 'apoc.export.graphml.data',
      documentation:
        'Exports the given nodes and relationships to the provided GraphML file.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST? OF NODE?',
        },
        {
          label: 'rels',
          documentation: 'rels :: LIST? OF RELATIONSHIP?',
        },
        {
          label: 'file',
          documentation: 'file :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config :: MAP?',
        },
      ],
    },
    'apoc.export.graphml.graph': {
      label: 'apoc.export.graphml.graph',
      documentation: 'Exports the given graph to the provided GraphML file.',
      parameters: [
        {
          label: 'graph',
          documentation: 'graph :: MAP?',
        },
        {
          label: 'file',
          documentation: 'file :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config :: MAP?',
        },
      ],
    },
    'apoc.export.graphml.query': {
      label: 'apoc.export.graphml.query',
      documentation:
        'Exports the given nodes and relationships from the Cypher statement to the provided GraphML file.',
      parameters: [
        {
          label: 'statement',
          documentation: 'statement :: STRING?',
        },
        {
          label: 'file',
          documentation: 'file :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config :: MAP?',
        },
      ],
    },
    'apoc.export.json.all': {
      label: 'apoc.export.json.all',
      documentation: 'Exports the full database to the provided JSON file.',
      parameters: [
        {
          label: 'file',
          documentation: 'file :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.export.json.data': {
      label: 'apoc.export.json.data',
      documentation:
        'Exports the given nodes and relationships to the provided JSON file.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST? OF NODE?',
        },
        {
          label: 'rels',
          documentation: 'rels :: LIST? OF RELATIONSHIP?',
        },
        {
          label: 'file',
          documentation: 'file :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.export.json.graph': {
      label: 'apoc.export.json.graph',
      documentation: 'Exports the given graph to the provided JSON file.',
      parameters: [
        {
          label: 'graph',
          documentation: 'graph :: MAP?',
        },
        {
          label: 'file',
          documentation: 'file :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
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
          documentation: 'statement :: STRING?',
        },
        {
          label: 'file',
          documentation: 'file :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.graph.from': {
      label: 'apoc.graph.from',
      documentation:
        'Generates a virtual sub-graph by extracting all of the nodes and relationships from the given data.',
      parameters: [
        {
          label: 'data',
          documentation: 'data :: ANY?',
        },
        {
          label: 'name',
          documentation: 'name :: STRING?',
        },
        {
          label: 'props',
          documentation: 'props :: MAP?',
        },
      ],
    },
    'apoc.graph.fromCypher': {
      label: 'apoc.graph.fromCypher',
      documentation:
        'Generates a virtual sub-graph by extracting all of the nodes and relationships from the data returned by the given Cypher statement.',
      parameters: [
        {
          label: 'statement',
          documentation: 'statement :: STRING?',
        },
        {
          label: 'params',
          documentation: 'params :: MAP?',
        },
        {
          label: 'name',
          documentation: 'name :: STRING?',
        },
        {
          label: 'props',
          documentation: 'props :: MAP?',
        },
      ],
    },
    'apoc.graph.fromDB': {
      label: 'apoc.graph.fromDB',
      documentation:
        'Generates a virtual sub-graph by extracting all of the nodes and relationships from the data returned by the given database.',
      parameters: [
        {
          label: 'name',
          documentation: 'name :: STRING?',
        },
        {
          label: 'props',
          documentation: 'props :: MAP?',
        },
      ],
    },
    'apoc.graph.fromData': {
      label: 'apoc.graph.fromData',
      documentation:
        'Generates a virtual sub-graph by extracting all of the nodes and relationships from the given data.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST? OF NODE?',
        },
        {
          label: 'rels',
          documentation: 'rels :: LIST? OF RELATIONSHIP?',
        },
        {
          label: 'name',
          documentation: 'name :: STRING?',
        },
        {
          label: 'props',
          documentation: 'props :: MAP?',
        },
      ],
    },
    'apoc.graph.fromDocument': {
      label: 'apoc.graph.fromDocument',
      documentation:
        'Generates a virtual sub-graph by extracting all of the nodes and relationships from the data returned by the given JSON file.',
      parameters: [
        {
          label: 'json',
          documentation: 'json :: ANY?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.graph.fromPath': {
      label: 'apoc.graph.fromPath',
      documentation:
        'Generates a virtual sub-graph by extracting all of the nodes and relationships from the data returned by the given path.',
      parameters: [
        {
          label: 'path',
          documentation: 'path :: PATH?',
        },
        {
          label: 'name',
          documentation: 'name :: STRING?',
        },
        {
          label: 'props',
          documentation: 'props :: MAP?',
        },
      ],
    },
    'apoc.graph.fromPaths': {
      label: 'apoc.graph.fromPaths',
      documentation:
        'Generates a virtual sub-graph by extracting all of the nodes and relationships from the data returned by the given paths.',
      parameters: [
        {
          label: 'paths',
          documentation: 'paths :: LIST? OF PATH?',
        },
        {
          label: 'name',
          documentation: 'name :: STRING?',
        },
        {
          label: 'props',
          documentation: 'props :: MAP?',
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
          documentation: 'json :: ANY?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.help': {
      label: 'apoc.help',
      documentation:
        'Returns descriptions of the available APOC procedures and functions.',
      parameters: [
        {
          label: 'proc',
          documentation: 'proc :: STRING?',
        },
      ],
    },
    'apoc.import.csv': {
      label: 'apoc.import.csv',
      documentation:
        'Imports nodes and relationships with the given labels and types from the provided CSV file.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST? OF MAP?',
        },
        {
          label: 'rels',
          documentation: 'rels :: LIST? OF MAP?',
        },
        {
          label: 'config',
          documentation: 'config :: MAP?',
        },
      ],
    },
    'apoc.import.graphml': {
      label: 'apoc.import.graphml',
      documentation: 'Imports a graph from the provided GraphML file.',
      parameters: [
        {
          label: 'urlOrBinaryFile',
          documentation: 'urlOrBinaryFile :: ANY?',
        },
        {
          label: 'config',
          documentation: 'config :: MAP?',
        },
      ],
    },
    'apoc.import.json': {
      label: 'apoc.import.json',
      documentation: 'Imports a graph from the provided JSON file.',
      parameters: [
        {
          label: 'urlOrBinaryFile',
          documentation: 'urlOrBinaryFile :: ANY?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.import.xml': {
      label: 'apoc.import.xml',
      documentation: 'Imports a graph from the provided XML file.',
      parameters: [
        {
          label: 'urlOrBinary',
          documentation: 'urlOrBinary :: ANY?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.load.arrow': {
      label: 'apoc.load.arrow',
      documentation:
        'Imports nodes and relationships from the provided arrow file.',
      parameters: [
        {
          label: 'file',
          documentation: 'file :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.load.arrow.stream': {
      label: 'apoc.load.arrow.stream',
      documentation:
        'Imports nodes and relationships from the provided arrow byte array.',
      parameters: [
        {
          label: 'source',
          documentation: 'source :: BYTEARRAY?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.load.json': {
      label: 'apoc.load.json',
      documentation:
        'Imports JSON file as a stream of values if the given JSON file is an array.\nIf the given JSON file is a map, this procedure imports a single value instead.',
      parameters: [
        {
          label: 'urlOrKeyOrBinary',
          documentation: 'urlOrKeyOrBinary :: ANY?',
        },
        {
          label: 'path',
          documentation: 'path =  :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
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
          documentation: 'url :: STRING?',
        },
        {
          label: 'path',
          documentation: 'path =  :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.load.jsonParams': {
      label: 'apoc.load.jsonParams',
      documentation:
        'Loads parameters from a JSON URL (e.g. web-API) as a stream of values if the given JSON file is an array.\nIf the given JSON file is a map, this procedure imports a single value instead.',
      parameters: [
        {
          label: 'urlOrKeyOrBinary',
          documentation: 'urlOrKeyOrBinary :: ANY?',
        },
        {
          label: 'headers',
          documentation: 'headers :: MAP?',
        },
        {
          label: 'payload',
          documentation: 'payload :: STRING?',
        },
        {
          label: 'path',
          documentation: 'path =  :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.load.xml': {
      label: 'apoc.load.xml',
      documentation:
        'Loads a single nested map from an XML URL (e.g. web-API).',
      parameters: [
        {
          label: 'urlOrBinary',
          documentation: 'urlOrBinary :: ANY?',
        },
        {
          label: 'path',
          documentation: 'path = / :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
        {
          label: 'simple',
          documentation: 'simple = false :: BOOLEAN?',
        },
      ],
    },
    'apoc.lock.all': {
      label: 'apoc.lock.all',
      documentation:
        'Acquires a write lock on the given nodes and relationships.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST? OF NODE?',
        },
        {
          label: 'rels',
          documentation: 'rels :: LIST? OF RELATIONSHIP?',
        },
      ],
    },
    'apoc.lock.nodes': {
      label: 'apoc.lock.nodes',
      documentation: 'Acquires a write lock on the given nodes.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST? OF NODE?',
        },
      ],
    },
    'apoc.lock.read.nodes': {
      label: 'apoc.lock.read.nodes',
      documentation: 'Acquires a read lock on the given nodes.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST? OF NODE?',
        },
      ],
    },
    'apoc.lock.read.rels': {
      label: 'apoc.lock.read.rels',
      documentation: 'Acquires a read lock on the given relationships.',
      parameters: [
        {
          label: 'rels',
          documentation: 'rels :: LIST? OF RELATIONSHIP?',
        },
      ],
    },
    'apoc.lock.rels': {
      label: 'apoc.lock.rels',
      documentation: 'Acquires a write lock on the given relationships.',
      parameters: [
        {
          label: 'rels',
          documentation: 'rels :: LIST? OF RELATIONSHIP?',
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
          documentation: 'path :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
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
          documentation: 'label :: STRING?',
        },
        {
          label: 'propertyY',
          documentation: 'propertyY :: STRING?',
        },
        {
          label: 'propertyX',
          documentation: 'propertyX :: STRING?',
        },
      ],
    },
    'apoc.merge.node': {
      label: 'apoc.merge.node',
      documentation: 'Merges the given node(s) with the given dynamic labels.',
      parameters: [
        {
          label: 'labels',
          documentation: 'labels :: LIST? OF STRING?',
        },
        {
          label: 'identProps',
          documentation: 'identProps :: MAP?',
        },
        {
          label: 'props',
          documentation: 'props = {} :: MAP?',
        },
        {
          label: 'onMatchProps',
          documentation: 'onMatchProps = {} :: MAP?',
        },
      ],
    },
    'apoc.merge.node.eager': {
      label: 'apoc.merge.node.eager',
      documentation:
        'Merges the given node(s) with the given dynamic labels eagerly.',
      parameters: [
        {
          label: 'labels',
          documentation: 'labels :: LIST? OF STRING?',
        },
        {
          label: 'identProps',
          documentation: 'identProps :: MAP?',
        },
        {
          label: 'props',
          documentation: 'props = {} :: MAP?',
        },
        {
          label: 'onMatchProps',
          documentation: 'onMatchProps = {} :: MAP?',
        },
      ],
    },
    'apoc.merge.nodeWithStats': {
      label: 'apoc.merge.nodeWithStats',
      documentation:
        'Merges the given node(s) with the given dynamic labels. Provides queryStatistics in the result.',
      parameters: [
        {
          label: 'labels',
          documentation: 'labels :: LIST? OF STRING?',
        },
        {
          label: 'identProps',
          documentation: 'identProps :: MAP?',
        },
        {
          label: 'props',
          documentation: 'props = {} :: MAP?',
        },
        {
          label: 'onMatchProps',
          documentation: 'onMatchProps = {} :: MAP?',
        },
      ],
    },
    'apoc.merge.nodeWithStats.eager': {
      label: 'apoc.merge.nodeWithStats.eager',
      documentation:
        'Merges the given node(s) with the given dynamic labels eagerly. Provides queryStatistics in the result.',
      parameters: [
        {
          label: 'labels',
          documentation: 'labels :: LIST? OF STRING?',
        },
        {
          label: 'identProps',
          documentation: 'identProps :: MAP?',
        },
        {
          label: 'props',
          documentation: 'props = {} :: MAP?',
        },
        {
          label: 'onMatchProps',
          documentation: 'onMatchProps = {} :: MAP?',
        },
      ],
    },
    'apoc.merge.relationship': {
      label: 'apoc.merge.relationship',
      documentation:
        'Merges the given relationship(s) with the given dynamic types/properties.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: NODE?',
        },
        {
          label: 'relType',
          documentation: 'relType :: STRING?',
        },
        {
          label: 'identProps',
          documentation: 'identProps :: MAP?',
        },
        {
          label: 'props',
          documentation: 'props :: MAP?',
        },
        {
          label: 'endNode',
          documentation: 'endNode :: NODE?',
        },
        {
          label: 'onMatchProps',
          documentation: 'onMatchProps = {} :: MAP?',
        },
      ],
    },
    'apoc.merge.relationship.eager': {
      label: 'apoc.merge.relationship.eager',
      documentation:
        'Merges the given relationship(s) with the given dynamic types/properties eagerly.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: NODE?',
        },
        {
          label: 'relType',
          documentation: 'relType :: STRING?',
        },
        {
          label: 'identProps',
          documentation: 'identProps :: MAP?',
        },
        {
          label: 'props',
          documentation: 'props :: MAP?',
        },
        {
          label: 'endNode',
          documentation: 'endNode :: NODE?',
        },
        {
          label: 'onMatchProps',
          documentation: 'onMatchProps = {} :: MAP?',
        },
      ],
    },
    'apoc.merge.relationshipWithStats': {
      label: 'apoc.merge.relationshipWithStats',
      documentation:
        'Merges the given relationship(s) with the given dynamic types/properties. Provides queryStatistics in the result.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: NODE?',
        },
        {
          label: 'relType',
          documentation: 'relType :: STRING?',
        },
        {
          label: 'identProps',
          documentation: 'identProps :: MAP?',
        },
        {
          label: 'props',
          documentation: 'props :: MAP?',
        },
        {
          label: 'endNode',
          documentation: 'endNode :: NODE?',
        },
        {
          label: 'onMatchProps',
          documentation: 'onMatchProps = {} :: MAP?',
        },
      ],
    },
    'apoc.merge.relationshipWithStats.eager': {
      label: 'apoc.merge.relationshipWithStats.eager',
      documentation:
        'Merges the given relationship(s) with the given dynamic types/properties eagerly. Provides queryStatistics in the result.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: NODE?',
        },
        {
          label: 'relType',
          documentation: 'relType :: STRING?',
        },
        {
          label: 'identProps',
          documentation: 'identProps :: MAP?',
        },
        {
          label: 'props',
          documentation: 'props :: MAP?',
        },
        {
          label: 'endNode',
          documentation: 'endNode :: NODE?',
        },
        {
          label: 'onMatchProps',
          documentation: 'onMatchProps = {} :: MAP?',
        },
      ],
    },
    'apoc.meta.data': {
      label: 'apoc.meta.data',
      documentation: 'Examines the full graph and returns a table of metadata.',
      parameters: [
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
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
          documentation: 'graph :: ANY?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.meta.graph': {
      label: 'apoc.meta.graph',
      documentation: 'Examines the full graph and returns a meta-graph.',
      parameters: [
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.meta.graph.of': {
      label: 'apoc.meta.graph.of',
      documentation: 'Examines the given sub-graph and returns a meta-graph.',
      parameters: [
        {
          label: 'graph',
          documentation: 'graph = {} :: ANY?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
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
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.meta.nodeTypeProperties': {
      label: 'apoc.meta.nodeTypeProperties',
      documentation:
        'Examines the full graph and returns a table of metadata with information about the nodes therein.',
      parameters: [
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.meta.relTypeProperties': {
      label: 'apoc.meta.relTypeProperties',
      documentation:
        'Examines the full graph and returns a table of metadata with information about the relationships therein.',
      parameters: [
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.meta.schema': {
      label: 'apoc.meta.schema',
      documentation:
        'Examines the given sub-graph and returns metadata as a map.',
      parameters: [
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
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
          documentation: 'config :: MAP?',
        },
      ],
    },
    'apoc.neighbors.athop': {
      label: 'apoc.neighbors.athop',
      documentation:
        'Returns all nodes connected by the given relationship types at the specified distance.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE?',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING?',
        },
        {
          label: 'distance',
          documentation: 'distance = 1 :: INTEGER?',
        },
      ],
    },
    'apoc.neighbors.athop.count': {
      label: 'apoc.neighbors.athop.count',
      documentation:
        'Returns the count of all nodes connected by the given relationship types at the specified distance.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE?',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING?',
        },
        {
          label: 'distance',
          documentation: 'distance = 1 :: INTEGER?',
        },
      ],
    },
    'apoc.neighbors.byhop': {
      label: 'apoc.neighbors.byhop',
      documentation:
        'Returns all nodes connected by the given relationship types within the specified distance.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE?',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING?',
        },
        {
          label: 'distance',
          documentation: 'distance = 1 :: INTEGER?',
        },
      ],
    },
    'apoc.neighbors.byhop.count': {
      label: 'apoc.neighbors.byhop.count',
      documentation:
        'Returns the count of all nodes connected by the given relationship types within the specified distance.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE?',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING?',
        },
        {
          label: 'distance',
          documentation: 'distance = 1 :: INTEGER?',
        },
      ],
    },
    'apoc.neighbors.tohop': {
      label: 'apoc.neighbors.tohop',
      documentation:
        'Returns all nodes connected by the given relationship types within the specified distance.\nNodes are returned individually for each row.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE?',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING?',
        },
        {
          label: 'distance',
          documentation: 'distance = 1 :: INTEGER?',
        },
      ],
    },
    'apoc.neighbors.tohop.count': {
      label: 'apoc.neighbors.tohop.count',
      documentation:
        'Returns the count of all nodes connected by the given relationships in the pattern within the specified distance.',
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE?',
        },
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING?',
        },
        {
          label: 'distance',
          documentation: 'distance = 1 :: INTEGER?',
        },
      ],
    },
    'apoc.nodes.collapse': {
      label: 'apoc.nodes.collapse',
      documentation:
        'Merges nodes together in the given list.\nThe nodes are then combined to become one node, with all labels of the previous nodes attached to it, and all relationships pointing to it.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST? OF NODE?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.nodes.cycles': {
      label: 'apoc.nodes.cycles',
      documentation:
        'Detects all path cycles in the given node list.\nThis procedure can be limited on relationships as well.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST? OF NODE?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.nodes.delete': {
      label: 'apoc.nodes.delete',
      documentation: 'Deletes all nodes with the given ids.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY?',
        },
        {
          label: 'batchSize',
          documentation: 'batchSize :: INTEGER?',
        },
      ],
    },
    'apoc.nodes.get': {
      label: 'apoc.nodes.get',
      documentation: 'Returns all nodes with the given ids.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY?',
        },
      ],
    },
    'apoc.nodes.group': {
      label: 'apoc.nodes.group',
      documentation:
        'Allows for the aggregation of nodes based on the given properties.\nThis procedure returns virtual nodes.',
      parameters: [
        {
          label: 'labels',
          documentation: 'labels :: LIST? OF STRING?',
        },
        {
          label: 'groupByProperties',
          documentation: 'groupByProperties :: LIST? OF STRING?',
        },
        {
          label: 'aggregations',
          documentation:
            'aggregations = [{*=count}, {*=count}] :: LIST? OF MAP?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.nodes.link': {
      label: 'apoc.nodes.link',
      documentation:
        'Creates a linked list of the given nodes connected by the given relationship type.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST? OF NODE?',
        },
        {
          label: 'type',
          documentation: 'type :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.nodes.rels': {
      label: 'apoc.nodes.rels',
      documentation: 'Returns all relationships with the given ids.',
      parameters: [
        {
          label: 'rels',
          documentation: 'rels :: ANY?',
        },
      ],
    },
    'apoc.path.expand': {
      label: 'apoc.path.expand',
      documentation:
        'Returns paths expanded from the start node following the given relationship types from min-depth to max-depth.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: ANY?',
        },
        {
          label: 'relFilter',
          documentation: 'relFilter :: STRING?',
        },
        {
          label: 'labelFilter',
          documentation: 'labelFilter :: STRING?',
        },
        {
          label: 'minDepth',
          documentation: 'minDepth :: INTEGER?',
        },
        {
          label: 'maxDepth',
          documentation: 'maxDepth :: INTEGER?',
        },
      ],
    },
    'apoc.path.expandConfig': {
      label: 'apoc.path.expandConfig',
      documentation:
        'Returns paths expanded from the start node the given relationship types from min-depth to max-depth.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: ANY?',
        },
        {
          label: 'config',
          documentation: 'config :: MAP?',
        },
      ],
    },
    'apoc.path.spanningTree': {
      label: 'apoc.path.spanningTree',
      documentation:
        'Returns spanning tree paths expanded from the start node following the given relationship types to max-depth.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: ANY?',
        },
        {
          label: 'config',
          documentation: 'config :: MAP?',
        },
      ],
    },
    'apoc.path.subgraphAll': {
      label: 'apoc.path.subgraphAll',
      documentation:
        'Returns the sub-graph reachable from the start node following the given relationship types to max-depth.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: ANY?',
        },
        {
          label: 'config',
          documentation: 'config :: MAP?',
        },
      ],
    },
    'apoc.path.subgraphNodes': {
      label: 'apoc.path.subgraphNodes',
      documentation:
        'Returns the nodes in the sub-graph reachable from the start node following the given relationship types to max-depth.',
      parameters: [
        {
          label: 'startNode',
          documentation: 'startNode :: ANY?',
        },
        {
          label: 'config',
          documentation: 'config :: MAP?',
        },
      ],
    },
    'apoc.periodic.cancel': {
      label: 'apoc.periodic.cancel',
      documentation: 'Cancels the given background job.',
      parameters: [
        {
          label: 'name',
          documentation: 'name :: STRING?',
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
          documentation: 'statement :: STRING?',
        },
        {
          label: 'params',
          documentation: 'params = {} :: MAP?',
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
          documentation: 'name :: STRING?',
        },
        {
          label: 'statement',
          documentation: 'statement :: STRING?',
        },
        {
          label: 'rate',
          documentation: 'rate :: INTEGER?',
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
          documentation: 'cypherIterate :: STRING?',
        },
        {
          label: 'cypherAction',
          documentation: 'cypherAction :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config :: MAP?',
        },
      ],
    },
    'apoc.periodic.list': {
      label: 'apoc.periodic.list',
      documentation: 'Returns a list of all background jobs.',
      parameters: [],
    },
    'apoc.periodic.repeat': {
      label: 'apoc.periodic.repeat',
      documentation:
        'Runs a repeatedly called background job.\nTo stop this procedure, use `apoc.periodic.cancel`.',
      parameters: [
        {
          label: 'name',
          documentation: 'name :: STRING?',
        },
        {
          label: 'statement',
          documentation: 'statement :: STRING?',
        },
        {
          label: 'rate',
          documentation: 'rate :: INTEGER?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
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
          documentation: 'name :: STRING?',
        },
        {
          label: 'statement',
          documentation: 'statement :: STRING?',
        },
        {
          label: 'params',
          documentation: 'params = {} :: MAP?',
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
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.refactor.categorize': {
      label: 'apoc.refactor.categorize',
      documentation:
        'Creates new category nodes from nodes in the graph with the specified sourceKey as one of its property keys.\nThe new category nodes are then connected to the original nodes with a relationship of the given type.',
      parameters: [
        {
          label: 'sourceKey',
          documentation: 'sourceKey :: STRING?',
        },
        {
          label: 'type',
          documentation: 'type :: STRING?',
        },
        {
          label: 'outgoing',
          documentation: 'outgoing :: BOOLEAN?',
        },
        {
          label: 'label',
          documentation: 'label :: STRING?',
        },
        {
          label: 'targetKey',
          documentation: 'targetKey :: STRING?',
        },
        {
          label: 'copiedKeys',
          documentation: 'copiedKeys :: LIST? OF STRING?',
        },
        {
          label: 'batchSize',
          documentation: 'batchSize :: INTEGER?',
        },
      ],
    },
    'apoc.refactor.cloneNodes': {
      label: 'apoc.refactor.cloneNodes',
      documentation:
        'Clones the given nodes with their labels and properties.\nIt is possible to skip any node properties using skipProperties (note: this only skips properties on nodes and not their relationships).',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST? OF NODE?',
        },
        {
          label: 'withRelationships',
          documentation: 'withRelationships = false :: BOOLEAN?',
        },
        {
          label: 'skipProperties',
          documentation: 'skipProperties = [] :: LIST? OF STRING?',
        },
      ],
    },
    'apoc.refactor.cloneSubgraph': {
      label: 'apoc.refactor.cloneSubgraph',
      documentation:
        'Clones the given nodes with their labels and properties (optionally skipping any properties in the skipProperties list via the config map), and clones the given relationships.\nIf no relationships are provided, all existing relationships between the given nodes will be cloned.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST? OF NODE?',
        },
        {
          label: 'rels',
          documentation: 'rels = [] :: LIST? OF RELATIONSHIP?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.refactor.cloneSubgraphFromPaths': {
      label: 'apoc.refactor.cloneSubgraphFromPaths',
      documentation:
        'Clones a sub-graph defined by the given list of paths.\nIt is possible to skip any node properties using the skipProperties list via the config map.',
      parameters: [
        {
          label: 'paths',
          documentation: 'paths :: LIST? OF PATH?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.refactor.collapseNode': {
      label: 'apoc.refactor.collapseNode',
      documentation:
        'Collapses the given node and replaces it with a relationship of the given type.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: ANY?',
        },
        {
          label: 'relType',
          documentation: 'relType :: STRING?',
        },
      ],
    },
    'apoc.refactor.deleteAndReconnect': {
      label: 'apoc.refactor.deleteAndReconnect',
      documentation:
        'Removes the given nodes from the path and reconnects the remaining nodes.',
      parameters: [
        {
          label: 'path',
          documentation: 'path :: PATH?',
        },
        {
          label: 'nodes',
          documentation: 'nodes :: LIST? OF NODE?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.refactor.extractNode': {
      label: 'apoc.refactor.extractNode',
      documentation:
        "Expands the given relationships into intermediate nodes.\nThe intermediate nodes are connected by the given 'OUT' and 'IN' types.",
      parameters: [
        {
          label: 'rels',
          documentation: 'rels :: ANY?',
        },
        {
          label: 'labels',
          documentation: 'labels :: LIST? OF STRING?',
        },
        {
          label: 'outType',
          documentation: 'outType :: STRING?',
        },
        {
          label: 'inType',
          documentation: 'inType :: STRING?',
        },
      ],
    },
    'apoc.refactor.from': {
      label: 'apoc.refactor.from',
      documentation:
        'Redirects the given relationship to the given start node.',
      parameters: [
        {
          label: 'rel',
          documentation: 'rel :: RELATIONSHIP?',
        },
        {
          label: 'newNode',
          documentation: 'newNode :: NODE?',
        },
      ],
    },
    'apoc.refactor.invert': {
      label: 'apoc.refactor.invert',
      documentation: 'Inverts the direction of the given relationship.',
      parameters: [
        {
          label: 'rel',
          documentation: 'rel :: RELATIONSHIP?',
        },
      ],
    },
    'apoc.refactor.mergeNodes': {
      label: 'apoc.refactor.mergeNodes',
      documentation:
        'Merges the given list of nodes onto the first node in the list.\nAll relationships are merged onto that node as well.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST? OF NODE?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.refactor.mergeRelationships': {
      label: 'apoc.refactor.mergeRelationships',
      documentation:
        'Merges the given list of relationships onto the first relationship in the list.',
      parameters: [
        {
          label: 'rels',
          documentation: 'rels :: LIST? OF RELATIONSHIP?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.refactor.normalizeAsBoolean': {
      label: 'apoc.refactor.normalizeAsBoolean',
      documentation: 'Refactors the given property to a boolean.',
      parameters: [
        {
          label: 'entity',
          documentation: 'entity :: ANY?',
        },
        {
          label: 'propertyKey',
          documentation: 'propertyKey :: STRING?',
        },
        {
          label: 'trueValues',
          documentation: 'trueValues :: LIST? OF ANY?',
        },
        {
          label: 'falseValues',
          documentation: 'falseValues :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.refactor.rename.label': {
      label: 'apoc.refactor.rename.label',
      documentation:
        "Renames the given label from 'oldLabel' to 'newLabel' for all nodes.\nIf a list of nodes is provided, the renaming is applied to the nodes within this list only.",
      parameters: [
        {
          label: 'oldLabel',
          documentation: 'oldLabel :: STRING?',
        },
        {
          label: 'newLabel',
          documentation: 'newLabel :: STRING?',
        },
        {
          label: 'nodes',
          documentation: 'nodes = [] :: LIST? OF NODE?',
        },
      ],
    },
    'apoc.refactor.rename.nodeProperty': {
      label: 'apoc.refactor.rename.nodeProperty',
      documentation:
        "Renames the given property from 'oldName' to 'newName' for all nodes.\nIf a list of nodes is provided, the renaming is applied to the nodes within this list only.",
      parameters: [
        {
          label: 'oldName',
          documentation: 'oldName :: STRING?',
        },
        {
          label: 'newName',
          documentation: 'newName :: STRING?',
        },
        {
          label: 'nodes',
          documentation: 'nodes = [] :: LIST? OF NODE?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.refactor.rename.type': {
      label: 'apoc.refactor.rename.type',
      documentation:
        "Renames all relationships with type 'oldType' to 'newType'.\nIf a list of relationships is provided, the renaming is applied to the relationships within this list only.",
      parameters: [
        {
          label: 'oldType',
          documentation: 'oldType :: STRING?',
        },
        {
          label: 'newType',
          documentation: 'newType :: STRING?',
        },
        {
          label: 'rels',
          documentation: 'rels = [] :: LIST? OF RELATIONSHIP?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.refactor.rename.typeProperty': {
      label: 'apoc.refactor.rename.typeProperty',
      documentation:
        "Renames the given property from 'oldName' to 'newName' for all relationships.\nIf a list of relationships is provided, the renaming is applied to the relationships within this list only.",
      parameters: [
        {
          label: 'oldName',
          documentation: 'oldName :: STRING?',
        },
        {
          label: 'newName',
          documentation: 'newName :: STRING?',
        },
        {
          label: 'rels',
          documentation: 'rels = [] :: LIST? OF RELATIONSHIP?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.refactor.setType': {
      label: 'apoc.refactor.setType',
      documentation: 'Changes the type of the given relationship.',
      parameters: [
        {
          label: 'rel',
          documentation: 'rel :: RELATIONSHIP?',
        },
        {
          label: 'newType',
          documentation: 'newType :: STRING?',
        },
      ],
    },
    'apoc.refactor.to': {
      label: 'apoc.refactor.to',
      documentation: 'Redirects the given relationship to the given end node.',
      parameters: [
        {
          label: 'rel',
          documentation: 'rel :: RELATIONSHIP?',
        },
        {
          label: 'endNode',
          documentation: 'endNode :: NODE?',
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
          documentation: 'indexes :: MAP?',
        },
        {
          label: 'constraints',
          documentation: 'constraints :: MAP?',
        },
        {
          label: 'dropExisting',
          documentation: 'dropExisting = true :: BOOLEAN?',
        },
      ],
    },
    'apoc.schema.nodes': {
      label: 'apoc.schema.nodes',
      documentation:
        'Returns all indexes and constraints information for all node labels in the database.\nIt is possible to define a set of labels to include or exclude in the config parameters.',
      parameters: [
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.schema.properties.distinct': {
      label: 'apoc.schema.properties.distinct',
      documentation:
        'Returns all distinct node property values for the given key.',
      parameters: [
        {
          label: 'label',
          documentation: 'label :: STRING?',
        },
        {
          label: 'key',
          documentation: 'key :: STRING?',
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
          documentation: 'label =  :: STRING?',
        },
        {
          label: 'key',
          documentation: 'key =  :: STRING?',
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
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.search.multiSearchReduced': {
      label: 'apoc.search.multiSearchReduced',
      documentation:
        'Returns a reduced representation of the nodes found after a parallel search over multiple indexes.\nThe reduced node representation includes: node id, node labels and the searched properties.',
      parameters: [
        {
          label: 'labelPropertyMap',
          documentation: 'labelPropertyMap :: ANY?',
        },
        {
          label: 'operator',
          documentation: 'operator :: STRING?',
        },
        {
          label: 'value',
          documentation: 'value :: STRING?',
        },
      ],
    },
    'apoc.search.node': {
      label: 'apoc.search.node',
      documentation:
        'Returns all the distinct nodes found after a parallel search over multiple indexes.',
      parameters: [
        {
          label: 'labelPropertyMap',
          documentation: 'labelPropertyMap :: ANY?',
        },
        {
          label: 'operator',
          documentation: 'operator :: STRING?',
        },
        {
          label: 'value',
          documentation: 'value :: STRING?',
        },
      ],
    },
    'apoc.search.nodeAll': {
      label: 'apoc.search.nodeAll',
      documentation:
        'Returns all the nodes found after a parallel search over multiple indexes.',
      parameters: [
        {
          label: 'labelPropertyMap',
          documentation: 'labelPropertyMap :: ANY?',
        },
        {
          label: 'operator',
          documentation: 'operator :: STRING?',
        },
        {
          label: 'value',
          documentation: 'value :: STRING?',
        },
      ],
    },
    'apoc.search.nodeAllReduced': {
      label: 'apoc.search.nodeAllReduced',
      documentation:
        'Returns a reduced representation of the nodes found after a parallel search over multiple indexes.\nThe reduced node representation includes: node id, node labels and the searched properties.',
      parameters: [
        {
          label: 'labelPropertyMap',
          documentation: 'labelPropertyMap :: ANY?',
        },
        {
          label: 'operator',
          documentation: 'operator :: STRING?',
        },
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
      ],
    },
    'apoc.search.nodeReduced': {
      label: 'apoc.search.nodeReduced',
      documentation:
        'Returns a reduced representation of the distinct nodes found after a parallel search over multiple indexes.\nThe reduced node representation includes: node id, node labels and the searched properties.',
      parameters: [
        {
          label: 'labelPropertyMap',
          documentation: 'labelPropertyMap :: ANY?',
        },
        {
          label: 'operator',
          documentation: 'operator :: STRING?',
        },
        {
          label: 'value',
          documentation: 'value :: STRING?',
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
          documentation: 'location :: STRING?',
        },
        {
          label: 'maxResults',
          documentation: 'maxResults = 100 :: INTEGER?',
        },
        {
          label: 'quotaException',
          documentation: 'quotaException = false :: BOOLEAN?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
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
          documentation: 'location :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
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
          documentation: 'latitude :: FLOAT?',
        },
        {
          label: 'longitude',
          documentation: 'longitude :: FLOAT?',
        },
        {
          label: 'quotaException',
          documentation: 'quotaException = false :: BOOLEAN?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.spatial.sortByDistance': {
      label: 'apoc.spatial.sortByDistance',
      documentation:
        'Sorts the given collection of paths by the sum of their distance based on the latitude/longitude values on the nodes.',
      parameters: [
        {
          label: 'paths',
          documentation: 'paths :: LIST? OF PATH?',
        },
      ],
    },
    'apoc.stats.degrees': {
      label: 'apoc.stats.degrees',
      documentation:
        'Returns the percentile groupings of the degrees on the nodes connected by the given relationship types.',
      parameters: [
        {
          label: 'relTypes',
          documentation: 'relTypes =  :: STRING?',
        },
      ],
    },
    'apoc.text.phoneticDelta': {
      label: 'apoc.text.phoneticDelta',
      documentation:
        'Returns the US_ENGLISH soundex character difference between the two given strings.',
      parameters: [
        {
          label: 'text1',
          documentation: 'text1 :: STRING?',
        },
        {
          label: 'text2',
          documentation: 'text2 :: STRING?',
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
          documentation: 'name :: STRING?',
        },
        {
          label: 'statement',
          documentation: 'statement :: STRING?',
        },
        {
          label: 'selector',
          documentation: 'selector :: MAP?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'apoc.trigger.drop': {
      label: 'apoc.trigger.drop',
      documentation: 'Eventually removes the given trigger.',
      parameters: [
        {
          label: 'databaseName',
          documentation: 'databaseName :: STRING?',
        },
        {
          label: 'name',
          documentation: 'name :: STRING?',
        },
      ],
    },
    'apoc.trigger.dropAll': {
      label: 'apoc.trigger.dropAll',
      documentation: 'Eventually removes all triggers from the given database.',
      parameters: [
        {
          label: 'databaseName',
          documentation: 'databaseName :: STRING?',
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
          documentation: 'databaseName :: STRING?',
        },
        {
          label: 'name',
          documentation: 'name :: STRING?',
        },
        {
          label: 'statement',
          documentation: 'statement :: STRING?',
        },
        {
          label: 'selector',
          documentation: 'selector :: MAP?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
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
          documentation: 'name :: STRING?',
        },
      ],
    },
    'apoc.trigger.remove': {
      label: 'apoc.trigger.remove',
      documentation: 'Removes the given trigger.',
      parameters: [
        {
          label: 'name',
          documentation: 'name :: STRING?',
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
          documentation: 'name :: STRING?',
        },
      ],
    },
    'apoc.trigger.show': {
      label: 'apoc.trigger.show',
      documentation: 'Lists all eventually installed triggers for a database.',
      parameters: [
        {
          label: 'databaseName',
          documentation: 'databaseName :: STRING?',
        },
      ],
    },
    'apoc.trigger.start': {
      label: 'apoc.trigger.start',
      documentation: 'Eventually restarts the given paused trigger.',
      parameters: [
        {
          label: 'databaseName',
          documentation: 'databaseName :: STRING?',
        },
        {
          label: 'name',
          documentation: 'name :: STRING?',
        },
      ],
    },
    'apoc.trigger.stop': {
      label: 'apoc.trigger.stop',
      documentation: 'Eventually stops the given trigger.',
      parameters: [
        {
          label: 'databaseName',
          documentation: 'databaseName :: STRING?',
        },
        {
          label: 'name',
          documentation: 'name :: STRING?',
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
          documentation: 'duration :: INTEGER?',
        },
      ],
    },
    'apoc.util.validate': {
      label: 'apoc.util.validate',
      documentation: 'If the given predicate is true an exception is thrown.',
      parameters: [
        {
          label: 'predicate',
          documentation: 'predicate :: BOOLEAN?',
        },
        {
          label: 'message',
          documentation: 'message :: STRING?',
        },
        {
          label: 'params',
          documentation: 'params :: LIST? OF ANY?',
        },
      ],
    },
    'apoc.warmup.run': {
      label: 'apoc.warmup.run',
      documentation:
        'Loads all nodes and relationships in the database into memory.',
      parameters: [
        {
          label: 'loadProperties',
          documentation: 'loadProperties = false :: BOOLEAN?',
        },
        {
          label: 'loadDynamicProperties',
          documentation: 'loadDynamicProperties = false :: BOOLEAN?',
        },
        {
          label: 'loadIndexes',
          documentation: 'loadIndexes = false :: BOOLEAN?',
        },
      ],
    },
    'apoc.when': {
      label: 'apoc.when',
      documentation:
        'This procedure will run the read-only ifQuery if the conditional has evaluated to true, otherwise the elseQuery will run.',
      parameters: [
        {
          label: 'condition',
          documentation: 'condition :: BOOLEAN?',
        },
        {
          label: 'ifQuery',
          documentation: 'ifQuery :: STRING?',
        },
        {
          label: 'elseQuery',
          documentation: 'elseQuery =  :: STRING?',
        },
        {
          label: 'params',
          documentation: 'params = {} :: MAP?',
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
          documentation: 'indexName :: STRING?',
        },
        {
          label: 'timeOutSeconds',
          documentation: 'timeOutSeconds = 300 :: INTEGER?',
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
          documentation: 'timeOutSeconds = 300 :: INTEGER?',
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
    'db.create.setVectorProperty': {
      label: 'db.create.setVectorProperty',
      documentation:
        "Set a vector property on a given node in a more space efficient representation than Cypher's SET.",
      parameters: [
        {
          label: 'node',
          documentation: 'node :: NODE?',
        },
        {
          label: 'key',
          documentation: 'key :: STRING?',
        },
        {
          label: 'vector',
          documentation: 'vector :: LIST? OF FLOAT?',
        },
      ],
    },
    'db.createLabel': {
      label: 'db.createLabel',
      documentation: 'Create a label',
      parameters: [
        {
          label: 'newLabel',
          documentation: 'newLabel :: STRING?',
        },
      ],
    },
    'db.createProperty': {
      label: 'db.createProperty',
      documentation: 'Create a Property',
      parameters: [
        {
          label: 'newProperty',
          documentation: 'newProperty :: STRING?',
        },
      ],
    },
    'db.createRelationshipType': {
      label: 'db.createRelationshipType',
      documentation: 'Create a RelationshipType',
      parameters: [
        {
          label: 'newRelationshipType',
          documentation: 'newRelationshipType :: STRING?',
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
        "Query the given full-text index. Returns the matching nodes, and their Lucene query score, ordered by score. Valid keys for the options map are: 'skip' to skip the top N results; 'limit' to limit the number of results returned; 'analyzer' to use the specified analyzer as search analyzer for this query.",
      parameters: [
        {
          label: 'indexName',
          documentation: 'indexName :: STRING?',
        },
        {
          label: 'queryString',
          documentation: 'queryString :: STRING?',
        },
        {
          label: 'options',
          documentation: 'options = {} :: MAP?',
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
          documentation: 'indexName :: STRING?',
        },
        {
          label: 'queryString',
          documentation: 'queryString :: STRING?',
        },
        {
          label: 'options',
          documentation: 'options = {} :: MAP?',
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
          documentation: 'indexName :: STRING?',
        },
        {
          label: 'label',
          documentation: 'label :: STRING?',
        },
        {
          label: 'propertyKey',
          documentation: 'propertyKey :: STRING?',
        },
        {
          label: 'vectorDimension',
          documentation: 'vectorDimension :: INTEGER?',
        },
        {
          label: 'vectorSimilarityFunction',
          documentation: 'vectorSimilarityFunction :: STRING?',
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
          documentation: 'indexName :: STRING?',
        },
        {
          label: 'numberOfNearestNeighbours',
          documentation: 'numberOfNearestNeighbours :: INTEGER?',
        },
        {
          label: 'query',
          documentation: 'query :: LIST? OF FLOAT?',
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
      documentation: 'List all available labels in the database.',
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
          documentation: 'timeOutSeconds = 300 :: INTEGER?',
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
      documentation: 'List all available relationship types in the database.',
      parameters: [],
    },
    'db.resampleIndex': {
      label: 'db.resampleIndex',
      documentation:
        'Schedule resampling of an index (for example: CALL db.resampleIndex("MyIndex")).',
      parameters: [
        {
          label: 'indexName',
          documentation: 'indexName :: STRING?',
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
          documentation: 'section :: STRING?',
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
          documentation: 'section :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
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
          documentation: 'section :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
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
          documentation: 'graphToken :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
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
          documentation: 'section :: STRING?',
        },
      ],
    },
    'dbms.checkConfigValue': {
      label: 'dbms.checkConfigValue',
      documentation: 'Check if a potential config setting value is valid.',
      parameters: [
        {
          label: 'setting',
          documentation: 'setting :: STRING?',
        },
        {
          label: 'value',
          documentation: 'value :: STRING?',
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
          documentation: 'port-name = null :: STRING?',
        },
        {
          label: 'server',
          documentation: 'server = null :: STRING?',
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
          documentation: 'server :: STRING?',
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
          documentation: 'databaseName :: STRING?',
        },
        {
          label: 'pause',
          documentation: 'pause :: BOOLEAN?',
        },
      ],
    },
    'dbms.cluster.routing.getRoutingTable': {
      label: 'dbms.cluster.routing.getRoutingTable',
      documentation:
        "Returns the advertised bolt capable endpoints for a given database, divided by each endpoint's capabilities. For example an endpoint may serve read queries, write queries and/or future getRoutingTable requests.",
      parameters: [
        {
          label: 'context',
          documentation: 'context :: MAP?',
        },
        {
          label: 'database',
          documentation: 'database = null :: STRING?',
        },
      ],
    },
    'dbms.cluster.secondaryReplicationDisable': {
      label: 'dbms.cluster.secondaryReplicationDisable',
      documentation:
        'The toggle can pause or resume the secondary replication process',
      parameters: [
        {
          label: 'databaseName',
          documentation: 'databaseName :: STRING?',
        },
        {
          label: 'pause',
          documentation: 'pause :: BOOLEAN?',
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
          documentation: 'autoEnable :: BOOLEAN?',
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
          documentation: 'server :: STRING?',
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
          documentation: 'id :: STRING?',
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
          documentation: 'ids :: LIST? OF STRING?',
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
          documentation: 'queryId :: STRING?',
        },
      ],
    },
    'dbms.listCapabilities': {
      label: 'dbms.listCapabilities',
      documentation: 'List capabilities',
      parameters: [],
    },
    'dbms.listConfig': {
      label: 'dbms.listConfig',
      documentation: 'List the currently active config of Neo4j.',
      parameters: [
        {
          label: 'searchString',
          documentation: 'searchString =  :: STRING?',
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
      documentation: 'Place a database into quarantine or remove from it.',
      parameters: [
        {
          label: 'databaseName',
          documentation: 'databaseName :: STRING?',
        },
        {
          label: 'setStatus',
          documentation: 'setStatus :: BOOLEAN?',
        },
        {
          label: 'reason',
          documentation: 'reason = No reason given :: STRING?',
        },
      ],
    },
    'dbms.queryJmx': {
      label: 'dbms.queryJmx',
      documentation:
        'Query JMX management data by domain and name. For instance, "*:*"',
      parameters: [
        {
          label: 'query',
          documentation: 'query :: STRING?',
        },
      ],
    },
    'dbms.routing.getRoutingTable': {
      label: 'dbms.routing.getRoutingTable',
      documentation:
        "Returns the advertised bolt capable endpoints for a given database, divided by each endpoint's capabilities. For example an endpoint may serve read queries, write queries and/or future getRoutingTable requests.",
      parameters: [
        {
          label: 'context',
          documentation: 'context :: MAP?',
        },
        {
          label: 'database',
          documentation: 'database = null :: STRING?',
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
        'Updates a given setting value. Passing an empty value will result in removing the configured value and falling back to the default value. Changes will not persist and will be lost if the server is restarted.',
      parameters: [
        {
          label: 'setting',
          documentation: 'setting :: STRING?',
        },
        {
          label: 'value',
          documentation: 'value :: STRING?',
        },
      ],
    },
    'dbms.setDatabaseAllocator': {
      label: 'dbms.setDatabaseAllocator',
      documentation:
        'With this method you can set the allocator, which is responsible to select servers for hosting databases.',
      parameters: [
        {
          label: 'allocator',
          documentation: 'allocator :: STRING?',
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
          documentation: 'primaries :: INTEGER?',
        },
        {
          label: 'secondaries',
          documentation: 'secondaries :: INTEGER?',
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
          documentation: 'databaseName :: STRING?',
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
    'gds.allShortestPaths.delta.mutate': {
      label: 'gds.allShortestPaths.delta.mutate',
      documentation:
        'The Delta Stepping shortest path algorithm computes the shortest (weighted) path between one node and any other node in the graph. The computation is run multi-threaded',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.allShortestPaths.delta.mutate.estimate': {
      label: 'gds.allShortestPaths.delta.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.allShortestPaths.delta.stats': {
      label: 'gds.allShortestPaths.delta.stats',
      documentation:
        'The Delta Stepping shortest path algorithm computes the shortest (weighted) path between one node and any other node in the graph. The computation is run multi-threaded',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.allShortestPaths.delta.stats.estimate': {
      label: 'gds.allShortestPaths.delta.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.allShortestPaths.delta.stream': {
      label: 'gds.allShortestPaths.delta.stream',
      documentation:
        'The Delta Stepping shortest path algorithm computes the shortest (weighted) path between one node and any other node in the graph. The computation is run multi-threaded',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.allShortestPaths.delta.stream.estimate': {
      label: 'gds.allShortestPaths.delta.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.allShortestPaths.delta.write': {
      label: 'gds.allShortestPaths.delta.write',
      documentation:
        'The Delta Stepping shortest path algorithm computes the shortest (weighted) path between one node and any other node in the graph. The computation is run multi-threaded',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.allShortestPaths.delta.write.estimate': {
      label: 'gds.allShortestPaths.delta.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.allShortestPaths.dijkstra.mutate': {
      label: 'gds.allShortestPaths.dijkstra.mutate',
      documentation:
        'The Dijkstra shortest path algorithm computes the shortest (weighted) path between one node and any other node in the graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.allShortestPaths.dijkstra.mutate.estimate': {
      label: 'gds.allShortestPaths.dijkstra.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.allShortestPaths.dijkstra.stream': {
      label: 'gds.allShortestPaths.dijkstra.stream',
      documentation:
        'The Dijkstra shortest path algorithm computes the shortest (weighted) path between one node and any other node in the graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.allShortestPaths.dijkstra.stream.estimate': {
      label: 'gds.allShortestPaths.dijkstra.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.allShortestPaths.dijkstra.write': {
      label: 'gds.allShortestPaths.dijkstra.write',
      documentation:
        'The Dijkstra shortest path algorithm computes the shortest (weighted) path between one node and any other node in the graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.allShortestPaths.dijkstra.write.estimate': {
      label: 'gds.allShortestPaths.dijkstra.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.allShortestPaths.stream': {
      label: 'gds.allShortestPaths.stream',
      documentation:
        'The All Pairs Shortest Path (APSP) calculates the shortest (weighted) path between all pairs of nodes.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.alpha.ml.splitRelationships.mutate': {
      label: 'gds.alpha.ml.splitRelationships.mutate',
      documentation:
        'Splits a graph into holdout and remaining relationship types and adds them to the graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.alpha.pipeline.linkPrediction.addMLP': {
      label: 'gds.alpha.pipeline.linkPrediction.addMLP',
      documentation:
        'Add a multilayer perceptron configuration to the parameter space of the link prediction train pipeline.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'gds.alpha.pipeline.linkPrediction.configureAutoTuning': {
      label: 'gds.alpha.pipeline.linkPrediction.configureAutoTuning',
      documentation:
        'Configures the auto-tuning of the link prediction pipeline.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration :: MAP?',
        },
      ],
    },
    'gds.alpha.pipeline.nodeClassification.addMLP': {
      label: 'gds.alpha.pipeline.nodeClassification.addMLP',
      documentation:
        'Add a multilayer perceptron configuration to the parameter space of the node classification train pipeline.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'gds.alpha.pipeline.nodeClassification.configureAutoTuning': {
      label: 'gds.alpha.pipeline.nodeClassification.configureAutoTuning',
      documentation:
        'Configures the auto-tuning of the node classification pipeline.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration :: MAP?',
        },
      ],
    },
    'gds.alpha.pipeline.nodeRegression.addLinearRegression': {
      label: 'gds.alpha.pipeline.nodeRegression.addLinearRegression',
      documentation:
        'Add a linear regression model candidate to a node regression pipeline.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.alpha.pipeline.nodeRegression.addNodeProperty': {
      label: 'gds.alpha.pipeline.nodeRegression.addNodeProperty',
      documentation:
        'Add a node property step to an existing node regression training pipeline.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
        {
          label: 'procedureName',
          documentation: 'procedureName :: STRING?',
        },
        {
          label: 'procedureConfiguration',
          documentation: 'procedureConfiguration :: MAP?',
        },
      ],
    },
    'gds.alpha.pipeline.nodeRegression.addRandomForest': {
      label: 'gds.alpha.pipeline.nodeRegression.addRandomForest',
      documentation:
        'Add a random forest model candidate to a node regression pipeline.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration :: MAP?',
        },
      ],
    },
    'gds.alpha.pipeline.nodeRegression.configureAutoTuning': {
      label: 'gds.alpha.pipeline.nodeRegression.configureAutoTuning',
      documentation:
        'Configures the auto-tuning of a node regression pipeline.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration :: MAP?',
        },
      ],
    },
    'gds.alpha.pipeline.nodeRegression.configureSplit': {
      label: 'gds.alpha.pipeline.nodeRegression.configureSplit',
      documentation:
        'Configures the graph splitting of a node regression pipeline.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration :: MAP?',
        },
      ],
    },
    'gds.alpha.pipeline.nodeRegression.create': {
      label: 'gds.alpha.pipeline.nodeRegression.create',
      documentation:
        'Creates a node regression training pipeline in the pipeline catalog.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
      ],
    },
    'gds.alpha.pipeline.nodeRegression.predict.mutate': {
      label: 'gds.alpha.pipeline.nodeRegression.predict.mutate',
      documentation:
        'Predicts target node property using a previously trained `NodeRegression` model',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.alpha.pipeline.nodeRegression.predict.stream': {
      label: 'gds.alpha.pipeline.nodeRegression.predict.stream',
      documentation:
        'Predicts target node property using a previously trained `NodeRegression` model',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration :: MAP?',
        },
      ],
    },
    'gds.alpha.pipeline.nodeRegression.selectFeatures': {
      label: 'gds.alpha.pipeline.nodeRegression.selectFeatures',
      documentation:
        'Add one or several features to an existing node regression training pipeline.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
        {
          label: 'featureProperties',
          documentation: 'featureProperties :: ANY?',
        },
      ],
    },
    'gds.alpha.pipeline.nodeRegression.train': {
      label: 'gds.alpha.pipeline.nodeRegression.train',
      documentation: 'Trains a node classification model based on a pipeline',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.articleRank.mutate': {
      label: 'gds.articleRank.mutate',
      documentation:
        'Article Rank is a variant of the Page Rank algorithm, which measures the transitive influence or connectivity of nodes.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.articleRank.mutate.estimate': {
      label: 'gds.articleRank.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.articleRank.stats': {
      label: 'gds.articleRank.stats',
      documentation:
        'Executes the algorithm and returns result statistics without writing the result to Neo4j.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.articleRank.stats.estimate': {
      label: 'gds.articleRank.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.articleRank.stream': {
      label: 'gds.articleRank.stream',
      documentation:
        'Article Rank is a variant of the Page Rank algorithm, which measures the transitive influence or connectivity of nodes.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.articleRank.stream.estimate': {
      label: 'gds.articleRank.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.articleRank.write': {
      label: 'gds.articleRank.write',
      documentation:
        'Article Rank is a variant of the Page Rank algorithm, which measures the transitive influence or connectivity of nodes.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.articleRank.write.estimate': {
      label: 'gds.articleRank.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.backup': {
      label: 'gds.backup',
      documentation: 'The back-up procedure persists graphs and models to disk',
      parameters: [
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.bellmanFord.mutate': {
      label: 'gds.bellmanFord.mutate',
      documentation:
        'The Bellman-Ford shortest path algorithm computes the shortest (weighted) path between one node and any other node in the graph without negative cycles.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.bellmanFord.mutate.estimate': {
      label: 'gds.bellmanFord.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.bellmanFord.stats': {
      label: 'gds.bellmanFord.stats',
      documentation:
        'The Bellman-Ford shortest path algorithm computes the shortest (weighted) path between one node and any other node in the graph without negative cycles.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.bellmanFord.stats.estimate': {
      label: 'gds.bellmanFord.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.bellmanFord.stream': {
      label: 'gds.bellmanFord.stream',
      documentation:
        'The Bellman-Ford shortest path algorithm computes the shortest (weighted) path between one node and any other node in the graph without negative cycles.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.bellmanFord.stream.estimate': {
      label: 'gds.bellmanFord.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.bellmanFord.write': {
      label: 'gds.bellmanFord.write',
      documentation:
        'The Bellman-Ford shortest path algorithm computes the shortest (weighted) path between one node and any other node in the graph without negative cycles.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.bellmanFord.write.estimate': {
      label: 'gds.bellmanFord.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.beta.graphSage.mutate': {
      label: 'gds.beta.graphSage.mutate',
      documentation:
        'The GraphSage algorithm inductively computes embeddings for nodes based on a their features and neighborhoods.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.beta.graphSage.mutate.estimate': {
      label: 'gds.beta.graphSage.mutate.estimate',
      documentation:
        'The GraphSage algorithm inductively computes embeddings for nodes based on a their features and neighborhoods.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.beta.graphSage.stream': {
      label: 'gds.beta.graphSage.stream',
      documentation:
        'The GraphSage algorithm inductively computes embeddings for nodes based on a their features and neighborhoods.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.beta.graphSage.stream.estimate': {
      label: 'gds.beta.graphSage.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.beta.graphSage.train': {
      label: 'gds.beta.graphSage.train',
      documentation:
        'The GraphSage algorithm inductively computes embeddings for nodes based on a their features and neighborhoods.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.beta.graphSage.train.estimate': {
      label: 'gds.beta.graphSage.train.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.beta.graphSage.write': {
      label: 'gds.beta.graphSage.write',
      documentation:
        'The GraphSage algorithm inductively computes embeddings for nodes based on a their features and neighborhoods.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.beta.graphSage.write.estimate': {
      label: 'gds.beta.graphSage.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.beta.pipeline.linkPrediction.addFeature': {
      label: 'gds.beta.pipeline.linkPrediction.addFeature',
      documentation:
        'Add a feature step to an existing link prediction pipeline.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
        {
          label: 'featureType',
          documentation: 'featureType :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration :: MAP?',
        },
      ],
    },
    'gds.beta.pipeline.linkPrediction.addLogisticRegression': {
      label: 'gds.beta.pipeline.linkPrediction.addLogisticRegression',
      documentation:
        'Add a logistic regression configuration to the parameter space of the link prediction train pipeline.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'gds.beta.pipeline.linkPrediction.addNodeProperty': {
      label: 'gds.beta.pipeline.linkPrediction.addNodeProperty',
      documentation:
        'Add a node property step to an existing link prediction pipeline.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
        {
          label: 'procedureName',
          documentation: 'procedureName :: STRING?',
        },
        {
          label: 'procedureConfiguration',
          documentation: 'procedureConfiguration :: MAP?',
        },
      ],
    },
    'gds.beta.pipeline.linkPrediction.addRandomForest': {
      label: 'gds.beta.pipeline.linkPrediction.addRandomForest',
      documentation:
        'Add a random forest configuration to the parameter space of the link prediction train pipeline.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config :: MAP?',
        },
      ],
    },
    'gds.beta.pipeline.linkPrediction.configureSplit': {
      label: 'gds.beta.pipeline.linkPrediction.configureSplit',
      documentation: 'Configures the split of the link prediction pipeline.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration :: MAP?',
        },
      ],
    },
    'gds.beta.pipeline.linkPrediction.create': {
      label: 'gds.beta.pipeline.linkPrediction.create',
      documentation:
        'Creates a link prediction pipeline in the pipeline catalog.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
      ],
    },
    'gds.beta.pipeline.linkPrediction.predict.mutate': {
      label: 'gds.beta.pipeline.linkPrediction.predict.mutate',
      documentation:
        'Predicts relationships for all non-connected node pairs based on a previously trained LinkPrediction model.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.beta.pipeline.linkPrediction.predict.mutate.estimate': {
      label: 'gds.beta.pipeline.linkPrediction.predict.mutate.estimate',
      documentation:
        'Estimates memory for predicting relationships for all non-connected node pairs based on a previously trained LinkPrediction model',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.beta.pipeline.linkPrediction.predict.stream': {
      label: 'gds.beta.pipeline.linkPrediction.predict.stream',
      documentation:
        'Predicts relationships for all non-connected node pairs based on a previously trained LinkPrediction model.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.beta.pipeline.linkPrediction.predict.stream.estimate': {
      label: 'gds.beta.pipeline.linkPrediction.predict.stream.estimate',
      documentation:
        'Estimates memory for predicting relationships for all non-connected node pairs based on a previously trained LinkPrediction model',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.beta.pipeline.linkPrediction.train': {
      label: 'gds.beta.pipeline.linkPrediction.train',
      documentation: 'Trains a link prediction model based on a pipeline',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.beta.pipeline.linkPrediction.train.estimate': {
      label: 'gds.beta.pipeline.linkPrediction.train.estimate',
      documentation: 'Estimates memory for applying a linkPrediction model',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.beta.pipeline.nodeClassification.addLogisticRegression': {
      label: 'gds.beta.pipeline.nodeClassification.addLogisticRegression',
      documentation:
        'Add a logistic regression configuration to the parameter space of the node classification train pipeline.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config = {} :: MAP?',
        },
      ],
    },
    'gds.beta.pipeline.nodeClassification.addNodeProperty': {
      label: 'gds.beta.pipeline.nodeClassification.addNodeProperty',
      documentation:
        'Add a node property step to an existing node classification training pipeline.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
        {
          label: 'procedureName',
          documentation: 'procedureName :: STRING?',
        },
        {
          label: 'procedureConfiguration',
          documentation: 'procedureConfiguration :: MAP?',
        },
      ],
    },
    'gds.beta.pipeline.nodeClassification.addRandomForest': {
      label: 'gds.beta.pipeline.nodeClassification.addRandomForest',
      documentation:
        'Add a random forest configuration to the parameter space of the node classification train pipeline.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
        {
          label: 'config',
          documentation: 'config :: MAP?',
        },
      ],
    },
    'gds.beta.pipeline.nodeClassification.configureSplit': {
      label: 'gds.beta.pipeline.nodeClassification.configureSplit',
      documentation:
        'Configures the split of the node classification training pipeline.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration :: MAP?',
        },
      ],
    },
    'gds.beta.pipeline.nodeClassification.create': {
      label: 'gds.beta.pipeline.nodeClassification.create',
      documentation:
        'Creates a node classification training pipeline in the pipeline catalog.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
      ],
    },
    'gds.beta.pipeline.nodeClassification.predict.mutate': {
      label: 'gds.beta.pipeline.nodeClassification.predict.mutate',
      documentation:
        'Predicts classes for all nodes based on a previously trained pipeline model',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.beta.pipeline.nodeClassification.predict.mutate.estimate': {
      label: 'gds.beta.pipeline.nodeClassification.predict.mutate.estimate',
      documentation:
        'Estimates memory for predicting classes for all nodes based on a previously trained pipeline model',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: ANY?',
        },
        {
          label: 'configuration',
          documentation: 'configuration :: MAP?',
        },
      ],
    },
    'gds.beta.pipeline.nodeClassification.predict.stream': {
      label: 'gds.beta.pipeline.nodeClassification.predict.stream',
      documentation:
        'Predicts classes for all nodes based on a previously trained pipeline model',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.beta.pipeline.nodeClassification.predict.stream.estimate': {
      label: 'gds.beta.pipeline.nodeClassification.predict.stream.estimate',
      documentation:
        'Estimates memory for predicting classes for all nodes based on a previously trained pipeline model',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: ANY?',
        },
        {
          label: 'configuration',
          documentation: 'configuration :: MAP?',
        },
      ],
    },
    'gds.beta.pipeline.nodeClassification.predict.write': {
      label: 'gds.beta.pipeline.nodeClassification.predict.write',
      documentation:
        'Predicts classes for all nodes based on a previously trained pipeline model',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.beta.pipeline.nodeClassification.predict.write.estimate': {
      label: 'gds.beta.pipeline.nodeClassification.predict.write.estimate',
      documentation:
        'Estimates memory for predicting classes for all nodes based on a previously trained pipeline model',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.beta.pipeline.nodeClassification.selectFeatures': {
      label: 'gds.beta.pipeline.nodeClassification.selectFeatures',
      documentation:
        'Add one or several features to an existing node classification training pipeline.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
        {
          label: 'nodeProperties',
          documentation: 'nodeProperties :: ANY?',
        },
      ],
    },
    'gds.beta.pipeline.nodeClassification.train': {
      label: 'gds.beta.pipeline.nodeClassification.train',
      documentation: 'Trains a node classification model based on a pipeline',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.beta.pipeline.nodeClassification.train.estimate': {
      label: 'gds.beta.pipeline.nodeClassification.train.estimate',
      documentation:
        'Estimates memory for training a node classification model based on a pipeline',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.betweenness.mutate': {
      label: 'gds.betweenness.mutate',
      documentation:
        'Betweenness centrality measures the relative information flow that passes through a node.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.betweenness.mutate.estimate': {
      label: 'gds.betweenness.mutate.estimate',
      documentation:
        'Betweenness centrality measures the relative information flow that passes through a node.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.betweenness.stats': {
      label: 'gds.betweenness.stats',
      documentation:
        'Betweenness centrality measures the relative information flow that passes through a node.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.betweenness.stats.estimate': {
      label: 'gds.betweenness.stats.estimate',
      documentation:
        'Betweenness centrality measures the relative information flow that passes through a node.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.betweenness.stream': {
      label: 'gds.betweenness.stream',
      documentation:
        'Betweenness centrality measures the relative information flow that passes through a node.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.betweenness.stream.estimate': {
      label: 'gds.betweenness.stream.estimate',
      documentation:
        'Betweenness centrality measures the relative information flow that passes through a node.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.betweenness.write': {
      label: 'gds.betweenness.write',
      documentation:
        'Betweenness centrality measures the relative information flow that passes through a node.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.betweenness.write.estimate': {
      label: 'gds.betweenness.write.estimate',
      documentation:
        'Betweenness centrality measures the relative information flow that passes through a node.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.bfs.mutate': {
      label: 'gds.bfs.mutate',
      documentation:
        'BFS is a traversal algorithm, which explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.bfs.mutate.estimate': {
      label: 'gds.bfs.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.bfs.stats': {
      label: 'gds.bfs.stats',
      documentation:
        'BFS is a traversal algorithm, which explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.bfs.stats.estimate': {
      label: 'gds.bfs.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.bfs.stream': {
      label: 'gds.bfs.stream',
      documentation:
        'BFS is a traversal algorithm, which explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.bfs.stream.estimate': {
      label: 'gds.bfs.stream.estimate',
      documentation:
        'BFS is a traversal algorithm, which explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: ANY?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.closeness.harmonic.mutate': {
      label: 'gds.closeness.harmonic.mutate',
      documentation:
        'Harmonic centrality is a way of detecting nodes that are able to spread information very efficiently through a graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.closeness.harmonic.stats': {
      label: 'gds.closeness.harmonic.stats',
      documentation:
        'Harmonic centrality is a way of detecting nodes that are able to spread information very efficiently through a graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.closeness.harmonic.stream': {
      label: 'gds.closeness.harmonic.stream',
      documentation:
        'Harmonic centrality is a way of detecting nodes that are able to spread information very efficiently through a graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.closeness.harmonic.write': {
      label: 'gds.closeness.harmonic.write',
      documentation:
        'Harmonic centrality is a way of detecting nodes that are able to spread information very efficiently through a graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.closeness.mutate': {
      label: 'gds.closeness.mutate',
      documentation:
        'Closeness centrality is a way of detecting nodes that are able to spread information very efficiently through a graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.closeness.stats': {
      label: 'gds.closeness.stats',
      documentation:
        'Closeness centrality is a way of detecting nodes that are able to spread information very efficiently through a graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.closeness.stream': {
      label: 'gds.closeness.stream',
      documentation:
        'Closeness centrality is a way of detecting nodes that are able to spread information very efficiently through a graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.closeness.write': {
      label: 'gds.closeness.write',
      documentation:
        'Closeness centrality is a way of detecting nodes that are able to spread information very efficiently through a graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.collapsePath.mutate': {
      label: 'gds.collapsePath.mutate',
      documentation:
        'Collapse Path algorithm is a traversal algorithm capable of creating relationships between the start and end nodes of a traversal',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.conductance.stream': {
      label: 'gds.conductance.stream',
      documentation:
        'Evaluates a division of nodes into communities based on the proportion of relationships that cross community boundaries.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.config.defaults.list': {
      label: 'gds.config.defaults.list',
      documentation:
        'List defaults; global by default, but also optionally for a specific user and/ or key',
      parameters: [
        {
          label: 'parameters',
          documentation: 'parameters = {} :: MAP?',
        },
      ],
    },
    'gds.config.defaults.set': {
      label: 'gds.config.defaults.set',
      documentation:
        'Set a default; global by, default, but also optionally for a specific user',
      parameters: [
        {
          label: 'key',
          documentation: 'key :: STRING?',
        },
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
        {
          label: 'username',
          documentation:
            'username = d81eb72e-c499-4f78-90c7-0c76123606a2 :: STRING?',
        },
      ],
    },
    'gds.config.limits.list': {
      label: 'gds.config.limits.list',
      documentation:
        'List limits; global by default, but also optionally for a specific user and/ or key',
      parameters: [
        {
          label: 'parameters',
          documentation: 'parameters = {} :: MAP?',
        },
      ],
    },
    'gds.config.limits.set': {
      label: 'gds.config.limits.set',
      documentation:
        'Set a limit; global by, default, but also optionally for a specific user',
      parameters: [
        {
          label: 'key',
          documentation: 'key :: STRING?',
        },
        {
          label: 'value',
          documentation: 'value :: ANY?',
        },
        {
          label: 'username',
          documentation:
            'username = d81eb72e-c499-4f78-90c7-0c76123606a2 :: STRING?',
        },
      ],
    },
    'gds.dag.longestPath.stream': {
      label: 'gds.dag.longestPath.stream',
      documentation: 'Returns the longest paths ending in given target nodes',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.dag.topologicalSort.stream': {
      label: 'gds.dag.topologicalSort.stream',
      documentation:
        'Returns all the nodes in the graph that are not part of a cycle or depend on a cycle, sorted in a topological order',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.debug.arrow': {
      label: 'gds.debug.arrow',
      documentation:
        'Returns details about the status of the GDS Flight server',
      parameters: [],
    },
    'gds.debug.sysInfo': {
      label: 'gds.debug.sysInfo',
      documentation: 'Returns details about the status of the system',
      parameters: [],
    },
    'gds.degree.mutate': {
      label: 'gds.degree.mutate',
      documentation:
        'Degree centrality measures the number of incoming and outgoing relationships from a node.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.degree.mutate.estimate': {
      label: 'gds.degree.mutate.estimate',
      documentation:
        'Degree centrality measures the number of incoming and outgoing relationships from a node.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.degree.stats': {
      label: 'gds.degree.stats',
      documentation:
        'Degree centrality measures the number of incoming and outgoing relationships from a node.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.degree.stats.estimate': {
      label: 'gds.degree.stats.estimate',
      documentation:
        'Degree centrality measures the number of incoming and outgoing relationships from a node.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.degree.stream': {
      label: 'gds.degree.stream',
      documentation:
        'Degree centrality measures the number of incoming and outgoing relationships from a node.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.degree.stream.estimate': {
      label: 'gds.degree.stream.estimate',
      documentation:
        'Degree centrality measures the number of incoming and outgoing relationships from a node.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.degree.write': {
      label: 'gds.degree.write',
      documentation:
        'Degree centrality measures the number of incoming and outgoing relationships from a node.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.degree.write.estimate': {
      label: 'gds.degree.write.estimate',
      documentation:
        'Degree centrality measures the number of incoming and outgoing relationships from a node.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.dfs.mutate': {
      label: 'gds.dfs.mutate',
      documentation:
        'Depth-first search (DFS) is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node (selecting some arbitrary node as the root node in the case of a graph) and explores as far as possible along each branch before backtracking.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.dfs.mutate.estimate': {
      label: 'gds.dfs.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.dfs.stream': {
      label: 'gds.dfs.stream',
      documentation:
        'Depth-first search (DFS) is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node (selecting some arbitrary node as the root node in the case of a graph) and explores as far as possible along each branch before backtracking.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.dfs.stream.estimate': {
      label: 'gds.dfs.stream.estimate',
      documentation:
        'Depth-first search (DFS) is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node (selecting some arbitrary node as the root node in the case of a graph) and explores as far as possible along each branch before backtracking.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: ANY?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.eigenvector.mutate': {
      label: 'gds.eigenvector.mutate',
      documentation:
        'Eigenvector Centrality is an algorithm that measures the transitive influence or connectivity of nodes.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.eigenvector.mutate.estimate': {
      label: 'gds.eigenvector.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.eigenvector.stats': {
      label: 'gds.eigenvector.stats',
      documentation:
        'Eigenvector Centrality is an algorithm that measures the transitive influence or connectivity of nodes.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.eigenvector.stats.estimate': {
      label: 'gds.eigenvector.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.eigenvector.stream': {
      label: 'gds.eigenvector.stream',
      documentation:
        'Eigenvector Centrality is an algorithm that measures the transitive influence or connectivity of nodes.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.eigenvector.stream.estimate': {
      label: 'gds.eigenvector.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.eigenvector.write': {
      label: 'gds.eigenvector.write',
      documentation:
        'Eigenvector Centrality is an algorithm that measures the transitive influence or connectivity of nodes.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.eigenvector.write.estimate': {
      label: 'gds.eigenvector.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.ephemeral.database.create': {
      label: 'gds.ephemeral.database.create',
      documentation: 'Creates an ephemeral database from a GDS graph.',
      parameters: [
        {
          label: 'dbName',
          documentation: 'dbName :: STRING?',
        },
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
      ],
    },
    'gds.ephemeral.database.drop': {
      label: 'gds.ephemeral.database.drop',
      documentation: 'Drop an ephemeral database backed by an in-memory graph',
      parameters: [
        {
          label: 'dbName',
          documentation: 'dbName :: STRING?',
        },
      ],
    },
    'gds.fastRP.mutate': {
      label: 'gds.fastRP.mutate',
      documentation:
        'Random Projection produces node embeddings via the fastrp algorithm',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.fastRP.mutate.estimate': {
      label: 'gds.fastRP.mutate.estimate',
      documentation:
        'Random Projection produces node embeddings via the fastrp algorithm',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.fastRP.stats': {
      label: 'gds.fastRP.stats',
      documentation:
        'Random Projection produces node embeddings via the fastrp algorithm',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.fastRP.stats.estimate': {
      label: 'gds.fastRP.stats.estimate',
      documentation:
        'Random Projection produces node embeddings via the fastrp algorithm',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.fastRP.stream': {
      label: 'gds.fastRP.stream',
      documentation:
        'Random Projection produces node embeddings via the fastrp algorithm',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.fastRP.stream.estimate': {
      label: 'gds.fastRP.stream.estimate',
      documentation:
        'Random Projection produces node embeddings via the fastrp algorithm',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.fastRP.write': {
      label: 'gds.fastRP.write',
      documentation:
        'Random Projection produces node embeddings via the fastrp algorithm',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.fastRP.write.estimate': {
      label: 'gds.fastRP.write.estimate',
      documentation:
        'Random Projection produces node embeddings via the fastrp algorithm',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.graph.drop': {
      label: 'gds.graph.drop',
      documentation:
        'Drops a named graph from the catalog and frees up the resources it occupies.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: ANY?',
        },
        {
          label: 'failIfMissing',
          documentation: 'failIfMissing = true :: BOOLEAN?',
        },
        {
          label: 'dbName',
          documentation: 'dbName =  :: STRING?',
        },
        {
          label: 'username',
          documentation: 'username =  :: STRING?',
        },
      ],
    },
    'gds.graph.exists': {
      label: 'gds.graph.exists',
      documentation: 'Checks if a graph exists in the catalog.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
      ],
    },
    'gds.graph.export': {
      label: 'gds.graph.export',
      documentation: 'Exports a named graph into a new offline Neo4j database.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.graph.export.csv': {
      label: 'gds.graph.export.csv',
      documentation: 'Exports a named graph to CSV files.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.graph.export.csv.estimate': {
      label: 'gds.graph.export.csv.estimate',
      documentation:
        'Estimate the required disk space for exporting a named graph to CSV files.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.graph.filter': {
      label: 'gds.graph.filter',
      documentation:
        'Applies node and relationship predicates on a graph and stores the result as a new graph in the catalog.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'fromGraphName',
          documentation: 'fromGraphName :: STRING?',
        },
        {
          label: 'nodeFilter',
          documentation: 'nodeFilter :: STRING?',
        },
        {
          label: 'relationshipFilter',
          documentation: 'relationshipFilter :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.graph.generate': {
      label: 'gds.graph.generate',
      documentation:
        'Computes a random graph, which will be stored in the graph catalog.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'nodeCount',
          documentation: 'nodeCount :: INTEGER?',
        },
        {
          label: 'averageDegree',
          documentation: 'averageDegree :: INTEGER?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.graph.graphProperty.drop': {
      label: 'gds.graph.graphProperty.drop',
      documentation: 'Removes a graph property from a projected graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'graphProperty',
          documentation: 'graphProperty :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.graph.graphProperty.stream': {
      label: 'gds.graph.graphProperty.stream',
      documentation: 'Streams the given graph property.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'graphProperty',
          documentation: 'graphProperty :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.graph.list': {
      label: 'gds.graph.list',
      documentation:
        'Lists information about named graphs stored in the catalog.',
      parameters: [
        {
          label: 'graphName',
          documentation:
            'graphName = d9b6394a-9482-4929-adab-f97df578a6c6 :: STRING?',
        },
      ],
    },
    'gds.graph.nodeLabel.mutate': {
      label: 'gds.graph.nodeLabel.mutate',
      documentation: 'Mutates the in-memory graph with the given node Label.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'nodeLabel',
          documentation: 'nodeLabel :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration :: MAP?',
        },
      ],
    },
    'gds.graph.nodeLabel.write': {
      label: 'gds.graph.nodeLabel.write',
      documentation: 'Writes the given node Label to an online Neo4j database.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'nodeLabel',
          documentation: 'nodeLabel :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration :: MAP?',
        },
      ],
    },
    'gds.graph.nodeProperties.drop': {
      label: 'gds.graph.nodeProperties.drop',
      documentation: 'Removes node properties from a projected graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'nodeProperties',
          documentation: 'nodeProperties :: ANY?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.graph.nodeProperties.stream': {
      label: 'gds.graph.nodeProperties.stream',
      documentation: 'Streams the given node properties.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'nodeProperties',
          documentation: 'nodeProperties :: ANY?',
        },
        {
          label: 'nodeLabels',
          documentation: 'nodeLabels = [*] :: ANY?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.graph.nodeProperties.write': {
      label: 'gds.graph.nodeProperties.write',
      documentation:
        'Writes the given node properties to an online Neo4j database.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'nodeProperties',
          documentation: 'nodeProperties :: ANY?',
        },
        {
          label: 'nodeLabels',
          documentation: 'nodeLabels = [*] :: ANY?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.graph.nodeProperty.stream': {
      label: 'gds.graph.nodeProperty.stream',
      documentation: 'Streams the given node property.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'nodeProperties',
          documentation: 'nodeProperties :: STRING?',
        },
        {
          label: 'nodeLabels',
          documentation: 'nodeLabels = [*] :: ANY?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.graph.project': {
      label: 'gds.graph.project',
      documentation:
        'Creates a named graph in the catalog for use by algorithms.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'nodeProjection',
          documentation: 'nodeProjection :: ANY?',
        },
        {
          label: 'relationshipProjection',
          documentation: 'relationshipProjection :: ANY?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.graph.project.cypher': {
      label: 'gds.graph.project.cypher',
      documentation:
        'Creates a named graph in the catalog for use by algorithms.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'nodeQuery',
          documentation: 'nodeQuery :: STRING?',
        },
        {
          label: 'relationshipQuery',
          documentation: 'relationshipQuery :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.graph.project.cypher.estimate': {
      label: 'gds.graph.project.cypher.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'nodeQuery',
          documentation: 'nodeQuery :: STRING?',
        },
        {
          label: 'relationshipQuery',
          documentation: 'relationshipQuery :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.graph.project.estimate': {
      label: 'gds.graph.project.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'nodeProjection',
          documentation: 'nodeProjection :: ANY?',
        },
        {
          label: 'relationshipProjection',
          documentation: 'relationshipProjection :: ANY?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.graph.relationship.write': {
      label: 'gds.graph.relationship.write',
      documentation:
        'Writes the given relationship and an optional relationship property to an online Neo4j database.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'relationshipType',
          documentation: 'relationshipType :: STRING?',
        },
        {
          label: 'relationshipProperty',
          documentation: 'relationshipProperty =  :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.graph.relationshipProperties.stream': {
      label: 'gds.graph.relationshipProperties.stream',
      documentation: 'Streams the given relationship properties.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'relationshipProperties',
          documentation: 'relationshipProperties :: LIST? OF STRING?',
        },
        {
          label: 'relationshipTypes',
          documentation: 'relationshipTypes = [*] :: LIST? OF STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.graph.relationshipProperties.write': {
      label: 'gds.graph.relationshipProperties.write',
      documentation:
        'Writes the given relationship and a list of relationship properties to an online Neo4j database.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'relationshipType',
          documentation: 'relationshipType :: STRING?',
        },
        {
          label: 'relationshipProperties',
          documentation: 'relationshipProperties :: LIST? OF STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration :: MAP?',
        },
      ],
    },
    'gds.graph.relationshipProperty.stream': {
      label: 'gds.graph.relationshipProperty.stream',
      documentation: 'Streams the given relationship property.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'relationshipProperty',
          documentation: 'relationshipProperty :: STRING?',
        },
        {
          label: 'relationshipTypes',
          documentation: 'relationshipTypes = [*] :: LIST? OF STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.graph.relationships.drop': {
      label: 'gds.graph.relationships.drop',
      documentation:
        'Delete the relationship type for a given graph stored in the graph-catalog.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'relationshipType',
          documentation: 'relationshipType :: STRING?',
        },
      ],
    },
    'gds.graph.relationships.stream': {
      label: 'gds.graph.relationships.stream',
      documentation: 'Streams the given relationship source/target pairs',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'relationshipTypes',
          documentation: 'relationshipTypes = [*] :: LIST? OF STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.graph.relationships.toUndirected': {
      label: 'gds.graph.relationships.toUndirected',
      documentation:
        'The ToUndirected procedure converts directed relationships to undirected relationships',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.graph.relationships.toUndirected.estimate': {
      label: 'gds.graph.relationships.toUndirected.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.graph.sample.cnarw': {
      label: 'gds.graph.sample.cnarw',
      documentation:
        'Constructs a random subgraph based on common neighbour aware random walks',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'fromGraphName',
          documentation: 'fromGraphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.graph.sample.cnarw.estimate': {
      label: 'gds.graph.sample.cnarw.estimate',
      documentation:
        'Estimate memory requirements for sampling graph using CNARW algorithm',
      parameters: [
        {
          label: 'fromGraphName',
          documentation: 'fromGraphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.graph.sample.rwr': {
      label: 'gds.graph.sample.rwr',
      documentation:
        'Constructs a random subgraph based on random walks with restarts',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'fromGraphName',
          documentation: 'fromGraphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.hashgnn.mutate': {
      label: 'gds.hashgnn.mutate',
      documentation:
        'HashGNN creates node embeddings by hashing and message passing.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.hashgnn.mutate.estimate': {
      label: 'gds.hashgnn.mutate.estimate',
      documentation:
        'HashGNN creates node embeddings by hashing and message passing.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.hashgnn.stream': {
      label: 'gds.hashgnn.stream',
      documentation:
        'HashGNN creates node embeddings by hashing and message passing.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.hashgnn.stream.estimate': {
      label: 'gds.hashgnn.stream.estimate',
      documentation:
        'HashGNN creates node embeddings by hashing and message passing.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.hits.mutate': {
      label: 'gds.hits.mutate',
      documentation:
        'Hyperlink-Induced Topic Search (HITS) is a link analysis algorithm that rates nodes',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.hits.mutate.estimate': {
      label: 'gds.hits.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.hits.stats': {
      label: 'gds.hits.stats',
      documentation:
        'Hyperlink-Induced Topic Search (HITS) is a link analysis algorithm that rates nodes',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.hits.stats.estimate': {
      label: 'gds.hits.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.hits.stream': {
      label: 'gds.hits.stream',
      documentation:
        'Hyperlink-Induced Topic Search (HITS) is a link analysis algorithm that rates nodes',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.hits.stream.estimate': {
      label: 'gds.hits.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.hits.write': {
      label: 'gds.hits.write',
      documentation:
        'Hyperlink-Induced Topic Search (HITS) is a link analysis algorithm that rates nodes',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.hits.write.estimate': {
      label: 'gds.hits.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.influenceMaximization.celf.mutate': {
      label: 'gds.influenceMaximization.celf.mutate',
      documentation:
        'The Cost Effective Lazy Forward (CELF) algorithm aims to find k nodes that maximize the expected spread of influence in the network.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.influenceMaximization.celf.mutate.estimate': {
      label: 'gds.influenceMaximization.celf.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.influenceMaximization.celf.stats': {
      label: 'gds.influenceMaximization.celf.stats',
      documentation:
        'Executes the algorithm and returns result statistics without writing the result to Neo4j.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.influenceMaximization.celf.stats.estimate': {
      label: 'gds.influenceMaximization.celf.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.influenceMaximization.celf.stream': {
      label: 'gds.influenceMaximization.celf.stream',
      documentation:
        'The Cost Effective Lazy Forward (CELF) algorithm aims to find k nodes that maximize the expected spread of influence in the network.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.influenceMaximization.celf.stream.estimate': {
      label: 'gds.influenceMaximization.celf.stream.estimate',
      documentation:
        'The Cost Effective Lazy Forward (CELF) algorithm aims to find k nodes that maximize the expected spread of influence in the network.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: ANY?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.influenceMaximization.celf.write': {
      label: 'gds.influenceMaximization.celf.write',
      documentation:
        'The Cost Effective Lazy Forward (CELF) algorithm aims to find k nodes that maximize the expected spread of influence in the network.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.influenceMaximization.celf.write.estimate': {
      label: 'gds.influenceMaximization.celf.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.k1coloring.mutate': {
      label: 'gds.k1coloring.mutate',
      documentation:
        'The K-1 Coloring algorithm assigns a color to every node in the graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.k1coloring.mutate.estimate': {
      label: 'gds.k1coloring.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.k1coloring.stats': {
      label: 'gds.k1coloring.stats',
      documentation:
        'The K-1 Coloring algorithm assigns a color to every node in the graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.k1coloring.stats.estimate': {
      label: 'gds.k1coloring.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.k1coloring.stream': {
      label: 'gds.k1coloring.stream',
      documentation:
        'The K-1 Coloring algorithm assigns a color to every node in the graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.k1coloring.stream.estimate': {
      label: 'gds.k1coloring.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.k1coloring.write': {
      label: 'gds.k1coloring.write',
      documentation:
        'The K-1 Coloring algorithm assigns a color to every node in the graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.k1coloring.write.estimate': {
      label: 'gds.k1coloring.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.kSpanningTree.write': {
      label: 'gds.kSpanningTree.write',
      documentation:
        'The K-spanning tree algorithm starts from a root node and returns a spanning tree with exactly k nodes',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.kcore.mutate': {
      label: 'gds.kcore.mutate',
      documentation: 'It computes the k-core values in a network',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.kcore.mutate.estimate': {
      label: 'gds.kcore.mutate.estimate',
      documentation: 'It computes the k-core values in a network',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.kcore.stats': {
      label: 'gds.kcore.stats',
      documentation: 'It computes the k-core values in a network',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.kcore.stats.estimate': {
      label: 'gds.kcore.stats.estimate',
      documentation: 'It computes the k-core values in a network',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.kcore.stream': {
      label: 'gds.kcore.stream',
      documentation: 'It computes the k-core values in a network',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.kcore.stream.estimate': {
      label: 'gds.kcore.stream.estimate',
      documentation: 'It computes the k-core values in a network',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.kcore.write': {
      label: 'gds.kcore.write',
      documentation: 'It computes the k-core values in a network',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.kcore.write.estimate': {
      label: 'gds.kcore.write.estimate',
      documentation: 'It computes the k-core values in a network',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.kmeans.mutate': {
      label: 'gds.kmeans.mutate',
      documentation:
        'The Kmeans  algorithm clusters nodes into different communities based on Euclidean distance',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.kmeans.mutate.estimate': {
      label: 'gds.kmeans.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.kmeans.stats': {
      label: 'gds.kmeans.stats',
      documentation:
        'The Kmeans  algorithm clusters nodes into different communities based on Euclidean distance',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.kmeans.stats.estimate': {
      label: 'gds.kmeans.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.kmeans.stream': {
      label: 'gds.kmeans.stream',
      documentation:
        'The Kmeans  algorithm clusters nodes into different communities based on Euclidean distance',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.kmeans.stream.estimate': {
      label: 'gds.kmeans.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.kmeans.write': {
      label: 'gds.kmeans.write',
      documentation:
        'The Kmeans  algorithm clusters nodes into different communities based on Euclidean distance',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.kmeans.write.estimate': {
      label: 'gds.kmeans.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.knn.filtered.mutate': {
      label: 'gds.knn.filtered.mutate',
      documentation:
        'The k-nearest neighbor graph algorithm constructs relationships between nodes if the distance between two nodes is among the k nearest distances compared to other nodes. KNN computes distances based on the similarity of node properties. Filtered KNN extends this functionality, allowing filtering on source nodes and target nodes, respectively.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.knn.filtered.mutate.estimate': {
      label: 'gds.knn.filtered.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.knn.filtered.stats': {
      label: 'gds.knn.filtered.stats',
      documentation:
        'The k-nearest neighbor graph algorithm constructs relationships between nodes if the distance between two nodes is among the k nearest distances compared to other nodes. KNN computes distances based on the similarity of node properties. Filtered KNN extends this functionality, allowing filtering on source nodes and target nodes, respectively.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.knn.filtered.stats.estimate': {
      label: 'gds.knn.filtered.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.knn.filtered.stream': {
      label: 'gds.knn.filtered.stream',
      documentation:
        'The k-nearest neighbor graph algorithm constructs relationships between nodes if the distance between two nodes is among the k nearest distances compared to other nodes. KNN computes distances based on the similarity of node properties. Filtered KNN extends this functionality, allowing filtering on source nodes and target nodes, respectively.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.knn.filtered.stream.estimate': {
      label: 'gds.knn.filtered.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.knn.filtered.write': {
      label: 'gds.knn.filtered.write',
      documentation:
        'The k-nearest neighbor graph algorithm constructs relationships between nodes if the distance between two nodes is among the k nearest distances compared to other nodes. KNN computes distances based on the similarity of node properties. Filtered KNN extends this functionality, allowing filtering on source nodes and target nodes, respectively.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.knn.filtered.write.estimate': {
      label: 'gds.knn.filtered.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.knn.mutate': {
      label: 'gds.knn.mutate',
      documentation:
        'The k-nearest neighbor graph algorithm constructs relationships between nodes if the distance between two nodes is among the k nearest distances compared to other nodes.KNN computes distances based on the similarity of node properties',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.knn.mutate.estimate': {
      label: 'gds.knn.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.knn.stats': {
      label: 'gds.knn.stats',
      documentation:
        'The k-nearest neighbor graph algorithm constructs relationships between nodes if the distance between two nodes is among the k nearest distances compared to other nodes.KNN computes distances based on the similarity of node properties',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.knn.stats.estimate': {
      label: 'gds.knn.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.knn.stream': {
      label: 'gds.knn.stream',
      documentation:
        'The k-nearest neighbor graph algorithm constructs relationships between nodes if the distance between two nodes is among the k nearest distances compared to other nodes.KNN computes distances based on the similarity of node properties',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.knn.stream.estimate': {
      label: 'gds.knn.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.knn.write': {
      label: 'gds.knn.write',
      documentation:
        'The k-nearest neighbor graph algorithm constructs relationships between nodes if the distance between two nodes is among the k nearest distances compared to other nodes.KNN computes distances based on the similarity of node properties',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.knn.write.estimate': {
      label: 'gds.knn.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.labelPropagation.mutate': {
      label: 'gds.labelPropagation.mutate',
      documentation:
        'The Label Propagation algorithm is a fast algorithm for finding communities in a graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.labelPropagation.mutate.estimate': {
      label: 'gds.labelPropagation.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.labelPropagation.stats': {
      label: 'gds.labelPropagation.stats',
      documentation:
        'The Label Propagation algorithm is a fast algorithm for finding communities in a graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.labelPropagation.stats.estimate': {
      label: 'gds.labelPropagation.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.labelPropagation.stream': {
      label: 'gds.labelPropagation.stream',
      documentation:
        'The Label Propagation algorithm is a fast algorithm for finding communities in a graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.labelPropagation.stream.estimate': {
      label: 'gds.labelPropagation.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.labelPropagation.write': {
      label: 'gds.labelPropagation.write',
      documentation:
        'The Label Propagation algorithm is a fast algorithm for finding communities in a graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.labelPropagation.write.estimate': {
      label: 'gds.labelPropagation.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.leiden.mutate': {
      label: 'gds.leiden.mutate',
      documentation:
        'Leiden is a community detection algorithm, which guarantees that communities are well connected',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.leiden.mutate.estimate': {
      label: 'gds.leiden.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.leiden.stats': {
      label: 'gds.leiden.stats',
      documentation:
        'Executes the algorithm and returns result statistics without writing the result to Neo4j.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.leiden.stats.estimate': {
      label: 'gds.leiden.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.leiden.stream': {
      label: 'gds.leiden.stream',
      documentation:
        'Leiden is a community detection algorithm, which guarantees that communities are well connected',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.leiden.stream.estimate': {
      label: 'gds.leiden.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.leiden.write': {
      label: 'gds.leiden.write',
      documentation:
        'Leiden is a community detection algorithm, which guarantees that communities are well connected',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.leiden.write.estimate': {
      label: 'gds.leiden.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.license.state': {
      label: 'gds.license.state',
      documentation: 'Returns details about the license state',
      parameters: [],
    },
    'gds.list': {
      label: 'gds.list',
      documentation:
        'CALL gds.list - lists all algorithm procedures, their description and signature',
      parameters: [
        {
          label: 'name',
          documentation: 'name =  :: STRING?',
        },
      ],
    },
    'gds.listProgress': {
      label: 'gds.listProgress',
      documentation: 'List progress events for currently running tasks.',
      parameters: [
        {
          label: 'jobId',
          documentation: 'jobId =  :: STRING?',
        },
      ],
    },
    'gds.localClusteringCoefficient.mutate': {
      label: 'gds.localClusteringCoefficient.mutate',
      documentation:
        'The local clustering coefficient is a metric quantifying how connected the neighborhood of a node is.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.localClusteringCoefficient.mutate.estimate': {
      label: 'gds.localClusteringCoefficient.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.localClusteringCoefficient.stats': {
      label: 'gds.localClusteringCoefficient.stats',
      documentation:
        'Executes the algorithm and returns result statistics without writing the result to Neo4j.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.localClusteringCoefficient.stats.estimate': {
      label: 'gds.localClusteringCoefficient.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.localClusteringCoefficient.stream': {
      label: 'gds.localClusteringCoefficient.stream',
      documentation:
        'The local clustering coefficient is a metric quantifying how connected the neighborhood of a node is.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.localClusteringCoefficient.stream.estimate': {
      label: 'gds.localClusteringCoefficient.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.localClusteringCoefficient.write': {
      label: 'gds.localClusteringCoefficient.write',
      documentation:
        'The local clustering coefficient is a metric quantifying how connected the neighborhood of a node is.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.localClusteringCoefficient.write.estimate': {
      label: 'gds.localClusteringCoefficient.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.louvain.mutate': {
      label: 'gds.louvain.mutate',
      documentation:
        'The Louvain method for community detection is an algorithm for detecting communities in networks.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.louvain.mutate.estimate': {
      label: 'gds.louvain.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.louvain.stats': {
      label: 'gds.louvain.stats',
      documentation:
        'Executes the algorithm and returns result statistics without writing the result to Neo4j.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.louvain.stats.estimate': {
      label: 'gds.louvain.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.louvain.stream': {
      label: 'gds.louvain.stream',
      documentation:
        'The Louvain method for community detection is an algorithm for detecting communities in networks.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.louvain.stream.estimate': {
      label: 'gds.louvain.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.louvain.write': {
      label: 'gds.louvain.write',
      documentation:
        'The Louvain method for community detection is an algorithm for detecting communities in networks.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.louvain.write.estimate': {
      label: 'gds.louvain.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.maxkcut.mutate': {
      label: 'gds.maxkcut.mutate',
      documentation:
        'Approximate Maximum k-cut maps each node into one of k disjoint communities trying to maximize the sum of weights of relationships between these communities.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.maxkcut.mutate.estimate': {
      label: 'gds.maxkcut.mutate.estimate',
      documentation:
        'Approximate Maximum k-cut maps each node into one of k disjoint communities trying to maximize the sum of weights of relationships between these communities.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.maxkcut.stream': {
      label: 'gds.maxkcut.stream',
      documentation:
        'Approximate Maximum k-cut maps each node into one of k disjoint communities trying to maximize the sum of weights of relationships between these communities.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.maxkcut.stream.estimate': {
      label: 'gds.maxkcut.stream.estimate',
      documentation:
        'Approximate Maximum k-cut maps each node into one of k disjoint communities trying to maximize the sum of weights of relationships between these communities.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.model.delete': {
      label: 'gds.model.delete',
      documentation: 'Deletes a stored model from disk.',
      parameters: [
        {
          label: 'modelName',
          documentation: 'modelName :: STRING?',
        },
      ],
    },
    'gds.model.drop': {
      label: 'gds.model.drop',
      documentation:
        'Drops a loaded model and frees up the resources it occupies.',
      parameters: [
        {
          label: 'modelName',
          documentation: 'modelName :: STRING?',
        },
        {
          label: 'failIfMissing',
          documentation: 'failIfMissing = true :: BOOLEAN?',
        },
      ],
    },
    'gds.model.exists': {
      label: 'gds.model.exists',
      documentation: 'Checks if a given model exists in the model catalog.',
      parameters: [
        {
          label: 'modelName',
          documentation: 'modelName :: STRING?',
        },
      ],
    },
    'gds.model.list': {
      label: 'gds.model.list',
      documentation: 'Lists all models contained in the model catalog.',
      parameters: [
        {
          label: 'modelName',
          documentation: 'modelName = __NO_VALUE :: STRING?',
        },
      ],
    },
    'gds.model.load': {
      label: 'gds.model.load',
      documentation: 'Load a stored model into main memory.',
      parameters: [
        {
          label: 'modelName',
          documentation: 'modelName :: STRING?',
        },
      ],
    },
    'gds.model.publish': {
      label: 'gds.model.publish',
      documentation: 'Make a trained model accessible by all users',
      parameters: [
        {
          label: 'modelName',
          documentation: 'modelName :: STRING?',
        },
      ],
    },
    'gds.model.store': {
      label: 'gds.model.store',
      documentation: 'Store the selected model to disk.',
      parameters: [
        {
          label: 'modelName',
          documentation: 'modelName :: STRING?',
        },
        {
          label: 'failIfUnsupported',
          documentation: 'failIfUnsupported = true :: BOOLEAN?',
        },
      ],
    },
    'gds.modularity.stats': {
      label: 'gds.modularity.stats',
      documentation:
        'The Modularity procedure computes the modularity scores for a given set of communities/',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.modularity.stats.estimate': {
      label: 'gds.modularity.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.modularity.stream': {
      label: 'gds.modularity.stream',
      documentation:
        'The Modularity procedure computes the modularity scores for a given set of communities/',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.modularity.stream.estimate': {
      label: 'gds.modularity.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.modularityOptimization.mutate': {
      label: 'gds.modularityOptimization.mutate',
      documentation:
        'The Modularity Optimization algorithm groups the nodes in the graph by optimizing the graphs modularity.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.modularityOptimization.mutate.estimate': {
      label: 'gds.modularityOptimization.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.modularityOptimization.stats': {
      label: 'gds.modularityOptimization.stats',
      documentation:
        'The Modularity Optimization algorithm groups the nodes in the graph by optimizing the graphs modularity.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.modularityOptimization.stats.estimate': {
      label: 'gds.modularityOptimization.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.modularityOptimization.stream': {
      label: 'gds.modularityOptimization.stream',
      documentation:
        'The Modularity Optimization algorithm groups the nodes in the graph by optimizing the graphs modularity.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.modularityOptimization.stream.estimate': {
      label: 'gds.modularityOptimization.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.modularityOptimization.write': {
      label: 'gds.modularityOptimization.write',
      documentation:
        'The Modularity Optimization algorithm groups the nodes in the graph by optimizing the graphs modularity.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.modularityOptimization.write.estimate': {
      label: 'gds.modularityOptimization.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.node2vec.mutate': {
      label: 'gds.node2vec.mutate',
      documentation:
        'The Node2Vec algorithm computes embeddings for nodes based on random walks.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.node2vec.mutate.estimate': {
      label: 'gds.node2vec.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.node2vec.stream': {
      label: 'gds.node2vec.stream',
      documentation:
        'The Node2Vec algorithm computes embeddings for nodes based on random walks.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.node2vec.stream.estimate': {
      label: 'gds.node2vec.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.node2vec.write': {
      label: 'gds.node2vec.write',
      documentation:
        'The Node2Vec algorithm computes embeddings for nodes based on random walks.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.node2vec.write.estimate': {
      label: 'gds.node2vec.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.nodeSimilarity.filtered.mutate': {
      label: 'gds.nodeSimilarity.filtered.mutate',
      documentation:
        'The Filtered Node Similarity algorithm compares a set of nodes based on the nodes they are connected to. Two nodes are considered similar if they share many of the same neighbors. The algorithm computes pair-wise similarities based on Jaccard or Overlap metrics. The filtered variant supports limiting which nodes to compare via source and target node filters.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.nodeSimilarity.filtered.mutate.estimate': {
      label: 'gds.nodeSimilarity.filtered.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.nodeSimilarity.filtered.stats': {
      label: 'gds.nodeSimilarity.filtered.stats',
      documentation:
        'The Filtered Node Similarity algorithm compares a set of nodes based on the nodes they are connected to. Two nodes are considered similar if they share many of the same neighbors. The algorithm computes pair-wise similarities based on Jaccard or Overlap metrics. The filtered variant supports limiting which nodes to compare via source and target node filters.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.nodeSimilarity.filtered.stats.estimate': {
      label: 'gds.nodeSimilarity.filtered.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.nodeSimilarity.filtered.stream': {
      label: 'gds.nodeSimilarity.filtered.stream',
      documentation:
        'The Filtered Node Similarity algorithm compares a set of nodes based on the nodes they are connected to. Two nodes are considered similar if they share many of the same neighbors. The algorithm computes pair-wise similarities based on Jaccard or Overlap metrics. The filtered variant supports limiting which nodes to compare via source and target node filters.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.nodeSimilarity.filtered.stream.estimate': {
      label: 'gds.nodeSimilarity.filtered.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.nodeSimilarity.filtered.write': {
      label: 'gds.nodeSimilarity.filtered.write',
      documentation:
        'The Filtered Node Similarity algorithm compares a set of nodes based on the nodes they are connected to. Two nodes are considered similar if they share many of the same neighbors. The algorithm computes pair-wise similarities based on Jaccard or Overlap metrics. The filtered variant supports limiting which nodes to compare via source and target node filters.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.nodeSimilarity.filtered.write.estimate': {
      label: 'gds.nodeSimilarity.filtered.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.nodeSimilarity.mutate': {
      label: 'gds.nodeSimilarity.mutate',
      documentation:
        'The Node Similarity algorithm compares a set of nodes based on the nodes they are connected to. Two nodes are considered similar if they share many of the same neighbors. Node Similarity computes pair-wise similarities based on the Jaccard metric.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.nodeSimilarity.mutate.estimate': {
      label: 'gds.nodeSimilarity.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.nodeSimilarity.stats': {
      label: 'gds.nodeSimilarity.stats',
      documentation:
        'The Node Similarity algorithm compares a set of nodes based on the nodes they are connected to. Two nodes are considered similar if they share many of the same neighbors. Node Similarity computes pair-wise similarities based on the Jaccard metric.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.nodeSimilarity.stats.estimate': {
      label: 'gds.nodeSimilarity.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.nodeSimilarity.stream': {
      label: 'gds.nodeSimilarity.stream',
      documentation:
        'The Node Similarity algorithm compares a set of nodes based on the nodes they are connected to. Two nodes are considered similar if they share many of the same neighbors. Node Similarity computes pair-wise similarities based on the Jaccard metric.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.nodeSimilarity.stream.estimate': {
      label: 'gds.nodeSimilarity.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.nodeSimilarity.write': {
      label: 'gds.nodeSimilarity.write',
      documentation:
        'The Node Similarity algorithm compares a set of nodes based on the nodes they are connected to. Two nodes are considered similar if they share many of the same neighbors. Node Similarity computes pair-wise similarities based on the Jaccard metric.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.nodeSimilarity.write.estimate': {
      label: 'gds.nodeSimilarity.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.pageRank.mutate': {
      label: 'gds.pageRank.mutate',
      documentation:
        'Page Rank is an algorithm that measures the transitive influence or connectivity of nodes.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.pageRank.mutate.estimate': {
      label: 'gds.pageRank.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.pageRank.stats': {
      label: 'gds.pageRank.stats',
      documentation:
        'Executes the algorithm and returns result statistics without writing the result to Neo4j.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.pageRank.stats.estimate': {
      label: 'gds.pageRank.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.pageRank.stream': {
      label: 'gds.pageRank.stream',
      documentation:
        'Page Rank is an algorithm that measures the transitive influence or connectivity of nodes.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.pageRank.stream.estimate': {
      label: 'gds.pageRank.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.pageRank.write': {
      label: 'gds.pageRank.write',
      documentation:
        'Page Rank is an algorithm that measures the transitive influence or connectivity of nodes.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.pageRank.write.estimate': {
      label: 'gds.pageRank.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.pipeline.drop': {
      label: 'gds.pipeline.drop',
      documentation: 'Drops a pipeline and frees up the resources it occupies.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
        {
          label: 'failIfMissing',
          documentation: 'failIfMissing = true :: BOOLEAN?',
        },
      ],
    },
    'gds.pipeline.exists': {
      label: 'gds.pipeline.exists',
      documentation:
        'Checks if a given pipeline exists in the pipeline catalog.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName :: STRING?',
        },
      ],
    },
    'gds.pipeline.list': {
      label: 'gds.pipeline.list',
      documentation: 'Lists all pipelines contained in the pipeline catalog.',
      parameters: [
        {
          label: 'pipelineName',
          documentation: 'pipelineName = __NO_VALUE :: STRING?',
        },
      ],
    },
    'gds.randomWalk.stats': {
      label: 'gds.randomWalk.stats',
      documentation:
        'Random Walk is an algorithm that provides random paths in a graph. It’s similar to how a drunk person traverses a city.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.randomWalk.stats.estimate': {
      label: 'gds.randomWalk.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.randomWalk.stream': {
      label: 'gds.randomWalk.stream',
      documentation:
        'Random Walk is an algorithm that provides random paths in a graph. It’s similar to how a drunk person traverses a city.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.randomWalk.stream.estimate': {
      label: 'gds.randomWalk.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.restore': {
      label: 'gds.restore',
      documentation: 'The restore procedure reads graphs and models from disk.',
      parameters: [
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.scaleProperties.mutate': {
      label: 'gds.scaleProperties.mutate',
      documentation: 'Scale node properties',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.scaleProperties.mutate.estimate': {
      label: 'gds.scaleProperties.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.scaleProperties.stats': {
      label: 'gds.scaleProperties.stats',
      documentation: 'Scale node properties',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.scaleProperties.stats.estimate': {
      label: 'gds.scaleProperties.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.scaleProperties.stream': {
      label: 'gds.scaleProperties.stream',
      documentation: 'Scale node properties',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.scaleProperties.stream.estimate': {
      label: 'gds.scaleProperties.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.scaleProperties.write': {
      label: 'gds.scaleProperties.write',
      documentation: 'Scale node properties',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.scaleProperties.write.estimate': {
      label: 'gds.scaleProperties.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.scc.mutate': {
      label: 'gds.scc.mutate',
      documentation:
        'The SCC algorithm finds sets of connected nodes in an directed graph, where all nodes in the same set form a connected component.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.scc.mutate.estimate': {
      label: 'gds.scc.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.scc.stats': {
      label: 'gds.scc.stats',
      documentation:
        'The SCC algorithm finds sets of connected nodes in an directed graph, where all nodes in the same set form a connected component.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.scc.stats.estimate': {
      label: 'gds.scc.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.scc.stream': {
      label: 'gds.scc.stream',
      documentation:
        'The SCC algorithm finds sets of connected nodes in an directed graph, where all nodes in the same set form a connected component.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.scc.stream.estimate': {
      label: 'gds.scc.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.scc.write': {
      label: 'gds.scc.write',
      documentation:
        'The SCC algorithm finds sets of connected nodes in an directed graph, where all nodes in the same set form a connected component.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.scc.write.estimate': {
      label: 'gds.scc.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.shortestPath.astar.mutate': {
      label: 'gds.shortestPath.astar.mutate',
      documentation:
        'The A* shortest path algorithm computes the shortest path between a pair of nodes. It uses the relationship weight property to compare path lengths. In addition, this implementation uses the haversine distance as a heuristic to converge faster.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.shortestPath.astar.mutate.estimate': {
      label: 'gds.shortestPath.astar.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.shortestPath.astar.stream': {
      label: 'gds.shortestPath.astar.stream',
      documentation:
        'The A* shortest path algorithm computes the shortest path between a pair of nodes. It uses the relationship weight property to compare path lengths. In addition, this implementation uses the haversine distance as a heuristic to converge faster.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.shortestPath.astar.stream.estimate': {
      label: 'gds.shortestPath.astar.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.shortestPath.astar.write': {
      label: 'gds.shortestPath.astar.write',
      documentation:
        'The A* shortest path algorithm computes the shortest path between a pair of nodes. It uses the relationship weight property to compare path lengths. In addition, this implementation uses the haversine distance as a heuristic to converge faster.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.shortestPath.astar.write.estimate': {
      label: 'gds.shortestPath.astar.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.shortestPath.dijkstra.mutate': {
      label: 'gds.shortestPath.dijkstra.mutate',
      documentation:
        'The Dijkstra shortest path algorithm computes the shortest (weighted) path between a pair of nodes.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.shortestPath.dijkstra.mutate.estimate': {
      label: 'gds.shortestPath.dijkstra.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.shortestPath.dijkstra.stream': {
      label: 'gds.shortestPath.dijkstra.stream',
      documentation:
        'The Dijkstra shortest path algorithm computes the shortest (weighted) path between a pair of nodes.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.shortestPath.dijkstra.stream.estimate': {
      label: 'gds.shortestPath.dijkstra.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.shortestPath.dijkstra.write': {
      label: 'gds.shortestPath.dijkstra.write',
      documentation:
        'The Dijkstra shortest path algorithm computes the shortest (weighted) path between a pair of nodes.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.shortestPath.dijkstra.write.estimate': {
      label: 'gds.shortestPath.dijkstra.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.shortestPath.yens.mutate': {
      label: 'gds.shortestPath.yens.mutate',
      documentation:
        "The Yen's shortest path algorithm computes the k shortest (weighted) paths between a pair of nodes.",
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.shortestPath.yens.mutate.estimate': {
      label: 'gds.shortestPath.yens.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.shortestPath.yens.stream': {
      label: 'gds.shortestPath.yens.stream',
      documentation:
        "The Yen's shortest path algorithm computes the k shortest (weighted) paths between a pair of nodes.",
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.shortestPath.yens.stream.estimate': {
      label: 'gds.shortestPath.yens.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: ANY?',
        },
        {
          label: 'configuration',
          documentation: 'configuration :: MAP?',
        },
      ],
    },
    'gds.shortestPath.yens.write': {
      label: 'gds.shortestPath.yens.write',
      documentation:
        "The Yen's shortest path algorithm computes the k shortest (weighted) paths between a pair of nodes.",
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.shortestPath.yens.write.estimate': {
      label: 'gds.shortestPath.yens.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: ANY?',
        },
        {
          label: 'configuration',
          documentation: 'configuration :: MAP?',
        },
      ],
    },
    'gds.sllpa.mutate': {
      label: 'gds.sllpa.mutate',
      documentation:
        'The Speaker Listener Label Propagation algorithm is a fast algorithm for finding overlapping communities in a graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.sllpa.mutate.estimate': {
      label: 'gds.sllpa.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.sllpa.stats': {
      label: 'gds.sllpa.stats',
      documentation:
        'The Speaker Listener Label Propagation algorithm is a fast algorithm for finding overlapping communities in a graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.sllpa.stats.estimate': {
      label: 'gds.sllpa.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.sllpa.stream': {
      label: 'gds.sllpa.stream',
      documentation:
        'The Speaker Listener Label Propagation algorithm is a fast algorithm for finding overlapping communities in a graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.sllpa.stream.estimate': {
      label: 'gds.sllpa.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.sllpa.write': {
      label: 'gds.sllpa.write',
      documentation:
        'The Speaker Listener Label Propagation algorithm is a fast algorithm for finding overlapping communities in a graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.sllpa.write.estimate': {
      label: 'gds.sllpa.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.spanningTree.mutate': {
      label: 'gds.spanningTree.mutate',
      documentation:
        'The spanning tree algorithm visits all nodes that are in the same connected component as the starting node, and returns a spanning tree of all nodes in the component where the total weight of the relationships is either minimized or maximized.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.spanningTree.mutate.estimate': {
      label: 'gds.spanningTree.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.spanningTree.stats': {
      label: 'gds.spanningTree.stats',
      documentation:
        'The spanning tree algorithm visits all nodes that are in the same connected component as the starting node, and returns a spanning tree of all nodes in the component where the total weight of the relationships is either minimized or maximized.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.spanningTree.stats.estimate': {
      label: 'gds.spanningTree.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.spanningTree.stream': {
      label: 'gds.spanningTree.stream',
      documentation:
        'The spanning tree algorithm visits all nodes that are in the same connected component as the starting node, and returns a spanning tree of all nodes in the component where the total weight of the relationships is either minimized or maximized.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.spanningTree.stream.estimate': {
      label: 'gds.spanningTree.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.spanningTree.write': {
      label: 'gds.spanningTree.write',
      documentation:
        'The spanning tree algorithm visits all nodes that are in the same connected component as the starting node, and returns a spanning tree of all nodes in the component where the total weight of the relationships is either minimized or maximized.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.spanningTree.write.estimate': {
      label: 'gds.spanningTree.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.steinerTree.mutate': {
      label: 'gds.steinerTree.mutate',
      documentation:
        'The steiner tree algorithm accepts a source node, as well as a list of target nodes. It then attempts to find a spanning tree where there is a path from the source node to each target node, such that the total weight of the relationships is as low as possible.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.steinerTree.mutate.estimate': {
      label: 'gds.steinerTree.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: ANY?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.steinerTree.stats': {
      label: 'gds.steinerTree.stats',
      documentation:
        'The steiner tree algorithm accepts a source node, as well as a list of target nodes. It then attempts to find a spanning tree where there is a path from the source node to each target node, such that the total weight of the relationships is as low as possible.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.steinerTree.stats.estimate': {
      label: 'gds.steinerTree.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: ANY?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.steinerTree.stream': {
      label: 'gds.steinerTree.stream',
      documentation:
        'The steiner tree algorithm accepts a source node, as well as a list of target nodes. It then attempts to find a spanning tree where there is a path from the source node to each target node, such that the total weight of the relationships is as low as possible.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.steinerTree.stream.estimate': {
      label: 'gds.steinerTree.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: ANY?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.steinerTree.write': {
      label: 'gds.steinerTree.write',
      documentation:
        'The steiner tree algorithm accepts a source node, as well as a list of target nodes. It then attempts to find a spanning tree where there is a path from the source node to each target node, such that the total weight of the relationships is as low as possible.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.steinerTree.write.estimate': {
      label: 'gds.steinerTree.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: ANY?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.systemMonitor': {
      label: 'gds.systemMonitor',
      documentation:
        "Get an overview of the system's workload and available resources",
      parameters: [],
    },
    'gds.triangleCount.mutate': {
      label: 'gds.triangleCount.mutate',
      documentation:
        'Triangle counting is a community detection graph algorithm that is used to determine the number of triangles passing through each node in the graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.triangleCount.mutate.estimate': {
      label: 'gds.triangleCount.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.triangleCount.stats': {
      label: 'gds.triangleCount.stats',
      documentation:
        'Triangle counting is a community detection graph algorithm that is used to determine the number of triangles passing through each node in the graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.triangleCount.stats.estimate': {
      label: 'gds.triangleCount.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.triangleCount.stream': {
      label: 'gds.triangleCount.stream',
      documentation:
        'Triangle counting is a community detection graph algorithm that is used to determine the number of triangles passing through each node in the graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.triangleCount.stream.estimate': {
      label: 'gds.triangleCount.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.triangleCount.write': {
      label: 'gds.triangleCount.write',
      documentation:
        'Triangle counting is a community detection graph algorithm that is used to determine the number of triangles passing through each node in the graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.triangleCount.write.estimate': {
      label: 'gds.triangleCount.write.estimate',
      documentation:
        'Triangle counting is a community detection graph algorithm that is used to determine the number of triangles passing through each node in the graph.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.triangles': {
      label: 'gds.triangles',
      documentation:
        'Triangles streams the nodeIds of each triangle in the graph.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.userLog': {
      label: 'gds.userLog',
      documentation: 'Log warnings and hints for currently running tasks.',
      parameters: [
        {
          label: 'jobId',
          documentation: 'jobId =  :: STRING?',
        },
      ],
    },
    'gds.version': {
      label: 'gds.version',
      documentation:
        'CALL gds.version() | Return the installed graph data science library version.',
      parameters: [],
    },
    'gds.wcc.mutate': {
      label: 'gds.wcc.mutate',
      documentation:
        'The WCC algorithm finds sets of connected nodes in an undirected graph, where all nodes in the same set form a connected component.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.wcc.mutate.estimate': {
      label: 'gds.wcc.mutate.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.wcc.stats': {
      label: 'gds.wcc.stats',
      documentation:
        'The WCC algorithm finds sets of connected nodes in an undirected graph, where all nodes in the same set form a connected component.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.wcc.stats.estimate': {
      label: 'gds.wcc.stats.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.wcc.stream': {
      label: 'gds.wcc.stream',
      documentation:
        'The WCC algorithm finds sets of connected nodes in an undirected graph, where all nodes in the same set form a connected component.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.wcc.stream.estimate': {
      label: 'gds.wcc.stream.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
    },
    'gds.wcc.write': {
      label: 'gds.wcc.write',
      documentation:
        'The WCC algorithm finds sets of connected nodes in an undirected graph, where all nodes in the same set form a connected component.',
      parameters: [
        {
          label: 'graphName',
          documentation: 'graphName :: STRING?',
        },
        {
          label: 'configuration',
          documentation: 'configuration = {} :: MAP?',
        },
      ],
    },
    'gds.wcc.write.estimate': {
      label: 'gds.wcc.write.estimate',
      documentation:
        'Returns an estimation of the memory consumption for that procedure.',
      parameters: [
        {
          label: 'graphNameOrConfiguration',
          documentation: 'graphNameOrConfiguration :: ANY?',
        },
        {
          label: 'algoConfiguration',
          documentation: 'algoConfiguration :: MAP?',
        },
      ],
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
          documentation: 'data :: MAP?',
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
