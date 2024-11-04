-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 04 nov. 2024 à 17:16
-- Version du serveur : 8.3.0
-- Version de PHP : 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `hackathon`
--

-- --------------------------------------------------------

--
-- Structure de la table `evaluations`
--

DROP TABLE IF EXISTS `evaluations`;
CREATE TABLE IF NOT EXISTS `evaluations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `juryId` int NOT NULL,
  `projectId` int NOT NULL,
  `scores` json NOT NULL,
  `feedback` text,
  `biasScore` float DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Evaluations_projectId_juryId_unique` (`juryId`,`projectId`),
  KEY `projectId` (`projectId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `evaluations`
--

INSERT INTO `evaluations` (`id`, `juryId`, `projectId`, `scores`, `feedback`, `biasScore`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, '{\"impact\": 8, \"innovation\": 9, \"feasibility\": 8, \"presentation\": 9}', 'Excellent project with innovative approach', 0, '2024-11-02 22:22:28', '2024-11-02 22:22:28');

-- --------------------------------------------------------

--
-- Structure de la table `hackathonjuries`
--

DROP TABLE IF EXISTS `hackathonjuries`;
CREATE TABLE IF NOT EXISTS `hackathonjuries` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `hackathonId` int NOT NULL,
  `juryId` int NOT NULL,
  PRIMARY KEY (`hackathonId`,`juryId`),
  KEY `juryId` (`juryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `hackathons`
--

DROP TABLE IF EXISTS `hackathons`;
CREATE TABLE IF NOT EXISTS `hackathons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `maxTeamSize` int DEFAULT '5',
  `status` enum('draft','active','completed') DEFAULT 'draft',
  `partners` json DEFAULT NULL,
  `evaluationCriteria` json DEFAULT NULL,
  `statistics` json DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `hackathons`
--

INSERT INTO `hackathons` (`id`, `name`, `description`, `startDate`, `endDate`, `maxTeamSize`, `status`, `partners`, `evaluationCriteria`, `statistics`, `createdAt`, `updatedAt`) VALUES
(1, 'Test Hackathon 2024', 'A test hackathon for integration testing', '2024-01-01 00:00:00', '2024-01-07 00:00:00', 3, 'active', '[\"TestCorp\", \"TechInc\"]', '{\"impact\": {\"weight\": 0.3}, \"innovation\": {\"weight\": 0.3}, \"feasibility\": {\"weight\": 0.2}, \"presentation\": {\"weight\": 0.2}}', '{\"teamCount\": 1, \"evaluations\": {\"average\": 8.5, \"completed\": 1}, \"projectCount\": 1, \"participantCount\": 2, \"mentoringSessions\": {\"total\": 1, \"cancelled\": 0, \"completed\": 0, \"scheduled\": 1}}', '2024-11-02 22:22:28', '2024-11-02 22:22:28'),
(2, '', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 5, 'draft', '[]', '{\"impact\": {\"weight\": 0.3}, \"innovation\": {\"weight\": 0.3}, \"feasibility\": {\"weight\": 0.2}, \"presentation\": {\"weight\": 0.2}}', '{\"teamCount\": 0, \"projectCount\": 0, \"participantCount\": 0, \"mentoringSessions\": {\"total\": 0, \"cancelled\": 0, \"completed\": 0, \"scheduled\": 0}}', '2024-11-03 17:39:12', '2024-11-03 17:39:12'),
(3, 'hjiiid', 'ghhjrf uiooksdoicuyuis', '2024-11-21 00:00:00', '2024-11-30 00:00:00', 5, 'draft', '[]', '{\"impact\": {\"weight\": 0.3}, \"innovation\": {\"weight\": 0.3}, \"feasibility\": {\"weight\": 0.2}, \"presentation\": {\"weight\": 0.2}}', '{\"teamCount\": 0, \"projectCount\": 0, \"participantCount\": 0, \"mentoringSessions\": {\"total\": 0, \"cancelled\": 0, \"completed\": 0, \"scheduled\": 0}}', '2024-11-03 17:51:12', '2024-11-03 17:51:12'),
(4, 'tyluiytyu', 'dtfgjhklyf(fgiuop^kç_è-(srdtuyi', '2024-11-15 00:00:00', '2024-11-22 00:00:00', 5, 'draft', '[]', '{\"impact\": {\"weight\": 0.3}, \"innovation\": {\"weight\": 0.3}, \"feasibility\": {\"weight\": 0.2}, \"presentation\": {\"weight\": 0.2}}', '{\"teamCount\": 0, \"projectCount\": 0, \"participantCount\": 0, \"mentoringSessions\": {\"total\": 0, \"cancelled\": 0, \"completed\": 0, \"scheduled\": 0}}', '2024-11-03 18:02:21', '2024-11-03 18:02:21'),
(5, 'dgfhjklm', 'dfxdgcfhjklkmouytrtyuiop', '2024-11-14 00:00:00', '2024-11-21 00:00:00', 5, 'active', '[]', '{\"impact\": {\"weight\": 0.3}, \"innovation\": {\"weight\": 0.3}, \"feasibility\": {\"weight\": 0.3}, \"presentation\": {\"weight\": 0.1}}', '{\"teamCount\": 0, \"projectCount\": 0, \"participantCount\": 0, \"mentoringSessions\": {\"total\": 0, \"cancelled\": 0, \"completed\": 0, \"scheduled\": 0}}', '2024-11-03 18:43:32', '2024-11-03 18:43:32');

-- --------------------------------------------------------

--
-- Structure de la table `juries`
--

DROP TABLE IF EXISTS `juries`;
CREATE TABLE IF NOT EXISTS `juries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `juryUserId` int NOT NULL,
  `specialization` varchar(255) NOT NULL,
  `evaluationCriteria` json DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `juryUserId` (`juryUserId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `juries`
--

INSERT INTO `juries` (`id`, `juryUserId`, `specialization`, `evaluationCriteria`, `createdAt`, `updatedAt`) VALUES
(1, 5, 'Technical Innovation', '{\"impact\": {\"weight\": 0.3}, \"innovation\": {\"weight\": 0.3}, \"feasibility\": {\"weight\": 0.2}, \"presentation\": {\"weight\": 0.2}}', '2024-11-02 22:22:28', '2024-11-02 22:22:28');

-- --------------------------------------------------------

--
-- Structure de la table `mentorassignments`
--

DROP TABLE IF EXISTS `mentorassignments`;
CREATE TABLE IF NOT EXISTS `mentorassignments` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `mentorId` int NOT NULL,
  `teamId` int NOT NULL,
  PRIMARY KEY (`mentorId`,`teamId`),
  KEY `teamId` (`teamId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `mentorassignments`
--

INSERT INTO `mentorassignments` (`createdAt`, `updatedAt`, `mentorId`, `teamId`) VALUES
('2024-11-03 23:32:36', '2024-11-03 23:32:36', 1, 1),
('2024-11-04 15:08:42', '2024-11-04 15:08:42', 1, 19),
('2024-11-04 15:48:47', '2024-11-04 15:48:47', 1, 20);

-- --------------------------------------------------------

--
-- Structure de la table `mentoringsessions`
--

DROP TABLE IF EXISTS `mentoringsessions`;
CREATE TABLE IF NOT EXISTS `mentoringsessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mentorId` int NOT NULL,
  `teamId` int NOT NULL,
  `hackathonId` int NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `status` enum('scheduled','completed','cancelled') DEFAULT 'scheduled',
  `notes` text,
  `notificationsSent` json DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `mentorId` (`mentorId`),
  KEY `teamId` (`teamId`),
  KEY `hackathonId` (`hackathonId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `mentoringsessions`
--

INSERT INTO `mentoringsessions` (`id`, `mentorId`, `teamId`, `hackathonId`, `startTime`, `endTime`, `status`, `notes`, `notificationsSent`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 1, '2024-01-02 09:00:00', '2024-01-02 10:00:00', 'scheduled', NULL, '{\"reminder\": false}', '2024-11-02 22:22:28', '2024-11-02 22:22:28');

-- --------------------------------------------------------

--
-- Structure de la table `mentors`
--

DROP TABLE IF EXISTS `mentors`;
CREATE TABLE IF NOT EXISTS `mentors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `expertise` varchar(255) NOT NULL,
  `availability` json DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `mentors`
--

INSERT INTO `mentors` (`id`, `userId`, `expertise`, `availability`, `createdAt`, `updatedAt`) VALUES
(1, 4, 'Full Stack Development', '{\"1\": [{\"end\": \"17:00\", \"start\": \"09:00\"}]}', '2024-11-02 22:22:28', '2024-11-02 22:22:28');

-- --------------------------------------------------------

--
-- Structure de la table `projects`
--

DROP TABLE IF EXISTS `projects`;
CREATE TABLE IF NOT EXISTS `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `githubUrl` varchar(255) DEFAULT NULL,
  `demoUrl` varchar(255) DEFAULT NULL,
  `technologies` json DEFAULT NULL,
  `status` enum('in_progress','submitted','evaluated') DEFAULT 'in_progress',
  `hackathonId` int NOT NULL,
  `teamId` int NOT NULL,
  `aiScore` float DEFAULT '0',
  `finalScore` float DEFAULT '0',
  `scores` json DEFAULT NULL,
  `feedback` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `hackathonId` (`hackathonId`),
  KEY `teamId` (`teamId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `projects`
--

INSERT INTO `projects` (`id`, `name`, `description`, `githubUrl`, `demoUrl`, `technologies`, `status`, `hackathonId`, `teamId`, `aiScore`, `finalScore`, `scores`, `feedback`, `createdAt`, `updatedAt`) VALUES
(1, 'Test Project', 'A test project', 'https://github.com/test/project', NULL, '[\"Node.js\", \"React\", \"MySQL\"]', 'evaluated', 1, 1, 8.5, 8.5, '{\"impact\": 0, \"innovation\": 0, \"feasibility\": 0, \"presentation\": 0}', NULL, '2024-11-02 22:22:28', '2024-11-02 22:22:28');

-- --------------------------------------------------------

--
-- Structure de la table `teammembers`
--

DROP TABLE IF EXISTS `teammembers`;
CREATE TABLE IF NOT EXISTS `teammembers` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `teamId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`teamId`,`userId`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `teammembers`
--

INSERT INTO `teammembers` (`createdAt`, `updatedAt`, `teamId`, `userId`) VALUES
('2024-11-02 22:22:28', '2024-11-02 22:22:28', 1, 2),
('2024-11-02 22:22:28', '2024-11-02 22:22:28', 1, 3),
('2024-11-04 11:22:27', '2024-11-04 11:22:27', 6, 2),
('2024-11-04 11:24:51', '2024-11-04 11:24:51', 7, 6),
('2024-11-04 11:32:14', '2024-11-04 11:32:14', 8, 4),
('2024-11-04 11:49:29', '2024-11-04 11:49:29', 9, 3),
('2024-11-04 13:55:28', '2024-11-04 13:55:28', 18, 2),
('2024-11-04 13:55:28', '2024-11-04 13:55:28', 18, 3),
('2024-11-04 14:22:33', '2024-11-04 14:22:33', 19, 3),
('2024-11-04 14:22:33', '2024-11-04 14:22:33', 19, 4),
('2024-11-04 15:48:47', '2024-11-04 15:48:47', 20, 1),
('2024-11-04 15:49:11', '2024-11-04 15:49:11', 20, 3);

-- --------------------------------------------------------

--
-- Structure de la table `teammentorassignments`
--

DROP TABLE IF EXISTS `teammentorassignments`;
CREATE TABLE IF NOT EXISTS `teammentorassignments` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `teamId` int NOT NULL,
  `mentorId` int NOT NULL,
  PRIMARY KEY (`teamId`,`mentorId`),
  KEY `mentorId` (`mentorId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `teams`
--

DROP TABLE IF EXISTS `teams`;
CREATE TABLE IF NOT EXISTS `teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `hackathonId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `hackathonId` (`hackathonId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `teams`
--

INSERT INTO `teams` (`id`, `name`, `description`, `hackathonId`, `createdAt`, `updatedAt`) VALUES
(1, 'Test Team', 'A team for testing', 1, '2024-11-02 22:22:28', '2024-11-02 22:22:28'),
(2, 'vhgj', 'vbkjjkjjuhfgjkjhytryuiuhoipjotrerxtfcygtvuhiolmkjhvtfygi', 1, '2024-11-04 09:46:52', '2024-11-04 09:46:52'),
(3, 'vhgjvhghjj', 'vbkjjkjjuhfgjkjhytryuiuhoipjotrerxtfcygtvuhiolmkjhvtfygi', 1, '2024-11-04 09:47:04', '2024-11-04 09:47:04'),
(4, 'vhgjvhghjj', 'vbkjjkjjuhfgjkjhytryuiuhoipjotrerxtfcygtvuhiolmkjhvtfygi', 1, '2024-11-04 09:55:22', '2024-11-04 09:55:22'),
(5, 'vhgjvhghjj', 'vbkjjkjjuhfgjkjhytryuiuhoipjotrerxtfcygtvuhiolmkjhvtfygi', 1, '2024-11-04 10:00:06', '2024-11-04 10:00:06'),
(6, 'Laetitia AZODJILANDE', 'hgjkjhggjkliuyfgiuhojpjxctyvuhijezwrextcyuiojptryguhijklm;ùm:', 1, '2024-11-04 11:22:27', '2024-11-04 11:22:27'),
(7, 'fdghjklm', 'rtyuijklùerdtryuiooùezdetryubiuni,mezdxtryuiezdsxrtyugih', 1, '2024-11-04 11:24:51', '2024-11-04 11:24:51'),
(8, 'team2', 'uniusduiiuhezihireiuuufhiuhirifjeojeoifhiubiuiuhiuoijojopjoiu', 1, '2024-11-04 11:32:14', '2024-11-04 11:32:14'),
(9, 'Laetitia', 'fdghjklzertyuijigyyguipoytxrtybih-dthoiopipoiuytydtyf', 1, '2024-11-04 11:49:29', '2024-11-04 11:49:29'),
(10, 'dfghjklmghjklm', 'dtfyghjklmdfghjklmdfghjklmsfdghjkllfdghjklmfdghjkletryuiop', 1, '2024-11-04 13:04:03', '2024-11-04 13:04:03'),
(12, 'ffdhuhidjoioidsjoudosudgsdgdshhiodsu', 'gdvbduhdsiuhdshdsuidsidusidsuidhudygcygydgdygsudgusdgdshdsuudis', 1, '2024-11-04 13:15:20', '2024-11-04 13:15:20'),
(13, 'dsdds', 'dfghjkldyghjohytgiogtcghjhkljfdghjklmùdfghjbkl,muuiiooop', 1, '2024-11-04 13:16:28', '2024-11-04 13:16:28'),
(15, 'fghjkl', 'fguiiuiiuyy vtygyg gsgdyugds\nghgyuihf\nghgè_hsophuiiojoppopkokpo', 1, '2024-11-04 13:35:42', '2024-11-04 13:35:42'),
(16, 'ugiuhq', 'ytuieozpuiruieuycvhhyugeiqhuivdqiurueigbhcdjqbuiqhuivgrugaerug', 4, '2024-11-04 13:36:54', '2024-11-04 13:36:54'),
(17, 'hjfdhiuifhiio', 'gvyybjbeugurbjdovjopvbyubufvijoivyrheiosçysniovjqhgurbuiqjlbvhgruhjiojrq', 1, '2024-11-04 13:44:59', '2024-11-04 13:44:59'),
(18, 'gyuiuooç', 'ytuieozpuiruieuycvhhyugeiqhuivdqiurueigbhcdjqbuiqhuivgrugaerug', 3, '2024-11-04 13:55:28', '2024-11-04 13:55:28'),
(19, 'vjhklkllk', 'ffgijoytcuyoipkpiuytiupoptydytç_pàibuiyrtykukjxsrtdufy', 3, '2024-11-04 14:22:33', '2024-11-04 14:22:33'),
(20, 'sdghgyhsd', 'ghjkhdshugbuhuvvhkjoioiihghvghgkjmlhhvyhhiuhihiyuyghuoippoiu', 1, '2024-11-04 15:48:47', '2024-11-04 15:48:47');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` enum('participant','organizer','jury','mentor') DEFAULT 'participant',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `name`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'organizer@test.com', '$2a$10$tMny5PPVdlAi4LsEWM1Lju79eOWIDeCOlkK9WHfLYbrn..ewhUAAK', 'Test Organizer', 'organizer', '2024-11-02 22:22:28', '2024-11-02 22:22:28'),
(2, 'participant1@test.com', '$2a$10$Er8AXyYKL7w5OpiXJtWagO5GERhOIpQjesH.ALwI9OuI9yuPORxvG', 'Test Participant 1', 'participant', '2024-11-02 22:22:28', '2024-11-02 22:22:28'),
(3, 'participant2@test.com', '$2a$10$FV88eNgBuL/WYRF1QOXDvuuzGG2aEt1Jy.kj9gjRknKHfyjuEytCO', 'Test Participant 2', 'participant', '2024-11-02 22:22:28', '2024-11-02 22:22:28'),
(4, 'mentor@test.com', '$2a$10$s7tW0syvLgek7NPjKY2hj.mr2h76iuqVimX6RNvMCC0u2tq9c.KXy', 'Test Mentor', 'mentor', '2024-11-02 22:22:28', '2024-11-02 22:22:28'),
(5, 'jury@test.com', '$2a$10$GGrWq2D.LzgODHhOpHfG1O5em205CzLnrfZvhU.bmuIB..bzkcexa', 'Test Jury', 'jury', '2024-11-02 22:22:28', '2024-11-02 22:22:28'),
(6, 'laetitiaelvire19@gmail.com', '$2a$10$TnODbjDwC.QmEoKIkeaV3ewBtOAEq4KEtiIrOpuC66/cBriry977i', 'Laetitia AZODJILANDE', 'participant', '2024-11-03 10:54:53', '2024-11-03 10:54:53');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `evaluations`
--
ALTER TABLE `evaluations`
  ADD CONSTRAINT `evaluations_ibfk_1` FOREIGN KEY (`juryId`) REFERENCES `juries` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `evaluations_ibfk_2` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `hackathonjuries`
--
ALTER TABLE `hackathonjuries`
  ADD CONSTRAINT `hackathonjuries_ibfk_1` FOREIGN KEY (`hackathonId`) REFERENCES `hackathons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hackathonjuries_ibfk_2` FOREIGN KEY (`juryId`) REFERENCES `juries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `juries`
--
ALTER TABLE `juries`
  ADD CONSTRAINT `juries_ibfk_1` FOREIGN KEY (`juryUserId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `mentorassignments`
--
ALTER TABLE `mentorassignments`
  ADD CONSTRAINT `mentorassignments_ibfk_1` FOREIGN KEY (`mentorId`) REFERENCES `mentors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `mentorassignments_ibfk_2` FOREIGN KEY (`teamId`) REFERENCES `teams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `mentoringsessions`
--
ALTER TABLE `mentoringsessions`
  ADD CONSTRAINT `mentoringsessions_ibfk_1` FOREIGN KEY (`mentorId`) REFERENCES `mentors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `mentoringsessions_ibfk_2` FOREIGN KEY (`teamId`) REFERENCES `teams` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `mentoringsessions_ibfk_3` FOREIGN KEY (`hackathonId`) REFERENCES `hackathons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `mentors`
--
ALTER TABLE `mentors`
  ADD CONSTRAINT `mentors_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`hackathonId`) REFERENCES `hackathons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`teamId`) REFERENCES `teams` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `teammembers`
--
ALTER TABLE `teammembers`
  ADD CONSTRAINT `teammembers_ibfk_1` FOREIGN KEY (`teamId`) REFERENCES `teams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `teammembers_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `teammentorassignments`
--
ALTER TABLE `teammentorassignments`
  ADD CONSTRAINT `teammentorassignments_ibfk_1` FOREIGN KEY (`teamId`) REFERENCES `teams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `teammentorassignments_ibfk_2` FOREIGN KEY (`mentorId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `teams`
--
ALTER TABLE `teams`
  ADD CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`hackathonId`) REFERENCES `hackathons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
