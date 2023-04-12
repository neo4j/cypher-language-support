lexer grammar CypherLexer;

SPACE
   : (' ' | '\t' | '\n' | '\r') -> channel (HIDDEN)
   ;

SINGLE_LINE_COMMENT
   : '//' (~ [\n\r])* (('\n' | '\r' | '\r\n'))? -> channel (HIDDEN)
   ;

MORE0
   : '/**' ~ [/] -> more , mode (IN_FORMAL_COMMENT)
   ;

MORE1
   : '/*' -> more , mode (IN_MULTI_LINE_COMMENT)
   ;

DECIMAL_DOUBLE
   : ([0-9] (INTEGER_PART)* ('_')? '.' (INTEGER_PART)+ (DECIMAL_EXPONENT)? (IDENTIFIER)? | '.' (INTEGER_PART)+ (DECIMAL_EXPONENT)? (IDENTIFIER)? | [0-9] (INTEGER_PART)* DECIMAL_EXPONENT (IDENTIFIER)?)
   ;

UNSIGNED_DECIMAL_INTEGER
   : ([1-9] (INTEGER_PART)* (PART_LETTER)* | '0')
   ;

fragment DECIMAL_EXPONENT
   : [eE] ([+\-])? (INTEGER_PART)+ (PART_LETTER)*
   ;

fragment INTEGER_PART
   : ('_')? [0-9]
   ;

UNSIGNED_HEX_INTEGER
   : '0' [xX] (PART_LETTER)*
   ;

UNSIGNED_OCTAL_INTEGER
   : '0' ('o')? (PART_LETTER)*
   ;

STRING1_OPEN
   : '\'' -> more , mode (STRING1)
   ;

STRING2_OPEN
   : '"' -> more , mode (STRING2)
   ;

ESCAPED_SYMBOLIC_NAME_OPEN
   : '`' -> more , mode (ESC_SYMB_NAME)
   ;

ACCESS
   : A C C E S S
   ;

ACTIVE
   : A C T I V E
   ;

ADMIN
   : A D M I N
   ;

ADMINISTRATOR
   : A D M I N I S T R A T O R
   ;

ALIAS
   : A L I A S
   ;

ALIASES
   : A L I A S E S
   ;

ALL_SHORTEST_PATH
   : A L L S H O R T E S T P A T H S
   ;

ALL
   : A L L
   ;

ALTER
   : A L T E R
   ;

AND
   : A N D
   ;

ANY
   : A N Y
   ;

AS
   : A S
   ;

ASC
   : A S C (E N D I N G)?
   ;

ASSERT
   : A S S E R T
   ;

ASSIGN
   : A S S I G N
   ;

AT
   : A T
   ;

BAR
   : '|'
   ;

BOOSTED
   : B O O S T E D
   ;

BREAK
   : B R E A K
   ;

BRIEF
   : B R I E F
   ;

BTREE
   : B T R E E
   ;

BUILT
   : B U I L T
   ;

BY
   : B Y
   ;

CALL
   : C A L L
   ;

CASE
   : C A S E
   ;

CHANGE
   : C H A N G E
   ;

COLON
   : ':'
   ;

COMMA
   : ','
   ;

COMMAND
   : C O M M A N D
   ;

COMMANDS
   : C O M M A N D S
   ;

COMMIT
   : C O M M I T
   ;

COMPOSITE
   : C O M P O S I T E
   ;

CONSTRAINT
   : C O N S T R A I N T
   ;

CONSTRAINTS
   : C O N S T R A I N T S
   ;

CONTAINS
   : C O N T A I N S
   ;

COPY
   : C O P Y
   ;

CONTINUE
   : C O N T I N U E
   ;

COUNT
   : C O U N T
   ;

CREATE
   : C R E A T E
   ;

CSV
   : C S V
   ;

CURRENT
   : C U R R E N T
   ;

DATA
   : D A T A
   ;

DATABASE
   : D A T A B A S E
   ;

DATABASES
   : D A T A B A S E S
   ;

DBMS
   : D B M S
   ;

DEALLOCATE
   : D E A L L O C A T E
   ;

DEFAULT_TOKEN
   : D E F A U L T
   ;

DEFINED
   : D E F I N E D
   ;

DELETE
   : D E L E T E
   ;

DENY
   : D E N Y
   ;

DESC
   : D E S C (E N D I N G)?
   ;

DESTROY
   : D E S T R O Y
   ;

DETACH
   : D E T A C H
   ;

DOLLAR
   : '$'
   ;

