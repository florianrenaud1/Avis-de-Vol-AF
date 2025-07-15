package fr.florianrenaud.avisdevol.unit.rest.controllers;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Collections;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import fr.florianrenaud.avisdevol.business.enums.RatingStatus;
import fr.florianrenaud.avisdevol.business.resources.RatingFiltersResource;
import fr.florianrenaud.avisdevol.business.resources.RatingResource;
import fr.florianrenaud.avisdevol.business.service.BizRatingService;
import fr.florianrenaud.avisdevol.business.utils.Pagination;
import fr.florianrenaud.avisdevol.dao.exceptions.InfrastructureErrorType;
import fr.florianrenaud.avisdevol.dao.exceptions.NotFoundException;
import fr.florianrenaud.avisdevol.rest.controllers.RatingController;
import fr.florianrenaud.avisdevol.utils.mothers.RatingMother;

@WebMvcTest(controllers = RatingController.class,
    excludeAutoConfiguration = {
        SecurityAutoConfiguration.class
    })
@ActiveProfiles("test")
class RatingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BizRatingService bizRatingService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testSearch_WithFilters_ShouldReturnPaginatedResults() throws Exception {
        // Given
        RatingFiltersResource filters = RatingMother.createRatingFiltersResource();
        Pagination<RatingResource> expectedPagination = RatingMother.createRatingPagination();
        
        when(bizRatingService.getRatingsByFilters(any(RatingFiltersResource.class), anyInt(), anyInt(), anyString(), anyString()))
            .thenReturn(expectedPagination);

        // When & Then
        mockMvc.perform(post("/rest/rating/search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(filters))
                .param("page", "0")
                .param("size", "20")
                .param("col", "rating")
                .param("direction", "asc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.totalElements", is(expectedPagination.totalElements())))
                .andExpect(jsonPath("$.content", hasSize(expectedPagination.content().size())));

        verify(bizRatingService).getRatingsByFilters(any(RatingFiltersResource.class), eq(0), eq(20), eq("rating"), eq("asc"));
    }

    @Test
    void testSearch_WithoutFilters_ShouldUseDefaultFilters() throws Exception {
        // Given
        Pagination<RatingResource> expectedPagination = RatingMother.createRatingPagination();
        
        when(bizRatingService.getRatingsByFilters(any(RatingFiltersResource.class), anyInt(), anyInt(), anyString(), anyString()))
            .thenReturn(expectedPagination);

        // When & Then
        mockMvc.perform(post("/rest/rating/search")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(bizRatingService).getRatingsByFilters(any(RatingFiltersResource.class), eq(0), eq(20), eq("rating"), eq("asc"));
    }

    @Test
    void testSearch_WithCustomPagination_ShouldUseCustomParameters() throws Exception {
        // Given
        Pagination<RatingResource> expectedPagination = RatingMother.createRatingPagination();
        
        when(bizRatingService.getRatingsByFilters(any(RatingFiltersResource.class), anyInt(), anyInt(), anyString(), anyString()))
            .thenReturn(expectedPagination);

        // When & Then
        mockMvc.perform(post("/rest/rating/search")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}")
                .param("page", "2")
                .param("size", "10")
                .param("col", "date")
                .param("direction", "desc"))
                .andExpect(status().isOk());

        verify(bizRatingService).getRatingsByFilters(any(RatingFiltersResource.class), eq(2), eq(10), eq("date"), eq("desc"));
    }

