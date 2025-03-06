-- CreateTable
CREATE TABLE `DocSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `docId` INTEGER NOT NULL,
    `defaultFirstTabgrpDurSymShow` BOOLEAN NOT NULL DEFAULT true,
    `tabgroupsIncludeDurAttribute` BOOLEAN NOT NULL DEFAULT true,
    `proportionInclude` BOOLEAN NOT NULL DEFAULT false,
    `proportionNum` INTEGER NULL DEFAULT 2,
    `proportionNumbase` INTEGER NULL DEFAULT 2,

    UNIQUE INDEX `DocSettings_docId_key`(`docId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DocSettings` ADD CONSTRAINT `DocSettings_docId_fkey` FOREIGN KEY (`docId`) REFERENCES `RetabDoc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
