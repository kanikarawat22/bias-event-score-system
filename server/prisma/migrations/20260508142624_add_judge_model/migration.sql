-- CreateTable
CREATE TABLE "Judge" (
    "id" SERIAL NOT NULL,
    "judgeName" TEXT NOT NULL,
    "judgePin" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "Judge_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Judge" ADD CONSTRAINT "Judge_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
