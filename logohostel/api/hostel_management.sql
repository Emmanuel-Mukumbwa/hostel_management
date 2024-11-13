-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 08, 2024 at 06:36 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hostel_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `hostel`
--

CREATE TABLE `hostel` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `capacity` int(11) NOT NULL,
  `room_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hostel`
--

INSERT INTO `hostel` (`id`, `name`, `location`, `capacity`, `room_id`) VALUES
(1, 'logo', 'mzuni', 21, 1);

-- --------------------------------------------------------

--
-- Table structure for table `maintenance_replies`
--

CREATE TABLE `maintenance_replies` (
  `id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `scheduled_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `maintenance_replies`
--

INSERT INTO `maintenance_replies` (`id`, `request_id`, `message`, `scheduled_date`, `created_at`, `username`) VALUES
(5, 8, 'problem noted', '2024-11-05', '2024-11-05 16:51:09', 'Anthony'),
(6, 8, 'sending technician', '2024-11-16', '2024-11-06 08:43:18', 'Anthony');

-- --------------------------------------------------------

--
-- Table structure for table `maintenance_requests`
--

CREATE TABLE `maintenance_requests` (
  `id` int(11) NOT NULL,
  `category` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','in progress','completed') DEFAULT 'pending',
  `room_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `maintenance_requests`
--

INSERT INTO `maintenance_requests` (`id`, `category`, `description`, `created_at`, `status`, `room_id`, `username`) VALUES
(8, 'Electrical', 'Sockets not functioning', '2024-11-05 16:44:18', 'completed', 18, 'Anthony');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `room_number` varchar(50) NOT NULL,
  `duration` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `payment_proof` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(50) NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `username`, `email`, `room_number`, `duration`, `total_price`, `payment_proof`, `created_at`, `status`) VALUES
(3, 'emmanuel', 'emukumbwa2419@gmail.com', '1', 7, 10500.00, 'uploads/developing.png', '2024-11-08 05:28:36', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`) VALUES
(1, 'Admin'),
(2, 'Landlord'),
(3, 'normal');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `room_number` int(11) NOT NULL DEFAULT 0,
  `room_detail_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `name`, `is_available`, `room_number`, `room_detail_id`) VALUES
(1, 'Room 1', 0, 1, 1),
(2, 'Room 2', 1, 2, 2),
(3, 'Room 3', 1, 3, 1),
(4, 'Room 4', 0, 4, 2),
(5, 'Room 5', 1, 5, 2),
(6, 'Room 6', 0, 6, 1),
(7, 'Room 7', 1, 7, 2),
(8, 'Room 8', 0, 8, 2),
(9, 'Room 9', 1, 9, 1),
(10, 'Room 10', 0, 10, 1),
(11, 'Room 11', 1, 11, 1),
(12, 'Room 12', 0, 12, 1),
(13, 'Room 13', 1, 13, 1),
(14, 'Room 14', 1, 14, 1),
(15, 'Room 15', 1, 15, 1),
(16, 'Room 16', 1, 16, 2),
(17, 'Room 17', 1, 17, 2),
(18, 'Room 18', 0, 18, 1),
(19, 'Room 19', 1, 19, 1),
(20, 'Room 20', 1, 20, 1),
(21, 'Room 21', 1, 21, 2);

-- --------------------------------------------------------

--
-- Table structure for table `room_details`
--

CREATE TABLE `room_details` (
  `id` int(11) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `number_of_beds` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room_details`
--

INSERT INTO `room_details` (`id`, `type`, `price`, `number_of_beds`) VALUES
(1, 'single', 45000.00, 1),
(2, 'double', 35000.00, 2);

-- --------------------------------------------------------

--
-- Table structure for table `room_reservations`
--

CREATE TABLE `room_reservations` (
  `reservation_id` int(11) NOT NULL,
  `room_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `check_in_date` date DEFAULT NULL,
  `check_out_date` date DEFAULT NULL,
  `status` enum('pending','confirmed','canceled') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room_reservations`
--

INSERT INTO `room_reservations` (`reservation_id`, `room_id`, `user_id`, `check_in_date`, `check_out_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 14, '2024-11-08', '2024-11-22', '', '2024-11-07 04:54:57', '2024-11-07 12:44:05'),
(2, 1, 14, '2024-11-09', '2024-11-16', 'pending', '2024-11-08 05:11:17', '2024-11-08 05:11:17');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `contact` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role_id`, `email`, `contact`) VALUES
(5, 'admin', '$2y$10$MqnxDKcq9tO3Rut.LKuveOCzSTMC0mUp.Lc8y0akER7d8nTW1ZM7K', 1, 'admin@admin.com', '0999000008'),
(7, 'landlord', '$2y$10$fEK7ldwplpagTiwi9dFmC.LTsFVzaBdyRe9C6numuIATMaSh42o5C', 2, 'landlord@landlord.com', '1234567890'),
(14, 'emmanuel', '$2y$10$nALgQTHWEdoL6LFjN4yC6OwZpakQ4setGJymwQzs5Kw8MgASFkGgO', 3, 'emukumbwa2419@gmail.com', '0992374652'),
(15, 'geoff', '$2y$10$AQj/Y4IVTEfVtUrcAGe5JO6Sgy1XS42GHE.hgjIV0za7IPURfO/3y', 3, 'g@gmail.com', '0995914033'),
(17, 'Anthony', '$2y$10$HXOdNPjIBQxHggiSZO5Uh.V0AGUbGtCW2z6eiFW75goMxnHUKLsNy', 3, 'chaimadeputy@gmail.com', '0882138072'),
(18, 'arelic', '$2y$10$OxkS83F7yllrPde7aZIyLeoGD7kCcr2.fbmkUL4Kkdri51Gb0TWL6', 3, 'arelic@gmail.com', '0987654322');

-- --------------------------------------------------------

--
-- Table structure for table `user_loyalty`
--

CREATE TABLE `user_loyalty` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `total_days_stayed` int(11) DEFAULT 0,
  `loyalty_discount` decimal(5,2) DEFAULT 0.00,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_loyalty`
--

INSERT INTO `user_loyalty` (`id`, `username`, `total_days_stayed`, `loyalty_discount`, `last_updated`) VALUES
(1, 'emanuel', 12, 0.00, '2024-11-05 08:44:56'),
(2, 'geoff', 125, 999.99, '2024-11-05 09:51:11'),
(3, 'Anthony', 99, 999.99, '2024-11-05 16:36:32'),
(4, 'Anthony', 115, 999.99, '2024-11-05 16:39:04'),
(5, 'emmanuel', 20, 0.00, '2024-11-05 17:12:38'),
(6, 'emmanuel', 8, 0.00, '2024-11-05 18:17:29'),
(7, 'emmanuel', 15, 0.00, '2024-11-05 18:18:15'),
(8, 'emmanuel', 15, 0.00, '2024-11-05 18:19:38'),
(9, 'emmanuel', 15, 0.00, '2024-11-05 18:20:02'),
(10, 'emmanuel', 9, 0.00, '2024-11-05 18:22:59');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `hostel`
--
ALTER TABLE `hostel`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `maintenance_replies`
--
ALTER TABLE `maintenance_replies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `request_id` (`request_id`);

--
-- Indexes for table `maintenance_requests`
--
ALTER TABLE `maintenance_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`email`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_detail_id` (`room_detail_id`);

--
-- Indexes for table `room_details`
--
ALTER TABLE `room_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room_reservations`
--
ALTER TABLE `room_reservations`
  ADD PRIMARY KEY (`reservation_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `user_loyalty`
--
ALTER TABLE `user_loyalty`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `hostel`
--
ALTER TABLE `hostel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `maintenance_replies`
--
ALTER TABLE `maintenance_replies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `maintenance_requests`
--
ALTER TABLE `maintenance_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `room_details`
--
ALTER TABLE `room_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `room_reservations`
--
ALTER TABLE `room_reservations`
  MODIFY `reservation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `user_loyalty`
--
ALTER TABLE `user_loyalty`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `hostel`
--
ALTER TABLE `hostel`
  ADD CONSTRAINT `hostel_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`);

--
-- Constraints for table `maintenance_replies`
--
ALTER TABLE `maintenance_replies`
  ADD CONSTRAINT `maintenance_replies_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `maintenance_requests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `maintenance_requests`
--
ALTER TABLE `maintenance_requests`
  ADD CONSTRAINT `maintenance_requests_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`room_detail_id`) REFERENCES `room_details` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
