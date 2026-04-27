# Data Update Schedule Configuration

## Overview
This document describes the automated data update system for ICD-10 mappings from multiple authoritative sources.

## Update Schedule

### Recommended Schedule: Quarterly (Every 3 Months)
- **Frequency**: Run on the first day of each quarter (Jan 1, Apr 1, Jul 1, Oct 1)
- **Time**: 2:00 AM UTC (to minimize impact on users)
- **Duration**: ~30-45 minutes depending on data volume

## Available Scripts

### Individual Import Scripts
```bash
# FDA SPL Import (100 drugs at a time)
npm run data:import:fda

# WHO ATC Import (500 drugs at a time)  
npm run data:import:who

# DailyMed Import (TIER_1 source, processes all drugs)
npm run data:import:dailymed

# RxNorm Import (50 drugs at a time due to API limits)
npm run data:import:rxnorm
```

### Combined Update Script
```bash
# Run all imports in sequence
npm run data:update:all
```

## Cron Job Configuration

### Linux/Mac (crontab)
```bash
# Edit crontab
crontab -e

# Add this line for quarterly updates (Jan 1, Apr 1, Jul 1, Oct 1 at 2:00 AM UTC)
0 2 1 1,4,7,10 * cd /path/to/project && npm run data:update:all >> /var/log/drugeye-updates.log 2>&1
```

### Windows (Task Scheduler)
1. Open Task Scheduler
2. Create Basic Task: "DrugEye Data Updates"
3. Trigger: Quarterly (January, April, July, October 1st)
4. Action: Start a program
   - Program: `node.exe`
   - Arguments: `C:\path\to\project\node_modules\.bin\npx.cmd tsx scripts/schedule-data-updates.ts`
   - Start in: `C:\path\to\project`

### GitHub Actions (for cloud deployment)
```yaml
name: Quarterly Data Updates

on:
  schedule:
    - cron: '0 2 1 1,4,7,10 *'  # 2:00 AM UTC on quarter starts
  workflow_dispatch:  # Allow manual triggering

jobs:
  update-data:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run data updates
        run: npm run data:update:all
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## Monitoring and Logging

### Log File Location
- **Linux/Mac**: `/var/log/drugeye-updates.log`
- **Windows**: `C:\Users\[username]\AppData\Local\DrugEye\updates.log`

### Log Format
```
============================================================
DrugEye ICD-10 Data Update Schedule
============================================================
Started at: 2026-04-27T06:00:00.000Z

Step 1: WHO ATC Import
------------------------------------------------------------
[... process output ...]
✓ WHO ATC import completed

Step 2: FDA SPL Import
------------------------------------------------------------
[... process output ...]
✓ FDA SPL import completed

Step 3: DailyMed Import
------------------------------------------------------------
[... process output ...]
✓ DailyMed import completed

Step 4: RxNorm Import
------------------------------------------------------------
[... process output ...]
✓ RxNorm import completed

Final Database Statistics
------------------------------------------------------------
Total drugs: 21876
Total ICD-10 mappings: 42846
Average mappings per drug: 1.96

Source breakdown:
  THERAPEUTIC_INFERENCE: 42632
  WHO_ATC: 105
  FDA_SPL: 109
  DAILYMED_SPL: 500

Validation status:
  Validated: 0
  Pending review: 42846

============================================================
Update Summary
============================================================
WHO ATC: ✓ (12.3s)
FDA SPL: ✓ (45.7s)
DailyMed: ✓ (180.5s)
RxNorm: ✓ (120.2s)
Total duration: 358.7s
Completed at: 2026-04-27T06:05:58.000Z
============================================================
```

## Manual Validation Required

After each automated update, pharmacists should:

1. **Review the update log** for any errors or warnings
2. **Check the validation dashboard** at `/admin/validation`
3. **Validate high-priority mappings** (FDA and WHO ATC sources)
4. **Review any failed imports** and investigate drug name mismatches

## Error Handling

### Common Issues and Solutions

**Issue**: FDA API rate limiting
- **Solution**: Script automatically includes 1-second delays between requests

**Issue**: Database connection timeout
- **Solution**: Check DATABASE_URL and ensure database is accessible

**Issue**: RxNorm API returns 404 errors
- **Solution**: Expected behavior for non-US drugs; script continues processing

**Issue**: Prisma client errors
- **Solution**: Run `npm run db:generate` to regenerate Prisma client

## Rollback Procedure

If an update causes issues:

1. **Stop the update process** if still running
2. **Check the database** for recent changes
3. **Restore from backup** if available
4. **Contact system administrator** for manual rollback

## Contact

For issues with the data update system:
- Check logs in the configured log file
- Review this documentation
- Contact the system administrator

## Version History

- **v1.0** (2026-04-27): Initial implementation with FDA, WHO ATC, and RxNorm integration
- **v1.1** (2026-04-27): Improved drug name matching for better FDA/RxNorm success rates
- **v2.0** (2026-04-27): Added DailyMed integration (TIER_1 source) with enhanced ICD-10 mapping and batch processing for all 21,876 drugs
