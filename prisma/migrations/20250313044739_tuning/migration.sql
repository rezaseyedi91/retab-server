-- CreateTable
CREATE TABLE `TuningPreset` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_TabCourseTuningInfoToTuningPreset` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_TabCourseTuningInfoToTuningPreset_AB_unique`(`A`, `B`),
    INDEX `_TabCourseTuningInfoToTuningPreset_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_TabCourseTuningInfoToTuningPreset` ADD CONSTRAINT `_TabCourseTuningInfoToTuningPreset_A_fkey` FOREIGN KEY (`A`) REFERENCES `TabCourseTuningInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TabCourseTuningInfoToTuningPreset` ADD CONSTRAINT `_TabCourseTuningInfoToTuningPreset_B_fkey` FOREIGN KEY (`B`) REFERENCES `TuningPreset`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
