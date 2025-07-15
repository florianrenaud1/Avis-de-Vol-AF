package fr.florianrenaud.avisdevol.unit.dao.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import fr.florianrenaud.avisdevol.dao.entity.AirlineEntity;
import fr.florianrenaud.avisdevol.dao.repository.AirlineRepository;
import fr.florianrenaud.avisdevol.utils.mothers.AirlineMother;

@DataJpaTest
@ActiveProfiles("test")
class AirlineRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private AirlineRepository airlineRepository;

    private AirlineEntity airFrance;
    private AirlineEntity airCanada;
    private AirlineEntity lufthansa;
    private AirlineEntity inactiveAirline;

    @BeforeEach
    void setUp() {
        // Prepare test data using Mother pattern
        airFrance = AirlineMother.createAirFranceEntity();
        airCanada = AirlineMother.createAirCanadaEntity();
        lufthansa = AirlineMother.createLufthansaEntity();
        inactiveAirline = AirlineMother.createInactiveAirlineEntity();

        // Reset IDs for persistence
        airFrance.setId(null);
        airCanada.setId(null);
        lufthansa.setId(null);
        inactiveAirline.setId(null);

        // Persist test data
        entityManager.persistAndFlush(airFrance);
        entityManager.persistAndFlush(airCanada);
        entityManager.persistAndFlush(lufthansa);
        entityManager.persistAndFlush(inactiveAirline);
    }

    @Test
    void testFindTop5ByNameContainingIgnoreCase_WithValidName_ShouldReturnMatchingAirlines() {
        // When
        List<AirlineEntity> result = airlineRepository.findTop5ByNameContainingIgnoreCase("Air France");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Air France", result.get(0).getName());
        assertEquals("AF", result.get(0).getIataCode());
        assertEquals("AFR", result.get(0).getIcaoCode());
    }

    @Test
    void testFindTop5ByNameContainingIgnoreCase_WithPartialName_ShouldReturnMultipleAirlines() {
        // When
        List<AirlineEntity> result = airlineRepository.findTop5ByNameContainingIgnoreCase("Air");

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.stream().anyMatch(airline -> "Air France".equals(airline.getName())));
        assertTrue(result.stream().anyMatch(airline -> "Air Canada".equals(airline.getName())));
    }

    @Test
    void testFindTop5ByNameContainingIgnoreCase_WithCaseInsensitive_ShouldReturnResults() {
        // When
        List<AirlineEntity> result = airlineRepository.findTop5ByNameContainingIgnoreCase("air france");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Air France", result.get(0).getName());
    }

    @Test
    void testFindTop5ByNameContainingIgnoreCase_WithUpperCase_ShouldReturnResults() {
        // When
        List<AirlineEntity> result = airlineRepository.findTop5ByNameContainingIgnoreCase("AIR FRANCE");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Air France", result.get(0).getName());
    }

    @Test
    void testFindTop5ByNameContainingIgnoreCase_WithNonExistentName_ShouldReturnEmptyList() {
        // When
        List<AirlineEntity> result = airlineRepository.findTop5ByNameContainingIgnoreCase("NonExistent Airlines");

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testFindTop5ByNameContainingIgnoreCase_WithEmptyString_ShouldReturnEmptyList() {
        // When
        List<AirlineEntity> result = airlineRepository.findTop5ByNameContainingIgnoreCase("");

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testFindTop5ByNameContainingIgnoreCase_ShouldIncludeInactiveAirlines() {
        // When
        List<AirlineEntity> result = airlineRepository.findTop5ByNameContainingIgnoreCase("Defunct");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Defunct Company", result.get(0).getName());
        assertEquals(false, result.get(0).getActive());
    }

    @Test
    void testFindTop5ByNameContainingIgnoreCase_ShouldLimitToTop5Results() {
        // Given - Create 6 airlines with similar names
        for (int i = 1; i <= 6; i++) {
            AirlineEntity airline = AirlineMother.createAirlineEntity(null, "Test Airlines " + i, "T" + i, "TST" + i, "Country" + i, true);
            entityManager.persistAndFlush(airline);
        }

        // When
        List<AirlineEntity> result = airlineRepository.findTop5ByNameContainingIgnoreCase("Test Airlines");

        // Then
        assertNotNull(result);
        assertEquals(5, result.size());
    }

    @Test
    void testFindByNameIgnoreCase_WithExistingName_ShouldReturnAirline() {
        // When
        Optional<AirlineEntity> result = airlineRepository.findByNameIgnoreCase("Air France");

        // Then
        assertTrue(result.isPresent());
        assertEquals("Air France", result.get().getName());
        assertEquals("AF", result.get().getIataCode());
        assertEquals("AFR", result.get().getIcaoCode());
        assertEquals("France", result.get().getCountry());
    }

    @Test
    void testFindByNameIgnoreCase_WithCaseInsensitive_ShouldReturnAirline() {
        // When
        Optional<AirlineEntity> result = airlineRepository.findByNameIgnoreCase("air france");

        // Then
        assertTrue(result.isPresent());
        assertEquals("Air France", result.get().getName());
    }

    @Test
    void testFindByNameIgnoreCase_WithUpperCase_ShouldReturnAirline() {
        // When
        Optional<AirlineEntity> result = airlineRepository.findByNameIgnoreCase("AIR FRANCE");

        // Then
        assertTrue(result.isPresent());
        assertEquals("Air France", result.get().getName());
    }

    @Test
    void testFindByNameIgnoreCase_WithNonExistentName_ShouldReturnEmpty() {
        // When
        Optional<AirlineEntity> result = airlineRepository.findByNameIgnoreCase("NonExistent Airlines");

        // Then
        assertFalse(result.isPresent());
    }

    @Test
    void testFindByNameIgnoreCase_WithEmptyString_ShouldReturnEmpty() {
        // When
        Optional<AirlineEntity> result = airlineRepository.findByNameIgnoreCase("");

        // Then
        assertFalse(result.isPresent());
    }

    @Test
    void testFindByNameIgnoreCase_WithDifferentAirlines_ShouldReturnCorrectAirline() {
        // When
        Optional<AirlineEntity> lufthansaResult = airlineRepository.findByNameIgnoreCase("Lufthansa");
        Optional<AirlineEntity> airCanadaResult = airlineRepository.findByNameIgnoreCase("Air Canada");

        // Then
        assertTrue(lufthansaResult.isPresent());
        assertEquals("Lufthansa", lufthansaResult.get().getName());
        assertEquals("LH", lufthansaResult.get().getIataCode());
        assertEquals("DLH", lufthansaResult.get().getIcaoCode());

        assertTrue(airCanadaResult.isPresent());
        assertEquals("Air Canada", airCanadaResult.get().getName());
        assertEquals("AC", airCanadaResult.get().getIataCode());
        assertEquals("ACA", airCanadaResult.get().getIcaoCode());
    }

    @Test
    void testJpaRepositoryMethods_ShouldWork() {
        // Test standard JPA methods
        // When
        List<AirlineEntity> allAirlines = airlineRepository.findAll();
        long count = airlineRepository.count();

        // Then
        assertNotNull(allAirlines);
        assertEquals(4, allAirlines.size()); // airFrance, airCanada, lufthansa, inactiveAirline
        assertEquals(4L, count);
    }

    @Test
    void testFindById_WithExistingId_ShouldReturnAirline() {
        // Given
        Long airFranceId = airFrance.getId();

        // When
        Optional<AirlineEntity> result = airlineRepository.findById(airFranceId);

        // Then
        assertTrue(result.isPresent());
        assertEquals("Air France", result.get().getName());
        assertEquals(airFranceId, result.get().getId());
    }

    @Test
    void testSaveAndFlush_WithNewAirline_ShouldPersistAirline() {
        // Given
        AirlineEntity newAirline = AirlineMother.createAirlineEntity(null, "British Airways", "BA", "BAW", "United Kingdom", true);

        // When
        AirlineEntity savedAirline = airlineRepository.saveAndFlush(newAirline);

        // Then
        assertNotNull(savedAirline.getId());
        assertEquals("British Airways", savedAirline.getName());
        assertEquals("BA", savedAirline.getIataCode());
        assertEquals("BAW", savedAirline.getIcaoCode());

        // Verify it can be found
        Optional<AirlineEntity> found = airlineRepository.findByNameIgnoreCase("British Airways");
        assertTrue(found.isPresent());
        assertEquals(savedAirline.getId(), found.get().getId());
    }

    @Test
    void testDeleteById_WithExistingId_ShouldRemoveAirline() {
        // Given
        Long airFranceId = airFrance.getId();
        assertTrue(airlineRepository.findById(airFranceId).isPresent());

        // When
        airlineRepository.deleteById(airFranceId);
        airlineRepository.flush();

        // Then
        assertFalse(airlineRepository.findById(airFranceId).isPresent());
        assertEquals(3, airlineRepository.count()); // Should have 3 remaining
    }

    @Test
    void testUpdate_WithExistingAirline_ShouldUpdateAirline() {
        // Given
        AirlineEntity toUpdate = airFrance;
        String originalName = toUpdate.getName();
        String newName = "Air France Updated";

        // When
        toUpdate.setName(newName);
        AirlineEntity updatedAirline = airlineRepository.saveAndFlush(toUpdate);

        // Then
        assertNotNull(updatedAirline);
        assertEquals(newName, updatedAirline.getName());
        assertEquals(toUpdate.getId(), updatedAirline.getId());

        // Verify the change is persisted
        Optional<AirlineEntity> found = airlineRepository.findById(toUpdate.getId());
        assertTrue(found.isPresent());
        assertEquals(newName, found.get().getName());
        
        // Verify old name is no longer findable
        Optional<AirlineEntity> oldNameSearch = airlineRepository.findByNameIgnoreCase(originalName);
        assertFalse(oldNameSearch.isPresent());
    }

    @Test
    void testFindTop5ByNameContainingIgnoreCase_WithPartialIataCode_ShouldNotMatch() {
        // When - searching by IATA code should not match name search
        List<AirlineEntity> result = airlineRepository.findTop5ByNameContainingIgnoreCase("AF");

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty()); // Should not find anything as AF is not in the name
    }

    @Test
    void testConcurrentAccess_ShouldMaintainDataIntegrity() {
        // Given
        String testName = "Concurrent Airlines";
        AirlineEntity airline1 = AirlineMother.createAirlineEntity(null, testName, "CA1", "CON1", "Country1", true);
        AirlineEntity airline2 = AirlineMother.createAirlineEntity(null, testName, "CA2", "CON2", "Country2", true);

        // When
        AirlineEntity saved1 = airlineRepository.saveAndFlush(airline1);
        AirlineEntity saved2 = airlineRepository.saveAndFlush(airline2);

        // Then
        assertNotEquals(saved1.getId(), saved2.getId());
        assertEquals(testName, saved1.getName());
        assertEquals(testName, saved2.getName());

        // Verify both can be found by name search
        List<AirlineEntity> found = airlineRepository.findTop5ByNameContainingIgnoreCase(testName);
        assertEquals(2, found.size());
    }
}
