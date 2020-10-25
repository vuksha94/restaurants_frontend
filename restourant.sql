-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 23, 2020 at 04:02 PM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `restourants`
--

-- --------------------------------------------------------

--
-- Table structure for table `restourant`
--

CREATE TABLE `restourant` (
  `id` int(11) NOT NULL,
  `manager_id` int(11) NOT NULL,
  `name` varchar(32) COLLATE utf32_unicode_ci NOT NULL,
  `description` text COLLATE utf32_unicode_ci DEFAULT NULL,
  `address` varchar(64) COLLATE utf32_unicode_ci NOT NULL,
  `city_id` int(11) NOT NULL,
  `photo` varchar(128) COLLATE utf32_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

--
-- Dumping data for table `restourant`
--

INSERT INTO `restourant` (`id`, `manager_id`, `name`, `description`, `address`, `city_id`, `photo`) VALUES
(3, 1, 'Little Bay', NULL, 'Dositejeva 9a', 1, NULL),
(13, 2, 'Zvezdara Teatar', '', 'Milana Rakića 32', 1, NULL),
(14, 3, 'Majdan', 'Lep amnijent', 'Bulevar kralja Aleksandra 21', 1, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `restourant`
--
ALTER TABLE `restourant`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name_unique` (`name`) USING BTREE,
  ADD KEY `manager_id` (`manager_id`),
  ADD KEY `city_id` (`city_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `restourant`
--
ALTER TABLE `restourant`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `restourant`
--
ALTER TABLE `restourant`
  ADD CONSTRAINT `restourant_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `manager` (`id`),
  ADD CONSTRAINT `restourant_ibfk_2` FOREIGN KEY (`city_id`) REFERENCES `city` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
