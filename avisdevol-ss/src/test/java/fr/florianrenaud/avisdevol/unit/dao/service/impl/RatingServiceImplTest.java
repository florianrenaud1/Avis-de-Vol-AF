package fr.florianrenaud.avisdevol.unit.dao.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import fr.florianrenaud.avisdevol.business.enums.RatingStatus;
import fr.florianrenaud.avisdevol.business.resources.RatingFiltersResource;
import fr.florianrenaud.avisdevol.dao.entity.AirlineEntity;
import fr.florianrenaud.avisdevol.dao.entity.RatingEntity;
import fr.florianrenaud.avisdevol.dao.exceptions.NotFoundException;
import fr.florianrenaud.avisdevol.dao.repository.AirlineRepository;
import fr.florianrenaud.avisdevol.dao.repository.RatingRepository;
import fr.florianrenaud.avisdevol.dao.service.impl.RatingServiceImpl;
import fr.florianrenaud.avisdevol.dao.specifications.RatingSearchSpecification;
import fr.florianrenaud.avisdevol.utils.mothers.AirlineMother;
import fr.florianrenaud.avisdevol.utils.mothers.RatingMother;

@ExtendWith(MockitoExtension.class)
class RatingServiceImplTest {

    @Mock
    private RatingSearchSpecification ratingSearchSpecification;

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private AirlineRepository airlineRepository;

    @InjectMocks
    private RatingServiceImpl ratingService;

    @Test
    void testGetRatingsByFilters_WithValidFilters_ShouldReturnPageOfRatings() {
        // Given
        RatingFiltersResource filters = RatingMother.createRatingFilters();
        Pageable pageable = PageRequest.of(0, 10);
        Page<RatingEntity> expectedPage = RatingMother.createPageOfRatingEntities();
        @SuppressWarnings("unchecked")
        Specification<RatingEntity> specification = mock(Specification.class);

        when(ratingSearchSpecification.getRatingSearch(filters)).thenReturn(specification);
        when(ratingRepository.findAll(specification, pageable)).thenReturn(expectedPage);

        // When
        Page<RatingEntity> result = ratingService.getRatingsByFilters(filters, pageable);

        // Then
        assertNotNull(result);
        assertEquals(expectedPage.getTotalElements(), result.getTotalElements());
        verify(ratingSearchSpecification).getRatingSearch(filters);
        verify(ratingRepository).findAll(specification, pageable);
    }

    @Test
    void testGetRatingsByFilters_WithEmptyResults_ShouldReturnEmptyPage() {
        // Given
        RatingFiltersResource filters = RatingMother.createRatingFilters();
        Pageable pageable = PageRequest.of(0, 10);
        Page<RatingEntity> emptyPage = new PageImpl<>(java.util.Collections.emptyList());
        @SuppressWarnings("unchecked")
        Specification<RatingEntity> specification = mock(Specification.class);

        when(ratingSearchSpecification.getRatingSearch(filters)).thenReturn(specification);
        when(ratingRepository.findAll(specification, pageable)).thenReturn(emptyPage);

        // When
        Page<RatingEntity> result = ratingService.getRatingsByFilters(filters, pageable);

        // Then
        assertNotNull(result);
        assertEquals(0, result.getTotalElements());
        assertTrue(result.getContent().isEmpty());
        verify(ratingSearchSpecification).getRatingSearch(filters);
        verify(ratingRepository).findAll(specification, pageable);
    }

    @Test
    void testCreateRating_WithValidRating_ShouldSaveRating() throws NotFoundException {
        // Given
        AirlineEntity airline = AirlineMother.createAirFranceEntity();
        RatingEntity rating = RatingMother.createRatingEntity();
        rating.setAirline(airline);

        when(airlineRepository.findById(airline.getId())).thenReturn(Optional.of(airline));

        // When
        ratingService.createRating(rating);

        // Then
        verify(airlineRepository).findById(airline.getId());
        verify(ratingRepository).save(rating);
    }

    @Test
    void testCreateRating_WithNonExistentAirline_ShouldThrowNotFoundException() {
        // Given
        AirlineEntity airline = AirlineMother.createAirFranceEntity();
        RatingEntity rating = RatingMother.createRatingEntity();
        rating.setAirline(airline);

        when(airlineRepository.findById(airline.getId())).thenReturn(Optional.empty());

        // When & Then
        assertThrows(NotFoundException.class, () -> ratingService.createRating(rating));
        verify(airlineRepository).findById(airline.getId());
        verify(ratingRepository, never()).save(any());
    }

    @Test
    void testGetRatingById_WithExistingId_ShouldReturnRating() throws NotFoundException {
        // Given
        Integer ratingId = 1;
        RatingEntity expectedRating = RatingMother.createRatingEntity();

        when(ratingRepository.findById(ratingId)).thenReturn(Optional.of(expectedRating));

        // When
        RatingEntity result = ratingService.getRatingById(ratingId);

        // Then
        assertNotNull(result);
        assertEquals(expectedRating.getId(), result.getId());
        assertEquals(expectedRating.getComment(), result.getComment());
        verify(ratingRepository).findById(ratingId);
    }

