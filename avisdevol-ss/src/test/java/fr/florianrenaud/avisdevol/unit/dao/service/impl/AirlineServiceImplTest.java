package fr.florianrenaud.avisdevol.unit.dao.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import fr.florianrenaud.avisdevol.dao.entity.AirlineEntity;
import fr.florianrenaud.avisdevol.dao.repository.AirlineRepository;
import fr.florianrenaud.avisdevol.dao.service.impl.AirlineServiceImpl;
import fr.florianrenaud.avisdevol.utils.mothers.AirlineMother;

@ExtendWith(MockitoExtension.class)
class AirlineServiceImplTest {

    @Mock
    private AirlineRepository airlineRepository;

    @InjectMocks
    private AirlineServiceImpl airlineService;

    @Test
    void testGetAirlinesWhereNameContains_WithValidName_ShouldReturnMatchingAirlines() {
        // Given
        String searchName = "Air France";
        AirlineEntity airFrance = AirlineMother.createAirFranceEntity();
        List<AirlineEntity> expectedAirlines = Arrays.asList(airFrance);

        when(airlineRepository.findTop5ByNameContainingIgnoreCase(searchName)).thenReturn(expectedAirlines);

        // When
        List<AirlineEntity> result = airlineService.getAirlinesWhereNameContains(searchName);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Air France", result.get(0).getName());
        assertEquals("AF", result.get(0).getIataCode());
        assertEquals("AFR", result.get(0).getIcaoCode());
        verify(airlineRepository).findTop5ByNameContainingIgnoreCase(searchName);
    }

