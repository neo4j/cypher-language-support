import re
import sys

def rename_antlr_rules(grammar: str) -> str:
    # Regex pattern to match rule definitions in ANTLR4 grammar
    rule_definition_pattern = re.compile(r"(?m)^(?P<rule_name>[a-zA-Z_][a-zA-Z_0-9]*)\s*:")
    
    # Collect all rule names
    rule_names = rule_definition_pattern.findall(grammar)
    
    # Create a mapping of old rule names to new rule names with '_Cypher_5'
    rule_rename_map = {rule: f"{rule}_Cypher25" for rule in rule_names}
    
    # Replace all rule definitions with the renamed ones
    def append_suffix(match):
        rule_name = match.group('rule_name')
        return f"{rule_rename_map[rule_name]}:"
    
    renamed_grammar = rule_definition_pattern.sub(append_suffix, grammar)
    
    # Replace rule references within other rules
    for original_rule, renamed_rule in rule_rename_map.items():
        renamed_grammar = re.sub(rf'\b{original_rule}\b', renamed_rule, renamed_grammar)
    
    return renamed_grammar

# Example usage
input_grammar = sys.stdin.read()

renamed_grammar = rename_antlr_rules(input_grammar)
print(renamed_grammar)