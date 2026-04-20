-- Migration: Add comprehensive drug data fields
ALTER TABLE "Drug" ADD COLUMN "g6pdSafety" TEXT;
ALTER TABLE "Drug" ADD COLUMN "offLabelUses" TEXT;
