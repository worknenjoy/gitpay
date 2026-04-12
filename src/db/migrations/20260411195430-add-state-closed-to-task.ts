import { QueryInterface } from 'sequelize'

export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.sequelize.query(
    `ALTER TYPE "enum_Tasks_state" ADD VALUE IF NOT EXISTS 'closed'`
  )
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  // Postgres does not support removing enum values directly.
  // Recreate the type without 'closed' and cast the column back.
  await queryInterface.sequelize.query(`
    ALTER TABLE "Tasks" ALTER COLUMN state DROP DEFAULT;
    ALTER TABLE "Tasks" ALTER COLUMN state TYPE VARCHAR(255);
    DROP TYPE "enum_Tasks_state";
    CREATE TYPE "enum_Tasks_state" AS ENUM ('created', 'funded', 'claimed', 'completed');
    ALTER TABLE "Tasks" ALTER COLUMN state TYPE "enum_Tasks_state" USING state::"enum_Tasks_state";
    ALTER TABLE "Tasks" ALTER COLUMN state SET DEFAULT 'created';
  `)
}
