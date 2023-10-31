-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "images" TEXT NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);
