-- MySQL dump 10.13  Distrib 5.7.30, for Linux (x86_64)
--
-- Host: localhost    Database: bimbingan
-- ------------------------------------------------------
-- Server version	5.7.30-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `antrian`
--

DROP TABLE IF EXISTS `antrian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `antrian` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idMahasiswa` int(11) NOT NULL,
  `idDosen` int(11) NOT NULL,
  `waktu` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idDosen` (`idDosen`),
  KEY `idMahasiswa` (`idMahasiswa`),
  CONSTRAINT `antrian_ibfk_3` FOREIGN KEY (`idDosen`) REFERENCES `dosen` (`id`),
  CONSTRAINT `antrian_ibfk_4` FOREIGN KEY (`idMahasiswa`) REFERENCES `mahasiswa` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `antrian`
--

LOCK TABLES `antrian` WRITE;
/*!40000 ALTER TABLE `antrian` DISABLE KEYS */;
INSERT INTO `antrian` VALUES (2,12,24,'1594971420825','completed'),(3,12,24,'1594971752396','completed'),(4,12,24,'1594971803994','completed'),(6,12,24,'1594971851389','completed'),(9,12,24,'1594973462544','completed'),(10,11,24,'1594973466763','completed'),(11,12,24,'1594973509316','completed'),(12,11,24,'1594973511488','completed'),(13,12,24,'1594973540728','completed'),(14,11,24,'1594973541987','completed'),(16,11,24,'1594973566811','completed'),(17,12,24,'1594973570499','completed'),(18,11,24,'1594976994914','completed'),(19,11,24,'1594979315510','completed'),(25,14,24,'1594993269094','completed'),(26,11,24,'1595049421016','completed'),(27,12,24,'1595049432669','completed'),(31,11,24,'1595049645296','completed'),(32,12,24,'1595049653357','completed'),(33,11,24,'1595049655359','completed');
/*!40000 ALTER TABLE `antrian` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dosen`
--

DROP TABLE IF EXISTS `dosen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dosen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nip` varchar(255) NOT NULL,
  `namaLengkap` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `idFakultas` int(11) NOT NULL,
  `idGender` int(11) NOT NULL,
  `alamat` varchar(255) NOT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `avatar` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `idFakultas` (`idFakultas`),
  KEY `idGender` (`idGender`),
  CONSTRAINT `dosen_ibfk_1` FOREIGN KEY (`idFakultas`) REFERENCES `fakultas` (`id`),
  CONSTRAINT `dosen_ibfk_2` FOREIGN KEY (`idGender`) REFERENCES `gender` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dosen`
--

LOCK TABLES `dosen` WRITE;
/*!40000 ALTER TABLE `dosen` DISABLE KEYS */;
INSERT INTO `dosen` VALUES (23,'888908','Felipe Johnson','felipejohnson','$2b$10$NB0REmjR.xyjPSUSLSkaGeCdM1oLWX43NgU7NJnvaIVlUhZPP0J2u',1,1,'NYC, USA',0,'professorMale3'),(24,'8675567565','Mariana Saswita','marianasaswita','$2b$10$DyUJ9E..ylKCHxOI.F9LK.iAG1T5X10//oTOEBWAM/Kbds.f2lVYy',1,2,'San fransisco, USA',0,'professorFemale3'),(25,'85566899','Gerald Panggali','geraldpanggali','$2b$10$Q2qR.cUke.6t3zjR4GH//uTeDXWPDYf0uLfUCHfapquOpwSpXsl82',2,1,'San fransisco, USA',0,'professorMale1'),(26,'765444556','Iriana Haruna','irianaharuna','$2b$10$LORbu9yW4uCY5jVojPgqMuhIWByvUgThpHlv1thVjP01ATrFf.KCm',2,2,'Colorado, USA',0,'professorFemale3');
/*!40000 ALTER TABLE `dosen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fakultas`
--

DROP TABLE IF EXISTS `fakultas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fakultas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nama` (`nama`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fakultas`
--

