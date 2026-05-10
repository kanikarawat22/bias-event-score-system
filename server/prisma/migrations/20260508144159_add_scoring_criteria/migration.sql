-- CreateTable
CREATE TABLE "ScoringCriterion" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "maxMarks" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "ScoringCriterion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScoringCriterion" ADD CONSTRAINT "ScoringCriterion_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