DISTINCT
   : D I S T I N C T
   ;

DIVIDE
   : '/'
   ;

DOT
   : '.'
   ;

DOTDOT
   : '..'
   ;

DRIVER
   : D R I V E R
   ;

DROP
   : D R O P
   ;

DRYRUN
   : D R Y R U N
   ;

DUMP
   : D U M P
   ;

EACH
   : E A C H
   ;

ENABLE
   : E N A B L E
   ;

ELEMENT
   : E L E M E N T
   ;

ELEMENTS
   : E L E M E N T S
   ;

ELSE
   : E L S E
   ;

ENCRYPTED
   : E N C R Y P T E D
   ;

END
   : E N D
   ;

ENDS
   : E N D S
   ;

EQ
   : '='
   ;

EXECUTABLE
   : E X E C U T A B L E
   ;

EXECUTE
   : E X E C U T E
   ;

EXIST
   : E X I S T
   ;

EXISTENCE
   : E X I S T E N C E
   ;

EXISTS
   : E X I S T S
   ;

ERROR
   : E R R O R
   ;

FAIL
   : F A I L
   ;

FALSE
   : F A L S E
   ;

FIELDTERMINATOR
   : F I E L D T E R M I N A T O R
   ;

FOR
   : F O R
   ;

FOREACH
   : F O R E A C H
   ;

FROM
   : F R O M
   ;

FULLTEXT
   : F U L L T E X T
   ;

FUNCTION
   : F U N C T I O N
   ;

FUNCTIONS
   : F U N C T I O N S
   ;

GE
   : '>='
   ;

GRANT
   : G R A N T
   ;

GRAPH
   : G R A P H
   ;

GRAPHS
   : G R A P H S
   ;

GT
   : '>'
   ;

HEADERS
   : H E A D E R S
   ;

HOME
   : H O M E
   ;

IF
   : I F
   ;

IMPERSONATE
   : I M P E R S O N A T E
   ;

IMMUTABLE
   : I M M U T A B L E
   ;

IN
   : I N
   ;

INDEX
   : I N D E X
   ;

INDEXES
   : I N D E X E S
   ;

INF
   : I N F
   ;

INFINITY
   : I N F I N I T Y
   ;

IS
   : I S
   ;

JOIN
   : J O I N
   ;

KEY
   : K E Y
   ;

LABEL
   : L A B E L
   ;

LABELS
   : L A B E L S
   ;

AMPERSAND
   : '&'
   ;

EXCLAMATION_MARK
   : '!'
   ;

LBRACKET
   : '['
   ;

LCURLY
   : '{'
   ;

LE
   : '<='
   ;

LIMITROWS
   : L I M I T
   ;

LOAD
   : L O A D
   ;

LOOKUP
   : L O O K U P
   ;

LPAREN
   : '('
   ;

LT
   : '<'
   ;

MANAGEMENT
   : M A N A G E M E N T
   ;

MATCH
   : M A T C H
   ;

MERGE
   : M E R G E
   ;

MINUS
   : '-'
   ;

PERCENT
   : '%'
   ;

NEQ
   : '!='
   ;

NEQ2
   : '<>'
   ;

NAME
   : N A M E
   ;

NAMES
   : N A M E S
   ;

NAN
   : N A N
   ;

NEW
   : N E W
   ;

NODE
   : N O D E
   ;

NODES
   : N O D E S
   ;

NONE
   : N O N E
   ;

NOT
   : N O T
   ;

NOWAIT
   : N O W A I T
   ;

NULL
   : N U L L
   ;

OF
   : O F
   ;

ON
   : O N
   ;

ONLY
   : O N L Y
   ;

OPTIONAL
   : O P T I O N A L
   ;

OPTIONS
   : O P T I O N S
   ;

OPTION
   : O P T I O N
   ;

OR
   : O R
   ;

ORDER
   : O R D E R
   ;

OUTPUT
   : O U T P U T
   ;

PASSWORD
   : P A S S W O R D
   ;

PASSWORDS
   : P A S S W O R D S
   ;

PERIODIC
   : P E R I O D I C
   ;

PLAINTEXT
   : P L A I N T E X T
   ;

PLUS
   : '+'
   ;

PLUSEQUAL
   : '+='
   ;

POINT
   : P O I N T
   ;

POPULATED
   : P O P U L A T E D
   ;

POW
   : '^'
   ;

PRIMARY
   : P R I M A R Y
   ;

PRIMARIES
   : P R I M A R I E S
   ;

PRIVILEGE
   : P R I V I L E G E
   ;

