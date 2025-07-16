package fr.florianrenaud.avisdevol.unit.rest.controllers;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import fr.florianrenaud.avisdevol.business.resources.AirlineResource;
import fr.florianrenaud.avisdevol.business.service.BizAirlineService;
import fr.florianrenaud.avisdevol.config.JwtFilter;
import fr.florianrenaud.avisdevol.business.service.impl.JwtServiceImpl;
import fr.florianrenaud.avisdevol.rest.controllers.AirlineController;
import fr.florianrenaud.avisdevol.utils.mothers.AirlineMother;

@WebMvcTest(controllers = AirlineController.class, 
    excludeAutoConfiguration = {
        SecurityAutoConfiguration.class
    },
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.ASSIGNABLE_TYPE, 
        classes = {JwtFilter.class, JwtServiceImpl.class}
    ))
@ActiveProfiles("test")
class AirlineControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BizAirlineService bizAirlineService;

    @Test
    void testGetAirlineByName_WithValidName_ShouldReturnAirlines() throws Exception {
        // Given
        String searchName = "Air France";
        List<AirlineResource> expectedAirlines = Arrays.asList(
            AirlineMother.createAirFranceResource()
        );
        when(bizAirlineService.getAirlinesByName(searchName)).thenReturn(expectedAirlines);

        // When & Then
        mockMvc.perform(get("/rest/airline")
                .param("name", searchName)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].name").value("Air France"))
                .andExpect(jsonPath("$[0].iataCode").value("AF"))
                .andExpect(jsonPath("$[0].icaoCode").value("AFR"));

        verify(bizAirlineService).getAirlinesByName(searchName);
    }

    @Test
    void testGetAirlineByName_WithPartialName_ShouldReturnMultipleAirlines() throws Exception {
        // Given
        String searchName = "Air";
        List<AirlineResource> expectedAirlines = Arrays.asList(
            AirlineMother.createAirFranceResource(),
            AirlineMother.createAirCanadaResource()
        );
        when(bizAirlineService.getAirlinesByName(searchName)).thenReturn(expectedAirlines);

        // When & Then
        mockMvc.perform(get("/rest/airline")
                .param("name", searchName)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name").value("Air France"))
                .andExpect(jsonPath("$[1].name").value("Air Canada"));

        verify(bizAirlineService).getAirlinesByName(searchName);
    }

    @Test
    void testGetAirlineByName_WithNonExistentName_ShouldReturnEmptyList() throws Exception {
        // Given
        String searchName = "NonExistent Airlines";
        List<AirlineResource> expectedAirlines = Collections.emptyList();
        when(bizAirlineService.getAirlinesByName(searchName)).thenReturn(expectedAirlines);

        // When & Then
        mockMvc.perform(get("/rest/airline")
                .param("name", searchName)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));

        verify(bizAirlineService).getAirlinesByName(searchName);
    }

    @Test
    void testGetAirlineByName_WithEmptyName_ShouldReturnEmptyList() throws Exception {
        // Given
        String searchName = "";
        List<AirlineResource> expectedAirlines = Collections.emptyList();
        when(bizAirlineService.getAirlinesByName(searchName)).thenReturn(expectedAirlines);

        // When & Then
        mockMvc.perform(get("/rest/airline")
                .param("name", searchName)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));

        verify(bizAirlineService).getAirlinesByName(searchName);
    }

    @Test
    void testGetAirlineByName_WithCaseInsensitiveName_ShouldReturnAirlines() throws Exception {
        // Given
        String searchName = "air france";
        List<AirlineResource> expectedAirlines = Arrays.asList(
            AirlineMother.createAirFranceResource()
        );
        when(bizAirlineService.getAirlinesByName(searchName)).thenReturn(expectedAirlines);

        // When & Then
        mockMvc.perform(get("/rest/airline")
                .param("name", searchName)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Air France"));

        verify(bizAirlineService).getAirlinesByName(searchName);
    }

    @Test
    void testGetAirlineByName_WithSpecialCharacters_ShouldHandleGracefully() throws Exception {
        // Given
        String searchName = "Luf%th@nsa";
        List<AirlineResource> expectedAirlines = Collections.emptyList();
        when(bizAirlineService.getAirlinesByName(searchName)).thenReturn(expectedAirlines);

        // When & Then
        mockMvc.perform(get("/rest/airline")
                .param("name", searchName)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));

        verify(bizAirlineService).getAirlinesByName(searchName);
    }

    @Test
    void testGetAirlineByName_WithInactiveAirline_ShouldReturnInactiveAirline() throws Exception {
        // Given
        String searchName = "Defunct";
        List<AirlineResource> expectedAirlines = Arrays.asList(
            AirlineMother.createInactiveAirlineResource()
        );
        when(bizAirlineService.getAirlinesByName(searchName)).thenReturn(expectedAirlines);

        // When & Then
        mockMvc.perform(get("/rest/airline")
                .param("name", searchName)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Defunct Company"))
                .andExpect(jsonPath("$[0].active").value(false));

        verify(bizAirlineService).getAirlinesByName(searchName);
    }

    @Test
    void testGetAirlineByName_WithMixedActiveAndInactiveAirlines_ShouldReturnBoth() throws Exception {
        // Given
        String searchName = "Air";
        List<AirlineResource> expectedAirlines = Arrays.asList(
            AirlineMother.createAirFranceResource(),
            AirlineMother.createAirCanadaResource(),
            AirlineMother.createInactiveAirlineResource()
        );
        when(bizAirlineService.getAirlinesByName(searchName)).thenReturn(expectedAirlines);

        // When & Then
        mockMvc.perform(get("/rest/airline")
                .param("name", searchName)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(3)));

        verify(bizAirlineService).getAirlinesByName(searchName);
    }

    @Test
    void testGetAirlineByName_WithLongName_ShouldHandleCorrectly() throws Exception {
        // Given
        String searchName = "VeryLongAirlineNameThatShouldBeHandledCorrectly";
        List<AirlineResource> expectedAirlines = Collections.emptyList();
        when(bizAirlineService.getAirlinesByName(searchName)).thenReturn(expectedAirlines);

        // When & Then
        mockMvc.perform(get("/rest/airline")
                .param("name", searchName)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));

        verify(bizAirlineService).getAirlinesByName(searchName);
    }
}
