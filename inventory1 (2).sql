-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 05, 2017 at 09:49 AM
-- Server version: 5.6.12-log
-- PHP Version: 5.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `inventory1`
--
CREATE DATABASE IF NOT EXISTS `inventory1` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `inventory1`;

-- --------------------------------------------------------

--
-- Table structure for table `detail_transaksi`
--

CREATE TABLE IF NOT EXISTS `detail_transaksi` (
  `idtransaksi` int(11) NOT NULL,
  `idproduk` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `base_id` varchar(11) DEFAULT NULL,
  `base_qty` varchar(15) DEFAULT NULL,
  `total_qty` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `detail_transaksi`
--

INSERT INTO `detail_transaksi` (`idtransaksi`, `idproduk`, `quantity`, `base_id`, `base_qty`, `total_qty`) VALUES
(237, 42, 1, '50', '75', '75'),
(238, 42, 1, '50', '75', '75'),
(239, 42, 1, '50', '75', '75'),
(240, 42, 1, '50', '75', '75'),
(241, 42, 1, '50', '75', '75'),
(242, 42, 1, '50', '75', '75'),
(243, 42, 1, '50', '75', '75'),
(244, 42, 1, '50', '75', '75'),
(245, 42, 1, '50', '75', '75'),
(246, 42, 1, '50', '75', '75'),
(247, 42, 1, '50', '75', '75'),
(248, 40, 1, '1', '75', '75'),
(249, 45, 1, '1', '75', '75'),
(250, 42, 1, '50', '75', '75'),
(251, 42, 1, '50', '75', '75'),
(252, 42, 1, '50', '75', '75'),
(253, 42, 1, '50', '75', '75'),
(254, 42, 1, '50', '75', '75'),
(255, 42, 1, '50', '75', '75'),
(256, 36, 1, '1', '80', '80'),
(257, 42, 1, '50', '75', '75'),
(258, 42, 1, '50', '75', '75'),
(259, 42, 1, '50', '75', '75'),
(260, 35, 1, '1', '80', '80'),
(261, 42, 1, '50', '75', '75'),
(262, 42, 1, '50', '75', '75'),
(263, 42, 1, '50', '75', '75'),
(264, 41, 1, '1', '75', '75'),
(265, 42, 1, '50', '75', '75'),
(266, 42, 1, '50', '75', '75'),
(267, 45, 1, '1', '75', '75'),
(268, 45, 1, '1', '75', '75'),
(268, 39, 1, '1', '75', '75'),
(269, 39, 1, '1', '75', '75'),
(269, 45, 1, '1', '75', '75'),
(270, 45, 1, '1', '75', '75'),
(270, 44, 1, '1', '75', '75'),
(270, 39, 1, '1', '75', '75'),
(270, 42, 1, '50', '75', '75'),
(270, 41, 1, '1', '75', '75'),
(270, 37, 1, '1', '75', '75'),
(270, 36, 1, '1', '80', '80');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE IF NOT EXISTS `inventory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `inventory_name` varchar(200) NOT NULL,
  `harga` double NOT NULL,
  `stok` int(11) NOT NULL,
  `available_stock` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=56 ;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`id`, `inventory_name`, `harga`, `stok`, `available_stock`, `created_at`) VALUES
(54, 'Vanila', 0, 500, '500', '2017-01-19 03:59:21'),
(55, 'Dry Fruit', 0, 500, '500', '2017-01-19 03:59:35');

-- --------------------------------------------------------

--
-- Table structure for table `produk`
--

CREATE TABLE IF NOT EXISTS `produk` (
  `idproduk` int(11) NOT NULL AUTO_INCREMENT,
  `nama_produk` varchar(200) NOT NULL,
  `harga` double NOT NULL,
  `stok` int(11) NOT NULL,
  `idkategori` int(11) NOT NULL,
  PRIMARY KEY (`idproduk`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=46 ;

--
-- Dumping data for table `produk`
--

INSERT INTO `produk` (`idproduk`, `nama_produk`, `harga`, `stok`, `idkategori`) VALUES
(1, 'Strawberry (70 ml)\n', 69, 0, 1),
(2, 'Blue Berry (70 ml)', 99, 0, 2),
(3, 'Green Ape (70 ml)', 69, 0, 1),
(4, 'Masala Peru (70 ml)', 79, 0, 1),
(5, 'Real kiwi (70 ml)', 79, 0, 1),
(6, 'Berry Blast (70 ml)', 79, 0, 1),
(7, 'ButterScotch Apple (70 ml)', 89, 0, 1),
(8, 'Fresh Strawberry (70 ml)', 99, 0, 1),
(9, 'Real Alphonso (70 ml)', 99, 0, 1),
(10, 'Kaccha Aam (70 ml)', 79, 0, 1),
(11, 'Peach And Apricot (70 ml)', 89, 0, 1),
(12, 'Oreo crumble (75 ml)', 89, 0, 1),
(13, 'Choco Pie (75 ml)', 89, 0, 1),
(14, 'Choco muffins (75 ml)', 89, 0, 1),
(15, 'Choco Almond Fudge (75 ml)', 89, 0, 1),
(16, 'Bournvita (75 ml)', 89, 0, 1),
(17, 'Plum Cake (75 ml)', 99, 0, 1),
(18, 'Nutella', 99, 0, 1),
(19, 'Oreo nutella (75 ml)', 99, 0, 1),
(20, 'Nutella Almond (75 ml)', 109, 0, 1),
(21, 'Ferrero Rocher (75 ml)', 119, 0, 1),
(22, 'Rocher nutella (75 ml)', 129, 0, 1),
(23, 'Double Rocher (75 ml)', 149, 0, 1),
(24, 'dark fantasy (75 ml)', 129, 0, 1),
(25, 'Brownie (75 ml)', 149, 0, 1),
(26, 'Choco Coco (75 ml)', 129, 0, 1),
(27, 'Bourborn (75 ml)', 89, 0, 1),
(28, 'Chocochips (75 ml)', 99, 0, 1),
(29, 'Anjeer (80ml)', 89, 0, 1),
(30, 'Rajbhog (80ml)', 99, 0, 1),
(31, 'Gulkand Dry fruits (80ml)', 109, 0, 1),
(32, 'Choco Anjeer (80ml)', 99, -1004, 1),
(33, 'Honey Dry fruits (80ml)', 109, 0, 1),
(34, 'Nut overload (80ml)', 109, 0, 1),
(35, 'Choco Dry fruits (80ml)', 109, 0, 1),
(36, 'Shahi Dawat (80ml)', 119, 0, 1),
(37, 'Mirchi (75 ml)', 69, 0, 1),
(38, 'Gulkand (75 ml)', 79, 0, 1),
(39, 'Masala Pan (75 ml)', 89, 0, 1),
(40, 'Gulab Jamun (75 ml)', 89, 0, 1),
(41, 'Chocolate Pan (75 ml)', 99, 0, 1),
(42, 'Lonavala Chikki (75 ml)', 99, 55, 50),
(43, 'Gajar Halwa (75 ml)', 119, 0, 1),
(44, 'Spicy Mango (75 ml)', 99, -1, 1),
(45, 'Shahi Pan (75 ml)', 119, -112, 1);

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE IF NOT EXISTS `transaksi` (
  `idtransaksi` int(11) NOT NULL AUTO_INCREMENT,
  `totalitems` int(11) NOT NULL,
  `totalcost` double NOT NULL,
  `bayar` double NOT NULL,
  `kembali` double NOT NULL,
  `first_name` varchar(32) DEFAULT NULL,
  `last_name` varchar(32) DEFAULT NULL,
  `mobile_no` varchar(15) DEFAULT NULL,
  `payment_type` varchar(20) DEFAULT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`idtransaksi`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=271 ;

--
-- Dumping data for table `transaksi`
--

INSERT INTO `transaksi` (`idtransaksi`, `totalitems`, `totalcost`, `bayar`, `kembali`, `first_name`, `last_name`, `mobile_no`, `payment_type`, `date`) VALUES
(237, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-19 00:00:00'),
(238, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-19 00:00:00'),
(239, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-19 00:00:00'),
(240, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-19 00:00:00'),
(241, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-19 00:00:00'),
(242, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-19 00:00:00'),
(243, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-19 00:00:00'),
(244, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-19 00:00:00'),
(245, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-19 00:00:00'),
(246, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-19 00:00:00'),
(247, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-19 00:00:00'),
(248, 1, 89, 0, 0, '', '', '', 'Cash', '2017-01-19 00:00:00'),
(249, 1, 119, 0, 0, '', '', '', 'Cash', '2017-01-19 00:00:00'),
(250, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-19 00:00:00'),
(251, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-19 00:00:00'),
(252, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-19 00:00:00'),
(253, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-22 00:00:00'),
(254, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-22 00:00:00'),
(255, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-22 00:00:00'),
(256, 1, 119, 0, 0, '', '', '', 'Cash', '2017-01-22 00:00:00'),
(257, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-22 00:00:00'),
(258, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-22 00:00:00'),
(259, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-22 00:00:00'),
(260, 1, 109, 0, 0, '', '', '', 'Cash', '2017-01-22 00:00:00'),
(261, 1, 99, 0, 0, '', '', '', 'Cash', '0000-00-00 00:00:00'),
(262, 1, 99, 0, 0, '', '', '', 'Cash', '2013-10-04 08:51:32'),
(263, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-22 15:30:13'),
(264, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-22 15:30:47'),
(265, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-22 16:06:54'),
(266, 1, 99, 0, 0, '', '', '', 'Cash', '2017-01-22 16:07:57'),
(267, 1, 119, 0, 0, '', '', '', 'Cash', '2017-02-05 15:09:26'),
(268, 2, 208, 0, 0, '', '', '', 'Cash', '2017-02-05 15:09:54'),
(269, 2, 208, 0, 0, '', '', '', 'Cash', '2017-02-05 15:10:56'),
(270, 7, 693, 0, 0, '', '', '', 'Cash', '2017-02-05 15:13:32');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `iduser` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(20) NOT NULL,
  `nama_lengkap` varchar(80) NOT NULL,
  PRIMARY KEY (`iduser`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`iduser`, `username`, `email`, `password`, `nama_lengkap`) VALUES
(1, 'kelvin77', 'Kelvin 77', 'kelvin77', 'kelvin77');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
