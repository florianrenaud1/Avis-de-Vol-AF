package fr.florianrenaud.avisdevol.business.mapper;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import fr.florianrenaud.avisdevol.business.resources.RatingResource;
import fr.florianrenaud.avisdevol.business.utils.Pagination;
import fr.florianrenaud.avisdevol.dao.entity.RatingEntity;

/**
 * MapStruct mapper for converting between RatingEntity and RatingResource.
 */
@Mapper(componentModel = "spring", uses = {AirlineMapper.class})
@Component
public interface RatingMapper {

    /**
     * Converts a Page of RatingEntity to a Pagination of RatingResource.
     *
     * @param entity the Page of RatingEntity to convert
     * @return the converted Pagination of RatingResource
     */
    Pagination<RatingResource> mapToListOfRatingResources(Page<RatingEntity> entity);

    /**
     * Converts a RatingEntity to a RatingResource.
     *
     * @param entity the RatingEntity to convert
     * @return the converted RatingResource
     */
    @Mapping(source = "id", target = "id")
    @Mapping(source = "airline", target = "airline")
    @Mapping(source = "comment", target = "comments")
    @Mapping(source = "answer", target = "answer")
    RatingResource ratingEntityToRatingResource(RatingEntity entity);

    @Mapping(source = "airline", target = "airline")
    @Mapping(source = "comments", target = "comment")
    @Mapping(target = "id", ignore = true) // Ignorer l'ID lors de la création
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(source = "answer", target = "answer")
    RatingEntity ratingResourceToRatingEntity(RatingResource resource);
    
   /* @Mapping(source = "airline", target = "airline")
    @Mapping(source = "comments", target = "comment")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    RatingEntity ratingResourceForCreationToRatingEntity(RatingResourceForCreation resource);*/

    /**
     * Converts a Long to Integer.
     */
    @Named("longToInteger")
    default Integer longToInteger(Long value) {
        return value != null ? value.intValue() : null;
    }

    /**
     * Converts a Long to String.
     */
    @Named("longToString")
    default String longToString(Long value) {
        return value != null ? value.toString() : null;
    }

    /**
     * Converts an Integer to String.
     */
    @Named("integerToString")
    default String integerToString(Integer value) {
        return value != null ? value.toString() : null;
    }

    /**
     * Converts a LocalDate to String using ISO date format.
     */
    @Named("localDateToString")
    default String localDateToString(LocalDate date) {
        return date != null ? date.format(DateTimeFormatter.ISO_LOCAL_DATE) : null;
    }
}