    @Test
    void testGetAirlinesWhereNameContains_WithPartialName_ShouldReturnMultipleAirlines() {
        // Given
        String searchName = "Air";
        AirlineEntity airFrance = AirlineMother.createAirFranceEntity();
        AirlineEntity airCanada = AirlineMother.createAirCanadaEntity();
        List<AirlineEntity> expectedAirlines = Arrays.asList(airFrance, airCanada);

        when(airlineRepository.findTop5ByNameContainingIgnoreCase(searchName)).thenReturn(expectedAirlines);

        // When
        List<AirlineEntity> result = airlineService.getAirlinesWhereNameContains(searchName);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.stream().anyMatch(airline -> "Air France".equals(airline.getName())));
        assertTrue(result.stream().anyMatch(airline -> "Air Canada".equals(airline.getName())));
        verify(airlineRepository).findTop5ByNameContainingIgnoreCase(searchName);
    }

    @Test
    void testGetAirlinesWhereNameContains_WithCaseInsensitiveSearch_ShouldReturnResults() {
        // Given
        String searchName = "air france";
        AirlineEntity airFrance = AirlineMother.createAirFranceEntity();
        List<AirlineEntity> expectedAirlines = Arrays.asList(airFrance);

        when(airlineRepository.findTop5ByNameContainingIgnoreCase(searchName)).thenReturn(expectedAirlines);

        // When
        List<AirlineEntity> result = airlineService.getAirlinesWhereNameContains(searchName);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Air France", result.get(0).getName());
        verify(airlineRepository).findTop5ByNameContainingIgnoreCase(searchName);
    }

    @Test
    void testGetAirlinesWhereNameContains_WithNoMatches_ShouldReturnEmptyList() {
        // Given
        String searchName = "NonExistentAirline";
        List<AirlineEntity> emptyList = Collections.emptyList();

        when(airlineRepository.findTop5ByNameContainingIgnoreCase(searchName)).thenReturn(emptyList);

        // When
        List<AirlineEntity> result = airlineService.getAirlinesWhereNameContains(searchName);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(airlineRepository).findTop5ByNameContainingIgnoreCase(searchName);
    }

    @Test
    void testGetAirlinesWhereNameContains_WithEmptyString_ShouldReturnEmptyList() {
        // Given
        String searchName = "";
        List<AirlineEntity> emptyList = Collections.emptyList();

        when(airlineRepository.findTop5ByNameContainingIgnoreCase(searchName)).thenReturn(emptyList);

        // When
        List<AirlineEntity> result = airlineService.getAirlinesWhereNameContains(searchName);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(airlineRepository).findTop5ByNameContainingIgnoreCase(searchName);
    }

    @Test
    void testGetAirlinesWhereNameContains_WithNullName_ShouldCallRepository() {
        // Given
        String searchName = null;
        List<AirlineEntity> emptyList = Collections.emptyList();

        when(airlineRepository.findTop5ByNameContainingIgnoreCase(searchName)).thenReturn(emptyList);

        // When
        List<AirlineEntity> result = airlineService.getAirlinesWhereNameContains(searchName);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(airlineRepository).findTop5ByNameContainingIgnoreCase(searchName);
    }

    @Test
    void testGetAirlinesWhereNameContains_ShouldLimitToTop5Results() {
        // Given
        String searchName = "Airlines";
        List<AirlineEntity> manyAirlines = Arrays.asList(
            AirlineMother.createAirFranceEntity(),
            AirlineMother.createAirCanadaEntity(),
            AirlineMother.createLufthansaEntity(),
            AirlineMother.createAirlineEntity(4L, "Test Airlines 1", "T1", "TST1", "Country1", true),
            AirlineMother.createAirlineEntity(5L, "Test Airlines 2", "T2", "TST2", "Country2", true)
        );

        when(airlineRepository.findTop5ByNameContainingIgnoreCase(searchName)).thenReturn(manyAirlines);

        // When
        List<AirlineEntity> result = airlineService.getAirlinesWhereNameContains(searchName);

        // Then
        assertNotNull(result);
        assertEquals(5, result.size());
        verify(airlineRepository).findTop5ByNameContainingIgnoreCase(searchName);
    }

    @Test
    void testGetAirlineByName_WithExistingName_ShouldReturnAirline() {
        // Given
        String airlineName = "Air France";
        AirlineEntity airFrance = AirlineMother.createAirFranceEntity();
        Optional<AirlineEntity> expectedResult = Optional.of(airFrance);

        when(airlineRepository.findByNameIgnoreCase(airlineName)).thenReturn(expectedResult);

        // When
        Optional<AirlineEntity> result = airlineService.getAirlineByName(airlineName);

        // Then
        assertTrue(result.isPresent());
        assertEquals("Air France", result.get().getName());
        assertEquals("AF", result.get().getIataCode());
        assertEquals("AFR", result.get().getIcaoCode());
        verify(airlineRepository).findByNameIgnoreCase(airlineName);
    }

    @Test
    void testGetAirlineByName_WithNonExistentName_ShouldReturnEmpty() {
        // Given
        String airlineName = "NonExistent Airlines";
        Optional<AirlineEntity> emptyResult = Optional.empty();

        when(airlineRepository.findByNameIgnoreCase(airlineName)).thenReturn(emptyResult);

        // When
        Optional<AirlineEntity> result = airlineService.getAirlineByName(airlineName);

        // Then
        assertFalse(result.isPresent());
        verify(airlineRepository).findByNameIgnoreCase(airlineName);
    }

    @Test
    void testGetAirlineByName_WithCaseInsensitiveName_ShouldReturnAirline() {
        // Given
        String airlineName = "AIR FRANCE";
        AirlineEntity airFrance = AirlineMother.createAirFranceEntity();
        Optional<AirlineEntity> expectedResult = Optional.of(airFrance);

        when(airlineRepository.findByNameIgnoreCase(airlineName)).thenReturn(expectedResult);

        // When
        Optional<AirlineEntity> result = airlineService.getAirlineByName(airlineName);

        // Then
        assertTrue(result.isPresent());
        assertEquals("Air France", result.get().getName());
        verify(airlineRepository).findByNameIgnoreCase(airlineName);
    }

    @Test
    void testGetAirlineByName_WithLowercaseName_ShouldReturnAirline() {
        // Given
        String airlineName = "air france";
        AirlineEntity airFrance = AirlineMother.createAirFranceEntity();
        Optional<AirlineEntity> expectedResult = Optional.of(airFrance);

        when(airlineRepository.findByNameIgnoreCase(airlineName)).thenReturn(expectedResult);

        // When
        Optional<AirlineEntity> result = airlineService.getAirlineByName(airlineName);

        // Then
        assertTrue(result.isPresent());
        assertEquals("Air France", result.get().getName());
        verify(airlineRepository).findByNameIgnoreCase(airlineName);
    }

    @Test
    void testGetAirlineByName_WithEmptyString_ShouldReturnEmpty() {
        // Given
        String airlineName = "";
        Optional<AirlineEntity> emptyResult = Optional.empty();

        when(airlineRepository.findByNameIgnoreCase(airlineName)).thenReturn(emptyResult);

        // When
        Optional<AirlineEntity> result = airlineService.getAirlineByName(airlineName);

        // Then
        assertFalse(result.isPresent());
        verify(airlineRepository).findByNameIgnoreCase(airlineName);
    }

    @Test
    void testGetAirlineByName_WithNullName_ShouldCallRepository() {
        // Given
        String airlineName = null;
        Optional<AirlineEntity> emptyResult = Optional.empty();

        when(airlineRepository.findByNameIgnoreCase(airlineName)).thenReturn(emptyResult);

        // When
        Optional<AirlineEntity> result = airlineService.getAirlineByName(airlineName);

        // Then
        assertFalse(result.isPresent());
        verify(airlineRepository).findByNameIgnoreCase(airlineName);
    }

    @Test
    void testGetAirlineByName_WithDifferentAirlines_ShouldReturnCorrectAirline() {
        // Given
        String lufthansaName = "Lufthansa";
        AirlineEntity lufthansa = AirlineMother.createLufthansaEntity();
        Optional<AirlineEntity> expectedResult = Optional.of(lufthansa);

        when(airlineRepository.findByNameIgnoreCase(lufthansaName)).thenReturn(expectedResult);

        // When
        Optional<AirlineEntity> result = airlineService.getAirlineByName(lufthansaName);

        // Then
        assertTrue(result.isPresent());
        assertEquals("Lufthansa", result.get().getName());
        assertEquals("LH", result.get().getIataCode());
        assertEquals("DLH", result.get().getIcaoCode());
        assertEquals("Germany", result.get().getCountry());
        verify(airlineRepository).findByNameIgnoreCase(lufthansaName);
    }

    @Test
    void testServiceInteractions_VerifyRepositoryCallsAreCorrect() {
        // Given
        String searchName = "Test";
        String exactName = "Test Airlines";
        
        List<AirlineEntity> searchResults = Arrays.asList(AirlineMother.createAirlineEntity(1L, "Test Airlines", "TA", "TEST", "TestCountry", true));
        Optional<AirlineEntity> exactResult = Optional.of(AirlineMother.createAirlineEntity(1L, "Test Airlines", "TA", "TEST", "TestCountry", true));

        when(airlineRepository.findTop5ByNameContainingIgnoreCase(searchName)).thenReturn(searchResults);
        when(airlineRepository.findByNameIgnoreCase(exactName)).thenReturn(exactResult);

        // When
        List<AirlineEntity> searchResult = airlineService.getAirlinesWhereNameContains(searchName);
        Optional<AirlineEntity> exactSearchResult = airlineService.getAirlineByName(exactName);

        // Then
        assertNotNull(searchResult);
        assertTrue(exactSearchResult.isPresent());
        
        verify(airlineRepository, times(1)).findTop5ByNameContainingIgnoreCase(searchName);
        verify(airlineRepository, times(1)).findByNameIgnoreCase(exactName);
        verifyNoMoreInteractions(airlineRepository);
    }
}
