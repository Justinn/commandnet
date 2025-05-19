/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Agent_userId_accountId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Agent_token_key" ON "Agent"("token");
