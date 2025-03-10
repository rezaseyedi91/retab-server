-- DropForeignKey
ALTER TABLE `DocSettings` DROP FOREIGN KEY `DocSettings_docId_fkey`;

-- AddForeignKey
ALTER TABLE `DocSettings` ADD CONSTRAINT `DocSettings_docId_fkey` FOREIGN KEY (`docId`) REFERENCES `RetabDoc`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