PRIVILEGES
   : P R I V I L E G E S
   ;

PROCEDURE
   : P R O C E D U R E
   ;

PROCEDURES
   : P R O C E D U R E S
   ;

PROPERTIES
   : P R O P E R T I E S
   ;

PROPERTY
   : P R O P E R T Y
   ;

QUESTION
   : '?'
   ;

RANGE
   : R A N G E
   ;

RBRACKET
   : ']'
   ;

RCURLY
   : '}'
   ;

READ
   : R E A D
   ;

REALLOCATE
   : R E A L L O C A T E
   ;

REDUCE
   : R E D U C E
   ;

RENAME
   : R E N A M E
   ;

REGEQ
   : '=~'
   ;

REL
   : R E L
   ;

RELATIONSHIP
   : R E L A T I O N S H I P
   ;

RELATIONSHIPS
   : R E L A T I O N S H I P S
   ;

REMOVE
   : R E M O V E
   ;

REPLACE
   : R E P L A C E
   ;

REPORT
   : R E P O R T
   ;

REQUIRE
   : R E Q U I R E
   ;

REQUIRED
   : R E Q U I R E D
   ;

RETURN
   : R E T U R N
   ;

REVOKE
   : R E V O K E
   ;

ROLE
   : R O L E
   ;

ROLES
   : R O L E S
   ;

ROW
   : R O W
   ;

ROWS
   : R O W S
   ;

RPAREN
   : ')'
   ;

SCAN
   : S C A N
   ;

SEC
   : S E C
   ;

SECOND
   : S E C O N D
   ;

SECONDARY
   : S E C O N D A R Y
   ;

SECONDARIES
   : S E C O N D A R I E S
   ;

SECONDS
   : S E C O N D S
   ;

SEEK
   : S E E K
   ;

SEMICOLON
   : ';'
   ;

SERVER
   : S E R V E R
   ;

SERVERS
   : S E R V E R S
   ;

SET
   : S E T
   ;

SETTING
   : S E T T I N G
   ;

SETTINGS
   : S E T T I N G S
   ;

SHORTEST_PATH
   : S H O R T E S T P A T H
   ;

SHOW
   : S H O W
   ;

SINGLE
   : S I N G L E
   ;

SKIPROWS
   : S K I P
   ;

START
   : S T A R T
   ;

STARTS
   : S T A R T S
   ;

STATUS
   : S T A T U S
   ;

STOP
   : S T O P
   ;

SUSPENDED
   : S U S P E N D E D
   ;

TARGET
   : T A R G E T
   ;

TERMINATE
   : T E R M I N A T E
   ;

TEXT
   : T E X T
   ;

THEN
   : T H E N
   ;

TIMES
   : '*'
   ;

TO
   : T O
   ;

TOPOLOGY
   : T O P O L O G Y
   ;

TRANSACTION
   : T R A N S A C T I O N
   ;

TRANSACTIONS
   : T R A N S A C T I O N S
   ;

TRAVERSE
   : T R A V E R S E
   ;

TRUE
   : T R U E
   ;

TYPE
   : T Y P E
   ;

TYPES
   : T Y P E S
   ;

UNION
   : U N I O N
   ;

UNIQUE
   : U N I Q U E
   ;

UNIQUENESS
   : U N I Q U E N E S S
   ;

UNWIND
   : U N W I N D
   ;

USE
   : U S E
   ;

USER
   : U S E R
   ;

USERS
   : U S E R S
   ;

USING
   : U S I N G
   ;

VERBOSE
   : V E R B O S E
   ;

WAIT
   : W A I T
   ;

WHEN
   : W H E N
   ;

WHERE
   : W H E R E
   ;

WITH
   : W I T H
   ;

WRITE
   : W R I T E
   ;

XOR
   : X O R
   ;

YIELD
   : Y I E L D
   ;

IDENTIFIER
   : LETTER (PART_LETTER)*
   ;