    @Test
    void testGetRatingById_WithNonExistentId_ShouldThrowNotFoundException() {
        // Given
        Integer ratingId = 999;

        when(ratingRepository.findById(ratingId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(NotFoundException.class, () -> ratingService.getRatingById(ratingId));
        verify(ratingRepository).findById(ratingId);
    }

    @Test
    void testUpdateRatingComment_WithExistingRating_ShouldUpdateAndReturnRating() throws NotFoundException {
        // Given
        Integer ratingId = 1;
        String newComment = "Updated comment";
        RatingEntity existingRating = RatingMother.createRatingEntity();
        RatingEntity updatedRating = RatingMother.createRatingEntity();
        updatedRating.setComment(newComment);

        when(ratingRepository.findById(ratingId)).thenReturn(Optional.of(existingRating));
        when(ratingRepository.save(any(RatingEntity.class))).thenReturn(updatedRating);

        // When
        RatingEntity result = ratingService.updateRatingComment(ratingId, newComment);

        // Then
        assertNotNull(result);
        assertEquals(newComment, result.getComment());
        verify(ratingRepository).findById(ratingId);
        verify(ratingRepository).save(existingRating);
        assertEquals(newComment, existingRating.getComment());
    }

    @Test
    void testUpdateRatingComment_WithNonExistentRating_ShouldThrowNotFoundException() {
        // Given
        Integer ratingId = 999;
        String newComment = "Updated comment";

        when(ratingRepository.findById(ratingId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(NotFoundException.class, () -> ratingService.updateRatingComment(ratingId, newComment));
        verify(ratingRepository).findById(ratingId);
        verify(ratingRepository, never()).save(any());
    }

    @Test
    void testUpdateRatingComment_WithEmptyComment_ShouldUpdateToEmpty() throws NotFoundException {
        // Given
        Integer ratingId = 1;
        String emptyComment = "";
        RatingEntity existingRating = RatingMother.createRatingEntity();

        when(ratingRepository.findById(ratingId)).thenReturn(Optional.of(existingRating));
        when(ratingRepository.save(any(RatingEntity.class))).thenReturn(existingRating);

        // When
        RatingEntity result = ratingService.updateRatingComment(ratingId, emptyComment);

        // Then
        assertNotNull(result);
        verify(ratingRepository).findById(ratingId);
        verify(ratingRepository).save(existingRating);
        assertEquals(emptyComment, existingRating.getComment());
    }

    @Test
    void testAddAnswerToRating_WithExistingRating_ShouldAddAnswer() throws NotFoundException {
        // Given
        Integer ratingId = 1;
        String answer = "Thank you for your feedback";
        RatingEntity existingRating = RatingMother.createRatingEntity();

        when(ratingRepository.findById(ratingId)).thenReturn(Optional.of(existingRating));

        // When
        ratingService.addAnswerToRating(ratingId, answer);

        // Then
        verify(ratingRepository).findById(ratingId);
        verify(ratingRepository).save(existingRating);
        assertEquals(answer, existingRating.getAnswer());
    }

    @Test
    void testAddAnswerToRating_WithNonExistentRating_ShouldThrowNotFoundException() {
        // Given
        Integer ratingId = 999;
        String answer = "Thank you for your feedback";

        when(ratingRepository.findById(ratingId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(NotFoundException.class, () -> ratingService.addAnswerToRating(ratingId, answer));
        verify(ratingRepository).findById(ratingId);
        verify(ratingRepository, never()).save(any());
    }

    @Test
    void testAddAnswerToRating_WithEmptyAnswer_ShouldSetEmptyAnswer() throws NotFoundException {
        // Given
        Integer ratingId = 1;
        String emptyAnswer = "";
        RatingEntity existingRating = RatingMother.createRatingEntity();

        when(ratingRepository.findById(ratingId)).thenReturn(Optional.of(existingRating));

        // When
        ratingService.addAnswerToRating(ratingId, emptyAnswer);

        // Then
        verify(ratingRepository).findById(ratingId);
        verify(ratingRepository).save(existingRating);
        assertEquals(emptyAnswer, existingRating.getAnswer());
    }

    @Test
    void testUpdateRatingStatus_WithExistingRating_ShouldUpdateAndReturnRating() throws NotFoundException {
        // Given
        Integer ratingId = 1;
        RatingStatus newStatus = RatingStatus.PUBLISHED;
        RatingEntity existingRating = RatingMother.createRatingEntity();
        RatingEntity updatedRating = RatingMother.createRatingEntity();
        updatedRating.setStatus(newStatus);

        when(ratingRepository.findById(ratingId)).thenReturn(Optional.of(existingRating));
        when(ratingRepository.save(any(RatingEntity.class))).thenReturn(updatedRating);

        // When
        RatingEntity result = ratingService.updateRatingStatus(ratingId, newStatus);

        // Then
        assertNotNull(result);
        assertEquals(newStatus, result.getStatus());
        verify(ratingRepository).findById(ratingId);
        verify(ratingRepository).save(existingRating);
        assertEquals(newStatus, existingRating.getStatus());
    }

    @Test
    void testUpdateRatingStatus_WithNonExistentRating_ShouldThrowNotFoundException() {
        // Given
        Integer ratingId = 999;
        RatingStatus newStatus = RatingStatus.PUBLISHED;

        when(ratingRepository.findById(ratingId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(NotFoundException.class, () -> ratingService.updateRatingStatus(ratingId, newStatus));
        verify(ratingRepository).findById(ratingId);
        verify(ratingRepository, never()).save(any());
    }

    @Test
    void testUpdateRatingStatus_WithDifferentStatuses_ShouldUpdateCorrectly() throws NotFoundException {
        // Given
        Integer ratingId = 1;
        RatingStatus rejectedStatus = RatingStatus.REJECTED;
        RatingEntity existingRating = RatingMother.createRatingEntity();

        when(ratingRepository.findById(ratingId)).thenReturn(Optional.of(existingRating));
        when(ratingRepository.save(any(RatingEntity.class))).thenReturn(existingRating);

        // When
        RatingEntity result = ratingService.updateRatingStatus(ratingId, rejectedStatus);

        // Then
        assertNotNull(result);
        verify(ratingRepository).findById(ratingId);
        verify(ratingRepository).save(existingRating);
        assertEquals(rejectedStatus, existingRating.getStatus());
    }

    @Test
    void testCreateRating_WithMultipleAirlines_ShouldWorkForEachAirline() throws NotFoundException {
        // Given
        AirlineEntity airFrance = AirlineMother.createAirFranceEntity();
        AirlineEntity lufthansa = AirlineMother.createLufthansaEntity();
        RatingEntity airFranceRating = RatingMother.createRatingEntity();
        RatingEntity lufthansaRating = RatingMother.createRatingEntity();
        airFranceRating.setAirline(airFrance);
        lufthansaRating.setAirline(lufthansa);

        when(airlineRepository.findById(airFrance.getId())).thenReturn(Optional.of(airFrance));
        when(airlineRepository.findById(lufthansa.getId())).thenReturn(Optional.of(lufthansa));

        // When
        ratingService.createRating(airFranceRating);
        ratingService.createRating(lufthansaRating);

        // Then
        verify(airlineRepository).findById(airFrance.getId());
        verify(airlineRepository).findById(lufthansa.getId());
        verify(ratingRepository).save(airFranceRating);
        verify(ratingRepository).save(lufthansaRating);
    }

    @Test
    void testServiceInteractions_VerifyRepositoryCallsAreCorrect() throws NotFoundException {
        // Given
        Integer ratingId = 1;
        RatingEntity rating = RatingMother.createRatingEntity();
        String comment = "Updated comment";
        String answer = "Thank you";
        RatingStatus status = RatingStatus.PUBLISHED;

        when(ratingRepository.findById(ratingId)).thenReturn(Optional.of(rating));
        when(ratingRepository.save(any(RatingEntity.class))).thenReturn(rating);

        // When
        ratingService.updateRatingComment(ratingId, comment);
        ratingService.addAnswerToRating(ratingId, answer);
        ratingService.updateRatingStatus(ratingId, status);

        // Then
        verify(ratingRepository, times(3)).findById(ratingId);
        verify(ratingRepository, times(3)).save(rating);
        verifyNoMoreInteractions(ratingRepository);
        verifyNoInteractions(airlineRepository);
    }

    @Test
    void testGetRatingsByFilters_WithPositiveRatings_ShouldReturnPositiveRatings() {
        // Given
        RatingFiltersResource filters = RatingMother.createRatingFilters();
        Pageable pageable = PageRequest.of(0, 10);
        
        // Create positive ratings manually since createPageOfPositiveRatingEntities doesn't exist
        RatingEntity positiveRating1 = RatingMother.createPositiveRatingEntity();
        RatingEntity positiveRating2 = RatingMother.createPositiveRatingEntity();
        Page<RatingEntity> positiveRatings = new PageImpl<>(Arrays.asList(positiveRating1, positiveRating2));
        
        @SuppressWarnings("unchecked")
        Specification<RatingEntity> specification = mock(Specification.class);

        when(ratingSearchSpecification.getRatingSearch(filters)).thenReturn(specification);
        when(ratingRepository.findAll(specification, pageable)).thenReturn(positiveRatings);

        // When
        Page<RatingEntity> result = ratingService.getRatingsByFilters(filters, pageable);

        // Then
        assertNotNull(result);
        assertTrue(result.getContent().stream().allMatch(r -> r.getRating() >= 3));
        verify(ratingSearchSpecification).getRatingSearch(filters);
        verify(ratingRepository).findAll(specification, pageable);
    }
}