LOCK TABLES `fakultas` WRITE;
/*!40000 ALTER TABLE `fakultas` DISABLE KEYS */;
INSERT INTO `fakultas` VALUES (2,'Ekonomi'),(1,'Fastikom'),(3,'Tarbiyah');
/*!40000 ALTER TABLE `fakultas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gender`
--

DROP TABLE IF EXISTS `gender`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gender` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gender`
--

LOCK TABLES `gender` WRITE;
/*!40000 ALTER TABLE `gender` DISABLE KEYS */;
INSERT INTO `gender` VALUES (1,'Laki-laki'),(2,'Perempuan');
/*!40000 ALTER TABLE `gender` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mahasiswa`
--

DROP TABLE IF EXISTS `mahasiswa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mahasiswa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nim` varchar(255) NOT NULL,
  `namaLengkap` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `idProdi` int(11) NOT NULL,
  `semester` int(11) NOT NULL,
  `idGender` int(11) NOT NULL,
  `alamat` varchar(255) NOT NULL,
  `idDosen` int(11) NOT NULL,
  `avatar` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idDosen` (`idDosen`),
  KEY `prodi` (`idProdi`),
  KEY `idGender` (`idGender`),
  CONSTRAINT `mahasiswa_ibfk_1` FOREIGN KEY (`idDosen`) REFERENCES `dosen` (`id`),
  CONSTRAINT `mahasiswa_ibfk_2` FOREIGN KEY (`idProdi`) REFERENCES `prodi` (`id`),
  CONSTRAINT `mahasiswa_ibfk_3` FOREIGN KEY (`idGender`) REFERENCES `gender` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mahasiswa`
--

LOCK TABLES `mahasiswa` WRITE;
/*!40000 ALTER TABLE `mahasiswa` DISABLE KEYS */;
INSERT INTO `mahasiswa` VALUES (11,'2017353453','Jyahn Doe','jyahndoe','$2b$10$Fu4hJb6yi0sjMN.INltsAum37ni7J18bTSRJIlE4HvJ4XbC6yuEAC',1,3,1,'Colorado, USA',24,'studentMale2'),(12,'20178908789','Diana larasati','dianalarasati','$2b$10$OmWOHvJHLDarvvoPNmxNzeB/.d/YQ.rYN5RcTm/sjMbCLayMa5LiW',10,7,2,'Jakarta, Indonesia',24,'studentFemale3'),(13,'234324324','Harold Howard','dfdfsfsdfsdfsdf','$2b$10$0eBkp1qrOK3JMYzy4FvFoe8p3FU0DUOOCQfjDjXqWXwJJA8V7zolu',10,4,1,'NYC, USA',24,'studentMale1'),(14,'4','Harold Howard','dfdfsfsdfsdfsdfa','$2b$10$m1t1YekL.uVkmnR5RKHg8eQJNdFtQTWHHpa9BQ9UpP/6m1Wba6H2a',10,2,1,'NYC, USA',24,'studentMale1');
/*!40000 ALTER TABLE `mahasiswa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prodi`
--

DROP TABLE IF EXISTS `prodi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prodi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) NOT NULL,
  `idFakultas` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nama` (`nama`),
  KEY `idFakultas` (`idFakultas`),
  CONSTRAINT `prodi_ibfk_1` FOREIGN KEY (`idFakultas`) REFERENCES `fakultas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prodi`
--

LOCK TABLES `prodi` WRITE;
/*!40000 ALTER TABLE `prodi` DISABLE KEYS */;
INSERT INTO `prodi` VALUES (1,'Teknik informatika',1),(10,'Teknik sipil',1),(12,'Ekonomi',2),(13,'Akuntansi',2),(14,'Pendidikan agama',3),(15,'Ilmu tafsir',3);
/*!40000 ALTER TABLE `prodi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('1bZB-TCgWN1YE2FcvtDda3jIi2wca--2',1597641767,'{\"cookie\":{\"originalMaxAge\":2592000000,\"expires\":\"2020-08-16T08:07:56.024Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":{\"id\":11,\"role\":\"student\"}}}'),('9dbnzlrMj7flPbEcVsd1VbN1H8QBSalI',1597643085,'{\"cookie\":{\"originalMaxAge\":2592000000,\"expires\":\"2020-08-17T05:40:58.667Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":{\"id\":24,\"role\":\"professor\"}}}'),('E7H2RdtUM8zKzjZ_zU6Hxe_osuvkbpdS',1597570655,'{\"cookie\":{\"originalMaxAge\":2591999999,\"expires\":\"2020-08-16T09:09:51.265Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":{\"id\":24,\"role\":\"professor\"}}}'),('EhaAnjqroaUdgleGJHTYtQ3MV25GYVZN',1597399819,'{\"cookie\":{\"originalMaxAge\":2592000000,\"expires\":\"2020-08-14T10:09:25.490Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":{\"id\":22,\"role\":\"professor\"}}}'),('M5zWV8Pkb_viqnMaLufV8knOpFgVK3Gd',1597581548,'{\"cookie\":{\"originalMaxAge\":2592000000,\"expires\":\"2020-08-16T12:38:48.681Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":{\"id\":11,\"role\":\"student\"}}}'),('N_KbMuksqLB1DkZTiEE1yDrCuzvtzkAT',1597571687,'{\"cookie\":{\"originalMaxAge\":2592000000,\"expires\":\"2020-08-16T09:52:03.145Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":{\"id\":11,\"role\":\"student\"}}}'),('c_FP3yT3v7z52d4P09JYcnyZUKD7fXDI',1597641767,'{\"cookie\":{\"originalMaxAge\":2592000000,\"expires\":\"2020-08-17T05:16:48.322Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":{\"id\":12,\"role\":\"student\"}}}'),('eNZ1TrGmHQmLa2_Leam7rzgCoVMT0vJt',1597495609,'{\"cookie\":{\"originalMaxAge\":2592000000,\"expires\":\"2020-08-15T12:45:40.202Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":{\"id\":24,\"role\":\"professor\"}}}'),('p5y3yCmTmBDNdcOnB7w4AjC3ywl7lfGA',1597564077,'{\"cookie\":{\"originalMaxAge\":2592000000,\"expires\":\"2020-08-16T07:35:28.678Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":{\"id\":24,\"role\":\"professor\"}}}'),('sBT9-lDzUYJsRqf3PJkI-jrV5m6iE1YT',1597585531,'{\"cookie\":{\"originalMaxAge\":2592000000,\"expires\":\"2020-08-16T13:30:23.329Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":{\"id\":14,\"role\":\"student\"}}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-07-19 12:17:33
