CREATE TABLE `exchanged_books` (
    `ISBN` bigint(20) NOT NULL,
    `title` varchar(200) NOT NULL,
    `author` varchar(200) NOT NULL,
    `year` int(11) DEFAULT NULL,
    `semester` int(11) DEFAULT NULL,
    `edition` int(11) DEFAULT NULL,
    `description` varchar(1000) DEFAULT NULL,
    `category` char(1) NOT NULL,
    `image` int(11) DEFAULT NULL,
    `rating` decimal(4, 1) NOT NULL,
    `owner` int(11) NOT NULL,
    `highlight` varchar(200) DEFAULT NULL,
    `publisher` varchar(200) DEFAULT NULL,
    `language` char(200) DEFAULT NULL,
    `book_category` varchar(200) DEFAULT NULL,
    PRIMARY KEY (`ISBN`)
);
CREATE TABLE `student` (
    `roll_no` int(11) NOT NULL,
    `fname` varchar(30) NOT NULL,
    `lname` varchar(30) DEFAULT NULL,
    `branch` varchar(25) DEFAULT NULL,
    `email` varchar(29) DEFAULT NULL,
    `phone_no` bigint(20) NOT NULL,
    `gender` char(1) NOT NULL,
    `year` varchar(30) DEFAULT NULL,
    `sem` varchar(15) DEFAULT NULL,
    `rating` int(11) DEFAULT NULL,
    `username` varchar(30) NOT NULL,
    `password` varchar(150) NOT NULL,
    `img` varchar(200) DEFAULT NULL,
    PRIMARY KEY (`username`, `roll_no`)
);
CREATE TABLE `books` (
    `ISBN` bigint(20) NOT NULL,
    `title` varchar(200) NOT NULL,
    `author` varchar(200) NOT NULL,
    `year` int(11) DEFAULT NULL,
    `semester` int(11) DEFAULT NULL,
    `edition` int(11) DEFAULT NULL,
    `description` varchar(1000) DEFAULT NULL,
    `category` char(2) NOT NULL,
    `image` varchar(150) DEFAULT NULL,
    `rating` decimal(4, 1) NOT NULL,
    `owner` int(11) NOT NULL,
    `highlight` varchar(200) DEFAULT NULL,
    `publisher` varchar(200) DEFAULT NULL,
    `language` char(200) DEFAULT NULL,
    `book_category` varchar(200) DEFAULT NULL,
    `t_feedback` int(11) NOT NULL DEFAULT '1',
    PRIMARY KEY (`ISBN`)
);
CREATE TABLE `demand` (
    `ISBN` bigint(20) NOT NULL,
    `owner` bigint(20) NOT NULL,
    `btitle` varchar(200) NOT NULL,
    `bauthor` varchar(200) NOT NULL,
    PRIMARY KEY (`ISBN`)
);
CREATE TABLE `exchange_log` (
    `rollno` bigint(20) NOT NULL,
    `owner` bigint(20) NOT NULL,
    `isbn1` bigint(20) NOT NULL,
    `isbn2` bigint(20) NOT NULL
);
CREATE TABLE `borrow_books` (
    `rollno` bigint(20) NOT NULL,
    `owner` bigint(20) NOT NULL,
    `isbn` bigint(20) NOT NULL,
    `startdate` date NOT NULL,
    `enddate` date DEFAULT NULL,
    PRIMARY KEY (`isbn`)
);
CREATE TABLE `buybook` (
    `rollno` bigint(20) NOT NULL,
    `isbn` bigint(20) NOT NULL,
    `owner` bigint(20) NOT NULL
);
CREATE TABLE `rating` (
    `roll_no` int(11) NOT NULL AUTO_INCREMENT,
    `STARS` tinyint(4) DEFAULT NULL,
    `DESCRIPTION` varchar(1000) DEFAULT NULL,
    `ISBN` int(11) NOT NULL,
    `USERNAME` varchar(50) NOT NULL,
    PRIMARY KEY (`roll_no`)
);
CREATE TABLE `sell` (
    `ISBN` bigint(20) NOT NULL,
    `owner` bigint(20) NOT NULL,
    `price` int(11) NOT NULL,
    PRIMARY KEY (`ISBN`)
);
CREATE TABLE `rent` (
    `ISBN` bigint(20) NOT NULL,
    `owner` bigint(20) NOT NULL,
    `cost` int(11) NOT NULL,
    PRIMARY KEY (`ISBN`)
);
CREATE TABLE `transaction` (
    `TRANSID` varchar(50) NOT NULL,
    `isbn` bigint(20) NOT NULL,
    `sender_name` varchar(40) NOT NULL,
    `s_rollno` bigint(20) NOT NULL,
    `Receiver_name` varchar(40) NOT NULL,
    `r_rollno` bigint(20) NOT NULL,
    `amount` int(11) NOT NULL,
    PRIMARY KEY (`TRANSID`)
);