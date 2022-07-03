/*
  Warnings:

  - Added the required column `password` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN password TEXT NULL;

UPDATE "user" SET password = '123456' WHERE id != 0;

ALTER TABLE "user" ALTER COLUMN password SET NOT NULL;
