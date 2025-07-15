package fr.florianrenaud.avisdevol.unit.business.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.util.Arrays;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import fr.florianrenaud.avisdevol.business.enums.RatingStatus;
import fr.florianrenaud.avisdevol.business.mapper.RatingMapper;
import fr.florianrenaud.avisdevol.business.resources.RatingFiltersResource;
import fr.florianrenaud.avisdevol.business.resources.RatingResource;
import fr.florianrenaud.avisdevol.business.service.impl.BizRatingServiceImpl;
import fr.florianrenaud.avisdevol.business.utils.Pagination;
import fr.florianrenaud.avisdevol.dao.entity.RatingEntity;
import fr.florianrenaud.avisdevol.dao.exceptions.InfrastructureErrorType;
import fr.florianrenaud.avisdevol.dao.exceptions.NotFoundException;
import fr.florianrenaud.avisdevol.dao.service.RatingService;
import fr.florianrenaud.avisdevol.utils.mothers.RatingMother;

@ExtendWith(MockitoExtension.class)
class BizRatingServiceImplTest {

    @Mock
    private RatingService ratingService;

    @Mock
    private RatingMapper ratingMapper;

    @InjectMocks
    private BizRatingServiceImpl bizRatingService;

    @Test
    void testGetRatingsByFilters_WithDefaultFilters_ShouldReturnPaginatedResults() {
        // Given
        RatingFiltersResource filters = RatingMother.createRatingFilters();
        Page<RatingEntity> pagedEntities = RatingMother.createPageOfRatingEntities();
        
        RatingResource ratingResource1 = RatingMother.createPositiveRatingResource();
        RatingResource ratingResource2 = RatingMother.createNegativeRatingResource();
        Pagination<RatingResource> expectedPagination = new Pagination<>(
            Arrays.asList(ratingResource1, ratingResource2), 
            2, 
            new fr.florianrenaud.avisdevol.business.utils.Pageable(0, 20)
        );

        when(ratingService.getRatingsByFilters(eq(filters), any(Pageable.class))).thenReturn(pagedEntities);
        when(ratingMapper.mapToListOfRatingResources(pagedEntities)).thenReturn(expectedPagination);

        // When
        Pagination<RatingResource> result = bizRatingService.getRatingsByFilters(filters, 0, 20, "date", "asc");

        // Then
        assertNotNull(result);
        assertEquals(2, result.content().size());
        verify(ratingService).getRatingsByFilters(eq(filters), any(Pageable.class));
        verify(ratingMapper).mapToListOfRatingResources(pagedEntities);
    }

    @Test
    void testGetRatingsByFilters_WithAirlineFilter_ShouldReturnFilteredResults() {
        // Given
        RatingFiltersResource filters = RatingMother.createRatingFiltersWithAirline("Air France");
        Page<RatingEntity> pagedEntities = RatingMother.createPageOfRatingEntities();
        
        RatingResource airFranceRating = RatingMother.createPositiveRatingResource();
        Pagination<RatingResource> expectedPagination = new Pagination<>(
            Arrays.asList(airFranceRating), 
            1, 
            new fr.florianrenaud.avisdevol.business.utils.Pageable(0, 20)
        );

        when(ratingService.getRatingsByFilters(eq(filters), any(Pageable.class))).thenReturn(pagedEntities);
        when(ratingMapper.mapToListOfRatingResources(pagedEntities)).thenReturn(expectedPagination);

        // When
        Pagination<RatingResource> result = bizRatingService.getRatingsByFilters(filters, 0, 20, "date", "asc");

        // Then
        assertNotNull(result);
        assertEquals(1, result.content().size());
        assertEquals("Air France", result.content().get(0).getAirline().getName());
        verify(ratingService).getRatingsByFilters(eq(filters), any(Pageable.class));
        verify(ratingMapper).mapToListOfRatingResources(pagedEntities);
    }

    @Test
    void testGetRatingsByFilters_WithEmptyResults_ShouldReturnEmptyPagination() {
        // Given
        RatingFiltersResource filters = RatingMother.createRatingFilters();
        Page<RatingEntity> emptyPage = RatingMother.createEmptyPageOfRatingEntities();
        
        Pagination<RatingResource> emptyPagination = new Pagination<>(
            Arrays.asList(), 
            0, 
            new fr.florianrenaud.avisdevol.business.utils.Pageable(0, 20)
        );

        when(ratingService.getRatingsByFilters(eq(filters), any(Pageable.class))).thenReturn(emptyPage);
        when(ratingMapper.mapToListOfRatingResources(emptyPage)).thenReturn(emptyPagination);

        // When
        Pagination<RatingResource> result = bizRatingService.getRatingsByFilters(filters, 0, 20, "date", "asc");

        // Then
        assertNotNull(result);
        assertTrue(result.content().isEmpty());
        assertEquals(0, result.totalElements());
        verify(ratingService).getRatingsByFilters(eq(filters), any(Pageable.class));
        verify(ratingMapper).mapToListOfRatingResources(emptyPage);
    }

