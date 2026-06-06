-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "GerdSeverity" AS ENUM ('MILD', 'MODERATE', 'SEVERE');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'DRINK');

-- CreateEnum
CREATE TYPE "PortionSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "SymptomType" AS ENUM ('HEARTBURN', 'REGURGITATION', 'BLOATING', 'NAUSEA', 'CHEST_PAIN', 'OTHER');

-- CreateEnum
CREATE TYPE "SleepPosition" AS ENUM ('FLAT', 'LEFT_SIDE', 'RIGHT_SIDE', 'ELEVATED');

-- CreateEnum
CREATE TYPE "FoodCategory" AS ENUM ('GRAIN', 'PROTEIN', 'DAIRY', 'VEGETABLE', 'FRUIT', 'BEVERAGE', 'SNACK', 'OTHER');

-- CreateEnum
CREATE TYPE "GerdRiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('MEAL_REMINDER', 'JOURNAL_REMINDER', 'SYMPTOM_CHECK');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "age" INTEGER,
    "gender" "Gender",
    "gerd_severity" "GerdSeverity",
    "gerd_duration_months" INTEGER,
    "medications" TEXT[],
    "food_restrictions" TEXT[],

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "log_date" DATE NOT NULL,
    "overall_score" INTEGER NOT NULL DEFAULT 10,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_logs" (
    "id" UUID NOT NULL,
    "daily_log_id" UUID NOT NULL,
    "food_item_id" UUID,
    "meal_type" "MealType" NOT NULL,
    "food_name" TEXT NOT NULL,
    "meal_time" TIMESTAMP(3) NOT NULL,
    "portion_size" "PortionSize",
    "notes" TEXT,

    CONSTRAINT "meal_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "symptom_logs" (
    "id" UUID NOT NULL,
    "daily_log_id" UUID NOT NULL,
    "symptom_type" "SymptomType" NOT NULL,
    "severity" INTEGER NOT NULL,
    "onset_time" TIMESTAMP(3) NOT NULL,
    "duration_minutes" INTEGER,
    "notes" TEXT,

    CONSTRAINT "symptom_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" UUID NOT NULL,
    "daily_log_id" UUID NOT NULL,
    "sleep_hours" DOUBLE PRECISION,
    "sleep_position" "SleepPosition",
    "stress_level" INTEGER,
    "exercise_done" BOOLEAN NOT NULL DEFAULT false,
    "exercise_type" TEXT,
    "exercise_duration_min" INTEGER,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food_items" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "category" "FoodCategory" NOT NULL,
    "gerd_risk_level" "GerdRiskLevel" NOT NULL,
    "description" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "food_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "label" TEXT,
    "scheduled_at" TIME(0) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "days_of_week" INTEGER[],

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "daily_logs_user_id_log_date_key" ON "daily_logs"("user_id", "log_date");

-- CreateIndex
CREATE INDEX "food_items_name_idx" ON "food_items"("name");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_logs" ADD CONSTRAINT "meal_logs_daily_log_id_fkey" FOREIGN KEY ("daily_log_id") REFERENCES "daily_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_logs" ADD CONSTRAINT "meal_logs_food_item_id_fkey" FOREIGN KEY ("food_item_id") REFERENCES "food_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symptom_logs" ADD CONSTRAINT "symptom_logs_daily_log_id_fkey" FOREIGN KEY ("daily_log_id") REFERENCES "daily_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_daily_log_id_fkey" FOREIGN KEY ("daily_log_id") REFERENCES "daily_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
