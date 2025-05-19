/*
  Warnings:

  - A unique constraint covering the columns `[accountId]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Agent_userId_accountId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Agent_accountId_key" ON "Agent"("accountId");
