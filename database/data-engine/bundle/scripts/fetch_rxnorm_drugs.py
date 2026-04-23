import requests
import json
from pathlib import Path
import time

BASE_URL = "https://rxnav.nlm.nih.gov/REST"
DATA_DIR = Path("data")

def search_drugs_by_name(name):
    """Search drugs by name and return RxNorm concepts."""
    url = f"{BASE_URL}/drugs.json?name={name}"
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return response.json()

def get_drug_concepts(rxcui):
    """Get drug concept details by RxCUI."""
    url = f"{BASE_URL}/drugs.json?rxcui={rxcui}"
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return response.json()

def get_drug_info(rxcui):
    """Get detailed drug information."""
    url = f"{BASE_URL}/rxterms.json?rxcui={rxcui}"
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return response.json()

def get_all_drugs_batch(offset=0, limit=100):
    """Get batch of drugs (approximate approach via approximate match)."""
    url = f"{BASE_URL}/approximateTerm.json?term=*&maxEntries={limit}&offset={offset}"
    response = requests.get(url, timeout=60)
    response.raise_for_status()
    return response.json()

def search_approximate(term, max_entries=100):
    """Approximate term search for finding drugs."""
    url = f"{BASE_URL}/approximateTerm.json?term={term}&maxEntries={max_entries}"
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return response.json()

def get_drug_by_rxcui(rxcui):
    """Get drug properties by RxCUI."""
    url = f"{BASE_URL}/rxcui/{rxcui}/properties.json"
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return response.json()

def extract_drug_data(search_term):
    """Extract drug data for a search term."""
    result = search_drugs_by_name(search_term)

    drugs = []
    if 'drugGroup' in result:
        drug_group = result['drugGroup']
        drug_name = drug_group.get('name', '')

        for concept_group in drug_group.get('conceptGroup', []):
            concept_properties = concept_group.get('conceptProperties', [])
            if isinstance(concept_properties, list):
                for prop in concept_properties:
                    drugs.append({
                        'name': prop.get('name', ''),
                        'rxcui': prop.get('rxcui', ''),
                        'synonym': prop.get('synonym', ''),
                        'tty': concept_group.get('tty', ''),
                        'language': prop.get('language', ''),
                        'suppress': prop.get('suppress', '')
                    })

    return drugs

def extract_from_approximate(search_term, max_entries=100):
    """Extract drugs using approximate term search."""
    result = search_approximate(search_term, max_entries)

    drugs = []
    if 'approximateGroup' in result:
        candidates = result['approximateGroup'].get('candidate', [])
        if isinstance(candidates, list):
            for cand in candidates:
                drugs.append({
                    'name': cand.get('name', ''),
                    'rxcui': cand.get('rxcui', ''),
                    'score': cand.get('score', ''),
                    'name': cand.get('name', '')
                })

    return drugs

def fetch_drug_details(rxcui):
    """Fetch detailed info for a drug."""
    result = get_drug_info(rxcui)

    if 'rxtermsGroup' in result:
        group = result['rxtermsGroup']
        if 'rxtermsConcept' in group:
            concept = group['rxtermsConcept']
            return {
                'rxcui': concept.get('rxcui', ''),
                'name': concept.get('name', ''),
                'synonym': concept.get('synonym', ''),
                'tty': concept.get('tty', ''),
                'baseNames': concept.get('baseNames', ''),
                'fullSynonyms': concept.get('fullSynonyms', ''),
                'displayName': concept.get('displayName', '')
            }

    return None

def search_and_enrich(search_term):
    """Search for drugs and enrich with details."""
    drugs = extract_drug_data(search_term)
    print(f"Found {len(drugs)} drugs")
    for drug in drugs[:10]:
        print(f"  - {drug.get('name')} ({drug.get('rxcui')}) [{drug.get('tty')}]")
    return drugs

def save_drugs(drugs, filename="dailymed_drugs.json"):
    """Save drugs to JSON file."""
    DATA_DIR.mkdir(exist_ok=True)
    output_path = DATA_DIR / filename

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(drugs, f, indent=2, ensure_ascii=False)

    print(f"Saved {len(drugs)} drugs to {output_path}")
    return output_path

def load_drugs(filename="dailymed_drugs.json"):
    """Load drugs from JSON file."""
    output_path = DATA_DIR / filename

    with open(output_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def main():
    import argparse

    parser = argparse.ArgumentParser(description="RxNorm Drug Data Fetcher")
    parser.add_argument('--search', type=str, help='Search for drug by name')
    parser.add_argument('--enrich', type=str, help='Search and fetch detailed info')
    parser.add_argument('--load', action='store_true', help='Load cached data')
    parser.add_argument('--output', type=str, default='dailymed_drugs.json', help='Output filename')

    args = parser.parse_args()

    if args.search:
        print(f"Searching for '{args.search}'...")
        drugs = extract_drug_data(args.search)
        print(f"Found {len(drugs)} drugs")
        for drug in drugs[:10]:
            print(f"  - {drug.get('name')} ({drug.get('rxcui')})")
        save_drugs(drugs, args.output)

    elif args.enrich:
        print(f"Searching and enriching '{args.enrich}'...")
        drugs = search_and_enrich(args.enrich)
        print(f"Found {len(drugs)} drugs")
        save_drugs(drugs, args.output)

    elif args.load:
        drugs = load_drugs(args.output)
        print(f"Loaded {len(drugs)} drugs")

    else:
        print("RxNorm Drug Data Fetcher")
        print("Usage:")
        print("  --search <term>  Search for drugs by name")
        print("  --enrich <term>  Search and fetch detailed info")
        print("  --load           Load cached data")
        print("\nExamples:")
        print("  python fetch_rxnorm_drugs.py --search aspirin")
        print("  python fetch_rxnorm_drugs.py --enrich metformin")

if __name__ == '__main__':
    main()