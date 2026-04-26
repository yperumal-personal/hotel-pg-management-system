-- Migration: Update tenant status values
-- Old values: ACTIVE, INACTIVE, SUSPENDED
-- New values: ACTIVE, TO_BE_EXTENDED, CLOSED
-- Status is now auto-calculated nightly based on checkout date

-- Step 1: Drop the existing CHECK constraint on status
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;

-- Step 2: Update existing data
--   INACTIVE / SUSPENDED → recompute from check_out_date below

-- Tenants whose checkout date is today or tomorrow → TO_BE_EXTENDED
UPDATE users
SET status = 'TO_BE_EXTENDED'
WHERE role = 'TENANT'
  AND check_out_date >= CURRENT_DATE
  AND check_out_date <= CURRENT_DATE + INTERVAL '1 day';

-- Tenants whose checkout date is 2 or more days in the past → CLOSED
UPDATE users
SET status = 'CLOSED'
WHERE role = 'TENANT'
  AND check_out_date < CURRENT_DATE - INTERVAL '1 day';

-- All remaining tenants (checkout in the future beyond tomorrow) → ACTIVE
UPDATE users
SET status = 'ACTIVE'
WHERE role = 'TENANT'
  AND (check_out_date IS NULL OR check_out_date > CURRENT_DATE + INTERVAL '1 day');

-- Non-tenant users (OWNER, STAFF, ADMIN) → keep as ACTIVE
UPDATE users
SET status = 'ACTIVE'
WHERE role != 'TENANT';

-- Step 3: Add the new CHECK constraint
ALTER TABLE users
ADD CONSTRAINT users_status_check
CHECK (status IN ('ACTIVE', 'TO_BE_EXTENDED', 'CLOSED'));
