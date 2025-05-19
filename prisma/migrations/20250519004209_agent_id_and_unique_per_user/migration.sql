/*
  Warnings:

  - The primary key for the `Agent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,accountId]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Agent` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Agent" DROP CONSTRAINT "Agent_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Agent_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_userId_accountId_key" ON "Agent"("userId", "accountId");
