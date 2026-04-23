import pandas as pd

# Path to the UAE drug list CSV
INPUT_FILE = 'data/csv/UAE drug list.csv'
OUTPUT_FILE = 'drug_to_icd10.csv'

def preprocess_uae_drug_list():
    # Read the UAE drug list
    df = pd.read_csv(INPUT_FILE)
    # Extract relevant columns
    # Use Generic Name as drug_name, and combine Generic Name, Strength, Dosage Form for description
    df['drug_name'] = df['Generic Name']
    df['description'] = df['Generic Name'].astype(str) + ', ' + df['Strength'].astype(str) + ', ' + df['Dosage Form'].astype(str)
    # If you have ICD-10 codes, add them here. Otherwise, leave blank
    df['current_icd10_codes'] = ''
    # Select only the required columns
    out_df = df[['drug_name', 'description', 'current_icd10_codes']]
    out_df.to_csv(OUTPUT_FILE, index=False)
    print(f"Preprocessed file saved as {OUTPUT_FILE}")

if __name__ == '__main__':
    preprocess_uae_drug_list()
