package fr.florianrenaud.avisdevol.unit.business.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import fr.florianrenaud.avisdevol.business.mapper.AirlineMapper;
import fr.florianrenaud.avisdevol.business.resources.AirlineResource;
import fr.florianrenaud.avisdevol.business.service.impl.BizAirlineServiceImpl;
import fr.florianrenaud.avisdevol.dao.entity.AirlineEntity;
import fr.florianrenaud.avisdevol.dao.service.AirlineService;
import fr.florianrenaud.avisdevol.utils.mothers.AirlineMother;

@ExtendWith(MockitoExtension.class)
class BizAirlineServiceImplTest {

    @Mock
    private AirlineService airlineService;

    @Mock
    private AirlineMapper airlineMapper;

    @InjectMocks
    private BizAirlineServiceImpl bizAirlineService;

    @Test
    void testGetAirlinesByName_WithValidName_ShouldReturnAirlines() {
        // Given
        String searchName = "Air France";
        AirlineEntity airlineEntity = AirlineMother.createAirFranceEntity();
        AirlineResource airlineResource = AirlineMother.createAirFranceResource();
        
        List<AirlineEntity> airlineEntities = Arrays.asList(airlineEntity);
        List<AirlineResource> expectedResources = Arrays.asList(airlineResource);

        when(airlineService.getAirlinesWhereNameContains(searchName)).thenReturn(airlineEntities);
        when(airlineMapper.airlineEntitiesToAirlineResources(airlineEntities)).thenReturn(expectedResources);

        // When
        List<AirlineResource> result = bizAirlineService.getAirlinesByName(searchName);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Air France", result.get(0).getName());
        assertEquals("AF", result.get(0).getIataCode());
        assertEquals("1", result.get(0).getId());

        verify(airlineService).getAirlinesWhereNameContains(searchName);
        verify(airlineMapper).airlineEntitiesToAirlineResources(airlineEntities);
    }

    @Test
    void testGetAirlinesByName_WithPartialName_ShouldReturnMatchingAirlines() {
        // Given
        String searchName = "Air";
        AirlineEntity airFrance = AirlineMother.createAirFranceEntity();
        AirlineEntity airCanada = AirlineMother.createAirCanadaEntity();
        List<AirlineEntity> airlineEntities = Arrays.asList(airFrance, airCanada);

        AirlineResource airFranceResource = AirlineMother.createAirFranceResource();
        AirlineResource airCanadaResource = AirlineMother.createAirCanadaResource();
        List<AirlineResource> expectedResources = Arrays.asList(airFranceResource, airCanadaResource);

        when(airlineService.getAirlinesWhereNameContains(searchName)).thenReturn(airlineEntities);
        when(airlineMapper.airlineEntitiesToAirlineResources(airlineEntities)).thenReturn(expectedResources);

        // When
        List<AirlineResource> result = bizAirlineService.getAirlinesByName(searchName);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.stream().anyMatch(airline -> "Air France".equals(airline.getName())));
        assertTrue(result.stream().anyMatch(airline -> "Air Canada".equals(airline.getName())));

