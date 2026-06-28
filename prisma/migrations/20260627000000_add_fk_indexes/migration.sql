-- CreateIndex
CREATE INDEX "meal_logs_daily_log_id_idx" ON "meal_logs"("daily_log_id");

-- CreateIndex
CREATE INDEX "symptom_logs_daily_log_id_idx" ON "symptom_logs"("daily_log_id");

-- CreateIndex
CREATE INDEX "symptom_logs_severity_onset_time_idx" ON "symptom_logs"("severity", "onset_time");

-- CreateIndex
CREATE INDEX "activity_logs_daily_log_id_idx" ON "activity_logs"("daily_log_id");
