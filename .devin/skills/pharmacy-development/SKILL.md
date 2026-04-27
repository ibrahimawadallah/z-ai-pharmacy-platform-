# Pharmacy Platform Development Skill

Specialized skill for DrugEye Clinical Command Center development with focus on healthcare data, drug interactions, and clinical workflows.

## Context
This is a healthcare/pharmacy platform with:
- Drug interaction checking
- ICD-10 disease mapping
- Clinical decision support
- UAE drug formulary integration
- FDA drug data integration

## Development Guidelines

### Data Handling
- Always validate drug data against existing schemas
- Use proper medical terminology and coding standards
- Maintain data integrity when importing/exporting
- Follow healthcare data privacy principles

### Clinical Logic
- Drug interaction checks must be comprehensive
- Always include pregnancy category warnings
- G6PD deficiency considerations for relevant drugs
- Proper dosing calculations and validation

### Code Patterns
- Use existing TypeScript/React patterns in the codebase
- Follow the established component structure
- Maintain consistency with existing API patterns
- Use proper error handling for clinical data

### Testing
- Test drug interaction scenarios thoroughly
- Validate ICD-10 mappings
- Test edge cases in clinical decision support
- Ensure data import/export reliability

## Available Resources
- Drug database: `database/data/`
- Interaction data: `database/drug-interactions.json`
- API endpoints: Check existing route patterns
- Component library: Review existing components

## Common Tasks
- Adding new drug data fields
- Implementing clinical decision rules
- Updating drug interaction logic
- Enhancing ICD-10 mapping accuracy
- Integrating new drug sources
