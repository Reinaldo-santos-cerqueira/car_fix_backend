/*
  Warnings:

  - Added the required column `path_profile_image` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "path_profile_image" TEXT NOT NULL;
