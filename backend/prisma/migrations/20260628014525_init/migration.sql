-- CreateEnum
CREATE TYPE "CapsuleStatus" AS ENUM ('DRAFT', 'PENDING_PAYMENT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CheckoutSessionStatus" AS ENUM ('PENDING', 'PAID', 'CANCELED', 'EXPIRED');

-- CreateTable
CREATE TABLE "Capsule" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "CapsuleStatus" NOT NULL DEFAULT 'DRAFT',
    "editToken" TEXT NOT NULL,
    "recipientName" TEXT,
    "occasion" TEXT,
    "songUrl" TEXT,
    "letter" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Capsule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineItem" (
    "id" TEXT NOT NULL,
    "capsuleId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimelineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckoutSession" (
    "id" TEXT NOT NULL,
    "capsuleId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'abacatepay',
    "status" "CheckoutSessionStatus" NOT NULL DEFAULT 'PENDING',
    "providerChargeId" TEXT,
    "pixQrCode" TEXT,
    "pixCopyPaste" TEXT,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "expiresAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CheckoutSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Capsule_slug_key" ON "Capsule"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Capsule_editToken_key" ON "Capsule"("editToken");

-- CreateIndex
CREATE INDEX "Capsule_slug_idx" ON "Capsule"("slug");

-- CreateIndex
CREATE INDEX "Capsule_status_idx" ON "Capsule"("status");

-- CreateIndex
CREATE INDEX "Capsule_editToken_idx" ON "Capsule"("editToken");

-- CreateIndex
CREATE INDEX "TimelineItem_capsuleId_idx" ON "TimelineItem"("capsuleId");

-- CreateIndex
CREATE INDEX "TimelineItem_sortOrder_idx" ON "TimelineItem"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutSession_capsuleId_key" ON "CheckoutSession"("capsuleId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutSession_providerChargeId_key" ON "CheckoutSession"("providerChargeId");

-- CreateIndex
CREATE INDEX "CheckoutSession_providerChargeId_idx" ON "CheckoutSession"("providerChargeId");

-- CreateIndex
CREATE INDEX "CheckoutSession_status_idx" ON "CheckoutSession"("status");

-- AddForeignKey
ALTER TABLE "TimelineItem" ADD CONSTRAINT "TimelineItem_capsuleId_fkey" FOREIGN KEY ("capsuleId") REFERENCES "Capsule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckoutSession" ADD CONSTRAINT "CheckoutSession_capsuleId_fkey" FOREIGN KEY ("capsuleId") REFERENCES "Capsule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