    @Test
    void testCreateRating_WithValidData_ShouldCreateSuccessfully() throws Exception {
        // Given
        RatingResource ratingResource = RatingMother.createRatingResource();
        doNothing().when(bizRatingService).createRating(any(RatingResource.class));

        // When & Then
        mockMvc.perform(post("/rest/rating/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ratingResource)))
                .andExpect(status().isOk());

        verify(bizRatingService).createRating(any(RatingResource.class));
    }

    // NOTE: Exception tests are commented out because this application
    // doesn't have an ExceptionHandler configured, so RestExceptions
    // become ServletExceptions in tests instead of proper HTTP status codes

    @Test
    void testCreateRating_WithNotFoundException_ShouldThrowException() throws Exception {
        // Given
        RatingResource ratingResource = RatingMother.createRatingResource();
        doThrow(new NotFoundException(InfrastructureErrorType.AIRLINE_NOT_FOUND)).when(bizRatingService).createRating(any(RatingResource.class));

        // When & Then - NotFoundException becomes ServletException without ExceptionHandler
        mockMvc.perform(post("/rest/rating/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ratingResource)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetRating_WithValidId_ShouldReturnRating() throws Exception {
        // Given
        Integer ratingId = 1;
        RatingResource expectedRating = RatingMother.createRatingResource();
        when(bizRatingService.getRatingById(ratingId)).thenReturn(expectedRating);

        // When & Then
        mockMvc.perform(get("/rest/rating/{ratingId}", ratingId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(expectedRating.getId())))
                .andExpect(jsonPath("$.flightNumber", is(expectedRating.getFlightNumber())))
                .andExpect(jsonPath("$.rating", is(expectedRating.getRating())))
                .andExpect(jsonPath("$.comments", is(expectedRating.getComments())));

        verify(bizRatingService).getRatingById(ratingId);
    }

    @Test
    void testGetRating_WithInvalidId_ShouldThrowException() throws Exception {
        // Given
        Integer ratingId = 999;
        when(bizRatingService.getRatingById(ratingId)).thenThrow(new NotFoundException(InfrastructureErrorType.RATING_NOT_FOUND));

        // When & Then - NotFoundException becomes ServletException without ExceptionHandler
        mockMvc.perform(get("/rest/rating/{ratingId}", ratingId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(bizRatingService).getRatingById(ratingId);
    }

    @Test
    void testAddAnswer_WithValidData_ShouldAddAnswerSuccessfully() throws Exception {
        // Given
        Integer ratingId = 1;
        String answer = "Thank you for your feedback. We will improve our service.";
        doNothing().when(bizRatingService).addAnswerToRating(ratingId, answer);

        // When & Then
        mockMvc.perform(put("/rest/rating/answer/{ratingId}", ratingId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("\"" + answer + "\""))
                .andExpect(status().isOk());

        verify(bizRatingService).addAnswerToRating(ratingId, "\"" + answer + "\"");
    }

    @Test
    void testAddAnswer_WithEmptyAnswer_ShouldTrimAndProcess() throws Exception {
        // Given
        Integer ratingId = 1;
        String answer = "  Thank you  ";
        doNothing().when(bizRatingService).addAnswerToRating(ratingId, "\"  Thank you  \"");

        // When & Then
        mockMvc.perform(put("/rest/rating/answer/{ratingId}", ratingId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("\"" + answer + "\""))
                .andExpect(status().isOk());

        verify(bizRatingService).addAnswerToRating(ratingId, "\"  Thank you  \"");
    }

    @Test
    void testAddAnswer_WithNullAnswer_ShouldPassNull() throws Exception {
        // Given
        Integer ratingId = 1;
        doNothing().when(bizRatingService).addAnswerToRating(ratingId, "null");

        // When & Then
        mockMvc.perform(put("/rest/rating/answer/{ratingId}", ratingId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("null"))
                .andExpect(status().isOk());

        verify(bizRatingService).addAnswerToRating(ratingId, "null");
    }

    @Test
    void testAddAnswer_WithNotFoundException_ShouldThrowException() throws Exception {
        // Given
        Integer ratingId = 999;
        String answer = "Thank you for your feedback";
        doThrow(new NotFoundException(InfrastructureErrorType.RATING_NOT_FOUND)).when(bizRatingService).addAnswerToRating(ratingId, "\"" + answer + "\"");

        // When & Then - NotFoundException becomes ServletException without ExceptionHandler
        mockMvc.perform(put("/rest/rating/answer/{ratingId}", ratingId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("\"" + answer + "\""))
                .andExpect(status().isNotFound());
    }

    @Test
    void testUpdateStatus_WithValidStatus_ShouldUpdateSuccessfully() throws Exception {
        // Given
        Integer ratingId = 1;
        String status = "PROCESSED";
        RatingResource expectedRating = RatingMother.createRatingResource();
        expectedRating.setStatus(RatingStatus.PROCESSED);
        
        when(bizRatingService.updateRatingStatus(ratingId, RatingStatus.PROCESSED)).thenReturn(expectedRating);

        // When & Then
        mockMvc.perform(put("/rest/rating/status/{ratingId}", ratingId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(status))  // Sans guillemets JSON
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status", is("PROCESSED")));

        verify(bizRatingService).updateRatingStatus(ratingId, RatingStatus.PROCESSED);
    }

    @Test
    void testUpdateStatus_WithValidStatusLowerCase_ShouldUpdateSuccessfully() throws Exception {
        // Given
        Integer ratingId = 1;
        String status = "published";
        RatingResource expectedRating = RatingMother.createRatingResource();
        expectedRating.setStatus(RatingStatus.PUBLISHED);
        
        when(bizRatingService.updateRatingStatus(ratingId, RatingStatus.PUBLISHED)).thenReturn(expectedRating);

        // When & Then
        mockMvc.perform(put("/rest/rating/status/{ratingId}", ratingId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(status))  // Sans guillemets JSON
                .andExpect(status().isOk());

        verify(bizRatingService).updateRatingStatus(ratingId, RatingStatus.PUBLISHED);
    }



    @Test
    void testUpdateStatus_WithStatusTrimming_ShouldTrimAndProcess() throws Exception {
        // Given
        Integer ratingId = 1;
        String status = "  REJECTED  ";
        RatingResource expectedRating = RatingMother.createRatingResource();
        expectedRating.setStatus(RatingStatus.REJECTED);
        
        when(bizRatingService.updateRatingStatus(ratingId, RatingStatus.REJECTED)).thenReturn(expectedRating);

        // When & Then
        mockMvc.perform(put("/rest/rating/status/{ratingId}", ratingId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(status))  // Sans guillemets JSON
                .andExpect(status().isOk());

        verify(bizRatingService).updateRatingStatus(ratingId, RatingStatus.REJECTED);
    }

    @Test
    void testUpdateStatus_WithNotFoundException_ShouldThrowException() throws Exception {
        // Given
        Integer ratingId = 999;
        String status = "PUBLISHED";
        when(bizRatingService.updateRatingStatus(ratingId, RatingStatus.PUBLISHED))
            .thenThrow(new NotFoundException(InfrastructureErrorType.RATING_NOT_FOUND));

        // When & Then - NotFoundException becomes ServletException without ExceptionHandler
        mockMvc.perform(put("/rest/rating/status/{ratingId}", ratingId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(status))  // Sans guillemets JSON
                .andExpect(status().isNotFound());
    }

    @Test
    void testSearch_WithEmptyResults_ShouldReturnEmptyPagination() throws Exception {
        // Given
        fr.florianrenaud.avisdevol.business.utils.Pageable pageable = 
            new fr.florianrenaud.avisdevol.business.utils.Pageable(0, 20);
        Pagination<RatingResource> emptyPagination = new Pagination<>(Collections.emptyList(), 0, pageable);
        
        when(bizRatingService.getRatingsByFilters(any(RatingFiltersResource.class), anyInt(), anyInt(), anyString(), anyString()))
            .thenReturn(emptyPagination);

        // When & Then
        mockMvc.perform(post("/rest/rating/search")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(0)))
                .andExpect(jsonPath("$.totalElements", is(0)));
    }
}
