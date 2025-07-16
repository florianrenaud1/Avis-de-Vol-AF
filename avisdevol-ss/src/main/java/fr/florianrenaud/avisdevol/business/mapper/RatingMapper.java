package fr.florianrenaud.avisdevol.business.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
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

    /**
     * Converts a RatingResource to a RatingEntity.
     *
     * @param resource the RatingResource to convert
     * @return the converted RatingEntity
     */
    @Mapping(source = "airline", target = "airline")
    @Mapping(source = "comments", target = "comment")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(source = "answer", target = "answer")
    RatingEntity ratingResourceToRatingEntity(RatingResource resource);
}
