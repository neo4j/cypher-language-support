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
grammar Optionals;


expression: 
    ruleOne | 
    ruleTwo | 
    ruleThree | 
    ruleFour | 
    ruleFive | 
    ruleSix | 
    ruleSeven |
    ruleEight |
    ruleNine |
    ruleTen |
    ruleEleven |
    ruleTwelve |
    ruleThirteen |
    ruleFourTeen | 
    ruleFifTeen |
    ruleSixteen;

ruleOne: A B;
ruleTwo: C? D;
ruleThree: E F?;
ruleFour: G?? H;
ruleFive: I J??;
ruleSix: K* L;
ruleSeven: M N*;
ruleEight: O+ P;
ruleNine: Q R+;
ruleTen: S*? T;
ruleEleven: U V*?;
ruleTwelve: W+? Y;
ruleThirteen: Z AA+?;
ruleFourTeen: BB (A B)?;
ruleFifTeen: CC (A B);
ruleSixteen: DD (A B)? C;

SPACE: ' ' -> channel(HIDDEN);
A: 'A';
B: 'B';
C: 'C';
D: 'D';
E: 'E';
F: 'F';
G: 'G';
H: 'H';
I: 'I';
J: 'J';
K: 'K';
L: 'L';
M: 'M';
N: 'N';
O: 'O';
P: 'P';
Q: 'Q';
R: 'R';
S: 'S';
T: 'T';
U: 'U';
V: 'V';
W: 'W';
Y: 'Y';
Z: 'Z';
AA: 'AA';
BB: 'BB';
CC: 'CC';
DD: 'DD';
