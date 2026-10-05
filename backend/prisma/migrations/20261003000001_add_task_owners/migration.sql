-- Existing Task rows must be assigned an owner before this migration can run.
ALTER TABLE "Task" ADD COLUMN "userId" INTEGER NOT NULL;

CREATE INDEX "Task_userId_idx" ON "Task"("userId");

ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
