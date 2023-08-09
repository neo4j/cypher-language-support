/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  CharStreams,
  CommonTokenStream,
} from 'antlr4';
import { CodeCompletionCore } from '../src/CodeCompletionCore';
import OptionalsLexer from './generated/OptionalsLexer';
import OptionalsParser from './generated/OptionalsParser';

describe('Code Completion Tests for optionals', () => {

  it('Non optional token token followed by non optional token', () => {
    const query = '';
    const inputStream = CharStreams.fromString(query);
    const lexer = new OptionalsLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);

    const parser = new OptionalsParser(tokenStream);
    parser.removeErrorListeners();
    parser.expression();

    const core = new CodeCompletionCore(parser);

    const candidates= core.collectCandidates(tokenStream.size);
    expect(candidates.tokens.get(OptionalsLexer.A)).toEqual({
      optional: false, 
      indexes: [OptionalsLexer.B]
    });
  });

  it('Optional token followed by non optional token', () => {
    const query = '';
    const inputStream = CharStreams.fromString(query);
    const lexer = new OptionalsLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);

    const parser = new OptionalsParser(tokenStream);
    parser.removeErrorListeners();
    parser.expression();

    const core = new CodeCompletionCore(parser);

    const candidates= core.collectCandidates(tokenStream.size);
    expect(candidates.tokens.get(OptionalsLexer.C)).toEqual({
      optional: false, 
      indexes: [OptionalsLexer.D]
    });
    expect(candidates.tokens.get(OptionalsLexer.D)).toEqual({
      optional: false,
      indexes: []
    });
    expect(candidates.tokens.get(OptionalsLexer.G)).toEqual({
      optional: false, 
      indexes: [OptionalsLexer.H]
    });
    expect(candidates.tokens.get(OptionalsLexer.H)).toEqual({
      optional: false, 
      indexes: []
    });
  });

  it('Non optional token followed by optional token', () => {
    const query = '';
    const inputStream = CharStreams.fromString(query);
    const lexer = new OptionalsLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);

    const parser = new OptionalsParser(tokenStream);
    parser.removeErrorListeners();
    parser.expression();

    const core = new CodeCompletionCore(parser);

    const candidates= core.collectCandidates(tokenStream.size);
    // Becuase we have UNION ALL? in the grammar and we want to be offering both UNION and UNION ALL
    expect(candidates.tokens.get(OptionalsLexer.E)).toEqual({
      optional: true,
      indexes: [OptionalsLexer.F]
    });
    expect(candidates.tokens.get(OptionalsLexer.I)).toEqual({
      optional: true,
      indexes: [OptionalsLexer.J]
    });

  });

  it('Closure followed by non optional token', () => {
    const query = '';
    const inputStream = CharStreams.fromString(query);
    const lexer = new OptionalsLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);

    const parser = new OptionalsParser(tokenStream);
    parser.removeErrorListeners();
    parser.expression();

    const core = new CodeCompletionCore(parser);

    const candidates= core.collectCandidates(tokenStream.size);
    expect(candidates.tokens.get(OptionalsLexer.K)).toEqual({
      optional: false, 
      indexes: []
    });
    expect(candidates.tokens.get(OptionalsLexer.L)).toEqual({
      optional: false, 
      indexes: []
    });
    expect(candidates.tokens.get(OptionalsLexer.O)).toEqual({
      optional: false, 
      indexes: []
    });
    expect(candidates.tokens.get(OptionalsLexer.S)).toEqual({
      optional: false, 
      indexes: []
    });
    expect(candidates.tokens.get(OptionalsLexer.T)).toEqual({
      optional: false, 
      indexes: []
    });
    expect(candidates.tokens.get(OptionalsLexer.W)).toEqual({
      optional: false, 
      indexes: []
    });

    expect(!candidates.tokens.has(OptionalsLexer.P));
    expect(!candidates.tokens.has(OptionalsLexer.Y));
  });

  it('Non optional token followed by closure', () => {
    const query = '';
    const inputStream = CharStreams.fromString(query);
    const lexer = new OptionalsLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);

    const parser = new OptionalsParser(tokenStream);
    parser.removeErrorListeners();
    parser.expression();

    const core = new CodeCompletionCore(parser);

    const candidates= core.collectCandidates(tokenStream.size);
    expect(candidates.tokens.get(OptionalsLexer.M)).toEqual({
      optional: false, 
      indexes: []
    });
    expect(candidates.tokens.get(OptionalsLexer.Q)).toEqual({
      optional: false, 
      indexes: []
    });
    expect(candidates.tokens.get(OptionalsLexer.U)).toEqual({
      optional: false, 
      indexes: []
    });
    expect(candidates.tokens.get(OptionalsLexer.Z)).toEqual({
      optional: false, 
      indexes: []
    });
  });

  it('Non optional token followed by closure', () => {
    const query = '';
    const inputStream = CharStreams.fromString(query);
    const lexer = new OptionalsLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);

    const parser = new OptionalsParser(tokenStream);
    parser.removeErrorListeners();
    parser.expression();

    const core = new CodeCompletionCore(parser);

    const candidates= core.collectCandidates(tokenStream.size);
    expect(candidates.tokens.get(OptionalsLexer.M)).toEqual({
      optional: false, 
      indexes: []
    });
    expect(candidates.tokens.get(OptionalsLexer.Q)).toEqual({
      optional: false, 
      indexes: []
    });
    expect(candidates.tokens.get(OptionalsLexer.U)).toEqual({
      optional: false, 
      indexes: []
    });
    expect(candidates.tokens.get(OptionalsLexer.Z)).toEqual({
      optional: false, 
      indexes: []
    });
  });

  it('Non optionals followed by compound optionals', () => {
    const query = '';
    const inputStream = CharStreams.fromString(query);
    const lexer = new OptionalsLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);

    const parser = new OptionalsParser(tokenStream);
    parser.removeErrorListeners();
    parser.expression();

    const core = new CodeCompletionCore(parser);

    const candidates= core.collectCandidates(tokenStream.size);
    expect(candidates.tokens.get(OptionalsLexer.BB)).toEqual({
      optional: true, 
      indexes: [OptionalsLexer.A, OptionalsLexer.B]
    });
    expect(candidates.tokens.get(OptionalsLexer.CC)).toEqual({
      optional: false, 
      indexes: [OptionalsLexer.A, OptionalsLexer.B]
    });
  });

  it('Compound optional followed by non optional', () => {
    const query = 'DD A ';
    const inputStream = CharStreams.fromString(query);
    const lexer = new OptionalsLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);

    const parser = new OptionalsParser(tokenStream);
    parser.removeErrorListeners();
    parser.expression();

    const core = new CodeCompletionCore(parser);

    const candidates= core.collectCandidates(tokenStream.size);
    expect(candidates.tokens.get(OptionalsLexer.B)).toEqual({
      optional: false, 
      indexes: []
    });
  });
});