        verify(airlineService).getAirlinesWhereNameContains(searchName);
        verify(airlineMapper).airlineEntitiesToAirlineResources(airlineEntities);
    }

    @Test
    void testGetAirlinesByName_WithNoMatches_ShouldReturnEmptyList() {
        // Given
        String searchName = "NonExistentAirline";
        List<AirlineEntity> emptyEntities = Collections.emptyList();
        List<AirlineResource> emptyResources = Collections.emptyList();

        when(airlineService.getAirlinesWhereNameContains(searchName)).thenReturn(emptyEntities);
        when(airlineMapper.airlineEntitiesToAirlineResources(emptyEntities)).thenReturn(emptyResources);

        // When
        List<AirlineResource> result = bizAirlineService.getAirlinesByName(searchName);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(airlineService).getAirlinesWhereNameContains(searchName);
        verify(airlineMapper).airlineEntitiesToAirlineResources(emptyEntities);
    }

    @Test
    void testGetAirlinesByName_WithEmptyString_ShouldReturnEmptyList() {
        // Given
        String searchName = "";
        List<AirlineEntity> emptyEntities = Collections.emptyList();
        List<AirlineResource> emptyResources = Collections.emptyList();

        when(airlineService.getAirlinesWhereNameContains(searchName)).thenReturn(emptyEntities);
        when(airlineMapper.airlineEntitiesToAirlineResources(emptyEntities)).thenReturn(emptyResources);

        // When
        List<AirlineResource> result = bizAirlineService.getAirlinesByName(searchName);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(airlineService).getAirlinesWhereNameContains(searchName);
        verify(airlineMapper).airlineEntitiesToAirlineResources(emptyEntities);
    }

    @Test
    void testGetAirlinesByName_WithNullName_ShouldCallServiceAndMapper() {
        // Given
        String searchName = null;
        List<AirlineEntity> emptyEntities = Collections.emptyList();
        List<AirlineResource> emptyResources = Collections.emptyList();

        when(airlineService.getAirlinesWhereNameContains(searchName)).thenReturn(emptyEntities);
        when(airlineMapper.airlineEntitiesToAirlineResources(emptyEntities)).thenReturn(emptyResources);

        // When
        List<AirlineResource> result = bizAirlineService.getAirlinesByName(searchName);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(airlineService).getAirlinesWhereNameContains(searchName);
        verify(airlineMapper).airlineEntitiesToAirlineResources(emptyEntities);
    }

    @Test
    void testGetAirlinesByName_WithCaseInsensitiveSearch_ShouldReturnResults() {
        // Given
        String searchName = "air france";
        AirlineEntity airlineEntity = AirlineMother.createAirFranceEntity();
        AirlineResource airlineResource = AirlineMother.createAirFranceResource();
        
        List<AirlineEntity> airlineEntities = Arrays.asList(airlineEntity);
        List<AirlineResource> expectedResources = Arrays.asList(airlineResource);

        when(airlineService.getAirlinesWhereNameContains(searchName)).thenReturn(airlineEntities);
        when(airlineMapper.airlineEntitiesToAirlineResources(airlineEntities)).thenReturn(expectedResources);

        // When
        List<AirlineResource> result = bizAirlineService.getAirlinesByName(searchName);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Air France", result.get(0).getName());

        verify(airlineService).getAirlinesWhereNameContains(searchName);
        verify(airlineMapper).airlineEntitiesToAirlineResources(airlineEntities);
    }

    @Test
    void testGetAirlinesByName_VerifyServiceAndMapperInteraction() {
        // Given
        String searchName = "Test Airline";
        AirlineEntity airlineEntity = AirlineMother.createAirFranceEntity();
        AirlineResource airlineResource = AirlineMother.createAirFranceResource();
        
        List<AirlineEntity> airlineEntities = Arrays.asList(airlineEntity);
        List<AirlineResource> expectedResources = Arrays.asList(airlineResource);

        when(airlineService.getAirlinesWhereNameContains(searchName)).thenReturn(airlineEntities);
        when(airlineMapper.airlineEntitiesToAirlineResources(airlineEntities)).thenReturn(expectedResources);

        // When
        List<AirlineResource> result = bizAirlineService.getAirlinesByName(searchName);

        // Then
        assertNotNull(result);
        assertEquals(expectedResources, result);

        // Verify that the service is called exactly once with the correct parameter
        verify(airlineService, times(1)).getAirlinesWhereNameContains(searchName);
        
        // Verify that the mapper is called exactly once with the correct parameter
        verify(airlineMapper, times(1)).airlineEntitiesToAirlineResources(airlineEntities);
        
        // Verify no other interactions
        verifyNoMoreInteractions(airlineService, airlineMapper);
    }

    @Test
    void testGetAirlinesByName_WithMultipleEuropeanAirlines_ShouldReturnAll() {
        // Given
        String searchName = "European";
        AirlineEntity airFrance = AirlineMother.createAirFranceEntity();
        AirlineEntity lufthansa = AirlineMother.createLufthansaEntity();
        List<AirlineEntity> airlineEntities = Arrays.asList(airFrance, lufthansa);

        AirlineResource airFranceResource = AirlineMother.createAirFranceResource();
        AirlineResource lufthansaResource = AirlineMother.createLufthansaResource();
        List<AirlineResource> expectedResources = Arrays.asList(airFranceResource, lufthansaResource);

        when(airlineService.getAirlinesWhereNameContains(searchName)).thenReturn(airlineEntities);
        when(airlineMapper.airlineEntitiesToAirlineResources(airlineEntities)).thenReturn(expectedResources);

        // When
        List<AirlineResource> result = bizAirlineService.getAirlinesByName(searchName);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.stream().anyMatch(airline -> "Air France".equals(airline.getName()) && "France".equals(airline.getCountry())));
        assertTrue(result.stream().anyMatch(airline -> "Lufthansa".equals(airline.getName()) && "Germany".equals(airline.getCountry())));

        verify(airlineService).getAirlinesWhereNameContains(searchName);
        verify(airlineMapper).airlineEntitiesToAirlineResources(airlineEntities);
    }

    @Test
    void testGetAirlinesByName_WithCustomAirlineData_ShouldReturnCustomData() {
        // Given
        String searchName = "Custom";
        AirlineEntity customEntity = AirlineMother.createAirlineEntity(999L, "Custom Airlines", "CU", "CUS", "Test Country", true);
        List<AirlineEntity> airlineEntities = Arrays.asList(customEntity);

        AirlineResource customResource = AirlineMother.createAirlineResource("999", "Custom Airlines", "CU", "CUS", "Test Country", true);
        List<AirlineResource> expectedResources = Arrays.asList(customResource);

        when(airlineService.getAirlinesWhereNameContains(searchName)).thenReturn(airlineEntities);
        when(airlineMapper.airlineEntitiesToAirlineResources(airlineEntities)).thenReturn(expectedResources);

        // When
        List<AirlineResource> result = bizAirlineService.getAirlinesByName(searchName);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Custom Airlines", result.get(0).getName());
        assertEquals("CU", result.get(0).getIataCode());
        assertEquals("CUS", result.get(0).getIcaoCode());
        assertEquals("Test Country", result.get(0).getCountry());

        verify(airlineService).getAirlinesWhereNameContains(searchName);
        verify(airlineMapper).airlineEntitiesToAirlineResources(airlineEntities);
    }
}
