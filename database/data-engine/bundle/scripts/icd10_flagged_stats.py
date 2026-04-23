import json
from collections import Counter

with open('data/uae-drugs-complete-icd10-mappings.json', encoding='utf-8') as f:
    m = json.load(f)

flagged_drugs = 0
flagged_entries = 0
codes = Counter()

for drug, codes_list in m.items():
    has_flag = False
    for e in codes_list:
        if 'flag' in e and e['flag']:
            flagged_entries += 1
            codes[e['code']] += 1
            has_flag = True
    if has_flag:
        flagged_drugs += 1

print(f"Flagged drugs: {flagged_drugs}")
print(f"Flagged entries: {flagged_entries}")
print("Most common flagged codes:")
for code, count in codes.most_common(10):
    print(f"{code}: {count}")
