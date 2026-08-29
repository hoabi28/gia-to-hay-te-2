-- CreateTable
CREATE TABLE "Laptop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "series" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "useCases" TEXT[],
    "image" TEXT NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "specs" JSONB NOT NULL,
    "performance" JSONB NOT NULL,
    "criteria" JSONB NOT NULL,
    "warrantyMonths" INTEGER NOT NULL,
    "pros" TEXT[],
    "cons" TEXT[],
    "buyIf" TEXT[],
    "avoidIf" TEXT[],
    "bestFor" TEXT NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Laptop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreOffer" (
    "id" SERIAL NOT NULL,
    "laptopId" TEXT NOT NULL,
    "store" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "shippingFee" INTEGER NOT NULL,
    "gift" TEXT,
    "warrantyMonths" INTEGER NOT NULL,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "url" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceSnapshot" (
    "id" SERIAL NOT NULL,
    "laptopId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityReview" (
    "id" TEXT NOT NULL,
    "laptopId" TEXT NOT NULL,
    "aspect" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "usageDurationMonths" INTEGER NOT NULL,

    CONSTRAINT "CommunityReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StoreOffer_laptopId_idx" ON "StoreOffer"("laptopId");

-- CreateIndex
CREATE INDEX "PriceSnapshot_laptopId_date_idx" ON "PriceSnapshot"("laptopId", "date");

-- CreateIndex
CREATE INDEX "CommunityReview_laptopId_idx" ON "CommunityReview"("laptopId");

-- AddForeignKey
ALTER TABLE "StoreOffer" ADD CONSTRAINT "StoreOffer_laptopId_fkey" FOREIGN KEY ("laptopId") REFERENCES "Laptop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceSnapshot" ADD CONSTRAINT "PriceSnapshot_laptopId_fkey" FOREIGN KEY ("laptopId") REFERENCES "Laptop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityReview" ADD CONSTRAINT "CommunityReview_laptopId_fkey" FOREIGN KEY ("laptopId") REFERENCES "Laptop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
