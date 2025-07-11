-- ===========================================
-- Script de création de la base de données AVISDEVOL pour PostgreSQL
-- Basé sur les entités AirlineEntity et RatingEntity
-- ===========================================

-- Création de la base de données (à exécuter en tant qu'administrateur)
-- CREATE DATABASE avisdevol
--     WITH 
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'fr_FR.UTF-8'
--     LC_CTYPE = 'fr_FR.UTF-8'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1;

-- Se connecter à la base de données avisdevol avant d'exécuter le reste du script

-- ===========================================
-- TYPES ENUM
-- ===========================================

-- Pas besoin de créer un type enum PostgreSQL, on utilisera des VARCHAR avec des contraintes

-- ===========================================
-- SEQUENCES
-- ===========================================

-- Séquence pour la table AIRLINE
CREATE SEQUENCE IF NOT EXISTS SEQ_AIRLINE
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Séquence pour la table RATING
CREATE SEQUENCE IF NOT EXISTS SEQ_RATING
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- ===========================================
-- TABLES
-- ===========================================

-- Table AIRLINE
CREATE TABLE IF NOT EXISTS AIRLINE (
    ID BIGINT PRIMARY KEY DEFAULT nextval('SEQ_AIRLINE'),
    NAME VARCHAR(100) NOT NULL,
    IATA_CODE VARCHAR(3) NOT NULL UNIQUE,
    ICAO_CODE VARCHAR(4) NOT NULL UNIQUE,
    COUNTRY VARCHAR(100) NOT NULL,
    ACTIVE BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT chk_iata_code_length CHECK (length(IATA_CODE) BETWEEN 2 AND 3),
    CONSTRAINT chk_icao_code_length CHECK (length(ICAO_CODE) = 3)
);

-- Table RATING
CREATE TABLE IF NOT EXISTS RATING (
    ID BIGINT PRIMARY KEY DEFAULT nextval('SEQ_RATING'),
    FLIGHT_NUMBER VARCHAR(10) NOT NULL,
    DATE DATE NOT NULL,
    CREATION_DATE DATE NOT NULL,
    RATING INTEGER NOT NULL,
    COMMENT TEXT,
    LAST_UPDATE_DATE DATE DEFAULT CURRENT_DATE,
    AIRLINE_ID BIGINT NOT NULL,
    ANSWER TEXT,
    STATUS VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED',
    CONSTRAINT fk_rating_airline FOREIGN KEY (AIRLINE_ID) REFERENCES AIRLINE(ID) ON DELETE CASCADE,
    CONSTRAINT chk_rating_range CHECK (RATING >= 1 AND RATING <= 5),
    CONSTRAINT chk_flight_number_format CHECK (FLIGHT_NUMBER ~ '^[A-Z]{2}[0-9]{1,4}$'),
    CONSTRAINT chk_status_values CHECK (STATUS IN ('PROCESSED', 'PUBLISHED', 'REJECTED'))
);

-- ===========================================
-- INDEX
-- ===========================================

-- Index sur la table RATING pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_rating_date ON RATING(DATE);
CREATE INDEX IF NOT EXISTS idx_rating_creation_date ON RATING(CREATION_DATE);
CREATE INDEX IF NOT EXISTS idx_rating_airline_id ON RATING(AIRLINE_ID);
CREATE INDEX IF NOT EXISTS idx_rating_flight_number ON RATING(FLIGHT_NUMBER);
CREATE INDEX IF NOT EXISTS idx_rating_rating ON RATING(RATING);
CREATE INDEX IF NOT EXISTS idx_rating_status ON RATING(STATUS);

-- Index sur la table AIRLINE
CREATE INDEX IF NOT EXISTS idx_airline_name ON AIRLINE(NAME);
CREATE INDEX IF NOT EXISTS idx_airline_country ON AIRLINE(COUNTRY);
CREATE INDEX IF NOT EXISTS idx_airline_active ON AIRLINE(ACTIVE);

-- ===========================================
-- DONNÉES D'EXEMPLE
-- ===========================================

-- Insertion des compagnies aériennes
INSERT INTO AIRLINE (NAME, IATA_CODE, ICAO_CODE, COUNTRY, ACTIVE) VALUES
('Air France', 'AF', 'AFR', 'France', TRUE),
('British Airways', 'BA', 'BAW', 'United Kingdom', TRUE),
('Lufthansa', 'LH', 'DLH', 'Germany', TRUE),
('KLM Royal Dutch Airlines', 'KL', 'KLM', 'Netherlands', TRUE),
('Emirates', 'EK', 'UAE', 'United Arab Emirates', TRUE),
('Qatar Airways', 'QR', 'QTR', 'Qatar', TRUE),
('Swiss International Air Lines', 'LX', 'SWR', 'Switzerland', TRUE),
('Turkish Airlines', 'TK', 'THY', 'Turkey', TRUE),
('Singapore Airlines', 'SQ', 'SIA', 'Singapore', TRUE),
('Japan Airlines', 'JL', 'JAL', 'Japan', TRUE),
('American Airlines', 'AA', 'AAL', 'United States', TRUE),
('Delta Air Lines', 'DL', 'DAL', 'United States', TRUE),
('United Airlines', 'UA', 'UAL', 'United States', TRUE),
('Air Canada', 'AC', 'ACA', 'Canada', TRUE),
('Alitalia', 'AZ', 'AZA', 'Italy', FALSE), -- Compagnie inactive
('Iberia', 'IB', 'IBE', 'Spain', TRUE),
('Scandinavian Airlines', 'SK', 'SAS', 'Sweden', TRUE),
('Austrian Airlines', 'OS', 'AUA', 'Austria', TRUE),
('TAP Air Portugal', 'TP', 'TAP', 'Portugal', TRUE),
('Aeroflot', 'SU', 'AFL', 'Russia', TRUE)
ON CONFLICT (IATA_CODE) DO NOTHING;

-- Insertion des avis/ratings
INSERT INTO RATING (FLIGHT_NUMBER, DATE, CREATION_DATE, RATING, COMMENT, LAST_UPDATE_DATE, AIRLINE_ID, ANSWER, STATUS) VALUES
-- Avis pour Air France (ID: 1)
('AF447', '2024-12-14', '2024-12-15', 5, 'Vol excellent, service impeccable et ponctualité parfaite. L''équipage était très professionnel.', '2024-12-16', 1, 'Merci pour votre retour positif ! Nous sommes ravis que votre expérience ait été à la hauteur de vos attentes.', 'PUBLISHED'),
('AF83', '2024-12-09', '2024-12-10', 4, 'Bon vol dans l''ensemble, petit retard mais service de qualité.', '2024-12-11', 1, 'Merci pour votre retour', 'PUBLISHED'),
('AF1780', '2024-12-07', '2024-12-08', 3, 'Vol correct mais repas moyen et divertissements limités.', '2024-12-09', 1, 'Merci pour votre retour', 'PUBLISHED'),
('AF254', '2024-12-04', '2024-12-05', 5, 'Première classe exceptionnelle, service aux petits soins.', '2024-12-06', 1, '', 'PROCESSED'),
('AF1148', '2024-11-30', '2024-12-01', 2, 'Retard important, pas d''information claire, déçu du service.', '2024-12-02', 1, '', 'PROCESSED'),

-- Avis pour British Airways (ID: 2)
('BA117', '2024-12-13', '2024-12-14', 4, 'Bon vol Londres-New York, confort correct en classe économique.', '2024-12-15', 2, '', 'PUBLISHED'),
('BA75', '2024-12-11', '2024-12-12', 5, 'Service britannique traditionnel, excellent thé et biscuits à bord.', '2024-12-13', 2, '', 'PUBLISHED'),
('BA303', '2024-12-08', '2024-12-09', 3, 'Vol moyen, sièges un peu étroits mais personnel aimable.', '2024-12-10', 2, '', 'PROCESSED'),
('BA142', '2024-12-06', '2024-12-07', 4, 'Ponctualité respectée, bon service clientèle.', '2024-12-08', 2, '', 'PUBLISHED'),

-- Avis pour Lufthansa (ID: 3)
('LH441', '2024-12-12', '2024-12-13', 5, 'Qualité allemande au rendez-vous, tout était parfait.', '2024-12-14', 3, '', 'PUBLISHED'),
('LH456', '2024-12-10', '2024-12-11', 4, 'Vol confortable, bonne cuisine allemande servie à bord.', '2024-12-12', 3, '', 'PUBLISHED'),
('LH418', '2024-12-05', '2024-12-06', 3, 'Correct sans plus, personnel efficace mais froid.', '2024-12-07', 3, '', 'PROCESSED'),

-- Avis pour KLM (ID: 4)
('KL641', '2024-12-11', '2024-12-12', 4, 'Vol Amsterdam-Tokyo, service hollandais chaleureux.', '2024-12-13', 4, '', 'PUBLISHED'),
('KL1006', '2024-12-09', '2024-12-10', 5, 'Excellent vol, sièges confortables et personnel souriant.', '2024-12-11', 4, '', 'PUBLISHED'),
('KL897', '2024-12-03', '2024-12-04', 2, 'Problème technique, vol annulé puis reporté, mauvaise gestion.', '2024-12-05', 4, '', 'REJECTED'),

-- Avis pour Emirates (ID: 5)
('EK203', '2024-12-10', '2024-12-11', 5, 'Luxe à bord, divertissements exceptionnels, service 5 étoiles.', '2024-12-12', 5, '', 'PUBLISHED'),
('EK241', '2024-12-08', '2024-12-09', 5, 'A380 magnifique, bar en vol, expérience inoubliable.', '2024-12-10', 5, '', 'PUBLISHED'),
('EK319', '2024-12-02', '2024-12-03', 4, 'Très bon vol Dubai-Londres, juste un peu cher.', '2024-12-04', 5, '', 'PUBLISHED'),

-- Avis pour Qatar Airways (ID: 6)
('QR149', '2024-12-09', '2024-12-10', 5, 'Service qatari exceptionnel, attention aux détails remarquable.', '2024-12-11', 6, '', 'PUBLISHED'),
('QR65', '2024-12-07', '2024-12-08', 4, 'Bon vol avec escale à Doha, aéroport impressionnant.', '2024-12-09', 6, '', 'PUBLISHED'),

-- Avis pour diverses autres compagnies
('LX8', '2024-12-06', '2024-12-07', 4, 'Swiss précision, vol ponctuel et propre.', '2024-12-08', 7, '', 'PUBLISHED'),
('TK1', '2024-12-05', '2024-12-06', 3, 'Vol correct Istanbul-Paris, cuisine turque appréciée.', '2024-12-07', 8, '', 'PROCESSED'),
('SQ317', '2024-12-04', '2024-12-05', 5, 'Singapore Airlines, le summum du raffinement asiatique.', '2024-12-06', 9, '', 'PUBLISHED'),
('JL516', '2024-12-03', '2024-12-04', 4, 'Service japonais impeccable, propreté remarquable.', '2024-12-05', 10, '', 'PUBLISHED'),
('AA100', '2024-12-02', '2024-12-03', 3, 'Vol domestique US correct, service basique.', '2024-12-04', 11, '', 'PROCESSED'),
('DL8', '2024-12-01', '2024-12-02', 2, 'Retard, sièges inconfortables, déçu de Delta.', '2024-12-03', 12, '', 'REJECTED'),
('UA914', '2024-11-30', '2024-12-01', 3, 'Vol transatlantique moyen, personnel fatigué.', '2024-12-02', 13, '', 'PROCESSED'),
('AC43', '2024-11-29', '2024-11-30', 4, 'Air Canada, service canadien sympathique.', '2024-12-01', 14, '', 'PUBLISHED'),
('IB6832', '2024-11-28', '2024-11-29', 4, 'Iberia, découverte de la cuisine espagnole en vol.', '2024-11-30', 16, '', 'PUBLISHED'),
('SK925', '2024-11-27', '2024-11-28', 3, 'SAS, design scandinave à bord, un peu froid.', '2024-11-29', 17, '', 'PROCESSED'),
('OS434', '2024-11-26', '2024-11-27', 4, 'Austrian Airlines, vol Vienne-New York agréable.', '2024-11-28', 18, '', 'PUBLISHED'),
('TP203', '2024-11-25', '2024-11-26', 3, 'TAP Portugal, correct pour le prix payé.', '2024-11-27', 19, '', 'PROCESSED'),
('SU150', '2024-11-24', '2024-11-25', 2, 'Aeroflot, service vieillissant, à améliorer.', '2024-11-26', 20, '', 'REJECTED');

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO avisdevol;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO avisdevol;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO avisdevol;

COMMIT;