fragment LETTER
   : [A-Z_a-zªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶ-ͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮ-ٯٱ-ۓەۥ-ۦۮ-ۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴ-ߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࢠ-ࢴࢶ-ࣇऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএ-ঐও-নপ-রলশ-হঽৎড়-ঢ়য়-ৡৰ-ৱৼਅ-ਊਏ-ਐਓ-ਨਪ-ਰਲ-ਲ਼ਵ-ਸ਼ਸ-ਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલ-ળવ-હઽૐૠ-ૡૹଅ-ଌଏ-ଐଓ-ନପ-ରଲ-ଳଵ-ହଽଡ଼-ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚౠ-ౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠ-ೡೱ-ೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะา-ำเ-ๆກ-ຂຄຆ-ຊຌ-ຣລວ-ະາ-ຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥ-ၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢄᢇ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮ-ᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲈᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵ-ᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼ‿-⁀⁔ⁱⁿₐ-ₜℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲ-ⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⸯ々-〇〡-〩〱-〵〸-〼ぁ-ゖゝ-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-鿼ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪ-ꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꞿꟂ-ꟊꟵ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽ-ꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵ-ꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּ-סּףּ-פּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻ︳-︴﹍-﹏ﹰ-ﹴﹶ-ﻼＡ-Ｚ＿ａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ]
   ;

fragment PART_LETTER
   : [ --$0-9A-Z_a-z-¢-¥ª\u00ADµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮ̀-ʹͶ-ͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁ҃-҇Ҋ-ԯԱ-Ֆՙՠ-ֈ֏֑-ֽֿׁ-ׂׄ-ׇׅא-תׯ-ײ؀-؅؋ؐ-ؚ\u061Cؠ-٩ٮ-ۓە-۝۟-۪ۨ-ۼۿ܏-݊ݍ-ޱ߀-ߵߺ߽-࠭ࡀ-࡛ࡠ-ࡪࢠ-ࢴࢶ-ࣇ࣓-ॣ०-९ॱ-ঃঅ-ঌএ-ঐও-নপ-রলশ-হ়-ৄে-ৈো-ৎৗড়-ঢ়য়-ৣ০-৳৻-ৼ৾ਁ-ਃਅ-ਊਏ-ਐਓ-ਨਪ-ਰਲ-ਲ਼ਵ-ਸ਼ਸ-ਹ਼ਾ-ੂੇ-ੈੋ-੍ੑਖ਼-ੜਫ਼੦-ੵઁ-ઃઅ-ઍએ-ઑઓ-નપ-રલ-ળવ-હ઼-ૅે-ૉો-્ૐૠ-ૣ૦-૯૱ૹ-૿ଁ-ଃଅ-ଌଏ-ଐଓ-ନପ-ରଲ-ଳଵ-ହ଼-ୄେ-ୈୋ-୍୕-ୗଡ଼-ଢ଼ୟ-ୣ୦-୯ୱஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹா-ூெ-ைொ-்ௐௗ௦-௯௹ఀ-ఌఎ-ఐఒ-నప-హఽ-ౄె-ైొ-్ౕ-ౖౘ-ౚౠ-ౣ౦-౯ಀ-ಃಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹ಼-ೄೆ-ೈೊ-್ೕ-ೖೞೠ-ೣ೦-೯ೱ-ೲഀ-ഌഎ-ഐഒ-ൄെ-ൈൊ-ൎൔ-ൗൟ-ൣ൦-൯ൺ-ൿඁ-ඃඅ-ඖක-නඳ-රලව-ෆ්ා-ුූෘ-ෟ෦-෯ෲ-ෳก-ฺ฿-๎๐-๙ກ-ຂຄຆ-ຊຌ-ຣລວ-ຽເ-ໄໆ່-ໍ໐-໙ໜ-ໟༀ༘-༙༠-༩༹༵༷༾-ཇཉ-ཬཱ-྄྆-ྗྙ-ྼ࿆က-၉ၐ-ႝႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚ፝-፟ᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜌᜎ-᜔ᜠ-᜴ᝀ-ᝓᝠ-ᝬᝮ-ᝰᝲ-ᝳក-៓ៗ៛-៝០-៩᠋-᠎᠐-᠙ᠠ-ᡸᢀ-ᢪᢰ-ᣵᤀ-ᤞᤠ-ᤫᤰ-᤻᥆-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉ᧐-᧙ᨀ-ᨛᨠ-ᩞ᩠-᩿᩼-᪉᪐-᪙ᪧ᪰-᪽ᪿ-ᫀᬀ-ᭋ᭐-᭙᭫-᭳ᮀ-᯳ᰀ-᰷᱀-᱉ᱍ-ᱽᲀ-ᲈᲐ-ᲺᲽ-Ჿ᳐-᳔᳒-ᳺᴀ-᷹᷻-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼ​-‏‪-‮‿-⁀⁔⁠-⁤⁦-⁯ⁱⁿₐ-ₜ₠-₿⃐-⃥⃜⃡-⃰ℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯ⵿-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⷠ-ⷿⸯ々-〇〡-〯〱-〵〸-〼ぁ-ゖ゙-゚ゝ-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-鿼ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘫꙀ-꙯ꙴ-꙽ꙿ-꛱ꜗ-ꜟꜢ-ꞈꞋ-ꞿꟂ-ꟊꟵ-ꠧ꠬꠸ꡀ-ꡳꢀ-ꣅ꣐-꣙꣠-ꣷꣻꣽ-꤭ꤰ-꥓ꥠ-ꥼꦀ-꧀ꧏ-꧙ꧠ-ꧾꨀ-ꨶꩀ-ꩍ꩐-꩙ꩠ-ꩶꩺ-ꫂꫛ-ꫝꫠ-ꫯꫲ-꫶ꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯪ꯬-꯭꯰-꯹가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִ-ﬨשׁ-זּטּ-לּמּנּ-סּףּ-פּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-﷼︀-️︠-︯︳-︴﹍-﹏﹩ﹰ-ﹴﹶ-ﻼ\uFEFF＄０-９Ａ-Ｚ＿ａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ￠-￡￥-￦￹-￻]
   ;

