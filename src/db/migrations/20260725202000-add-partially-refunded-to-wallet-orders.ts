import { QueryInterface, DataTypes } from 'sequelize'

export async function up({ queryInterface }: { queryInterface: QueryInterface }) {
  await queryInterface.sequelize.query(
    `ALTER TYPE "enum_WalletOrders_status" ADD VALUE IF NOT EXISTS 'partially_refunded'`
  )

  await queryInterface.addColumn('WalletOrders', 'refunded_amount', {
    type: DataTypes.DECIMAL,
    allowNull: false,
    defaultValue: 0
  })
}

export async function down({ queryInterface }: { queryInterface: QueryInterface }) {
  // Convert partially_refunded rows before removing the enum value
  await queryInterface.sequelize.query(`
    UPDATE "WalletOrders"
    SET status = 'refunded'
    WHERE status = 'partially_refunded'
  `)

  await queryInterface.removeColumn('WalletOrders', 'refunded_amount')

  // Postgres does not support removing enum values directly.
  // Recreate the type without 'partially_refunded' and cast the column back.
  await queryInterface.sequelize.query(`
    ALTER TABLE "WalletOrders" ALTER COLUMN status DROP DEFAULT;
    ALTER TABLE "WalletOrders" ALTER COLUMN status TYPE VARCHAR(255);
    DROP TYPE "enum_WalletOrders_status";
    CREATE TYPE "enum_WalletOrders_status" AS ENUM (
      'pending',
      'draft',
      'open',
      'paid',
      'failed',
      'uncollectible',
      'void',
      'refunded'
    );
    ALTER TABLE "WalletOrders"
      ALTER COLUMN status TYPE "enum_WalletOrders_status"
      USING status::"enum_WalletOrders_status";
    ALTER TABLE "WalletOrders" ALTER COLUMN status SET DEFAULT 'pending';
  `)
}
