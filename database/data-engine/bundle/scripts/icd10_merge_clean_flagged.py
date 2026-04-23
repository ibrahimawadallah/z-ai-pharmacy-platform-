import json

# Load clean and flagged mappings
with open('data/uae-drugs-complete-icd10-mappings-clean.json', encoding='utf-8') as f:
    clean = json.load(f)
with open('data/uae-drugs-complete-icd10-mappings-flagged.json', encoding='utf-8') as f:
    flagged = json.load(f)

# Merge: flagged drugs take precedence if also in clean
merged = clean.copy()
merged.update(flagged)

with open('data/uae-drugs-complete-icd10-mappings-merged.json', 'w', encoding='utf-8') as f:
    json.dump(merged, f, ensure_ascii=False, indent=2)

print(f"Merged mapping written: {len(merged)} drugs.")