ARROW_LINE
   : [\-\u00AD‐‑‒–—―﹘﹣－]
   ;

ARROW_LEFT_HEAD
   : [⟨〈﹤＜]
   ;

ARROW_RIGHT_HEAD
   : [⟩〉﹥＞]
   ;

fragment A
   : [aA]
   ;

fragment B
   : [bB]
   ;

fragment C
   : [cC]
   ;

fragment D
   : [dD]
   ;

fragment E
   : [eE]
   ;

fragment F
   : [fF]
   ;

fragment G
   : [gG]
   ;

fragment H
   : [hH]
   ;

fragment I
   : [iI]
   ;

fragment J
   : [jJ]
   ;

fragment K
   : [kK]
   ;

fragment L
   : [lL]
   ;

fragment M
   : [mM]
   ;

fragment N
   : [nN]
   ;

fragment O
   : [oO]
   ;

fragment P
   : [pP]
   ;

fragment Q
   : [qQ]
   ;

fragment R
   : [rR]
   ;

fragment S
   : [sS]
   ;

fragment T
   : [tT]
   ;

fragment U
   : [uU]
   ;

fragment V
   : [vV]
   ;

fragment W
   : [wW]
   ;

fragment X
   : [xX]
   ;

fragment Y
   : [yY]
   ;

fragment Z
   : [zZ]
   ;

mode IN_FORMAL_COMMENT;
FORMAL_COMMENT
   : '*/' -> channel (HIDDEN) , mode (DEFAULT_MODE)
   ;

MORE2
   : . -> more
   ;

mode STRING1;
MORE3
   : '\\\\' -> more
   ;

MORE4
   : '\\\'' -> more
   ;

MORE5
   : '\\"' -> more
   ;

MORE6
   : '\\b' -> more
   ;

MORE7
   : '\\f' -> more
   ;

MORE8
   : '\\n' -> more
   ;

MORE9
   : '\\r' -> more
   ;

MORE10
   : '\\t' -> more
   ;

MORE11
   : '\\u[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]' -> more
   ;

MORE12
   : ~ ['] -> more
   ;

STRING_LITERAL1
   : '\'' -> mode (DEFAULT_MODE)
   ;

mode STRING2;
MORE13
   : '\\\\' -> more
   ;

MORE14
   : '\\\'' -> more
   ;

MORE15
   : '\\"' -> more
   ;

MORE16
   : '\\b' -> more
   ;

MORE17
   : '\\f' -> more
   ;

MORE18
   : '\\n' -> more
   ;

MORE19
   : '\\r' -> more
   ;

MORE20
   : '\\t' -> more
   ;

MORE21
   : '\\u[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]' -> more
   ;

MORE22
   : ~ ["] -> more
   ;

STRING_LITERAL2
   : '"' -> mode (DEFAULT_MODE)
   ;

mode IN_MULTI_LINE_COMMENT;
MULTI_LINE_COMMENT
   : '*/' -> channel (HIDDEN) , mode (DEFAULT_MODE)
   ;

IN_MULTI_LINE_COMMENT_MORE2
   : MORE2 -> more
   ;

mode ESC_SYMB_NAME;
MORE23
   : ~ [`] -> more
   ;

MORE24
   : '``' -> more
   ;

ESCAPED_SYMBOLIC_NAME
   : '`' -> mode (DEFAULT_MODE)
   ;

mode IN_SINGLE_LINE_COMMENT;
IN_SINGLE_LINE_COMMENT_MORE2
   : MORE2 -> more
   ;

