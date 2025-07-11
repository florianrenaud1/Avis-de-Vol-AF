package fr.florianrenaud.avisdevol.business.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

import fr.florianrenaud.avisdevol.business.resources.AirlineResource;
import fr.florianrenaud.avisdevol.dao.entity.AirlineEntity;

/**
 * MapStruct mapper for converting between AirlineEntity and AirlineResource.
 */
@Mapper(componentModel = "spring")
@Component
public interface AirlineMapper {

    /**
     * Converts an AirlineEntity to an AirlineResource.
     *
     * @param entity the AirlineEntity to convert
     * @return the converted AirlineResource
     */
    @Mapping(source = "id", target = "id", qualifiedByName = "longToString")
    AirlineResource airlineEntityToAirlineResource(AirlineEntity entity);

    /**
     * Converts a list of AirlineEntity to a list of AirlineResource.
     *
     * @param entities the list of AirlineEntity to convert
     * @return the converted list of AirlineResource
     */
    List<AirlineResource> airlineEntitiesToAirlineResources(List<AirlineEntity> entities);

    /**
     * Converts a Long to String.
     */
    @Named("longToString")
    default String longToString(Long value) {
        return value != null ? value.toString() : null;
    }
}