    @Test
    void testCreateRating_WithValidRating_ShouldCreateWithPublishedStatus() throws NotFoundException {
        // Given
        RatingResource newRating = RatingMother.createNewRatingResource();
        RatingEntity ratingEntity = RatingMother.createRatingEntity();

        when(ratingMapper.ratingResourceToRatingEntity(newRating)).thenReturn(ratingEntity);
        doNothing().when(ratingService).createRating(any(RatingEntity.class));

        // When
        bizRatingService.createRating(newRating);

        // Then
        verify(ratingMapper).ratingResourceToRatingEntity(newRating);
        verify(ratingService).createRating(argThat(entity -> 
            entity.getStatus() == RatingStatus.PUBLISHED
        ));
    }

    @Test
    void testCreateRating_ShouldSetStatusToPublished() throws NotFoundException {
        // Given
        RatingResource newRating = RatingMother.createNewRatingResource();
        RatingEntity ratingEntity = RatingMother.createRatingEntity();
        ratingEntity.setStatus(null); // Initially no status

        when(ratingMapper.ratingResourceToRatingEntity(newRating)).thenReturn(ratingEntity);
        doNothing().when(ratingService).createRating(any(RatingEntity.class));

        // When
        bizRatingService.createRating(newRating);

        // Then
        assertEquals(RatingStatus.PUBLISHED, ratingEntity.getStatus());
        verify(ratingService).createRating(ratingEntity);
    }

    @Test
    void testGetRatingById_WithExistingId_ShouldReturnRating() throws NotFoundException {
        // Given
        Integer ratingId = 1;
        RatingEntity ratingEntity = RatingMother.createPositiveRatingEntity();
        RatingResource expectedResource = RatingMother.createPositiveRatingResource();

        when(ratingService.getRatingById(ratingId)).thenReturn(ratingEntity);
        when(ratingMapper.ratingEntityToRatingResource(ratingEntity)).thenReturn(expectedResource);

        // When
        RatingResource result = bizRatingService.getRatingById(ratingId);

        // Then
        assertNotNull(result);
        assertEquals(expectedResource.getId(), result.getId());
        assertEquals(expectedResource.getComments(), result.getComments());
        assertEquals(expectedResource.getRating(), result.getRating());
        verify(ratingService).getRatingById(ratingId);
        verify(ratingMapper).ratingEntityToRatingResource(ratingEntity);
    }

    @Test
    void testGetRatingById_WithNonExistentId_ShouldThrowNotFoundException() throws NotFoundException {
        // Given
        Integer ratingId = 999;
        when(ratingService.getRatingById(ratingId))
                .thenThrow(new NotFoundException(InfrastructureErrorType.RATING_NOT_FOUND));

        // When & Then
        assertThrows(NotFoundException.class, () -> bizRatingService.getRatingById(ratingId));
        verify(ratingService).getRatingById(ratingId);
        verifyNoInteractions(ratingMapper);
    }

    @Test
    void testUpdateRatingComment_WithValidData_ShouldUpdateAndReturnRating() throws NotFoundException {
        // Given
        Integer ratingId = 1;
        String newComment = "Updated comment";
        RatingEntity updatedEntity = RatingMother.createPositiveRatingEntity();
        updatedEntity.setComment(newComment);
        RatingResource expectedResource = RatingMother.createPositiveRatingResource();
        expectedResource.setComments(newComment);

        when(ratingService.updateRatingComment(ratingId, newComment)).thenReturn(updatedEntity);
        when(ratingMapper.ratingEntityToRatingResource(updatedEntity)).thenReturn(expectedResource);

        // When
        RatingResource result = bizRatingService.updateRatingComment(ratingId, newComment);

        // Then
        assertNotNull(result);
        assertEquals(newComment, result.getComments());
        verify(ratingService).updateRatingComment(ratingId, newComment);
        verify(ratingMapper).ratingEntityToRatingResource(updatedEntity);
    }

    @Test
    void testUpdateRatingComment_WithNonExistentRating_ShouldThrowNotFoundException() throws NotFoundException {
        // Given
        Integer ratingId = 999;
        String comment = "Comment";
        when(ratingService.updateRatingComment(ratingId, comment))
                .thenThrow(new NotFoundException(InfrastructureErrorType.RATING_NOT_FOUND));

        // When & Then
        assertThrows(NotFoundException.class, () -> bizRatingService.updateRatingComment(ratingId, comment));
        verify(ratingService).updateRatingComment(ratingId, comment);
        verifyNoInteractions(ratingMapper);
    }

