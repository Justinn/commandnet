/*
  Warnings:

  - You are about to drop the column `faction` on the `Agent` table. All the data in the column will be lost.
  - Added the required column `credits` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `headquarters` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipCount` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startingFaction` to the `Agent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agent" DROP COLUMN "faction",
ADD COLUMN     "credits" BIGINT NOT NULL,
ADD COLUMN     "headquarters" TEXT NOT NULL,
ADD COLUMN     "shipCount" INTEGER NOT NULL,
ADD COLUMN     "startingFaction" TEXT NOT NULL;
