const mockSchema = {
  functionSignatures: {
    abs: {
      label: 'abs',
    },
    acos: {
      label: 'acos',
    },
    all: {
      label: 'all',
    },
    any: {
      label: 'any',
    },
    'apoc.agg.first': {
      label: 'apoc.agg.first',
    },
    'apoc.agg.graph': {
      label: 'apoc.agg.graph',
    },
    'apoc.agg.last': {
      label: 'apoc.agg.last',
    },
    'apoc.agg.maxItems': {
      label: 'apoc.agg.maxItems',
    },
    'apoc.agg.median': {
      label: 'apoc.agg.median',
    },
    'apoc.agg.minItems': {
      label: 'apoc.agg.minItems',
    },
    'apoc.agg.nth': {
      label: 'apoc.agg.nth',
    },
    'apoc.agg.percentiles': {
      label: 'apoc.agg.percentiles',
    },
    'apoc.agg.product': {
      label: 'apoc.agg.product',
    },
    'apoc.agg.slice': {
      label: 'apoc.agg.slice',
    },
    'apoc.agg.statistics': {
      label: 'apoc.agg.statistics',
    },
    'apoc.any.isDeleted': {
      label: 'apoc.any.isDeleted',
    },
    'apoc.any.properties': {
      label: 'apoc.any.properties',
    },
    'apoc.any.property': {
      label: 'apoc.any.property',
    },
    'apoc.any.rebind': {
      label: 'apoc.any.rebind',
    },
    'apoc.bitwise.op': {
      label: 'apoc.bitwise.op',
    },
    'apoc.coll.avg': {
      label: 'apoc.coll.avg',
    },
    'apoc.coll.avgDuration': {
      label: 'apoc.coll.avgDuration',
    },
    'apoc.coll.combinations': {
      label: 'apoc.coll.combinations',
    },
    'apoc.coll.contains': {
      label: 'apoc.coll.contains',
    },
    'apoc.coll.containsAll': {
      label: 'apoc.coll.containsAll',
    },
    'apoc.coll.containsAllSorted': {
      label: 'apoc.coll.containsAllSorted',
    },
    'apoc.coll.containsDuplicates': {
      label: 'apoc.coll.containsDuplicates',
    },
    'apoc.coll.containsSorted': {
      label: 'apoc.coll.containsSorted',
    },
    'apoc.coll.different': {
      label: 'apoc.coll.different',
    },
    'apoc.coll.disjunction': {
      label: 'apoc.coll.disjunction',
    },
    'apoc.coll.dropDuplicateNeighbors': {
      label: 'apoc.coll.dropDuplicateNeighbors',
    },
    'apoc.coll.duplicates': {
      label: 'apoc.coll.duplicates',
    },
    'apoc.coll.duplicatesWithCount': {
      label: 'apoc.coll.duplicatesWithCount',
    },
    'apoc.coll.fill': {
      label: 'apoc.coll.fill',
    },
    'apoc.coll.flatten': {
      label: 'apoc.coll.flatten',
    },
    'apoc.coll.frequencies': {
      label: 'apoc.coll.frequencies',
    },
    'apoc.coll.frequenciesAsMap': {
      label: 'apoc.coll.frequenciesAsMap',
    },
    'apoc.coll.indexOf': {
      label: 'apoc.coll.indexOf',
    },
    'apoc.coll.insert': {
      label: 'apoc.coll.insert',
    },
    'apoc.coll.insertAll': {
      label: 'apoc.coll.insertAll',
    },
    'apoc.coll.intersection': {
      label: 'apoc.coll.intersection',
    },
    'apoc.coll.isEqualCollection': {
      label: 'apoc.coll.isEqualCollection',
    },
    'apoc.coll.max': {
      label: 'apoc.coll.max',
    },
    'apoc.coll.min': {
      label: 'apoc.coll.min',
    },
    'apoc.coll.occurrences': {
      label: 'apoc.coll.occurrences',
    },
    'apoc.coll.pairWithOffset': {
      label: 'apoc.coll.pairWithOffset',
    },
    'apoc.coll.pairs': {
      label: 'apoc.coll.pairs',
    },
    'apoc.coll.pairsMin': {
      label: 'apoc.coll.pairsMin',
    },
    'apoc.coll.partition': {
      label: 'apoc.coll.partition',
    },
    'apoc.coll.randomItem': {
      label: 'apoc.coll.randomItem',
    },
    'apoc.coll.randomItems': {
      label: 'apoc.coll.randomItems',
    },
    'apoc.coll.remove': {
      label: 'apoc.coll.remove',
    },
    'apoc.coll.removeAll': {
      label: 'apoc.coll.removeAll',
    },
    'apoc.coll.reverse': {
      label: 'apoc.coll.reverse',
    },
    'apoc.coll.runningTotal': {
      label: 'apoc.coll.runningTotal',
    },
    'apoc.coll.set': {
      label: 'apoc.coll.set',
    },
    'apoc.coll.shuffle': {
      label: 'apoc.coll.shuffle',
    },
    'apoc.coll.sort': {
      label: 'apoc.coll.sort',
    },
    'apoc.coll.sortMaps': {
      label: 'apoc.coll.sortMaps',
    },
    'apoc.coll.sortMulti': {
      label: 'apoc.coll.sortMulti',
    },
    'apoc.coll.sortNodes': {
      label: 'apoc.coll.sortNodes',
    },
    'apoc.coll.sortText': {
      label: 'apoc.coll.sortText',
    },
    'apoc.coll.stdev': {
      label: 'apoc.coll.stdev',
    },
    'apoc.coll.subtract': {
      label: 'apoc.coll.subtract',
    },
    'apoc.coll.sum': {
      label: 'apoc.coll.sum',
    },
    'apoc.coll.sumLongs': {
      label: 'apoc.coll.sumLongs',
    },
    'apoc.coll.toSet': {
      label: 'apoc.coll.toSet',
    },
    'apoc.coll.union': {
      label: 'apoc.coll.union',
    },
    'apoc.coll.unionAll': {
      label: 'apoc.coll.unionAll',
    },
    'apoc.coll.zip': {
      label: 'apoc.coll.zip',
    },
    'apoc.convert.fromJsonList': {
      label: 'apoc.convert.fromJsonList',
    },
    'apoc.convert.fromJsonMap': {
      label: 'apoc.convert.fromJsonMap',
    },
    'apoc.convert.getJsonProperty': {
      label: 'apoc.convert.getJsonProperty',
    },
    'apoc.convert.getJsonPropertyMap': {
      label: 'apoc.convert.getJsonPropertyMap',
    },
    'apoc.convert.toBoolean': {
      label: 'apoc.convert.toBoolean',
    },
    'apoc.convert.toBooleanList': {
      label: 'apoc.convert.toBooleanList',
    },
    'apoc.convert.toFloat': {
      label: 'apoc.convert.toFloat',
    },
    'apoc.convert.toIntList': {
      label: 'apoc.convert.toIntList',
    },
    'apoc.convert.toInteger': {
      label: 'apoc.convert.toInteger',
    },
    'apoc.convert.toJson': {
      label: 'apoc.convert.toJson',
    },
    'apoc.convert.toList': {
      label: 'apoc.convert.toList',
    },
    'apoc.convert.toMap': {
      label: 'apoc.convert.toMap',
    },
    'apoc.convert.toNode': {
      label: 'apoc.convert.toNode',
    },
    'apoc.convert.toNodeList': {
      label: 'apoc.convert.toNodeList',
    },
    'apoc.convert.toRelationship': {
      label: 'apoc.convert.toRelationship',
    },
    'apoc.convert.toRelationshipList': {
      label: 'apoc.convert.toRelationshipList',
    },
    'apoc.convert.toSet': {
      label: 'apoc.convert.toSet',
    },
    'apoc.convert.toSortedJsonMap': {
      label: 'apoc.convert.toSortedJsonMap',
    },
    'apoc.convert.toString': {
      label: 'apoc.convert.toString',
    },
    'apoc.convert.toStringList': {
      label: 'apoc.convert.toStringList',
    },
    'apoc.create.uuid': {
      label: 'apoc.create.uuid',
    },
    'apoc.create.uuidBase64': {
      label: 'apoc.create.uuidBase64',
    },
    'apoc.create.uuidBase64ToHex': {
      label: 'apoc.create.uuidBase64ToHex',
    },
    'apoc.create.uuidHexToBase64': {
      label: 'apoc.create.uuidHexToBase64',
    },
    'apoc.create.vNode': {
      label: 'apoc.create.vNode',
    },
    'apoc.create.vRelationship': {
      label: 'apoc.create.vRelationship',
    },
    'apoc.create.virtual.fromNode': {
      label: 'apoc.create.virtual.fromNode',
    },
    'apoc.cypher.runFirstColumn': {
      label: 'apoc.cypher.runFirstColumn',
    },
    'apoc.cypher.runFirstColumnMany': {
      label: 'apoc.cypher.runFirstColumnMany',
    },
    'apoc.cypher.runFirstColumnSingle': {
      label: 'apoc.cypher.runFirstColumnSingle',
    },
    'apoc.data.domain': {
      label: 'apoc.data.domain',
    },
    'apoc.data.url': {
      label: 'apoc.data.url',
    },
    'apoc.date.add': {
      label: 'apoc.date.add',
    },
    'apoc.date.convert': {
      label: 'apoc.date.convert',
    },
    'apoc.date.convertFormat': {
      label: 'apoc.date.convertFormat',
    },
    'apoc.date.currentTimestamp': {
      label: 'apoc.date.currentTimestamp',
    },
    'apoc.date.field': {
      label: 'apoc.date.field',
    },
    'apoc.date.fields': {
      label: 'apoc.date.fields',
    },
    'apoc.date.format': {
      label: 'apoc.date.format',
    },
    'apoc.date.fromISO8601': {
      label: 'apoc.date.fromISO8601',
    },
    'apoc.date.parse': {
      label: 'apoc.date.parse',
    },
    'apoc.date.parseAsZonedDateTime': {
      label: 'apoc.date.parseAsZonedDateTime',
    },
    'apoc.date.systemTimezone': {
      label: 'apoc.date.systemTimezone',
    },
    'apoc.date.toISO8601': {
      label: 'apoc.date.toISO8601',
    },
    'apoc.date.toYears': {
      label: 'apoc.date.toYears',
    },
    'apoc.diff.nodes': {
      label: 'apoc.diff.nodes',
    },
    'apoc.hashing.fingerprint': {
      label: 'apoc.hashing.fingerprint',
    },
    'apoc.hashing.fingerprintGraph': {
      label: 'apoc.hashing.fingerprintGraph',
    },
    'apoc.hashing.fingerprinting': {
      label: 'apoc.hashing.fingerprinting',
    },
    'apoc.json.path': {
      label: 'apoc.json.path',
    },
    'apoc.label.exists': {
      label: 'apoc.label.exists',
    },
    'apoc.map.clean': {
      label: 'apoc.map.clean',
    },
    'apoc.map.flatten': {
      label: 'apoc.map.flatten',
    },
    'apoc.map.fromLists': {
      label: 'apoc.map.fromLists',
    },
    'apoc.map.fromNodes': {
      label: 'apoc.map.fromNodes',
    },
    'apoc.map.fromPairs': {
      label: 'apoc.map.fromPairs',
    },
    'apoc.map.fromValues': {
      label: 'apoc.map.fromValues',
    },
    'apoc.map.get': {
      label: 'apoc.map.get',
    },
    'apoc.map.groupBy': {
      label: 'apoc.map.groupBy',
    },
    'apoc.map.groupByMulti': {
      label: 'apoc.map.groupByMulti',
    },
    'apoc.map.merge': {
      label: 'apoc.map.merge',
    },
    'apoc.map.mergeList': {
      label: 'apoc.map.mergeList',
    },
    'apoc.map.mget': {
      label: 'apoc.map.mget',
    },
    'apoc.map.removeKey': {
      label: 'apoc.map.removeKey',
    },
    'apoc.map.removeKeys': {
      label: 'apoc.map.removeKeys',
    },
    'apoc.map.setEntry': {
      label: 'apoc.map.setEntry',
    },
    'apoc.map.setKey': {
      label: 'apoc.map.setKey',
    },
    'apoc.map.setLists': {
      label: 'apoc.map.setLists',
    },
    'apoc.map.setPairs': {
      label: 'apoc.map.setPairs',
    },
    'apoc.map.setValues': {
      label: 'apoc.map.setValues',
    },
    'apoc.map.sortedProperties': {
      label: 'apoc.map.sortedProperties',
    },
    'apoc.map.submap': {
      label: 'apoc.map.submap',
    },
    'apoc.map.unflatten': {
      label: 'apoc.map.unflatten',
    },
    'apoc.map.updateTree': {
      label: 'apoc.map.updateTree',
    },
    'apoc.map.values': {
      label: 'apoc.map.values',
    },
    'apoc.math.cosh': {
      label: 'apoc.math.cosh',
    },
    'apoc.math.coth': {
      label: 'apoc.math.coth',
    },
    'apoc.math.csch': {
      label: 'apoc.math.csch',
    },
    'apoc.math.maxByte': {
      label: 'apoc.math.maxByte',
    },
    'apoc.math.maxDouble': {
      label: 'apoc.math.maxDouble',
    },
    'apoc.math.maxInt': {
      label: 'apoc.math.maxInt',
    },
    'apoc.math.maxLong': {
      label: 'apoc.math.maxLong',
    },
    'apoc.math.minByte': {
      label: 'apoc.math.minByte',
    },
    'apoc.math.minDouble': {
      label: 'apoc.math.minDouble',
    },
    'apoc.math.minInt': {
      label: 'apoc.math.minInt',
    },
    'apoc.math.minLong': {
      label: 'apoc.math.minLong',
    },
    'apoc.math.round': {
      label: 'apoc.math.round',
    },
    'apoc.math.sech': {
      label: 'apoc.math.sech',
    },
    'apoc.math.sigmoid': {
      label: 'apoc.math.sigmoid',
    },
    'apoc.math.sigmoidPrime': {
      label: 'apoc.math.sigmoidPrime',
    },
    'apoc.math.sinh': {
      label: 'apoc.math.sinh',
    },
    'apoc.math.tanh': {
      label: 'apoc.math.tanh',
    },
    'apoc.meta.cypher.isType': {
      label: 'apoc.meta.cypher.isType',
    },
    'apoc.meta.cypher.type': {
      label: 'apoc.meta.cypher.type',
    },
    'apoc.meta.cypher.types': {
      label: 'apoc.meta.cypher.types',
    },
    'apoc.meta.isType': {
      label: 'apoc.meta.isType',
    },
    'apoc.meta.nodes.count': {
      label: 'apoc.meta.nodes.count',
    },
    'apoc.meta.type': {
      label: 'apoc.meta.type',
    },
    'apoc.meta.typeName': {
      label: 'apoc.meta.typeName',
    },
    'apoc.meta.types': {
      label: 'apoc.meta.types',
    },
    'apoc.node.degree': {
      label: 'apoc.node.degree',
    },
    'apoc.node.degree.in': {
      label: 'apoc.node.degree.in',
    },
    'apoc.node.degree.out': {
      label: 'apoc.node.degree.out',
    },
    'apoc.node.id': {
      label: 'apoc.node.id',
    },
    'apoc.node.labels': {
      label: 'apoc.node.labels',
    },
    'apoc.node.rebind': {
      label: 'apoc.node.rebind',
    },
    'apoc.node.relationship.exists': {
      label: 'apoc.node.relationship.exists',
    },
    'apoc.node.relationship.types': {
      label: 'apoc.node.relationship.types',
    },
    'apoc.node.relationships.exist': {
      label: 'apoc.node.relationships.exist',
    },
    'apoc.nodes.connected': {
      label: 'apoc.nodes.connected',
    },
    'apoc.nodes.isDense': {
      label: 'apoc.nodes.isDense',
    },
    'apoc.nodes.relationship.types': {
      label: 'apoc.nodes.relationship.types',
    },
    'apoc.nodes.relationships.exist': {
      label: 'apoc.nodes.relationships.exist',
    },
    'apoc.number.arabicToRoman': {
      label: 'apoc.number.arabicToRoman',
    },
    'apoc.number.exact.add': {
      label: 'apoc.number.exact.add',
    },
    'apoc.number.exact.div': {
      label: 'apoc.number.exact.div',
    },
    'apoc.number.exact.mul': {
      label: 'apoc.number.exact.mul',
    },
    'apoc.number.exact.sub': {
      label: 'apoc.number.exact.sub',
    },
    'apoc.number.exact.toExact': {
      label: 'apoc.number.exact.toExact',
    },
    'apoc.number.exact.toFloat': {
      label: 'apoc.number.exact.toFloat',
    },
    'apoc.number.exact.toInteger': {
      label: 'apoc.number.exact.toInteger',
    },
    'apoc.number.format': {
      label: 'apoc.number.format',
    },
    'apoc.number.parseFloat': {
      label: 'apoc.number.parseFloat',
    },
    'apoc.number.parseInt': {
      label: 'apoc.number.parseInt',
    },
    'apoc.number.romanToArabic': {
      label: 'apoc.number.romanToArabic',
    },
    'apoc.path.combine': {
      label: 'apoc.path.combine',
    },
    'apoc.path.create': {
      label: 'apoc.path.create',
    },
    'apoc.path.elements': {
      label: 'apoc.path.elements',
    },
    'apoc.path.slice': {
      label: 'apoc.path.slice',
    },
    'apoc.rel.endNode': {
      label: 'apoc.rel.endNode',
    },
    'apoc.rel.id': {
      label: 'apoc.rel.id',
    },
    'apoc.rel.rebind': {
      label: 'apoc.rel.rebind',
    },
    'apoc.rel.startNode': {
      label: 'apoc.rel.startNode',
    },
    'apoc.rel.type': {
      label: 'apoc.rel.type',
    },
    'apoc.schema.node.constraintExists': {
      label: 'apoc.schema.node.constraintExists',
    },
    'apoc.schema.node.indexExists': {
      label: 'apoc.schema.node.indexExists',
    },
    'apoc.schema.relationship.constraintExists': {
      label: 'apoc.schema.relationship.constraintExists',
    },
    'apoc.schema.relationship.indexExists': {
      label: 'apoc.schema.relationship.indexExists',
    },
    'apoc.scoring.existence': {
      label: 'apoc.scoring.existence',
    },
    'apoc.scoring.pareto': {
      label: 'apoc.scoring.pareto',
    },
    'apoc.static.get': {
      label: 'apoc.static.get',
    },
    'apoc.static.getAll': {
      label: 'apoc.static.getAll',
    },
    'apoc.temporal.format': {
      label: 'apoc.temporal.format',
    },
    'apoc.temporal.formatDuration': {
      label: 'apoc.temporal.formatDuration',
    },
    'apoc.temporal.toZonedTemporal': {
      label: 'apoc.temporal.toZonedTemporal',
    },
    'apoc.text.base64Decode': {
      label: 'apoc.text.base64Decode',
    },
    'apoc.text.base64Encode': {
      label: 'apoc.text.base64Encode',
    },
    'apoc.text.base64UrlDecode': {
      label: 'apoc.text.base64UrlDecode',
    },
    'apoc.text.base64UrlEncode': {
      label: 'apoc.text.base64UrlEncode',
    },
    'apoc.text.byteCount': {
      label: 'apoc.text.byteCount',
    },
    'apoc.text.bytes': {
      label: 'apoc.text.bytes',
    },
    'apoc.text.camelCase': {
      label: 'apoc.text.camelCase',
    },
    'apoc.text.capitalize': {
      label: 'apoc.text.capitalize',
    },
    'apoc.text.capitalizeAll': {
      label: 'apoc.text.capitalizeAll',
    },
    'apoc.text.charAt': {
      label: 'apoc.text.charAt',
    },
    'apoc.text.clean': {
      label: 'apoc.text.clean',
    },
    'apoc.text.code': {
      label: 'apoc.text.code',
    },
    'apoc.text.compareCleaned': {
      label: 'apoc.text.compareCleaned',
    },
    'apoc.text.decapitalize': {
      label: 'apoc.text.decapitalize',
    },
    'apoc.text.decapitalizeAll': {
      label: 'apoc.text.decapitalizeAll',
    },
    'apoc.text.distance': {
      label: 'apoc.text.distance',
    },
    'apoc.text.doubleMetaphone': {
      label: 'apoc.text.doubleMetaphone',
    },
    'apoc.text.format': {
      label: 'apoc.text.format',
    },
    'apoc.text.fuzzyMatch': {
      label: 'apoc.text.fuzzyMatch',
    },
    'apoc.text.hammingDistance': {
      label: 'apoc.text.hammingDistance',
    },
    'apoc.text.hexCharAt': {
      label: 'apoc.text.hexCharAt',
    },
    'apoc.text.hexValue': {
      label: 'apoc.text.hexValue',
    },
    'apoc.text.indexOf': {
      label: 'apoc.text.indexOf',
    },
    'apoc.text.indexesOf': {
      label: 'apoc.text.indexesOf',
    },
    'apoc.text.jaroWinklerDistance': {
      label: 'apoc.text.jaroWinklerDistance',
    },
    'apoc.text.join': {
      label: 'apoc.text.join',
    },
    'apoc.text.levenshteinDistance': {
      label: 'apoc.text.levenshteinDistance',
    },
    'apoc.text.levenshteinSimilarity': {
      label: 'apoc.text.levenshteinSimilarity',
    },
    'apoc.text.lpad': {
      label: 'apoc.text.lpad',
    },
    'apoc.text.phonetic': {
      label: 'apoc.text.phonetic',
    },
    'apoc.text.random': {
      label: 'apoc.text.random',
    },
    'apoc.text.regexGroups': {
      label: 'apoc.text.regexGroups',
    },
    'apoc.text.regreplace': {
      label: 'apoc.text.regreplace',
    },
    'apoc.text.repeat': {
      label: 'apoc.text.repeat',
    },
    'apoc.text.replace': {
      label: 'apoc.text.replace',
    },
    'apoc.text.rpad': {
      label: 'apoc.text.rpad',
    },
    'apoc.text.slug': {
      label: 'apoc.text.slug',
    },
    'apoc.text.snakeCase': {
      label: 'apoc.text.snakeCase',
    },
    'apoc.text.sorensenDiceSimilarity': {
      label: 'apoc.text.sorensenDiceSimilarity',
    },
    'apoc.text.split': {
      label: 'apoc.text.split',
    },
    'apoc.text.swapCase': {
      label: 'apoc.text.swapCase',
    },
    'apoc.text.toCypher': {
      label: 'apoc.text.toCypher',
    },
    'apoc.text.toUpperCase': {
      label: 'apoc.text.toUpperCase',
    },
    'apoc.text.upperCamelCase': {
      label: 'apoc.text.upperCamelCase',
    },
    'apoc.text.urldecode': {
      label: 'apoc.text.urldecode',
    },
    'apoc.text.urlencode': {
      label: 'apoc.text.urlencode',
    },
    'apoc.trigger.nodesByLabel': {
      label: 'apoc.trigger.nodesByLabel',
    },
    'apoc.trigger.propertiesByKey': {
      label: 'apoc.trigger.propertiesByKey',
    },
    'apoc.trigger.toNode': {
      label: 'apoc.trigger.toNode',
    },
    'apoc.trigger.toRelationship': {
      label: 'apoc.trigger.toRelationship',
    },
    'apoc.ttl.config': {
      label: 'apoc.ttl.config',
    },
    'apoc.util.compress': {
      label: 'apoc.util.compress',
    },
    'apoc.util.decompress': {
      label: 'apoc.util.decompress',
    },
    'apoc.util.md5': {
      label: 'apoc.util.md5',
    },
    'apoc.util.sha1': {
      label: 'apoc.util.sha1',
    },
    'apoc.util.sha256': {
      label: 'apoc.util.sha256',
    },
    'apoc.util.sha384': {
      label: 'apoc.util.sha384',
    },
    'apoc.util.sha512': {
      label: 'apoc.util.sha512',
    },
    'apoc.util.validatePredicate': {
      label: 'apoc.util.validatePredicate',
    },
    'apoc.version': {
      label: 'apoc.version',
    },
    'apoc.xml.parse': {
      label: 'apoc.xml.parse',
    },
    asin: {
      label: 'asin',
    },
    atan: {
      label: 'atan',
    },
    atan2: {
      label: 'atan2',
    },
    avg: {
      label: 'avg',
    },
    ceil: {
      label: 'ceil',
    },
    coalesce: {
      label: 'coalesce',
    },
    collect: {
      label: 'collect',
    },
    cos: {
      label: 'cos',
    },
    cot: {
      label: 'cot',
    },
    count: {
      label: 'count',
    },
    date: {
      label: 'date',
    },
    'date.realtime': {
      label: 'date.realtime',
    },
    'date.statement': {
      label: 'date.statement',
    },
    'date.transaction': {
      label: 'date.transaction',
    },
    'date.truncate': {
      label: 'date.truncate',
    },
    datetime: {
      label: 'datetime',
    },
    'datetime.fromepoch': {
      label: 'datetime.fromepoch',
    },
    'datetime.fromepochmillis': {
      label: 'datetime.fromepochmillis',
    },
    'datetime.realtime': {
      label: 'datetime.realtime',
    },
    'datetime.statement': {
      label: 'datetime.statement',
    },
    'datetime.transaction': {
      label: 'datetime.transaction',
    },
    'datetime.truncate': {
      label: 'datetime.truncate',
    },
    degrees: {
      label: 'degrees',
    },
    duration: {
      label: 'duration',
    },
    'duration.between': {
      label: 'duration.between',
    },
    'duration.inDays': {
      label: 'duration.inDays',
    },
    'duration.inMonths': {
      label: 'duration.inMonths',
    },
    'duration.inSeconds': {
      label: 'duration.inSeconds',
    },
    e: {
      label: 'e',
    },
    endNode: {
      label: 'endNode',
    },
    exists: {
      label: 'exists',
    },
    exp: {
      label: 'exp',
    },
    file: {
      label: 'file',
    },
    floor: {
      label: 'floor',
    },
    'gds.alpha.linkprediction.adamicAdar': {
      label: 'gds.alpha.linkprediction.adamicAdar',
    },
    'gds.alpha.linkprediction.commonNeighbors': {
      label: 'gds.alpha.linkprediction.commonNeighbors',
    },
    'gds.alpha.linkprediction.preferentialAttachment': {
      label: 'gds.alpha.linkprediction.preferentialAttachment',
    },
    'gds.alpha.linkprediction.resourceAllocation': {
      label: 'gds.alpha.linkprediction.resourceAllocation',
    },
    'gds.alpha.linkprediction.sameCommunity': {
      label: 'gds.alpha.linkprediction.sameCommunity',
    },
    'gds.alpha.linkprediction.totalNeighbors': {
      label: 'gds.alpha.linkprediction.totalNeighbors',
    },
    'gds.alpha.ml.oneHotEncoding': {
      label: 'gds.alpha.ml.oneHotEncoding',
    },
    'gds.graph.exists': {
      label: 'gds.graph.exists',
    },
    'gds.graph.project': {
      label: 'gds.graph.project',
    },
    'gds.similarity.cosine': {
      label: 'gds.similarity.cosine',
    },
    'gds.similarity.euclidean': {
      label: 'gds.similarity.euclidean',
    },
    'gds.similarity.euclideanDistance': {
      label: 'gds.similarity.euclideanDistance',
    },
    'gds.similarity.jaccard': {
      label: 'gds.similarity.jaccard',
    },
    'gds.similarity.overlap': {
      label: 'gds.similarity.overlap',
    },
    'gds.similarity.pearson': {
      label: 'gds.similarity.pearson',
    },
    'gds.util.NaN': {
      label: 'gds.util.NaN',
    },
    'gds.util.asNode': {
      label: 'gds.util.asNode',
    },
    'gds.util.asNodes': {
      label: 'gds.util.asNodes',
    },
    'gds.util.infinity': {
      label: 'gds.util.infinity',
    },
    'gds.util.isFinite': {
      label: 'gds.util.isFinite',
    },
    'gds.util.isInfinite': {
      label: 'gds.util.isInfinite',
    },
    'gds.util.nodeProperty': {
      label: 'gds.util.nodeProperty',
    },
    'gds.version': {
      label: 'gds.version',
    },
    haversin: {
      label: 'haversin',
    },
    head: {
      label: 'head',
    },
    id: {
      label: 'id',
    },
    isEmpty: {
      label: 'isEmpty',
    },
    keys: {
      label: 'keys',
    },
    labels: {
      label: 'labels',
    },
    last: {
      label: 'last',
    },
    left: {
      label: 'left',
    },
    length: {
      label: 'length',
    },
    linenumber: {
      label: 'linenumber',
    },
    localdatetime: {
      label: 'localdatetime',
    },
    'localdatetime.realtime': {
      label: 'localdatetime.realtime',
    },
    'localdatetime.statement': {
      label: 'localdatetime.statement',
    },
    'localdatetime.transaction': {
      label: 'localdatetime.transaction',
    },
    'localdatetime.truncate': {
      label: 'localdatetime.truncate',
    },
    localtime: {
      label: 'localtime',
    },
    'localtime.realtime': {
      label: 'localtime.realtime',
    },
    'localtime.statement': {
      label: 'localtime.statement',
    },
    'localtime.transaction': {
      label: 'localtime.transaction',
    },
    'localtime.truncate': {
      label: 'localtime.truncate',
    },
    log: {
      label: 'log',
    },
    log10: {
      label: 'log10',
    },
    ltrim: {
      label: 'ltrim',
    },
    max: {
      label: 'max',
    },
    min: {
      label: 'min',
    },
    nodes: {
      label: 'nodes',
    },
    none: {
      label: 'none',
    },
    percentileCont: {
      label: 'percentileCont',
    },
    percentileDisc: {
      label: 'percentileDisc',
    },
    pi: {
      label: 'pi',
    },
    point: {
      label: 'point',
    },
    'point.distance': {
      label: 'point.distance',
    },
    'point.withinBBox': {
      label: 'point.withinBBox',
    },
    properties: {
      label: 'properties',
    },
    radians: {
      label: 'radians',
    },
    rand: {
      label: 'rand',
    },
    randomUUID: {
      label: 'randomUUID',
    },
    range: {
      label: 'range',
    },
    reduce: {
      label: 'reduce',
    },
    relationships: {
      label: 'relationships',
    },
    replace: {
      label: 'replace',
    },
    reverse: {
      label: 'reverse',
    },
    right: {
      label: 'right',
    },
    round: {
      label: 'round',
    },
    rtrim: {
      label: 'rtrim',
    },
    sign: {
      label: 'sign',
    },
    sin: {
      label: 'sin',
    },
    single: {
      label: 'single',
    },
    size: {
      label: 'size',
    },
    split: {
      label: 'split',
    },
    sqrt: {
      label: 'sqrt',
    },
    startNode: {
      label: 'startNode',
    },
    stdev: {
      label: 'stdev',
    },
    stdevp: {
      label: 'stdevp',
    },
    substring: {
      label: 'substring',
    },
    sum: {
      label: 'sum',
    },
    tail: {
      label: 'tail',
    },
    tan: {
      label: 'tan',
    },
    time: {
      label: 'time',
    },
    'time.realtime': {
      label: 'time.realtime',
    },
    'time.statement': {
      label: 'time.statement',
    },
    'time.transaction': {
      label: 'time.transaction',
    },
    'time.truncate': {
      label: 'time.truncate',
    },
    toBoolean: {
      label: 'toBoolean',
    },
    toBooleanList: {
      label: 'toBooleanList',
    },
    toBooleanOrNull: {
      label: 'toBooleanOrNull',
    },
    toFloat: {
      label: 'toFloat',
    },
    toFloatList: {
      label: 'toFloatList',
    },
    toFloatOrNull: {
      label: 'toFloatOrNull',
    },
    toInteger: {
      label: 'toInteger',
    },
    toIntegerList: {
      label: 'toIntegerList',
    },
    toIntegerOrNull: {
      label: 'toIntegerOrNull',
    },
    toLower: {
      label: 'toLower',
    },
    toStringList: {
      label: 'toStringList',
    },
    toStringOrNull: {
      label: 'toStringOrNull',
    },
    toUpper: {
      label: 'toUpper',
    },
    trim: {
      label: 'trim',
    },
    type: {
      label: 'type',
    },
  },
  procedureSignatures: {
    'apoc.algo.aStar': {
      label: 'apoc.algo.aStar',
    },
    'apoc.algo.aStarConfig': {
      label: 'apoc.algo.aStarConfig',
    },
    'apoc.algo.aStarWithPoint': {
      label: 'apoc.algo.aStarWithPoint',
    },
    'apoc.algo.allSimplePaths': {
      label: 'apoc.algo.allSimplePaths',
    },
    'apoc.algo.cover': {
      label: 'apoc.algo.cover',
    },
    'apoc.algo.dijkstra': {
      label: 'apoc.algo.dijkstra',
    },
    'apoc.algo.dijkstraWithDefaultWeight': {
      label: 'apoc.algo.dijkstraWithDefaultWeight',
    },
    'apoc.algo.travellingSalesman': {
      label: 'apoc.algo.travellingSalesman',
    },
    'apoc.atomic.add': {
      label: 'apoc.atomic.add',
    },
    'apoc.atomic.concat': {
      label: 'apoc.atomic.concat',
    },
    'apoc.atomic.insert': {
      label: 'apoc.atomic.insert',
    },
    'apoc.atomic.remove': {
      label: 'apoc.atomic.remove',
    },
    'apoc.atomic.subtract': {
      label: 'apoc.atomic.subtract',
    },
    'apoc.atomic.update': {
      label: 'apoc.atomic.update',
    },
    'apoc.bolt.execute': {
      label: 'apoc.bolt.execute',
    },
    'apoc.bolt.load': {
      label: 'apoc.bolt.load',
    },
    'apoc.bolt.load.fromLocal': {
      label: 'apoc.bolt.load.fromLocal',
    },
    'apoc.case': {
      label: 'apoc.case',
    },
    'apoc.cluster.graph': {
      label: 'apoc.cluster.graph',
    },
    'apoc.coll.elements': {
      label: 'apoc.coll.elements',
    },
    'apoc.coll.pairWithOffset': {
      label: 'apoc.coll.pairWithOffset',
    },
    'apoc.coll.partition': {
      label: 'apoc.coll.partition',
    },
    'apoc.coll.split': {
      label: 'apoc.coll.split',
    },
    'apoc.coll.zipToRows': {
      label: 'apoc.coll.zipToRows',
    },
    'apoc.config.list': {
      label: 'apoc.config.list',
    },
    'apoc.config.map': {
      label: 'apoc.config.map',
    },
    'apoc.convert.setJsonProperty': {
      label: 'apoc.convert.setJsonProperty',
    },
    'apoc.convert.toTree': {
      label: 'apoc.convert.toTree',
    },
    'apoc.couchbase.append': {
      label: 'apoc.couchbase.append',
    },
    'apoc.couchbase.exists': {
      label: 'apoc.couchbase.exists',
    },
    'apoc.couchbase.get': {
      label: 'apoc.couchbase.get',
    },
    'apoc.couchbase.insert': {
      label: 'apoc.couchbase.insert',
    },
    'apoc.couchbase.namedParamsQuery': {
      label: 'apoc.couchbase.namedParamsQuery',
    },
    'apoc.couchbase.posParamsQuery': {
      label: 'apoc.couchbase.posParamsQuery',
    },
    'apoc.couchbase.prepend': {
      label: 'apoc.couchbase.prepend',
    },
    'apoc.couchbase.query': {
      label: 'apoc.couchbase.query',
    },
    'apoc.couchbase.remove': {
      label: 'apoc.couchbase.remove',
    },
    'apoc.couchbase.replace': {
      label: 'apoc.couchbase.replace',
    },
    'apoc.couchbase.upsert': {
      label: 'apoc.couchbase.upsert',
    },
    'apoc.create.addLabels': {
      label: 'apoc.create.addLabels',
    },
    'apoc.create.clonePathToVirtual': {
      label: 'apoc.create.clonePathToVirtual',
    },
    'apoc.create.clonePathsToVirtual': {
      label: 'apoc.create.clonePathsToVirtual',
    },
    'apoc.create.node': {
      label: 'apoc.create.node',
    },
    'apoc.create.nodes': {
      label: 'apoc.create.nodes',
    },
    'apoc.create.relationship': {
      label: 'apoc.create.relationship',
    },
    'apoc.create.removeLabels': {
      label: 'apoc.create.removeLabels',
    },
    'apoc.create.removeProperties': {
      label: 'apoc.create.removeProperties',
    },
    'apoc.create.removeRelProperties': {
      label: 'apoc.create.removeRelProperties',
    },
    'apoc.create.setLabels': {
      label: 'apoc.create.setLabels',
    },
    'apoc.create.setProperties': {
      label: 'apoc.create.setProperties',
    },
    'apoc.create.setProperty': {
      label: 'apoc.create.setProperty',
    },
    'apoc.create.setRelProperties': {
      label: 'apoc.create.setRelProperties',
    },
    'apoc.create.setRelProperty': {
      label: 'apoc.create.setRelProperty',
    },
    'apoc.create.uuids': {
      label: 'apoc.create.uuids',
    },
    'apoc.create.vNode': {
      label: 'apoc.create.vNode',
    },
    'apoc.create.vNodes': {
      label: 'apoc.create.vNodes',
    },
    'apoc.create.vPattern': {
      label: 'apoc.create.vPattern',
    },
    'apoc.create.vPatternFull': {
      label: 'apoc.create.vPatternFull',
    },
    'apoc.create.vRelationship': {
      label: 'apoc.create.vRelationship',
    },
    'apoc.create.virtualPath': {
      label: 'apoc.create.virtualPath',
    },
    'apoc.custom.asFunction': {
      label: 'apoc.custom.asFunction',
    },
    'apoc.custom.asProcedure': {
      label: 'apoc.custom.asProcedure',
    },
    'apoc.custom.declareFunction': {
      label: 'apoc.custom.declareFunction',
    },
    'apoc.custom.declareProcedure': {
      label: 'apoc.custom.declareProcedure',
    },
    'apoc.custom.list': {
      label: 'apoc.custom.list',
    },
    'apoc.custom.removeFunction': {
      label: 'apoc.custom.removeFunction',
    },
    'apoc.custom.removeProcedure': {
      label: 'apoc.custom.removeProcedure',
    },
    'apoc.cypher.doIt': {
      label: 'apoc.cypher.doIt',
    },
    'apoc.cypher.mapParallel': {
      label: 'apoc.cypher.mapParallel',
    },
    'apoc.cypher.mapParallel2': {
      label: 'apoc.cypher.mapParallel2',
    },
    'apoc.cypher.parallel': {
      label: 'apoc.cypher.parallel',
    },
    'apoc.cypher.parallel2': {
      label: 'apoc.cypher.parallel2',
    },
    'apoc.cypher.run': {
      label: 'apoc.cypher.run',
    },
    'apoc.cypher.runFile': {
      label: 'apoc.cypher.runFile',
    },
    'apoc.cypher.runFiles': {
      label: 'apoc.cypher.runFiles',
    },
    'apoc.cypher.runMany': {
      label: 'apoc.cypher.runMany',
    },
    'apoc.cypher.runManyReadOnly': {
      label: 'apoc.cypher.runManyReadOnly',
    },
    'apoc.cypher.runSchema': {
      label: 'apoc.cypher.runSchema',
    },
    'apoc.cypher.runSchemaFile': {
      label: 'apoc.cypher.runSchemaFile',
    },
    'apoc.cypher.runSchemaFiles': {
      label: 'apoc.cypher.runSchemaFiles',
    },
    'apoc.cypher.runTimeboxed': {
      label: 'apoc.cypher.runTimeboxed',
    },
    'apoc.cypher.runWrite': {
      label: 'apoc.cypher.runWrite',
    },
    'apoc.date.expire': {
      label: 'apoc.date.expire',
    },
    'apoc.date.expireIn': {
      label: 'apoc.date.expireIn',
    },
    'apoc.diff.graphs': {
      label: 'apoc.diff.graphs',
    },
    'apoc.do.case': {
      label: 'apoc.do.case',
    },
    'apoc.do.when': {
      label: 'apoc.do.when',
    },
    'apoc.dv.catalog.add': {
      label: 'apoc.dv.catalog.add',
    },
    'apoc.dv.catalog.list': {
      label: 'apoc.dv.catalog.list',
    },
    'apoc.dv.catalog.remove': {
      label: 'apoc.dv.catalog.remove',
    },
    'apoc.dv.query': {
      label: 'apoc.dv.query',
    },
    'apoc.dv.queryAndLink': {
      label: 'apoc.dv.queryAndLink',
    },
    'apoc.es.get': {
      label: 'apoc.es.get',
    },
    'apoc.es.getRaw': {
      label: 'apoc.es.getRaw',
    },
    'apoc.es.post': {
      label: 'apoc.es.post',
    },
    'apoc.es.postRaw': {
      label: 'apoc.es.postRaw',
    },
    'apoc.es.put': {
      label: 'apoc.es.put',
    },
    'apoc.es.query': {
      label: 'apoc.es.query',
    },
    'apoc.es.stats': {
      label: 'apoc.es.stats',
    },
    'apoc.example.movies': {
      label: 'apoc.example.movies',
    },
    'apoc.export.arrow.all': {
      label: 'apoc.export.arrow.all',
    },
    'apoc.export.arrow.graph': {
      label: 'apoc.export.arrow.graph',
    },
    'apoc.export.arrow.query': {
      label: 'apoc.export.arrow.query',
    },
    'apoc.export.arrow.stream.all': {
      label: 'apoc.export.arrow.stream.all',
    },
    'apoc.export.arrow.stream.graph': {
      label: 'apoc.export.arrow.stream.graph',
    },
    'apoc.export.arrow.stream.query': {
      label: 'apoc.export.arrow.stream.query',
    },
    'apoc.export.csv.all': {
      label: 'apoc.export.csv.all',
    },
    'apoc.export.csv.data': {
      label: 'apoc.export.csv.data',
    },
    'apoc.export.csv.graph': {
      label: 'apoc.export.csv.graph',
    },
    'apoc.export.csv.query': {
      label: 'apoc.export.csv.query',
    },
    'apoc.export.cypher.all': {
      label: 'apoc.export.cypher.all',
    },
    'apoc.export.cypher.data': {
      label: 'apoc.export.cypher.data',
    },
    'apoc.export.cypher.graph': {
      label: 'apoc.export.cypher.graph',
    },
    'apoc.export.cypher.query': {
      label: 'apoc.export.cypher.query',
    },
    'apoc.export.cypher.schema': {
      label: 'apoc.export.cypher.schema',
    },
    'apoc.export.cypherAll': {
      label: 'apoc.export.cypherAll',
    },
    'apoc.export.cypherData': {
      label: 'apoc.export.cypherData',
    },
    'apoc.export.cypherGraph': {
      label: 'apoc.export.cypherGraph',
    },
    'apoc.export.cypherQuery': {
      label: 'apoc.export.cypherQuery',
    },
    'apoc.export.graphml.all': {
      label: 'apoc.export.graphml.all',
    },
    'apoc.export.graphml.data': {
      label: 'apoc.export.graphml.data',
    },
    'apoc.export.graphml.graph': {
      label: 'apoc.export.graphml.graph',
    },
    'apoc.export.graphml.query': {
      label: 'apoc.export.graphml.query',
    },
    'apoc.export.json.all': {
      label: 'apoc.export.json.all',
    },
    'apoc.export.json.data': {
      label: 'apoc.export.json.data',
    },
    'apoc.export.json.graph': {
      label: 'apoc.export.json.graph',
    },
    'apoc.export.json.query': {
      label: 'apoc.export.json.query',
    },
    'apoc.generate.ba': {
      label: 'apoc.generate.ba',
    },
    'apoc.generate.complete': {
      label: 'apoc.generate.complete',
    },
    'apoc.generate.er': {
      label: 'apoc.generate.er',
    },
    'apoc.generate.simple': {
      label: 'apoc.generate.simple',
    },
    'apoc.generate.ws': {
      label: 'apoc.generate.ws',
    },
    'apoc.gephi.add': {
      label: 'apoc.gephi.add',
    },
    'apoc.get.nodes': {
      label: 'apoc.get.nodes',
    },
    'apoc.get.rels': {
      label: 'apoc.get.rels',
    },
    'apoc.graph.from': {
      label: 'apoc.graph.from',
    },
    'apoc.graph.fromCypher': {
      label: 'apoc.graph.fromCypher',
    },
    'apoc.graph.fromDB': {
      label: 'apoc.graph.fromDB',
    },
    'apoc.graph.fromData': {
      label: 'apoc.graph.fromData',
    },
    'apoc.graph.fromDocument': {
      label: 'apoc.graph.fromDocument',
    },
    'apoc.graph.fromPath': {
      label: 'apoc.graph.fromPath',
    },
    'apoc.graph.fromPaths': {
      label: 'apoc.graph.fromPaths',
    },
    'apoc.graph.validateDocument': {
      label: 'apoc.graph.validateDocument',
    },
    'apoc.help': {
      label: 'apoc.help',
    },
    'apoc.import.csv': {
      label: 'apoc.import.csv',
    },
    'apoc.import.graphml': {
      label: 'apoc.import.graphml',
    },
    'apoc.import.json': {
      label: 'apoc.import.json',
    },
    'apoc.import.xml': {
      label: 'apoc.import.xml',
    },
    'apoc.json.validate': {
      label: 'apoc.json.validate',
    },
    'apoc.load.arrow': {
      label: 'apoc.load.arrow',
    },
    'apoc.load.arrow.stream': {
      label: 'apoc.load.arrow.stream',
    },
    'apoc.load.csv': {
      label: 'apoc.load.csv',
    },
    'apoc.load.csvParams': {
      label: 'apoc.load.csvParams',
    },
    'apoc.load.directory': {
      label: 'apoc.load.directory',
    },
    'apoc.load.directory.async.add': {
      label: 'apoc.load.directory.async.add',
    },
    'apoc.load.directory.async.list': {
      label: 'apoc.load.directory.async.list',
    },
    'apoc.load.directory.async.remove': {
      label: 'apoc.load.directory.async.remove',
    },
    'apoc.load.directory.async.removeAll': {
      label: 'apoc.load.directory.async.removeAll',
    },
    'apoc.load.driver': {
      label: 'apoc.load.driver',
    },
    'apoc.load.html': {
      label: 'apoc.load.html',
    },
    'apoc.load.htmlPlainText': {
      label: 'apoc.load.htmlPlainText',
    },
    'apoc.load.jdbc': {
      label: 'apoc.load.jdbc',
    },
    'apoc.load.jdbcParams': {
      label: 'apoc.load.jdbcParams',
    },
    'apoc.load.jdbcUpdate': {
      label: 'apoc.load.jdbcUpdate',
    },
    'apoc.load.json': {
      label: 'apoc.load.json',
    },
    'apoc.load.jsonArray': {
      label: 'apoc.load.jsonArray',
    },
    'apoc.load.jsonParams': {
      label: 'apoc.load.jsonParams',
    },
    'apoc.load.ldap': {
      label: 'apoc.load.ldap',
    },
    'apoc.load.xml': {
      label: 'apoc.load.xml',
    },
    'apoc.lock.all': {
      label: 'apoc.lock.all',
    },
    'apoc.lock.nodes': {
      label: 'apoc.lock.nodes',
    },
    'apoc.lock.read.nodes': {
      label: 'apoc.lock.read.nodes',
    },
    'apoc.lock.read.rels': {
      label: 'apoc.lock.read.rels',
    },
    'apoc.lock.rels': {
      label: 'apoc.lock.rels',
    },
    'apoc.log.debug': {
      label: 'apoc.log.debug',
    },
    'apoc.log.error': {
      label: 'apoc.log.error',
    },
    'apoc.log.info': {
      label: 'apoc.log.info',
    },
    'apoc.log.stream': {
      label: 'apoc.log.stream',
    },
    'apoc.log.warn': {
      label: 'apoc.log.warn',
    },
    'apoc.math.regr': {
      label: 'apoc.math.regr',
    },
    'apoc.merge.node': {
      label: 'apoc.merge.node',
    },
    'apoc.merge.node.eager': {
      label: 'apoc.merge.node.eager',
    },
    'apoc.merge.nodeWithStats': {
      label: 'apoc.merge.nodeWithStats',
    },
    'apoc.merge.nodeWithStats.eager': {
      label: 'apoc.merge.nodeWithStats.eager',
    },
    'apoc.merge.relationship': {
      label: 'apoc.merge.relationship',
    },
    'apoc.merge.relationship.eager': {
      label: 'apoc.merge.relationship.eager',
    },
    'apoc.merge.relationshipWithStats': {
      label: 'apoc.merge.relationshipWithStats',
    },
    'apoc.merge.relationshipWithStats.eager': {
      label: 'apoc.merge.relationshipWithStats.eager',
    },
    'apoc.meta.data': {
      label: 'apoc.meta.data',
    },
    'apoc.meta.data.of': {
      label: 'apoc.meta.data.of',
    },
    'apoc.meta.graph': {
      label: 'apoc.meta.graph',
    },
    'apoc.meta.graph.of': {
      label: 'apoc.meta.graph.of',
    },
    'apoc.meta.graphSample': {
      label: 'apoc.meta.graphSample',
    },
    'apoc.meta.nodeTypeProperties': {
      label: 'apoc.meta.nodeTypeProperties',
    },
    'apoc.meta.relTypeProperties': {
      label: 'apoc.meta.relTypeProperties',
    },
    'apoc.meta.schema': {
      label: 'apoc.meta.schema',
    },
    'apoc.meta.stats': {
      label: 'apoc.meta.stats',
    },
    'apoc.meta.subGraph': {
      label: 'apoc.meta.subGraph',
    },
    'apoc.metrics.get': {
      label: 'apoc.metrics.get',
    },
    'apoc.metrics.list': {
      label: 'apoc.metrics.list',
    },
    'apoc.metrics.storage': {
      label: 'apoc.metrics.storage',
    },
    'apoc.model.jdbc': {
      label: 'apoc.model.jdbc',
    },
    'apoc.mongo.aggregate': {
      label: 'apoc.mongo.aggregate',
    },
    'apoc.mongo.count': {
      label: 'apoc.mongo.count',
    },
    'apoc.mongo.delete': {
      label: 'apoc.mongo.delete',
    },
    'apoc.mongo.find': {
      label: 'apoc.mongo.find',
    },
    'apoc.mongo.insert': {
      label: 'apoc.mongo.insert',
    },
    'apoc.mongo.update': {
      label: 'apoc.mongo.update',
    },
    'apoc.mongodb.count': {
      label: 'apoc.mongodb.count',
    },
    'apoc.mongodb.delete': {
      label: 'apoc.mongodb.delete',
    },
    'apoc.mongodb.find': {
      label: 'apoc.mongodb.find',
    },
    'apoc.mongodb.first': {
      label: 'apoc.mongodb.first',
    },
    'apoc.mongodb.get': {
      label: 'apoc.mongodb.get',
    },
    'apoc.mongodb.get.byObjectId': {
      label: 'apoc.mongodb.get.byObjectId',
    },
    'apoc.mongodb.insert': {
      label: 'apoc.mongodb.insert',
    },
    'apoc.mongodb.update': {
      label: 'apoc.mongodb.update',
    },
    'apoc.monitor.ids': {
      label: 'apoc.monitor.ids',
    },
    'apoc.monitor.kernel': {
      label: 'apoc.monitor.kernel',
    },
    'apoc.monitor.store': {
      label: 'apoc.monitor.store',
    },
    'apoc.monitor.tx': {
      label: 'apoc.monitor.tx',
    },
    'apoc.neighbors.athop': {
      label: 'apoc.neighbors.athop',
    },
    'apoc.neighbors.athop.count': {
      label: 'apoc.neighbors.athop.count',
    },
    'apoc.neighbors.byhop': {
      label: 'apoc.neighbors.byhop',
    },
    'apoc.neighbors.byhop.count': {
      label: 'apoc.neighbors.byhop.count',
    },
    'apoc.neighbors.tohop': {
      label: 'apoc.neighbors.tohop',
    },
    'apoc.neighbors.tohop.count': {
      label: 'apoc.neighbors.tohop.count',
    },
    'apoc.nlp.azure.entities.graph': {
      label: 'apoc.nlp.azure.entities.graph',
    },
    'apoc.nlp.azure.entities.stream': {
      label: 'apoc.nlp.azure.entities.stream',
    },
    'apoc.nlp.azure.keyPhrases.graph': {
      label: 'apoc.nlp.azure.keyPhrases.graph',
    },
    'apoc.nlp.azure.keyPhrases.stream': {
      label: 'apoc.nlp.azure.keyPhrases.stream',
    },
    'apoc.nlp.azure.sentiment.graph': {
      label: 'apoc.nlp.azure.sentiment.graph',
    },
    'apoc.nlp.azure.sentiment.stream': {
      label: 'apoc.nlp.azure.sentiment.stream',
    },
    'apoc.nodes.collapse': {
      label: 'apoc.nodes.collapse',
    },
    'apoc.nodes.cycles': {
      label: 'apoc.nodes.cycles',
    },
    'apoc.nodes.delete': {
      label: 'apoc.nodes.delete',
    },
    'apoc.nodes.get': {
      label: 'apoc.nodes.get',
    },
    'apoc.nodes.group': {
      label: 'apoc.nodes.group',
    },
    'apoc.nodes.link': {
      label: 'apoc.nodes.link',
    },
    'apoc.nodes.rels': {
      label: 'apoc.nodes.rels',
    },
    'apoc.path.expand': {
      label: 'apoc.path.expand',
    },
    'apoc.path.expandConfig': {
      label: 'apoc.path.expandConfig',
    },
    'apoc.path.spanningTree': {
      label: 'apoc.path.spanningTree',
    },
    'apoc.path.subgraphAll': {
      label: 'apoc.path.subgraphAll',
    },
    'apoc.path.subgraphNodes': {
      label: 'apoc.path.subgraphNodes',
    },
    'apoc.periodic.cancel': {
      label: 'apoc.periodic.cancel',
    },
    'apoc.periodic.commit': {
      label: 'apoc.periodic.commit',
    },
    'apoc.periodic.countdown': {
      label: 'apoc.periodic.countdown',
    },
    'apoc.periodic.iterate': {
      label: 'apoc.periodic.iterate',
    },
    'apoc.periodic.list': {
      label: 'apoc.periodic.list',
    },
    'apoc.periodic.repeat': {
      label: 'apoc.periodic.repeat',
    },
    'apoc.periodic.rock_n_roll': {
      label: 'apoc.periodic.rock_n_roll',
    },
    'apoc.periodic.rock_n_roll_while': {
      label: 'apoc.periodic.rock_n_roll_while',
    },
    'apoc.periodic.submit': {
      label: 'apoc.periodic.submit',
    },
    'apoc.periodic.truncate': {
      label: 'apoc.periodic.truncate',
    },
    'apoc.redis.append': {
      label: 'apoc.redis.append',
    },
    'apoc.redis.configGet': {
      label: 'apoc.redis.configGet',
    },
    'apoc.redis.configSet': {
      label: 'apoc.redis.configSet',
    },
    'apoc.redis.copy': {
      label: 'apoc.redis.copy',
    },
    'apoc.redis.eval': {
      label: 'apoc.redis.eval',
    },
    'apoc.redis.exists': {
      label: 'apoc.redis.exists',
    },
    'apoc.redis.get': {
      label: 'apoc.redis.get',
    },
    'apoc.redis.getSet': {
      label: 'apoc.redis.getSet',
    },
    'apoc.redis.hdel': {
      label: 'apoc.redis.hdel',
    },
    'apoc.redis.hexists': {
      label: 'apoc.redis.hexists',
    },
    'apoc.redis.hget': {
      label: 'apoc.redis.hget',
    },
    'apoc.redis.hgetall': {
      label: 'apoc.redis.hgetall',
    },
    'apoc.redis.hincrby': {
      label: 'apoc.redis.hincrby',
    },
    'apoc.redis.hset': {
      label: 'apoc.redis.hset',
    },
    'apoc.redis.incrby': {
      label: 'apoc.redis.incrby',
    },
    'apoc.redis.info': {
      label: 'apoc.redis.info',
    },
    'apoc.redis.lrange': {
      label: 'apoc.redis.lrange',
    },
    'apoc.redis.persist': {
      label: 'apoc.redis.persist',
    },
    'apoc.redis.pexpire': {
      label: 'apoc.redis.pexpire',
    },
    'apoc.redis.pop': {
      label: 'apoc.redis.pop',
    },
    'apoc.redis.pttl': {
      label: 'apoc.redis.pttl',
    },
    'apoc.redis.push': {
      label: 'apoc.redis.push',
    },
    'apoc.redis.sadd': {
      label: 'apoc.redis.sadd',
    },
    'apoc.redis.scard': {
      label: 'apoc.redis.scard',
    },
    'apoc.redis.smembers': {
      label: 'apoc.redis.smembers',
    },
    'apoc.redis.spop': {
      label: 'apoc.redis.spop',
    },
    'apoc.redis.sunion': {
      label: 'apoc.redis.sunion',
    },
    'apoc.redis.zadd': {
      label: 'apoc.redis.zadd',
    },
    'apoc.redis.zcard': {
      label: 'apoc.redis.zcard',
    },
    'apoc.redis.zrangebyscore': {
      label: 'apoc.redis.zrangebyscore',
    },
    'apoc.redis.zrem': {
      label: 'apoc.redis.zrem',
    },
    'apoc.refactor.categorize': {
      label: 'apoc.refactor.categorize',
    },
    'apoc.refactor.cloneNodes': {
      label: 'apoc.refactor.cloneNodes',
    },
    'apoc.refactor.cloneNodesWithRelationships': {
      label: 'apoc.refactor.cloneNodesWithRelationships',
    },
    'apoc.refactor.cloneSubgraph': {
      label: 'apoc.refactor.cloneSubgraph',
    },
    'apoc.refactor.cloneSubgraphFromPaths': {
      label: 'apoc.refactor.cloneSubgraphFromPaths',
    },
    'apoc.refactor.collapseNode': {
      label: 'apoc.refactor.collapseNode',
    },
    'apoc.refactor.deleteAndReconnect': {
      label: 'apoc.refactor.deleteAndReconnect',
    },
    'apoc.refactor.extractNode': {
      label: 'apoc.refactor.extractNode',
    },
    'apoc.refactor.from': {
      label: 'apoc.refactor.from',
    },
    'apoc.refactor.invert': {
      label: 'apoc.refactor.invert',
    },
    'apoc.refactor.mergeNodes': {
      label: 'apoc.refactor.mergeNodes',
    },
    'apoc.refactor.mergeRelationships': {
      label: 'apoc.refactor.mergeRelationships',
    },
    'apoc.refactor.normalizeAsBoolean': {
      label: 'apoc.refactor.normalizeAsBoolean',
    },
    'apoc.refactor.rename.label': {
      label: 'apoc.refactor.rename.label',
    },
    'apoc.refactor.rename.nodeProperty': {
      label: 'apoc.refactor.rename.nodeProperty',
    },
    'apoc.refactor.rename.type': {
      label: 'apoc.refactor.rename.type',
    },
    'apoc.refactor.rename.typeProperty': {
      label: 'apoc.refactor.rename.typeProperty',
    },
    'apoc.refactor.setType': {
      label: 'apoc.refactor.setType',
    },
    'apoc.refactor.to': {
      label: 'apoc.refactor.to',
    },
    'apoc.schema.assert': {
      label: 'apoc.schema.assert',
    },
    'apoc.schema.nodes': {
      label: 'apoc.schema.nodes',
    },
    'apoc.schema.properties.distinct': {
      label: 'apoc.schema.properties.distinct',
    },
    'apoc.schema.properties.distinctCount': {
      label: 'apoc.schema.properties.distinctCount',
    },
    'apoc.schema.relationships': {
      label: 'apoc.schema.relationships',
    },
    'apoc.search.multiSearchReduced': {
      label: 'apoc.search.multiSearchReduced',
    },
    'apoc.search.node': {
      label: 'apoc.search.node',
    },
    'apoc.search.nodeAll': {
      label: 'apoc.search.nodeAll',
    },
    'apoc.search.nodeAllReduced': {
      label: 'apoc.search.nodeAllReduced',
    },
    'apoc.search.nodeReduced': {
      label: 'apoc.search.nodeReduced',
    },
    'apoc.spatial.geocode': {
      label: 'apoc.spatial.geocode',
    },
    'apoc.spatial.geocodeOnce': {
      label: 'apoc.spatial.geocodeOnce',
    },
    'apoc.spatial.reverseGeocode': {
      label: 'apoc.spatial.reverseGeocode',
    },
    'apoc.spatial.sortByDistance': {
      label: 'apoc.spatial.sortByDistance',
    },
    'apoc.static.get': {
      label: 'apoc.static.get',
    },
    'apoc.static.list': {
      label: 'apoc.static.list',
    },
    'apoc.static.set': {
      label: 'apoc.static.set',
    },
    'apoc.stats.degrees': {
      label: 'apoc.stats.degrees',
    },
    'apoc.systemdb.execute': {
      label: 'apoc.systemdb.execute',
    },
    'apoc.systemdb.export.metadata': {
      label: 'apoc.systemdb.export.metadata',
    },
    'apoc.systemdb.graph': {
      label: 'apoc.systemdb.graph',
    },
    'apoc.text.doubleMetaphone': {
      label: 'apoc.text.doubleMetaphone',
    },
    'apoc.text.phonetic': {
      label: 'apoc.text.phonetic',
    },
    'apoc.text.phoneticDelta': {
      label: 'apoc.text.phoneticDelta',
    },
    'apoc.trigger.add': {
      label: 'apoc.trigger.add',
    },
    'apoc.trigger.drop': {
      label: 'apoc.trigger.drop',
    },
    'apoc.trigger.dropAll': {
      label: 'apoc.trigger.dropAll',
    },
    'apoc.trigger.install': {
      label: 'apoc.trigger.install',
    },
    'apoc.trigger.list': {
      label: 'apoc.trigger.list',
    },
    'apoc.trigger.pause': {
      label: 'apoc.trigger.pause',
    },
    'apoc.trigger.remove': {
      label: 'apoc.trigger.remove',
    },
    'apoc.trigger.removeAll': {
      label: 'apoc.trigger.removeAll',
    },
    'apoc.trigger.resume': {
      label: 'apoc.trigger.resume',
    },
    'apoc.trigger.show': {
      label: 'apoc.trigger.show',
    },
    'apoc.trigger.start': {
      label: 'apoc.trigger.start',
    },
    'apoc.trigger.stop': {
      label: 'apoc.trigger.stop',
    },
    'apoc.ttl.expire': {
      label: 'apoc.ttl.expire',
    },
    'apoc.ttl.expireIn': {
      label: 'apoc.ttl.expireIn',
    },
    'apoc.util.sleep': {
      label: 'apoc.util.sleep',
    },
    'apoc.util.validate': {
      label: 'apoc.util.validate',
    },
    'apoc.uuid.drop': {
      label: 'apoc.uuid.drop',
    },
    'apoc.uuid.dropAll': {
      label: 'apoc.uuid.dropAll',
    },
    'apoc.uuid.install': {
      label: 'apoc.uuid.install',
    },
    'apoc.uuid.list': {
      label: 'apoc.uuid.list',
    },
    'apoc.uuid.remove': {
      label: 'apoc.uuid.remove',
    },
    'apoc.uuid.removeAll': {
      label: 'apoc.uuid.removeAll',
    },
    'apoc.uuid.setup': {
      label: 'apoc.uuid.setup',
    },
    'apoc.uuid.show': {
      label: 'apoc.uuid.show',
    },
    'apoc.warmup.run': {
      label: 'apoc.warmup.run',
    },
    'apoc.when': {
      label: 'apoc.when',
    },
    'apoc.xml.import': {
      label: 'apoc.xml.import',
    },
    'db.awaitIndex': {
      label: 'db.awaitIndex',
    },
    'db.awaitIndexes': {
      label: 'db.awaitIndexes',
    },
    'db.checkpoint': {
      label: 'db.checkpoint',
    },
    'db.clearQueryCaches': {
      label: 'db.clearQueryCaches',
    },
    'db.constraints': {
      label: 'db.constraints',
    },
    'db.createIndex': {
      label: 'db.createIndex',
    },
    'db.createLabel': {
      label: 'db.createLabel',
    },
    'db.createNodeKey': {
      label: 'db.createNodeKey',
    },
    'db.createProperty': {
      label: 'db.createProperty',
    },
    'db.createRelationshipType': {
      label: 'db.createRelationshipType',
    },
    'db.createUniquePropertyConstraint': {
      label: 'db.createUniquePropertyConstraint',
    },
    'db.index.fulltext.awaitEventuallyConsistentIndexRefresh': {
      label: 'db.index.fulltext.awaitEventuallyConsistentIndexRefresh',
    },
    'db.index.fulltext.createNodeIndex': {
      label: 'db.index.fulltext.createNodeIndex',
    },
    'db.index.fulltext.createRelationshipIndex': {
      label: 'db.index.fulltext.createRelationshipIndex',
    },
    'db.index.fulltext.drop': {
      label: 'db.index.fulltext.drop',
    },
    'db.index.fulltext.listAvailableAnalyzers': {
      label: 'db.index.fulltext.listAvailableAnalyzers',
    },
    'db.index.fulltext.queryNodes': {
      label: 'db.index.fulltext.queryNodes',
    },
    'db.index.fulltext.queryRelationships': {
      label: 'db.index.fulltext.queryRelationships',
    },
    'db.indexDetails': {
      label: 'db.indexDetails',
    },
    'db.indexes': {
      label: 'db.indexes',
    },
    'db.info': {
      label: 'db.info',
    },
    'db.labels': {
      label: 'db.labels',
    },
    'db.listLocks': {
      label: 'db.listLocks',
    },
    'db.ping': {
      label: 'db.ping',
    },
    'db.prepareForReplanning': {
      label: 'db.prepareForReplanning',
    },
    'db.propertyKeys': {
      label: 'db.propertyKeys',
    },
    'db.relationshipTypes': {
      label: 'db.relationshipTypes',
    },
    'db.resampleIndex': {
      label: 'db.resampleIndex',
    },
    'db.resampleOutdatedIndexes': {
      label: 'db.resampleOutdatedIndexes',
    },
    'db.schema.nodeTypeProperties': {
      label: 'db.schema.nodeTypeProperties',
    },
    'db.schema.relTypeProperties': {
      label: 'db.schema.relTypeProperties',
    },
    'db.schema.visualization': {
      label: 'db.schema.visualization',
    },
    'db.schemaStatements': {
      label: 'db.schemaStatements',
    },
    'db.stats.clear': {
      label: 'db.stats.clear',
    },
    'db.stats.collect': {
      label: 'db.stats.collect',
    },
    'db.stats.retrieve': {
      label: 'db.stats.retrieve',
    },
    'db.stats.retrieveAllAnonymized': {
      label: 'db.stats.retrieveAllAnonymized',
    },
    'db.stats.status': {
      label: 'db.stats.status',
    },
    'db.stats.stop': {
      label: 'db.stats.stop',
    },
    'dbms.cluster.overview': {
      label: 'dbms.cluster.overview',
    },
    'dbms.cluster.protocols': {
      label: 'dbms.cluster.protocols',
    },
    'dbms.cluster.role': {
      label: 'dbms.cluster.role',
    },
    'dbms.cluster.routing.getRoutingTable': {
      label: 'dbms.cluster.routing.getRoutingTable',
    },
    'dbms.components': {
      label: 'dbms.components',
    },
    'dbms.database.state': {
      label: 'dbms.database.state',
    },
    'dbms.functions': {
      label: 'dbms.functions',
    },
    'dbms.info': {
      label: 'dbms.info',
    },
    'dbms.killConnection': {
      label: 'dbms.killConnection',
    },
    'dbms.killConnections': {
      label: 'dbms.killConnections',
    },
    'dbms.killQueries': {
      label: 'dbms.killQueries',
    },
    'dbms.killQuery': {
      label: 'dbms.killQuery',
    },
    'dbms.killTransaction': {
      label: 'dbms.killTransaction',
    },
    'dbms.killTransactions': {
      label: 'dbms.killTransactions',
    },
    'dbms.listActiveLocks': {
      label: 'dbms.listActiveLocks',
    },
    'dbms.listCapabilities': {
      label: 'dbms.listCapabilities',
    },
    'dbms.listConfig': {
      label: 'dbms.listConfig',
    },
    'dbms.listConnections': {
      label: 'dbms.listConnections',
    },
    'dbms.listPools': {
      label: 'dbms.listPools',
    },
    'dbms.listQueries': {
      label: 'dbms.listQueries',
    },
    'dbms.listTransactions': {
      label: 'dbms.listTransactions',
    },
    'dbms.procedures': {
      label: 'dbms.procedures',
    },
    'dbms.quarantineDatabase': {
      label: 'dbms.quarantineDatabase',
    },
    'dbms.queryJmx': {
      label: 'dbms.queryJmx',
    },
    'dbms.routing.getRoutingTable': {
      label: 'dbms.routing.getRoutingTable',
    },
    'dbms.scheduler.failedJobs': {
      label: 'dbms.scheduler.failedJobs',
    },
    'dbms.scheduler.groups': {
      label: 'dbms.scheduler.groups',
    },
    'dbms.scheduler.jobs': {
      label: 'dbms.scheduler.jobs',
    },
    'dbms.scheduler.profile': {
      label: 'dbms.scheduler.profile',
    },
    'dbms.security.activateUser': {
      label: 'dbms.security.activateUser',
    },
    'dbms.security.addRoleToUser': {
      label: 'dbms.security.addRoleToUser',
    },
    'dbms.security.changePassword': {
      label: 'dbms.security.changePassword',
    },
    'dbms.security.changeUserPassword': {
      label: 'dbms.security.changeUserPassword',
    },
    'dbms.security.clearAuthCache': {
      label: 'dbms.security.clearAuthCache',
    },
    'dbms.security.createRole': {
      label: 'dbms.security.createRole',
    },
    'dbms.security.createUser': {
      label: 'dbms.security.createUser',
    },
    'dbms.security.deleteRole': {
      label: 'dbms.security.deleteRole',
    },
    'dbms.security.deleteUser': {
      label: 'dbms.security.deleteUser',
    },
    'dbms.security.listRoles': {
      label: 'dbms.security.listRoles',
    },
    'dbms.security.listRolesForUser': {
      label: 'dbms.security.listRolesForUser',
    },
    'dbms.security.listUsers': {
      label: 'dbms.security.listUsers',
    },
    'dbms.security.listUsersForRole': {
      label: 'dbms.security.listUsersForRole',
    },
    'dbms.security.removeRoleFromUser': {
      label: 'dbms.security.removeRoleFromUser',
    },
    'dbms.security.suspendUser': {
      label: 'dbms.security.suspendUser',
    },
    'dbms.setConfigValue': {
      label: 'dbms.setConfigValue',
    },
    'dbms.showCurrentUser': {
      label: 'dbms.showCurrentUser',
    },
    'dbms.upgrade': {
      label: 'dbms.upgrade',
    },
    'dbms.upgradeStatus': {
      label: 'dbms.upgradeStatus',
    },
    'gds.allShortestPaths.delta.mutate': {
      label: 'gds.allShortestPaths.delta.mutate',
    },
    'gds.allShortestPaths.delta.mutate.estimate': {
      label: 'gds.allShortestPaths.delta.mutate.estimate',
    },
    'gds.allShortestPaths.delta.stats': {
      label: 'gds.allShortestPaths.delta.stats',
    },
    'gds.allShortestPaths.delta.stats.estimate': {
      label: 'gds.allShortestPaths.delta.stats.estimate',
    },
    'gds.allShortestPaths.delta.stream': {
      label: 'gds.allShortestPaths.delta.stream',
    },
    'gds.allShortestPaths.delta.stream.estimate': {
      label: 'gds.allShortestPaths.delta.stream.estimate',
    },
    'gds.allShortestPaths.delta.write': {
      label: 'gds.allShortestPaths.delta.write',
    },
    'gds.allShortestPaths.delta.write.estimate': {
      label: 'gds.allShortestPaths.delta.write.estimate',
    },
    'gds.allShortestPaths.dijkstra.mutate': {
      label: 'gds.allShortestPaths.dijkstra.mutate',
    },
    'gds.allShortestPaths.dijkstra.mutate.estimate': {
      label: 'gds.allShortestPaths.dijkstra.mutate.estimate',
    },
    'gds.allShortestPaths.dijkstra.stream': {
      label: 'gds.allShortestPaths.dijkstra.stream',
    },
    'gds.allShortestPaths.dijkstra.stream.estimate': {
      label: 'gds.allShortestPaths.dijkstra.stream.estimate',
    },
    'gds.allShortestPaths.dijkstra.write': {
      label: 'gds.allShortestPaths.dijkstra.write',
    },
    'gds.allShortestPaths.dijkstra.write.estimate': {
      label: 'gds.allShortestPaths.dijkstra.write.estimate',
    },
    'gds.alpha.allShortestPaths.stream': {
      label: 'gds.alpha.allShortestPaths.stream',
    },
    'gds.alpha.backup': {
      label: 'gds.alpha.backup',
    },
    'gds.alpha.closeness.harmonic.stream': {
      label: 'gds.alpha.closeness.harmonic.stream',
    },
    'gds.alpha.closeness.harmonic.write': {
      label: 'gds.alpha.closeness.harmonic.write',
    },
    'gds.alpha.conductance.stream': {
      label: 'gds.alpha.conductance.stream',
    },
    'gds.alpha.config.defaults.list': {
      label: 'gds.alpha.config.defaults.list',
    },
    'gds.alpha.config.defaults.set': {
      label: 'gds.alpha.config.defaults.set',
    },
    'gds.alpha.config.limits.list': {
      label: 'gds.alpha.config.limits.list',
    },
    'gds.alpha.config.limits.set': {
      label: 'gds.alpha.config.limits.set',
    },
    'gds.alpha.create.cypherdb': {
      label: 'gds.alpha.create.cypherdb',
    },
    'gds.alpha.drop.cypherdb': {
      label: 'gds.alpha.drop.cypherdb',
    },
    'gds.alpha.graph.graphProperty.drop': {
      label: 'gds.alpha.graph.graphProperty.drop',
    },
    'gds.alpha.graph.graphProperty.stream': {
      label: 'gds.alpha.graph.graphProperty.stream',
    },
    'gds.alpha.graph.nodeLabel.mutate': {
      label: 'gds.alpha.graph.nodeLabel.mutate',
    },
    'gds.alpha.graph.nodeLabel.write': {
      label: 'gds.alpha.graph.nodeLabel.write',
    },
    'gds.alpha.hits.mutate': {
      label: 'gds.alpha.hits.mutate',
    },
    'gds.alpha.hits.mutate.estimate': {
      label: 'gds.alpha.hits.mutate.estimate',
    },
    'gds.alpha.hits.stats': {
      label: 'gds.alpha.hits.stats',
    },
    'gds.alpha.hits.stats.estimate': {
      label: 'gds.alpha.hits.stats.estimate',
    },
    'gds.alpha.hits.stream': {
      label: 'gds.alpha.hits.stream',
    },
    'gds.alpha.hits.stream.estimate': {
      label: 'gds.alpha.hits.stream.estimate',
    },
    'gds.alpha.hits.write': {
      label: 'gds.alpha.hits.write',
    },
    'gds.alpha.hits.write.estimate': {
      label: 'gds.alpha.hits.write.estimate',
    },
    'gds.alpha.kSpanningTree.write': {
      label: 'gds.alpha.kSpanningTree.write',
    },
    'gds.alpha.knn.filtered.mutate': {
      label: 'gds.alpha.knn.filtered.mutate',
    },
    'gds.alpha.knn.filtered.stats': {
      label: 'gds.alpha.knn.filtered.stats',
    },
    'gds.alpha.knn.filtered.stream': {
      label: 'gds.alpha.knn.filtered.stream',
    },
    'gds.alpha.knn.filtered.write': {
      label: 'gds.alpha.knn.filtered.write',
    },
    'gds.alpha.maxkcut.mutate': {
      label: 'gds.alpha.maxkcut.mutate',
    },
    'gds.alpha.maxkcut.mutate.estimate': {
      label: 'gds.alpha.maxkcut.mutate.estimate',
    },
    'gds.alpha.maxkcut.stream': {
      label: 'gds.alpha.maxkcut.stream',
    },
    'gds.alpha.maxkcut.stream.estimate': {
      label: 'gds.alpha.maxkcut.stream.estimate',
    },
    'gds.alpha.ml.splitRelationships.mutate': {
      label: 'gds.alpha.ml.splitRelationships.mutate',
    },
    'gds.alpha.model.delete': {
      label: 'gds.alpha.model.delete',
    },
    'gds.alpha.model.load': {
      label: 'gds.alpha.model.load',
    },
    'gds.alpha.model.publish': {
      label: 'gds.alpha.model.publish',
    },
    'gds.alpha.model.store': {
      label: 'gds.alpha.model.store',
    },
    'gds.alpha.modularity.stats': {
      label: 'gds.alpha.modularity.stats',
    },
    'gds.alpha.modularity.stream': {
      label: 'gds.alpha.modularity.stream',
    },
    'gds.alpha.nodeSimilarity.filtered.mutate': {
      label: 'gds.alpha.nodeSimilarity.filtered.mutate',
    },
    'gds.alpha.nodeSimilarity.filtered.mutate.estimate': {
      label: 'gds.alpha.nodeSimilarity.filtered.mutate.estimate',
    },
    'gds.alpha.nodeSimilarity.filtered.stats': {
      label: 'gds.alpha.nodeSimilarity.filtered.stats',
    },
    'gds.alpha.nodeSimilarity.filtered.stats.estimate': {
      label: 'gds.alpha.nodeSimilarity.filtered.stats.estimate',
    },
    'gds.alpha.nodeSimilarity.filtered.stream': {
      label: 'gds.alpha.nodeSimilarity.filtered.stream',
    },
    'gds.alpha.nodeSimilarity.filtered.stream.estimate': {
      label: 'gds.alpha.nodeSimilarity.filtered.stream.estimate',
    },
    'gds.alpha.nodeSimilarity.filtered.write': {
      label: 'gds.alpha.nodeSimilarity.filtered.write',
    },
    'gds.alpha.nodeSimilarity.filtered.write.estimate': {
      label: 'gds.alpha.nodeSimilarity.filtered.write.estimate',
    },
    'gds.alpha.pipeline.linkPrediction.addMLP': {
      label: 'gds.alpha.pipeline.linkPrediction.addMLP',
    },
    'gds.alpha.pipeline.linkPrediction.addRandomForest': {
      label: 'gds.alpha.pipeline.linkPrediction.addRandomForest',
    },
    'gds.alpha.pipeline.linkPrediction.configureAutoTuning': {
      label: 'gds.alpha.pipeline.linkPrediction.configureAutoTuning',
    },
    'gds.alpha.pipeline.nodeClassification.addMLP': {
      label: 'gds.alpha.pipeline.nodeClassification.addMLP',
    },
    'gds.alpha.pipeline.nodeClassification.addRandomForest': {
      label: 'gds.alpha.pipeline.nodeClassification.addRandomForest',
    },
    'gds.alpha.pipeline.nodeClassification.configureAutoTuning': {
      label: 'gds.alpha.pipeline.nodeClassification.configureAutoTuning',
    },
    'gds.alpha.pipeline.nodeRegression.addLinearRegression': {
      label: 'gds.alpha.pipeline.nodeRegression.addLinearRegression',
    },
    'gds.alpha.pipeline.nodeRegression.addNodeProperty': {
      label: 'gds.alpha.pipeline.nodeRegression.addNodeProperty',
    },
    'gds.alpha.pipeline.nodeRegression.addRandomForest': {
      label: 'gds.alpha.pipeline.nodeRegression.addRandomForest',
    },
    'gds.alpha.pipeline.nodeRegression.configureAutoTuning': {
      label: 'gds.alpha.pipeline.nodeRegression.configureAutoTuning',
    },
    'gds.alpha.pipeline.nodeRegression.configureSplit': {
      label: 'gds.alpha.pipeline.nodeRegression.configureSplit',
    },
    'gds.alpha.pipeline.nodeRegression.create': {
      label: 'gds.alpha.pipeline.nodeRegression.create',
    },
    'gds.alpha.pipeline.nodeRegression.predict.mutate': {
      label: 'gds.alpha.pipeline.nodeRegression.predict.mutate',
    },
    'gds.alpha.pipeline.nodeRegression.predict.stream': {
      label: 'gds.alpha.pipeline.nodeRegression.predict.stream',
    },
    'gds.alpha.pipeline.nodeRegression.selectFeatures': {
      label: 'gds.alpha.pipeline.nodeRegression.selectFeatures',
    },
    'gds.alpha.pipeline.nodeRegression.train': {
      label: 'gds.alpha.pipeline.nodeRegression.train',
    },
    'gds.alpha.restore': {
      label: 'gds.alpha.restore',
    },
    'gds.alpha.scaleProperties.mutate': {
      label: 'gds.alpha.scaleProperties.mutate',
    },
    'gds.alpha.scaleProperties.stream': {
      label: 'gds.alpha.scaleProperties.stream',
    },
    'gds.alpha.scc.stream': {
      label: 'gds.alpha.scc.stream',
    },
    'gds.alpha.scc.write': {
      label: 'gds.alpha.scc.write',
    },
    'gds.alpha.sllpa.mutate': {
      label: 'gds.alpha.sllpa.mutate',
    },
    'gds.alpha.sllpa.mutate.estimate': {
      label: 'gds.alpha.sllpa.mutate.estimate',
    },
    'gds.alpha.sllpa.stats': {
      label: 'gds.alpha.sllpa.stats',
    },
    'gds.alpha.sllpa.stats.estimate': {
      label: 'gds.alpha.sllpa.stats.estimate',
    },
    'gds.alpha.sllpa.stream': {
      label: 'gds.alpha.sllpa.stream',
    },
    'gds.alpha.sllpa.stream.estimate': {
      label: 'gds.alpha.sllpa.stream.estimate',
    },
    'gds.alpha.sllpa.write': {
      label: 'gds.alpha.sllpa.write',
    },
    'gds.alpha.sllpa.write.estimate': {
      label: 'gds.alpha.sllpa.write.estimate',
    },
    'gds.alpha.systemMonitor': {
      label: 'gds.alpha.systemMonitor',
    },
    'gds.alpha.triangles': {
      label: 'gds.alpha.triangles',
    },
    'gds.alpha.userLog': {
      label: 'gds.alpha.userLog',
    },
    'gds.articleRank.mutate': {
      label: 'gds.articleRank.mutate',
    },
    'gds.articleRank.mutate.estimate': {
      label: 'gds.articleRank.mutate.estimate',
    },
    'gds.articleRank.stats': {
      label: 'gds.articleRank.stats',
    },
    'gds.articleRank.stats.estimate': {
      label: 'gds.articleRank.stats.estimate',
    },
    'gds.articleRank.stream': {
      label: 'gds.articleRank.stream',
    },
    'gds.articleRank.stream.estimate': {
      label: 'gds.articleRank.stream.estimate',
    },
    'gds.articleRank.write': {
      label: 'gds.articleRank.write',
    },
    'gds.articleRank.write.estimate': {
      label: 'gds.articleRank.write.estimate',
    },
    'gds.bellmanFord.mutate': {
      label: 'gds.bellmanFord.mutate',
    },
    'gds.bellmanFord.mutate.estimate': {
      label: 'gds.bellmanFord.mutate.estimate',
    },
    'gds.bellmanFord.stats': {
      label: 'gds.bellmanFord.stats',
    },
    'gds.bellmanFord.stats.estimate': {
      label: 'gds.bellmanFord.stats.estimate',
    },
    'gds.bellmanFord.stream': {
      label: 'gds.bellmanFord.stream',
    },
    'gds.bellmanFord.stream.estimate': {
      label: 'gds.bellmanFord.stream.estimate',
    },
    'gds.bellmanFord.write': {
      label: 'gds.bellmanFord.write',
    },
    'gds.bellmanFord.write.estimate': {
      label: 'gds.bellmanFord.write.estimate',
    },
    'gds.beta.closeness.mutate': {
      label: 'gds.beta.closeness.mutate',
    },
    'gds.beta.closeness.stats': {
      label: 'gds.beta.closeness.stats',
    },
    'gds.beta.closeness.stream': {
      label: 'gds.beta.closeness.stream',
    },
    'gds.beta.closeness.write': {
      label: 'gds.beta.closeness.write',
    },
    'gds.beta.collapsePath.mutate': {
      label: 'gds.beta.collapsePath.mutate',
    },
    'gds.beta.graph.export.csv': {
      label: 'gds.beta.graph.export.csv',
    },
    'gds.beta.graph.export.csv.estimate': {
      label: 'gds.beta.graph.export.csv.estimate',
    },
    'gds.beta.graph.generate': {
      label: 'gds.beta.graph.generate',
    },
    'gds.beta.graph.project.subgraph': {
      label: 'gds.beta.graph.project.subgraph',
    },
    'gds.beta.graph.relationships.stream': {
      label: 'gds.beta.graph.relationships.stream',
    },
    'gds.beta.graph.relationships.toUndirected': {
      label: 'gds.beta.graph.relationships.toUndirected',
    },
    'gds.beta.graph.relationships.toUndirected.estimate': {
      label: 'gds.beta.graph.relationships.toUndirected.estimate',
    },
    'gds.beta.graphSage.mutate': {
      label: 'gds.beta.graphSage.mutate',
    },
    'gds.beta.graphSage.mutate.estimate': {
      label: 'gds.beta.graphSage.mutate.estimate',
    },
    'gds.beta.graphSage.stream': {
      label: 'gds.beta.graphSage.stream',
    },
    'gds.beta.graphSage.stream.estimate': {
      label: 'gds.beta.graphSage.stream.estimate',
    },
    'gds.beta.graphSage.train': {
      label: 'gds.beta.graphSage.train',
    },
    'gds.beta.graphSage.train.estimate': {
      label: 'gds.beta.graphSage.train.estimate',
    },
    'gds.beta.graphSage.write': {
      label: 'gds.beta.graphSage.write',
    },
    'gds.beta.graphSage.write.estimate': {
      label: 'gds.beta.graphSage.write.estimate',
    },
    'gds.beta.hashgnn.mutate': {
      label: 'gds.beta.hashgnn.mutate',
    },
    'gds.beta.hashgnn.mutate.estimate': {
      label: 'gds.beta.hashgnn.mutate.estimate',
    },
    'gds.beta.hashgnn.stream': {
      label: 'gds.beta.hashgnn.stream',
    },
    'gds.beta.hashgnn.stream.estimate': {
      label: 'gds.beta.hashgnn.stream.estimate',
    },
    'gds.beta.influenceMaximization.celf.mutate': {
      label: 'gds.beta.influenceMaximization.celf.mutate',
    },
    'gds.beta.influenceMaximization.celf.mutate.estimate': {
      label: 'gds.beta.influenceMaximization.celf.mutate.estimate',
    },
    'gds.beta.influenceMaximization.celf.stats': {
      label: 'gds.beta.influenceMaximization.celf.stats',
    },
    'gds.beta.influenceMaximization.celf.stats.estimate': {
      label: 'gds.beta.influenceMaximization.celf.stats.estimate',
    },
    'gds.beta.influenceMaximization.celf.stream': {
      label: 'gds.beta.influenceMaximization.celf.stream',
    },
    'gds.beta.influenceMaximization.celf.stream.estimate': {
      label: 'gds.beta.influenceMaximization.celf.stream.estimate',
    },
    'gds.beta.influenceMaximization.celf.write': {
      label: 'gds.beta.influenceMaximization.celf.write',
    },
    'gds.beta.influenceMaximization.celf.write.estimate': {
      label: 'gds.beta.influenceMaximization.celf.write.estimate',
    },
    'gds.beta.k1coloring.mutate': {
      label: 'gds.beta.k1coloring.mutate',
    },
    'gds.beta.k1coloring.mutate.estimate': {
      label: 'gds.beta.k1coloring.mutate.estimate',
    },
    'gds.beta.k1coloring.stats': {
      label: 'gds.beta.k1coloring.stats',
    },
    'gds.beta.k1coloring.stats.estimate': {
      label: 'gds.beta.k1coloring.stats.estimate',
    },
    'gds.beta.k1coloring.stream': {
      label: 'gds.beta.k1coloring.stream',
    },
    'gds.beta.k1coloring.stream.estimate': {
      label: 'gds.beta.k1coloring.stream.estimate',
    },
    'gds.beta.k1coloring.write': {
      label: 'gds.beta.k1coloring.write',
    },
    'gds.beta.k1coloring.write.estimate': {
      label: 'gds.beta.k1coloring.write.estimate',
    },
    'gds.beta.kmeans.mutate': {
      label: 'gds.beta.kmeans.mutate',
    },
    'gds.beta.kmeans.mutate.estimate': {
      label: 'gds.beta.kmeans.mutate.estimate',
    },
    'gds.beta.kmeans.stats': {
      label: 'gds.beta.kmeans.stats',
    },
    'gds.beta.kmeans.stats.estimate': {
      label: 'gds.beta.kmeans.stats.estimate',
    },
    'gds.beta.kmeans.stream': {
      label: 'gds.beta.kmeans.stream',
    },
    'gds.beta.kmeans.stream.estimate': {
      label: 'gds.beta.kmeans.stream.estimate',
    },
    'gds.beta.kmeans.write': {
      label: 'gds.beta.kmeans.write',
    },
    'gds.beta.kmeans.write.estimate': {
      label: 'gds.beta.kmeans.write.estimate',
    },
    'gds.beta.leiden.mutate': {
      label: 'gds.beta.leiden.mutate',
    },
    'gds.beta.leiden.mutate.estimate': {
      label: 'gds.beta.leiden.mutate.estimate',
    },
    'gds.beta.leiden.stats': {
      label: 'gds.beta.leiden.stats',
    },
    'gds.beta.leiden.stats.estimate': {
      label: 'gds.beta.leiden.stats.estimate',
    },
    'gds.beta.leiden.stream': {
      label: 'gds.beta.leiden.stream',
    },
    'gds.beta.leiden.stream.estimate': {
      label: 'gds.beta.leiden.stream.estimate',
    },
    'gds.beta.leiden.write': {
      label: 'gds.beta.leiden.write',
    },
    'gds.beta.leiden.write.estimate': {
      label: 'gds.beta.leiden.write.estimate',
    },
    'gds.beta.listProgress': {
      label: 'gds.beta.listProgress',
    },
    'gds.beta.model.drop': {
      label: 'gds.beta.model.drop',
    },
    'gds.beta.model.exists': {
      label: 'gds.beta.model.exists',
    },
    'gds.beta.model.list': {
      label: 'gds.beta.model.list',
    },
    'gds.beta.modularityOptimization.mutate': {
      label: 'gds.beta.modularityOptimization.mutate',
    },
    'gds.beta.modularityOptimization.mutate.estimate': {
      label: 'gds.beta.modularityOptimization.mutate.estimate',
    },
    'gds.beta.modularityOptimization.stream': {
      label: 'gds.beta.modularityOptimization.stream',
    },
    'gds.beta.modularityOptimization.stream.estimate': {
      label: 'gds.beta.modularityOptimization.stream.estimate',
    },
    'gds.beta.modularityOptimization.write': {
      label: 'gds.beta.modularityOptimization.write',
    },
    'gds.beta.modularityOptimization.write.estimate': {
      label: 'gds.beta.modularityOptimization.write.estimate',
    },
    'gds.beta.node2vec.mutate': {
      label: 'gds.beta.node2vec.mutate',
    },
    'gds.beta.node2vec.mutate.estimate': {
      label: 'gds.beta.node2vec.mutate.estimate',
    },
    'gds.beta.node2vec.stream': {
      label: 'gds.beta.node2vec.stream',
    },
    'gds.beta.node2vec.stream.estimate': {
      label: 'gds.beta.node2vec.stream.estimate',
    },
    'gds.beta.node2vec.write': {
      label: 'gds.beta.node2vec.write',
    },
    'gds.beta.node2vec.write.estimate': {
      label: 'gds.beta.node2vec.write.estimate',
    },
    'gds.beta.pipeline.drop': {
      label: 'gds.beta.pipeline.drop',
    },
    'gds.beta.pipeline.exists': {
      label: 'gds.beta.pipeline.exists',
    },
    'gds.beta.pipeline.linkPrediction.addFeature': {
      label: 'gds.beta.pipeline.linkPrediction.addFeature',
    },
    'gds.beta.pipeline.linkPrediction.addLogisticRegression': {
      label: 'gds.beta.pipeline.linkPrediction.addLogisticRegression',
    },
    'gds.beta.pipeline.linkPrediction.addNodeProperty': {
      label: 'gds.beta.pipeline.linkPrediction.addNodeProperty',
    },
    'gds.beta.pipeline.linkPrediction.addRandomForest': {
      label: 'gds.beta.pipeline.linkPrediction.addRandomForest',
    },
    'gds.beta.pipeline.linkPrediction.configureSplit': {
      label: 'gds.beta.pipeline.linkPrediction.configureSplit',
    },
    'gds.beta.pipeline.linkPrediction.create': {
      label: 'gds.beta.pipeline.linkPrediction.create',
    },
    'gds.beta.pipeline.linkPrediction.predict.mutate': {
      label: 'gds.beta.pipeline.linkPrediction.predict.mutate',
    },
    'gds.beta.pipeline.linkPrediction.predict.mutate.estimate': {
      label: 'gds.beta.pipeline.linkPrediction.predict.mutate.estimate',
    },
    'gds.beta.pipeline.linkPrediction.predict.stream': {
      label: 'gds.beta.pipeline.linkPrediction.predict.stream',
    },
    'gds.beta.pipeline.linkPrediction.predict.stream.estimate': {
      label: 'gds.beta.pipeline.linkPrediction.predict.stream.estimate',
    },
    'gds.beta.pipeline.linkPrediction.train': {
      label: 'gds.beta.pipeline.linkPrediction.train',
    },
    'gds.beta.pipeline.linkPrediction.train.estimate': {
      label: 'gds.beta.pipeline.linkPrediction.train.estimate',
    },
    'gds.beta.pipeline.list': {
      label: 'gds.beta.pipeline.list',
    },
    'gds.beta.pipeline.nodeClassification.addLogisticRegression': {
      label: 'gds.beta.pipeline.nodeClassification.addLogisticRegression',
    },
    'gds.beta.pipeline.nodeClassification.addNodeProperty': {
      label: 'gds.beta.pipeline.nodeClassification.addNodeProperty',
    },
    'gds.beta.pipeline.nodeClassification.addRandomForest': {
      label: 'gds.beta.pipeline.nodeClassification.addRandomForest',
    },
    'gds.beta.pipeline.nodeClassification.configureSplit': {
      label: 'gds.beta.pipeline.nodeClassification.configureSplit',
    },
    'gds.beta.pipeline.nodeClassification.create': {
      label: 'gds.beta.pipeline.nodeClassification.create',
    },
    'gds.beta.pipeline.nodeClassification.predict.mutate': {
      label: 'gds.beta.pipeline.nodeClassification.predict.mutate',
    },
    'gds.beta.pipeline.nodeClassification.predict.mutate.estimate': {
      label: 'gds.beta.pipeline.nodeClassification.predict.mutate.estimate',
    },
    'gds.beta.pipeline.nodeClassification.predict.stream': {
      label: 'gds.beta.pipeline.nodeClassification.predict.stream',
    },
    'gds.beta.pipeline.nodeClassification.predict.stream.estimate': {
      label: 'gds.beta.pipeline.nodeClassification.predict.stream.estimate',
    },
    'gds.beta.pipeline.nodeClassification.predict.write': {
      label: 'gds.beta.pipeline.nodeClassification.predict.write',
    },
    'gds.beta.pipeline.nodeClassification.predict.write.estimate': {
      label: 'gds.beta.pipeline.nodeClassification.predict.write.estimate',
    },
    'gds.beta.pipeline.nodeClassification.selectFeatures': {
      label: 'gds.beta.pipeline.nodeClassification.selectFeatures',
    },
    'gds.beta.pipeline.nodeClassification.train': {
      label: 'gds.beta.pipeline.nodeClassification.train',
    },
    'gds.beta.pipeline.nodeClassification.train.estimate': {
      label: 'gds.beta.pipeline.nodeClassification.train.estimate',
    },
    'gds.beta.spanningTree.mutate': {
      label: 'gds.beta.spanningTree.mutate',
    },
    'gds.beta.spanningTree.mutate.estimate': {
      label: 'gds.beta.spanningTree.mutate.estimate',
    },
    'gds.beta.spanningTree.stats': {
      label: 'gds.beta.spanningTree.stats',
    },
    'gds.beta.spanningTree.stats.estimate': {
      label: 'gds.beta.spanningTree.stats.estimate',
    },
    'gds.beta.spanningTree.stream': {
      label: 'gds.beta.spanningTree.stream',
    },
    'gds.beta.spanningTree.stream.estimate': {
      label: 'gds.beta.spanningTree.stream.estimate',
    },
    'gds.beta.spanningTree.write': {
      label: 'gds.beta.spanningTree.write',
    },
    'gds.beta.spanningTree.write.estimate': {
      label: 'gds.beta.spanningTree.write.estimate',
    },
    'gds.beta.steinerTree.mutate': {
      label: 'gds.beta.steinerTree.mutate',
    },
    'gds.beta.steinerTree.stats': {
      label: 'gds.beta.steinerTree.stats',
    },
    'gds.beta.steinerTree.stream': {
      label: 'gds.beta.steinerTree.stream',
    },
    'gds.beta.steinerTree.write': {
      label: 'gds.beta.steinerTree.write',
    },
    'gds.betweenness.mutate': {
      label: 'gds.betweenness.mutate',
    },
    'gds.betweenness.mutate.estimate': {
      label: 'gds.betweenness.mutate.estimate',
    },
    'gds.betweenness.stats': {
      label: 'gds.betweenness.stats',
    },
    'gds.betweenness.stats.estimate': {
      label: 'gds.betweenness.stats.estimate',
    },
    'gds.betweenness.stream': {
      label: 'gds.betweenness.stream',
    },
    'gds.betweenness.stream.estimate': {
      label: 'gds.betweenness.stream.estimate',
    },
    'gds.betweenness.write': {
      label: 'gds.betweenness.write',
    },
    'gds.betweenness.write.estimate': {
      label: 'gds.betweenness.write.estimate',
    },
    'gds.bfs.mutate': {
      label: 'gds.bfs.mutate',
    },
    'gds.bfs.mutate.estimate': {
      label: 'gds.bfs.mutate.estimate',
    },
    'gds.bfs.stats': {
      label: 'gds.bfs.stats',
    },
    'gds.bfs.stats.estimate': {
      label: 'gds.bfs.stats.estimate',
    },
    'gds.bfs.stream': {
      label: 'gds.bfs.stream',
    },
    'gds.bfs.stream.estimate': {
      label: 'gds.bfs.stream.estimate',
    },
    'gds.debug.arrow': {
      label: 'gds.debug.arrow',
    },
    'gds.debug.sysInfo': {
      label: 'gds.debug.sysInfo',
    },
    'gds.degree.mutate': {
      label: 'gds.degree.mutate',
    },
    'gds.degree.mutate.estimate': {
      label: 'gds.degree.mutate.estimate',
    },
    'gds.degree.stats': {
      label: 'gds.degree.stats',
    },
    'gds.degree.stats.estimate': {
      label: 'gds.degree.stats.estimate',
    },
    'gds.degree.stream': {
      label: 'gds.degree.stream',
    },
    'gds.degree.stream.estimate': {
      label: 'gds.degree.stream.estimate',
    },
    'gds.degree.write': {
      label: 'gds.degree.write',
    },
    'gds.degree.write.estimate': {
      label: 'gds.degree.write.estimate',
    },
    'gds.dfs.mutate': {
      label: 'gds.dfs.mutate',
    },
    'gds.dfs.mutate.estimate': {
      label: 'gds.dfs.mutate.estimate',
    },
    'gds.dfs.stream': {
      label: 'gds.dfs.stream',
    },
    'gds.dfs.stream.estimate': {
      label: 'gds.dfs.stream.estimate',
    },
    'gds.eigenvector.mutate': {
      label: 'gds.eigenvector.mutate',
    },
    'gds.eigenvector.mutate.estimate': {
      label: 'gds.eigenvector.mutate.estimate',
    },
    'gds.eigenvector.stats': {
      label: 'gds.eigenvector.stats',
    },
    'gds.eigenvector.stats.estimate': {
      label: 'gds.eigenvector.stats.estimate',
    },
    'gds.eigenvector.stream': {
      label: 'gds.eigenvector.stream',
    },
    'gds.eigenvector.stream.estimate': {
      label: 'gds.eigenvector.stream.estimate',
    },
    'gds.eigenvector.write': {
      label: 'gds.eigenvector.write',
    },
    'gds.eigenvector.write.estimate': {
      label: 'gds.eigenvector.write.estimate',
    },
    'gds.fastRP.mutate': {
      label: 'gds.fastRP.mutate',
    },
    'gds.fastRP.mutate.estimate': {
      label: 'gds.fastRP.mutate.estimate',
    },
    'gds.fastRP.stats': {
      label: 'gds.fastRP.stats',
    },
    'gds.fastRP.stats.estimate': {
      label: 'gds.fastRP.stats.estimate',
    },
    'gds.fastRP.stream': {
      label: 'gds.fastRP.stream',
    },
    'gds.fastRP.stream.estimate': {
      label: 'gds.fastRP.stream.estimate',
    },
    'gds.fastRP.write': {
      label: 'gds.fastRP.write',
    },
    'gds.fastRP.write.estimate': {
      label: 'gds.fastRP.write.estimate',
    },
    'gds.graph.deleteRelationships': {
      label: 'gds.graph.deleteRelationships',
    },
    'gds.graph.drop': {
      label: 'gds.graph.drop',
    },
    'gds.graph.exists': {
      label: 'gds.graph.exists',
    },
    'gds.graph.export': {
      label: 'gds.graph.export',
    },
    'gds.graph.list': {
      label: 'gds.graph.list',
    },
    'gds.graph.nodeProperties.drop': {
      label: 'gds.graph.nodeProperties.drop',
    },
    'gds.graph.nodeProperties.stream': {
      label: 'gds.graph.nodeProperties.stream',
    },
    'gds.graph.nodeProperties.write': {
      label: 'gds.graph.nodeProperties.write',
    },
    'gds.graph.nodeProperty.stream': {
      label: 'gds.graph.nodeProperty.stream',
    },
    'gds.graph.project': {
      label: 'gds.graph.project',
    },
    'gds.graph.project.cypher': {
      label: 'gds.graph.project.cypher',
    },
    'gds.graph.project.cypher.estimate': {
      label: 'gds.graph.project.cypher.estimate',
    },
    'gds.graph.project.estimate': {
      label: 'gds.graph.project.estimate',
    },
    'gds.graph.relationship.write': {
      label: 'gds.graph.relationship.write',
    },
    'gds.graph.relationshipProperties.stream': {
      label: 'gds.graph.relationshipProperties.stream',
    },
    'gds.graph.relationshipProperties.write': {
      label: 'gds.graph.relationshipProperties.write',
    },
    'gds.graph.relationshipProperty.stream': {
      label: 'gds.graph.relationshipProperty.stream',
    },
    'gds.graph.relationships.drop': {
      label: 'gds.graph.relationships.drop',
    },
    'gds.graph.removeNodeProperties': {
      label: 'gds.graph.removeNodeProperties',
    },
    'gds.graph.sample.cnarw': {
      label: 'gds.graph.sample.cnarw',
    },
    'gds.graph.sample.cnarw.estimate': {
      label: 'gds.graph.sample.cnarw.estimate',
    },
    'gds.graph.sample.rwr': {
      label: 'gds.graph.sample.rwr',
    },
    'gds.graph.streamNodeProperties': {
      label: 'gds.graph.streamNodeProperties',
    },
    'gds.graph.streamNodeProperty': {
      label: 'gds.graph.streamNodeProperty',
    },
    'gds.graph.streamRelationshipProperties': {
      label: 'gds.graph.streamRelationshipProperties',
    },
    'gds.graph.streamRelationshipProperty': {
      label: 'gds.graph.streamRelationshipProperty',
    },
    'gds.graph.writeNodeProperties': {
      label: 'gds.graph.writeNodeProperties',
    },
    'gds.graph.writeRelationship': {
      label: 'gds.graph.writeRelationship',
    },
    'gds.kcore.mutate': {
      label: 'gds.kcore.mutate',
    },
    'gds.kcore.mutate.estimate': {
      label: 'gds.kcore.mutate.estimate',
    },
    'gds.kcore.stats': {
      label: 'gds.kcore.stats',
    },
    'gds.kcore.stats.estimate': {
      label: 'gds.kcore.stats.estimate',
    },
    'gds.kcore.stream': {
      label: 'gds.kcore.stream',
    },
    'gds.kcore.stream.estimate': {
      label: 'gds.kcore.stream.estimate',
    },
    'gds.kcore.write': {
      label: 'gds.kcore.write',
    },
    'gds.kcore.write.estimate': {
      label: 'gds.kcore.write.estimate',
    },
    'gds.knn.mutate': {
      label: 'gds.knn.mutate',
    },
    'gds.knn.mutate.estimate': {
      label: 'gds.knn.mutate.estimate',
    },
    'gds.knn.stats': {
      label: 'gds.knn.stats',
    },
    'gds.knn.stats.estimate': {
      label: 'gds.knn.stats.estimate',
    },
    'gds.knn.stream': {
      label: 'gds.knn.stream',
    },
    'gds.knn.stream.estimate': {
      label: 'gds.knn.stream.estimate',
    },
    'gds.knn.write': {
      label: 'gds.knn.write',
    },
    'gds.knn.write.estimate': {
      label: 'gds.knn.write.estimate',
    },
    'gds.labelPropagation.mutate': {
      label: 'gds.labelPropagation.mutate',
    },
    'gds.labelPropagation.mutate.estimate': {
      label: 'gds.labelPropagation.mutate.estimate',
    },
    'gds.labelPropagation.stats': {
      label: 'gds.labelPropagation.stats',
    },
    'gds.labelPropagation.stats.estimate': {
      label: 'gds.labelPropagation.stats.estimate',
    },
    'gds.labelPropagation.stream': {
      label: 'gds.labelPropagation.stream',
    },
    'gds.labelPropagation.stream.estimate': {
      label: 'gds.labelPropagation.stream.estimate',
    },
    'gds.labelPropagation.write': {
      label: 'gds.labelPropagation.write',
    },
    'gds.labelPropagation.write.estimate': {
      label: 'gds.labelPropagation.write.estimate',
    },
    'gds.list': {
      label: 'gds.list',
    },
    'gds.localClusteringCoefficient.mutate': {
      label: 'gds.localClusteringCoefficient.mutate',
    },
    'gds.localClusteringCoefficient.mutate.estimate': {
      label: 'gds.localClusteringCoefficient.mutate.estimate',
    },
    'gds.localClusteringCoefficient.stats': {
      label: 'gds.localClusteringCoefficient.stats',
    },
    'gds.localClusteringCoefficient.stats.estimate': {
      label: 'gds.localClusteringCoefficient.stats.estimate',
    },
    'gds.localClusteringCoefficient.stream': {
      label: 'gds.localClusteringCoefficient.stream',
    },
    'gds.localClusteringCoefficient.stream.estimate': {
      label: 'gds.localClusteringCoefficient.stream.estimate',
    },
    'gds.localClusteringCoefficient.write': {
      label: 'gds.localClusteringCoefficient.write',
    },
    'gds.localClusteringCoefficient.write.estimate': {
      label: 'gds.localClusteringCoefficient.write.estimate',
    },
    'gds.louvain.mutate': {
      label: 'gds.louvain.mutate',
    },
    'gds.louvain.mutate.estimate': {
      label: 'gds.louvain.mutate.estimate',
    },
    'gds.louvain.stats': {
      label: 'gds.louvain.stats',
    },
    'gds.louvain.stats.estimate': {
      label: 'gds.louvain.stats.estimate',
    },
    'gds.louvain.stream': {
      label: 'gds.louvain.stream',
    },
    'gds.louvain.stream.estimate': {
      label: 'gds.louvain.stream.estimate',
    },
    'gds.louvain.write': {
      label: 'gds.louvain.write',
    },
    'gds.louvain.write.estimate': {
      label: 'gds.louvain.write.estimate',
    },
    'gds.nodeSimilarity.mutate': {
      label: 'gds.nodeSimilarity.mutate',
    },
    'gds.nodeSimilarity.mutate.estimate': {
      label: 'gds.nodeSimilarity.mutate.estimate',
    },
    'gds.nodeSimilarity.stats': {
      label: 'gds.nodeSimilarity.stats',
    },
    'gds.nodeSimilarity.stats.estimate': {
      label: 'gds.nodeSimilarity.stats.estimate',
    },
    'gds.nodeSimilarity.stream': {
      label: 'gds.nodeSimilarity.stream',
    },
    'gds.nodeSimilarity.stream.estimate': {
      label: 'gds.nodeSimilarity.stream.estimate',
    },
    'gds.nodeSimilarity.write': {
      label: 'gds.nodeSimilarity.write',
    },
    'gds.nodeSimilarity.write.estimate': {
      label: 'gds.nodeSimilarity.write.estimate',
    },
    'gds.pageRank.mutate': {
      label: 'gds.pageRank.mutate',
    },
    'gds.pageRank.mutate.estimate': {
      label: 'gds.pageRank.mutate.estimate',
    },
    'gds.pageRank.stats': {
      label: 'gds.pageRank.stats',
    },
    'gds.pageRank.stats.estimate': {
      label: 'gds.pageRank.stats.estimate',
    },
    'gds.pageRank.stream': {
      label: 'gds.pageRank.stream',
    },
    'gds.pageRank.stream.estimate': {
      label: 'gds.pageRank.stream.estimate',
    },
    'gds.pageRank.write': {
      label: 'gds.pageRank.write',
    },
    'gds.pageRank.write.estimate': {
      label: 'gds.pageRank.write.estimate',
    },
    'gds.randomWalk.stats': {
      label: 'gds.randomWalk.stats',
    },
    'gds.randomWalk.stats.estimate': {
      label: 'gds.randomWalk.stats.estimate',
    },
    'gds.randomWalk.stream': {
      label: 'gds.randomWalk.stream',
    },
    'gds.randomWalk.stream.estimate': {
      label: 'gds.randomWalk.stream.estimate',
    },
    'gds.scaleProperties.mutate': {
      label: 'gds.scaleProperties.mutate',
    },
    'gds.scaleProperties.mutate.estimate': {
      label: 'gds.scaleProperties.mutate.estimate',
    },
    'gds.scaleProperties.stats': {
      label: 'gds.scaleProperties.stats',
    },
    'gds.scaleProperties.stats.estimate': {
      label: 'gds.scaleProperties.stats.estimate',
    },
    'gds.scaleProperties.stream': {
      label: 'gds.scaleProperties.stream',
    },
    'gds.scaleProperties.stream.estimate': {
      label: 'gds.scaleProperties.stream.estimate',
    },
    'gds.scaleProperties.write': {
      label: 'gds.scaleProperties.write',
    },
    'gds.scaleProperties.write.estimate': {
      label: 'gds.scaleProperties.write.estimate',
    },
    'gds.shortestPath.astar.mutate': {
      label: 'gds.shortestPath.astar.mutate',
    },
    'gds.shortestPath.astar.mutate.estimate': {
      label: 'gds.shortestPath.astar.mutate.estimate',
    },
    'gds.shortestPath.astar.stream': {
      label: 'gds.shortestPath.astar.stream',
    },
    'gds.shortestPath.astar.stream.estimate': {
      label: 'gds.shortestPath.astar.stream.estimate',
    },
    'gds.shortestPath.astar.write': {
      label: 'gds.shortestPath.astar.write',
    },
    'gds.shortestPath.astar.write.estimate': {
      label: 'gds.shortestPath.astar.write.estimate',
    },
    'gds.shortestPath.dijkstra.mutate': {
      label: 'gds.shortestPath.dijkstra.mutate',
    },
    'gds.shortestPath.dijkstra.mutate.estimate': {
      label: 'gds.shortestPath.dijkstra.mutate.estimate',
    },
    'gds.shortestPath.dijkstra.stream': {
      label: 'gds.shortestPath.dijkstra.stream',
    },
    'gds.shortestPath.dijkstra.stream.estimate': {
      label: 'gds.shortestPath.dijkstra.stream.estimate',
    },
    'gds.shortestPath.dijkstra.write': {
      label: 'gds.shortestPath.dijkstra.write',
    },
    'gds.shortestPath.dijkstra.write.estimate': {
      label: 'gds.shortestPath.dijkstra.write.estimate',
    },
    'gds.shortestPath.yens.mutate': {
      label: 'gds.shortestPath.yens.mutate',
    },
    'gds.shortestPath.yens.mutate.estimate': {
      label: 'gds.shortestPath.yens.mutate.estimate',
    },
    'gds.shortestPath.yens.stream': {
      label: 'gds.shortestPath.yens.stream',
    },
    'gds.shortestPath.yens.stream.estimate': {
      label: 'gds.shortestPath.yens.stream.estimate',
    },
    'gds.shortestPath.yens.write': {
      label: 'gds.shortestPath.yens.write',
    },
    'gds.shortestPath.yens.write.estimate': {
      label: 'gds.shortestPath.yens.write.estimate',
    },
    'gds.triangleCount.mutate': {
      label: 'gds.triangleCount.mutate',
    },
    'gds.triangleCount.mutate.estimate': {
      label: 'gds.triangleCount.mutate.estimate',
    },
    'gds.triangleCount.stats': {
      label: 'gds.triangleCount.stats',
    },
    'gds.triangleCount.stats.estimate': {
      label: 'gds.triangleCount.stats.estimate',
    },
    'gds.triangleCount.stream': {
      label: 'gds.triangleCount.stream',
    },
    'gds.triangleCount.stream.estimate': {
      label: 'gds.triangleCount.stream.estimate',
    },
    'gds.triangleCount.write': {
      label: 'gds.triangleCount.write',
    },
    'gds.triangleCount.write.estimate': {
      label: 'gds.triangleCount.write.estimate',
    },
    'gds.wcc.mutate': {
      label: 'gds.wcc.mutate',
    },
    'gds.wcc.mutate.estimate': {
      label: 'gds.wcc.mutate.estimate',
    },
    'gds.wcc.stats': {
      label: 'gds.wcc.stats',
    },
    'gds.wcc.stats.estimate': {
      label: 'gds.wcc.stats.estimate',
    },
    'gds.wcc.stream': {
      label: 'gds.wcc.stream',
    },
    'gds.wcc.stream.estimate': {
      label: 'gds.wcc.stream.estimate',
    },
    'gds.wcc.write': {
      label: 'gds.wcc.write',
    },
    'gds.wcc.write.estimate': {
      label: 'gds.wcc.write.estimate',
    },
    'jwt.security.requestAccess': {
      label: 'jwt.security.requestAccess',
    },
    'tx.getMetaData': {
      label: 'tx.getMetaData',
    },
    'tx.setMetaData': {
      label: 'tx.setMetaData',
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
