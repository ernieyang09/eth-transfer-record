DROP INDEX IF EXISTS "transfer_records_idx";--> statement-breakpoint
ALTER TABLE "transfer_records" ADD COLUMN "token" text NOT NULL;--> statement-breakpoint
ALTER TABLE "transfer_records" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transfer_records_idx" ON "transfer_records" USING btree ("chain","token","from_address","created_at");