    @Test
    void testAddAnswerToRating_WithValidData_ShouldAddAnswer() throws NotFoundException {
        // Given
        Integer ratingId = 1;
        String answer = "Thank you for your feedback!";
        doNothing().when(ratingService).addAnswerToRating(ratingId, answer);

        // When
        bizRatingService.addAnswerToRating(ratingId, answer);

        // Then
        verify(ratingService).addAnswerToRating(ratingId, answer);
    }

    @Test
    void testAddAnswerToRating_WithNonExistentRating_ShouldThrowNotFoundException() throws NotFoundException {
        // Given
        Integer ratingId = 999;
        String answer = "Answer";
        doThrow(new NotFoundException(InfrastructureErrorType.RATING_NOT_FOUND))
                .when(ratingService).addAnswerToRating(ratingId, answer);

        // When & Then
        assertThrows(NotFoundException.class, () -> bizRatingService.addAnswerToRating(ratingId, answer));
        verify(ratingService).addAnswerToRating(ratingId, answer);
    }

    @Test
    void testUpdateRatingStatus_WithValidStatus_ShouldUpdateAndReturnRating() throws NotFoundException {
        // Given
        Integer ratingId = 1;
        RatingStatus newStatus = RatingStatus.PROCESSED;
        RatingEntity updatedEntity = RatingMother.createPositiveRatingEntity();
        updatedEntity.setStatus(newStatus);
        RatingResource expectedResource = RatingMother.createPositiveRatingResource();
        expectedResource.setStatus(newStatus);

        when(ratingService.updateRatingStatus(ratingId, newStatus)).thenReturn(updatedEntity);
        when(ratingMapper.ratingEntityToRatingResource(updatedEntity)).thenReturn(expectedResource);

        // When
        RatingResource result = bizRatingService.updateRatingStatus(ratingId, newStatus);

        // Then
        assertNotNull(result);
        assertEquals(newStatus, result.getStatus());
        verify(ratingService).updateRatingStatus(ratingId, newStatus);
        verify(ratingMapper).ratingEntityToRatingResource(updatedEntity);
    }

    @Test
    void testUpdateRatingStatus_WithAllPossibleStatuses_ShouldWork() throws NotFoundException {
        // Given
        Integer ratingId = 1;
        RatingEntity entity = RatingMother.createRatingEntity();
        RatingResource resource = RatingMother.createRatingResource();

        when(ratingService.updateRatingStatus(eq(ratingId), any(RatingStatus.class))).thenReturn(entity);
        when(ratingMapper.ratingEntityToRatingResource(entity)).thenReturn(resource);

        // Test all possible statuses
        for (RatingStatus status : RatingStatus.values()) {
            // When
            RatingResource result = bizRatingService.updateRatingStatus(ratingId, status);

            // Then
            assertNotNull(result);
        }

        verify(ratingService, times(RatingStatus.values().length)).updateRatingStatus(eq(ratingId), any(RatingStatus.class));
        verify(ratingMapper, times(RatingStatus.values().length)).ratingEntityToRatingResource(entity);
    }

    @Test
    void testUpdateRatingStatus_WithNonExistentRating_ShouldThrowNotFoundException() throws NotFoundException {
        // Given
        Integer ratingId = 999;
        RatingStatus status = RatingStatus.PUBLISHED;
        when(ratingService.updateRatingStatus(ratingId, status))
                .thenThrow(new NotFoundException(InfrastructureErrorType.RATING_NOT_FOUND));

        // When & Then
        assertThrows(NotFoundException.class, () -> bizRatingService.updateRatingStatus(ratingId, status));
        verify(ratingService).updateRatingStatus(ratingId, status);
        verifyNoInteractions(ratingMapper);
    }

    @Test
    void testServiceInteractions_VerifyAllDependenciesAreCalled() throws NotFoundException {
        // Given
        RatingFiltersResource filters = RatingMother.createRatingFilters();
        Page<RatingEntity> pagedEntities = RatingMother.createEmptyPageOfRatingEntities();
        Pagination<RatingResource> pagination = new Pagination<>(Arrays.asList(), 0, new fr.florianrenaud.avisdevol.business.utils.Pageable(0, 20));

        when(ratingService.getRatingsByFilters(any(RatingFiltersResource.class), any(Pageable.class))).thenReturn(pagedEntities);
        when(ratingMapper.mapToListOfRatingResources(pagedEntities)).thenReturn(pagination);

        // When
        bizRatingService.getRatingsByFilters(filters, 0, 20, "date", "desc");

        // Then
        verify(ratingService, times(1)).getRatingsByFilters(eq(filters), any(Pageable.class));
        verify(ratingMapper, times(1)).mapToListOfRatingResources(pagedEntities);
        verifyNoMoreInteractions(ratingService, ratingMapper);
    }
}
