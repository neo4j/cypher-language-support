import { SignatureInformation } from 'vscode-languageserver-types';

export interface DbInfo {
  procedureSignatures: Map<string, SignatureInformation>;
  functionSignatures: Map<string, SignatureInformation>;
  labels: string[];
  relationshipTypes: string[];
}

/*

It would be easier to use in client code if the schema was available programmatically instead of via a procedure so that we could get a typescript type for it.
As it stands now I’ll have to write the typescript type myself, and the GitHub gist is more example than specification. 
https://gist.github.com/oskarhane/7e40012019803e4109ff955cfd50d34d#file-graph-schema-v5-json

I’ve attempted to write a typescript type definition, which I’ll need to do anyway to safely use the JSON for completions. 
I’ve annotated it with questions/thoughts as well and I can pass it along here
 */
export interface GraphSchema {
  graphSchemaRepresentation: {
    graphSchema: {
      nodeLabels: NodeLabel[];
      relationshipTypes: RelType[];
      nodeObjectTypes: NodeObject[];
      relationshipObjectTypes: RelObject[];
    };
    // NOTE the spec says there should be a "version" field here, but the procedure didn't return any
  };
}

type NodeLabelPrefix = 'nl';
// Question: Are the string part of the label guaranteed to equal to the token?
// Question: Are the prefixes for node/rel/label/referencing mandatory?
type NodeLabelId = `${NodeLabelPrefix}:${string}`;
type NodeLabel = { $id: NodeLabelId; token: string };
type NodeLabelRef = { $ref: `#${NodeLabelId}` };

type RelTypePrefix = 'rt';
type RelTypeId = `${RelTypePrefix}:${string}`;
type RelType = { $id: RelTypeId; token: string };
type RelTypeIdRef = { $ref: `#${RelTypeId}` };

// Relationship Types map cleanly to a "RelationshipObjectType"
// But not so much for nodes, since they can have multiple labels
// In the examples, it seems like a "NodeObjectType" is a defined by a set of labels
// Is the Id required to be the same as the labels?
// Is this concept of a "Node Type" something we should formalize in the main database ?
type NodeObjectPrefix = 'n';
type NodeObjectType = `${NodeObjectPrefix}:${string}`;
type NodeObjectTypeReference = { $ref: `#${NodeObjectType}` };
type NodeObject = {
  $id: NodeObjectType;
  labels: NodeLabelRef[];
  properties: Property[];
};

type RelObjectTypePrefix = 'r';
type RelObjectTypeId = `${RelObjectTypePrefix}:${string}`;
// NOTE There are no references to RelObjectTypeId in the examples, but I assume this is the format they would have
// type RelationshipTypeIdRef = { $ref: `#${RelObjectTypeId}` };
type RelObject = {
  $id: RelObjectTypeId;
  // It would be nice for this to be called relationshipType instead of just type
  // to distinguish it from the type of a property
  type: RelTypeIdRef;
  from: NodeObjectTypeReference;
  to: NodeObjectTypeReference;
  properties: Property[];
};

// NOTE the spec v5 seems to call this "mandatory" rather than "nullable"
// https://gist.github.com/oskarhane/7e40012019803e4109ff955cfd50d34d#file-graph-schema-v5-json
type Property = { type: PropertyType; token: string; nullable: boolean };
type PropertyType =
  | { type: 'array'; items: SimplePropertyType }
  | SimplePropertyType;

type SimplePropertyType = { type: 'string' | 'integer' };
// What other are valid types does the spec contain? All the ones from the cypher docs on property types?
// https://neo4j.com/docs/cypher-manual/current/values-and-types/property-structural-constructed/#_property_types
// if so we should have:
// BOOLEAN, DATE, DURATION, FLOAT, INTEGER, LIST, LOCAL DATETIME, LOCAL TIME, POINT, STRING, ZONED DATETIME, and ZONED TIME.
//
// There are already string representation of types in neo4j, if you run:
// `show functions yield signature, argumentDescription, returnDescription;` you will see things like
// INTEGER? to describe a nullable integer => whereas { type: 'integer', nullable: true } is how the same value would be represented in the schema
// Should we aim to have the same representation for both? If not, I think it would be good to have a clear mapping between the two
// otherwise we can't do proper typechecking with schema + procedure/function signatures
