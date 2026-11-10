-- ONLY run this if you previously created USERS using the original
-- lab 7.zip schema with NAME and PASSWORD_HASH, and want to keep its rows.
-- Do NOT run this on a USERS table that already has USERNAME and PASSWORD.
USE practice_lab;
ALTER TABLE USERS
    CHANGE COLUMN name USERNAME VARCHAR(255) NOT NULL,
    CHANGE COLUMN password_hash PASSWORD VARCHAR(255) NOT NULL,
    ADD COLUMN ROLE ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    ADD COLUMN MANAGER_ID INT NULL;

ALTER TABLE USERS
    ADD CONSTRAINT fk_users_manager
        FOREIGN KEY (MANAGER_ID) REFERENCES USERS(ID)
        ON DELETE SET NULL;
