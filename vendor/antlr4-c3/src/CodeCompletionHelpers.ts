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
import { ATNState } from './antlr4';

export function advanceToNonEpsilon(current: ATNState) {
    const BLOCK_END = current.constructor.BLOCK_END;
    const BLOCK_START = current.constructor.BLOCK_START;
    
    /* 
        i. This represents the case: A? B
              
                ε        ε        B
            n - - -> o - - -> p - - -> q
             \     /^
            ε \   / A (transition)
               \ /
                ˅
                m

        ii. This represents the case: A B?
           
           (transition)
                A        ε    
            n - - -> m - - -> p
                      \     /^
                     ε \   / B
                        \ /
                         ˅
                         o

        iii. This represents the case: (A B)? C
              
                ε        ε        C
            n - - -> p - - -> q - - -> r
            |        ^
          ε |        | B (transition)
            |        |
            ˅ - - - >
            m   A     o
    */

    const transitions = current.transitions;
    let optional = false;

    if (current.stateType === BLOCK_END && transitions.length === 1 && transitions[0].isEpsilon) {
      // Case i.
      const optStartState = (current as any).startState as ATNState;
      const optTransitions = optStartState.transitions;

      if (optStartState.stateType === BLOCK_START && optTransitions.length === 2) {
        const a = optTransitions[0].target;
        const b = optTransitions[1].target;

        if (
          (a.stateType === BLOCK_END && b.transitions.length >= 1 && b.transitions.at(0).target.stateNumber === current.stateNumber) ||
          (b.stateType === BLOCK_END && a.transitions.length >= 1 && a.transitions.at(0).target.stateNumber === current.stateNumber)
        ) {
          current = transitions[0].target;
        }
      }
    } else if (current.stateType === BLOCK_START && transitions.length === 2) {
      // Case ii.
      const a = transitions[0].target;
      const b = transitions[1].target;

      if (a.stateType === BLOCK_END) {
        optional = true;
        current = b;
      } else if (b.stateType === BLOCK_END) {
        optional = true;
        current = a;
      }
    }

    return {
      state: current,
      optional: optional
    }
  }