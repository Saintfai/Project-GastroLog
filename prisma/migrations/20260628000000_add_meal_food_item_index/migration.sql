-- CreateIndex
-- Index untuk foreign key meal_logs.food_item_id (relasi ke food_items).
-- IF NOT EXISTS dipakai agar aman dijalankan meski index sudah pernah dibuat manual.
CREATE INDEX IF NOT EXISTS "meal_logs_food_item_id_idx" ON "meal_logs"("food_item_id");
