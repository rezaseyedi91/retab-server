-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Instrument` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL DEFAULT 'Lute',

    UNIQUE INDEX `Instrument_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RetabDoc` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `mainChildId` INTEGER NULL,
    `lastModifiedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `filename` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `RetabDoc_mainChildId_key`(`mainChildId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StaffInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `docId` INTEGER NOT NULL,
    `n` INTEGER NOT NULL,
    `linesCount` INTEGER NULL,
    `notationType` VARCHAR(191) NOT NULL,
    `instrumentId` INTEGER NULL,

    UNIQUE INDEX `StaffInfo_docId_n_key`(`docId`, `n`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TabCourseTuningInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `n` INTEGER NOT NULL,
    `pname` VARCHAR(191) NOT NULL,
    `oct` INTEGER NOT NULL,

    UNIQUE INDEX `TabCourseTuningInfo_n_pname_oct_key`(`n`, `pname`, `oct`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MeiTag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tagTitle` VARCHAR(191) NOT NULL DEFAULT '',
    `selfClosing` BOOLEAN NOT NULL DEFAULT false,
    `textContent` VARCHAR(191) NULL,
    `xmlId` VARCHAR(191) NOT NULL,
    `indexAmongSiblings` INTEGER NOT NULL DEFAULT 0,
    `parentId` INTEGER NULL,
    `docId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MeiAttribute` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NULL,
    `containerTagId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_StaffInfoToTabCourseTuningInfo` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_StaffInfoToTabCourseTuningInfo_AB_unique`(`A`, `B`),
    INDEX `_StaffInfoToTabCourseTuningInfo_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RetabDoc` ADD CONSTRAINT `RetabDoc_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RetabDoc` ADD CONSTRAINT `RetabDoc_mainChildId_fkey` FOREIGN KEY (`mainChildId`) REFERENCES `MeiTag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StaffInfo` ADD CONSTRAINT `StaffInfo_docId_fkey` FOREIGN KEY (`docId`) REFERENCES `RetabDoc`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StaffInfo` ADD CONSTRAINT `StaffInfo_instrumentId_fkey` FOREIGN KEY (`instrumentId`) REFERENCES `Instrument`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MeiTag` ADD CONSTRAINT `MeiTag_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `MeiTag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MeiAttribute` ADD CONSTRAINT `MeiAttribute_containerTagId_fkey` FOREIGN KEY (`containerTagId`) REFERENCES `MeiTag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StaffInfoToTabCourseTuningInfo` ADD CONSTRAINT `_StaffInfoToTabCourseTuningInfo_A_fkey` FOREIGN KEY (`A`) REFERENCES `StaffInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StaffInfoToTabCourseTuningInfo` ADD CONSTRAINT `_StaffInfoToTabCourseTuningInfo_B_fkey` FOREIGN KEY (`B`) REFERENCES `TabCourseTuningInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
