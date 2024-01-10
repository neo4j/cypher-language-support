import { runSemanticAnalysis } from '@neo4j-cypher/language-support';
import workerpool from 'workerpool';

workerpool.worker({ runSemanticAnalysis });

export type CheckSyntaxFunction = typeof runSemanticAnalysis;
