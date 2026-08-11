-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "contactName" TEXT,
ADD COLUMN     "defaultCurrency" TEXT NOT NULL DEFAULT 'EUR',
ADD COLUMN     "defaultVatRatePercent" INTEGER NOT NULL DEFAULT 19,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "internalNotes" TEXT,
ADD COLUMN     "paymentTermsDays" INTEGER NOT NULL DEFAULT 14,
ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE INDEX "Customer_archivedAt_idx" ON "Customer"("archivedAt");
