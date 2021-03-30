CREATE DATABASE `shopping` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE `warehouse` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE `delivery` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON `shopping`.* TO 'lucid'@'%';
GRANT ALL PRIVILEGES ON `warehouse`.* TO 'lucid'@'%';
GRANT ALL PRIVILEGES ON `delivery`.* TO 'lucid'@'%';
FLUSH PRIVILEGES;
