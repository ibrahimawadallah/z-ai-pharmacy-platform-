import json
from collections import Counter

MAPPING_FILE = 'data/uae-drugs-complete-icd10-mappings.json'

def load_mapping(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)

if __name__ == '__main__':
    mapping = load_mapping(MAPPING_FILE)
    flagged_drugs = 0
    flagged_entries = 0
    codes = Counter()

    for drug, codes_list in mapping.items():
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
    print('\nTop 10 flagged ICD-10 codes:')
    for code, count in codes.most_common(10):
        print(f"  {code}: {count}")
