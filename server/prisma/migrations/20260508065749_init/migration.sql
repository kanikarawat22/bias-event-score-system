-- CreateTable
CREATE TABLE "Society" (
    "id" SERIAL NOT NULL,
    "societyName" TEXT NOT NULL,
    "societyEmail" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "secretaryName" TEXT NOT NULL,
    "secretaryNumber" TEXT NOT NULL,
    "societyLogo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Society_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Society_societyEmail_key" ON "Society"("societyEmail");
