# Data Files Documentation

## Source of Truth for Data Files

This document specifies which files are the official source of truth for different data types in the PharmGenius project.

## UAE Drug List CSV

**Source of Truth**: `data/csv/UAE drug list.csv`  
**Original Source**: `database/Drugs 1.csv` (updated November 15, 2025)

This is the authoritative source for UAE drug data. The source file is `database/Drugs 1.csv`, which is copied to `data/csv/UAE drug list.csv` as the official data file used by the application. All other copies are considered outdated or duplicates.

### File Locations

| Location                             | Status                 | Purpose                                      |
| ------------------------------------ | ---------------------- | -------------------------------------------- |
| `data/csv/UAE drug list.csv`         | ✅ **Source of Truth** | Official data file (copied from Drugs 1.csv) |
| `database/Drugs 1.csv`               | ✅ **Original Source** | Updated source file (Nov 15, 2025)           |
| `data/csv/updated uae drug list.csv` | ❌ Removed             | Old version, replaced by Drugs 1.csv         |
| `database/UAE drug list.csv`         | ❌ Removed             | Legacy copy, replaced by Drugs 1.csv         |
| `database/updated uae drug list.csv` | ❌ Removed             | Legacy copy, replaced by Drugs 1.csv         |

### Code References

All code should reference `data/csv/UAE drug list.csv`:

- ✅ `server/server.js` - Updated to use `data/csv/UAE drug list.csv`
- ✅ `server/server-fallback.js` - Updated to use `data/csv/UAE drug list.csv`
- ✅ `scripts/migration/*.js` - Already using `data/csv/UAE drug list.csv`
- ✅ `scripts/data-processing/*.js` - Updated to use `data/csv/UAE drug list.csv`
- ✅ `server/utils/healthMonitor.js` - Already using `data/csv/UAE drug list.csv`
- ✅ `server/startup-check.js` - Already using `data/csv/UAE drug list.csv`

## Other CSV Files

### `database/categories.csv`

**Purpose**: ICD-10 categories data  
**Status**: ✅ Active  
**Used by**: ICD-10 search functionality

### `database/processed_drugs.csv`

**Purpose**: Processed drug data (generated file)  
**Status**: ⚠️ Generated - do not edit manually  
**Used by**: Migration scripts

## JSON Data Files

### ICD-10 Data

- `data/json/icd10-data.json` - Full ICD-10 dataset
- `data/json/icd10-data-enhanced.json` - Enhanced version
- `data/json/icd10-data-fast.json` - Optimized version
- `server/public/icd10-data.json` - Served version (may be copied from data/json)

### Daman Formulary

- `data/json/daman-formulary.json` - Source file
- `server/public/daman-formulary.json` - Served version (may be copied from data/json)

## Maintenance

### Updating UAE Drug List

1. **Update the source file**: `database/Drugs 1.csv` (or import from XLSX)
2. **Copy to source of truth**: After updating `Drugs 1.csv`, copy it to `data/csv/UAE drug list.csv`
3. **All code references** `data/csv/UAE drug list.csv` automatically
4. **Commit both files**: Keep `database/Drugs 1.csv` as the original source

### Adding New Data Files

1. Place source files in `data/csv/` or `data/json/`
2. Document in this file
3. Update any scripts that reference the file
4. Add to `.gitignore` if generated

## Cleanup Recommendations

### Files Status (Updated Nov 15, 2025)

- ✅ `database/Drugs 1.csv` - Original updated source file (6.17MB, 21,887 records)
- ✅ `data/csv/UAE drug list.csv` - Official source of truth (copied from Drugs 1.csv)
- ❌ `data/csv/updated uae drug list.csv` - Removed (replaced by Drugs 1.csv)
- ❌ `database/UAE drug list.csv` - Removed (replaced by Drugs 1.csv)
- ❌ `database/updated uae drug list.csv` - Removed (replaced by Drugs 1.csv)

### Before Removing Legacy Files

1. Verify `data/csv/UAE drug list.csv` is complete and up-to-date
2. Test application with only the source file
3. Check if any scripts specifically reference the legacy files
4. Backup before removal

---

**Last Updated**: Generated during project cleanup  
**Maintainer**: PharmGenius Team
