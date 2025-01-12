-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: localhost:8889
-- Время создания: Янв 12 2025 г., 14:02
-- Версия сервера: 8.0.35
-- Версия PHP: 8.2.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `movie-tracker`
--

-- --------------------------------------------------------

--
-- Структура таблицы `migrations`
--

CREATE TABLE `migrations` (
  `id` int NOT NULL,
  `timestamp` bigint NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `movie`
--

CREATE TABLE `movie` (
  `title` varchar(255) NOT NULL DEFAULT 'Untitled',
  `year` int NOT NULL,
  `country` varchar(255) DEFAULT NULL,
  `runtime` int DEFAULT NULL,
  `watched` tinyint NOT NULL DEFAULT '0',
  `currentMinute` int DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `userId` int DEFAULT NULL,
  `imdbID` varchar(255) DEFAULT NULL,
  `id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `movie`
--

INSERT INTO `movie` (`title`, `year`, `country`, `runtime`, `watched`, `currentMinute`, `createdAt`, `updatedAt`, `userId`, `imdbID`, `id`) VALUES
('The Super Mario Bros. Movie', 2023, 'N/A', NULL, 0, 0, '2024-12-04 10:59:56.553525', '2024-12-04 10:59:56.553525', 8, 'tt6718170', 2),
('Scary Movie 2', 2001, 'N/A', NULL, 0, 0, '2024-12-04 11:00:18.348612', '2024-12-04 11:00:18.348612', 8, 'tt0257106', 3),
('Scary Movie 3', 2003, 'N/A', NULL, 0, 0, '2024-12-04 11:15:44.077531', '2024-12-04 11:15:44.077531', 8, 'tt0306047', 4),
('Scary Movie', 2000, 'N/A', NULL, 0, 0, '2024-12-04 12:10:43.958610', '2024-12-04 12:10:43.958610', 8, 'tt0175142', 5),
('Not Another Teen Movie', 2001, 'N/A', NULL, 0, 0, '2024-12-04 12:14:21.683361', '2024-12-04 12:14:21.683361', 8, 'tt0277371', 6),
('The Lego Movie', 2014, 'N/A', NULL, 0, 0, '2024-12-04 12:14:33.611173', '2024-12-04 12:14:33.611173', 8, 'tt1490017', 7),
('Not Another Teen Movie', 2001, 'United States', NULL, 1, 0, '2024-12-11 15:31:11.702320', '2024-12-11 19:20:22.000000', 11, 'tt0277371', 23),
('The Simpsons Movie', 2007, 'United States, North Korea, South Korea', NULL, 0, 0, '2024-12-11 15:32:44.509697', '2024-12-11 15:32:44.509697', 9, 'tt0462538', 25),
('The Super Mario Bros. Movie', 2023, 'United States, Japan', NULL, 1, 20, '2024-12-11 19:20:41.734748', '2024-12-11 19:20:48.000000', 10, 'tt6718170', 26),
('Bee Movie', 2007, 'United States, Canada', NULL, 0, 0, '2024-12-11 19:26:01.810573', '2024-12-11 19:26:01.810573', 9, 'tt0389790', 27),
('The Lego Movie', 2014, 'United States, Denmark, Australia, Norway', NULL, 0, 0, '2024-12-11 19:26:07.883512', '2024-12-11 19:26:07.883512', 9, 'tt1490017', 28),
('Scary Movie', 2000, 'United States', NULL, 0, 0, '2024-12-11 19:26:10.815465', '2024-12-11 19:26:10.815465', 9, 'tt0175142', 29),
('Scary Movie 3', 2003, 'United States, Canada', NULL, 0, 0, '2025-01-10 21:19:24.002244', '2025-01-10 21:19:24.002244', 9, 'tt0306047', 30);

-- --------------------------------------------------------

--
-- Структура таблицы `series`
--

CREATE TABLE `series` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `country` varchar(255) DEFAULT NULL,
  `season` int NOT NULL,
  `episode` int NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `userId` int DEFAULT NULL,
  `watched` tinyint NOT NULL DEFAULT '0',
  `currentSeason` int DEFAULT NULL,
  `currentEpisode` int DEFAULT NULL,
  `year` varchar(255) NOT NULL,
  `imdbID` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `series`
--

INSERT INTO `series` (`id`, `title`, `country`, `season`, `episode`, `createdAt`, `updatedAt`, `userId`, `watched`, `currentSeason`, `currentEpisode`, `year`, `imdbID`) VALUES
(32, 'Mr. Bean: The Animated Series', 'United Kingdom', 1, 1, '2024-12-11 15:26:39.381549', '2024-12-11 15:26:39.381549', 10, 0, 1, 1, '2002', 'tt0280277'),
(33, 'Superman: The Animated Series', 'United States, Japan, South Korea', 1, 1, '2024-12-11 15:27:47.772282', '2024-12-11 15:30:24.000000', 8, 1, 1, 4, '1996', 'tt0115378'),
(34, 'The Divergent Series: Insurgent', 'United States, Canada', 1, 1, '2024-12-11 15:37:53.854241', '2024-12-11 15:37:53.854241', 11, 0, 1, 1, '2015', 'tt2908446'),
(35, 'Superman: The Animated Series', 'United States, Japan, South Korea', 1, 1, '2024-12-11 19:21:06.955167', '2024-12-11 19:21:06.955167', 9, 0, 1, 1, '1996', 'tt0115378'),
(36, 'From Dusk Till Dawn: The Series', 'United States', 1, 1, '2024-12-11 19:28:23.063958', '2024-12-11 19:28:23.063958', 9, 0, 1, 1, '2014', 'tt3337194');

-- --------------------------------------------------------

--
-- Структура таблицы `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `createdAt`, `updatedAt`) VALUES
(8, 'jojo@mail.ru', '$2a$10$hmVRyTtm6X9bZA6JN3mQIexsMcB6WMETxnjTuyMNc8zPWhj0zWfHu', '2024-12-03 22:59:37.652455', '2024-12-03 22:59:37.652455'),
(9, 'sonya@mail.ru', '$2a$10$aQfJ11xGQgd/VA6Fy4NAj.6KB.Z1TIa3LKEBB501DHCLlGiYz0H2e', '2024-12-04 12:15:51.908985', '2024-12-04 12:15:51.908985'),
(10, 'ddd@mail.ru', '$2a$10$./u6TJjK7Bn7kNnb2CUqpOgjoK5dnw5.0zRL0zqZXnAzjMg5fzcsW', '2024-12-04 23:27:26.098212', '2024-12-04 23:27:26.098212'),
(11, 'mad@mail.ru', '$2a$10$HNGFI/F/.cVUmpkB9IbpdeMmvhGX5UJ8y37rfk2qo3uxZ6O/oQ2vy', '2024-12-11 13:19:01.864131', '2024-12-11 13:19:01.864131');

-- --------------------------------------------------------

--
-- Структура таблицы `user_library`
--

CREATE TABLE `user_library` (
  `id` int NOT NULL,
  `userId` int DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'watching',
  `currentMinute` int NOT NULL DEFAULT '0',
  `currentSeason` int NOT NULL DEFAULT '1',
  `currentEpisode` int NOT NULL DEFAULT '1',
  `movieId` int DEFAULT NULL,
  `seriesId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `movie`
--
ALTER TABLE `movie`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_ec7ed42b2e89092919129bdf990` (`userId`);

--
-- Индексы таблицы `series`
--
ALTER TABLE `series`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_56b2fd95ff296de2ae6d318fdfe` (`userId`);

--
-- Индексы таблицы `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`);

--
-- Индексы таблицы `user_library`
--
ALTER TABLE `user_library`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_304c4f1cbabd1088a132055ac6a` (`movieId`),
  ADD KEY `FK_a8151e30a9a680106e26ab13aa7` (`seriesId`),
  ADD KEY `FK_f17caa18ce0be8389d8cf1cc4b5` (`userId`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `movie`
--
ALTER TABLE `movie`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT для таблицы `series`
--
ALTER TABLE `series`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT для таблицы `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT для таблицы `user_library`
--
ALTER TABLE `user_library`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `movie`
--
ALTER TABLE `movie`
  ADD CONSTRAINT `FK_ec7ed42b2e89092919129bdf990` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `series`
--
ALTER TABLE `series`
  ADD CONSTRAINT `FK_56b2fd95ff296de2ae6d318fdfe` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `user_library`
--
ALTER TABLE `user_library`
  ADD CONSTRAINT `FK_304c4f1cbabd1088a132055ac6a` FOREIGN KEY (`movieId`) REFERENCES `movie` (`id`),
  ADD CONSTRAINT `FK_a8151e30a9a680106e26ab13aa7` FOREIGN KEY (`seriesId`) REFERENCES `series` (`id`),
  ADD CONSTRAINT `FK_f17caa18ce0be8389d8cf1cc4b5` FOREIGN KEY (`userId`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
