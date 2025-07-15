package fr.florianrenaud.avisdevol.utils.mothers;

import fr.florianrenaud.avisdevol.business.resources.AirlineResource;
import fr.florianrenaud.avisdevol.dao.entity.AirlineEntity;

/**
 * Mother class for creating test data for Airline objects.
 * Provides factory methods to create consistent test data.
 */
public class AirlineMother {

    /**
     * Creates a sample AirlineEntity with default values.
     */
    public static AirlineEntity createAirlineEntity() {
        return createAirlineEntity(1L, "Air France", "AF", "AFR", "France", true);
    }

    /**
     * Creates an AirlineEntity with specific values.
     */
    public static AirlineEntity createAirlineEntity(Long id, String name, String iataCode, String icaoCode, String country, Boolean active) {
        AirlineEntity entity = new AirlineEntity();
        entity.setId(id);
        entity.setName(name);
        entity.setIataCode(iataCode);
        entity.setIcaoCode(icaoCode);
        entity.setCountry(country);
        entity.setActive(active);
        return entity;
    }

    /**
     * Creates Air France entity.
     */
    public static AirlineEntity createAirFranceEntity() {
        return createAirlineEntity(1L, "Air France", "AF", "AFR", "France", true);
    }

    /**
     * Creates Air Canada entity.
     */
    public static AirlineEntity createAirCanadaEntity() {
        return createAirlineEntity(2L, "Air Canada", "AC", "ACA", "Canada", true);
    }

    /**
     * Creates Lufthansa entity.
     */
    public static AirlineEntity createLufthansaEntity() {
        return createAirlineEntity(3L, "Lufthansa", "LH", "DLH", "Germany", true);
    }

    /**
     * Creates a sample AirlineResource with default values.
     */
    public static AirlineResource createAirlineResource() {
        return createAirlineResource("1", "Air France", "AF", "AFR", "France", true);
    }

    /**
     * Creates an AirlineResource with specific values.
     */
    public static AirlineResource createAirlineResource(String id, String name, String iataCode, String icaoCode, String country, Boolean active) {
        AirlineResource resource = new AirlineResource();
        resource.setId(id);
        resource.setName(name);
        resource.setIataCode(iataCode);
        resource.setIcaoCode(icaoCode);
        resource.setCountry(country);
        resource.setActive(active);
        return resource;
    }

    /**
     * Creates Air France resource.
     */
    public static AirlineResource createAirFranceResource() {
        return createAirlineResource("1", "Air France", "AF", "AFR", "France", true);
    }

    /**
     * Creates Air Canada resource.
     */
    public static AirlineResource createAirCanadaResource() {
        return createAirlineResource("2", "Air Canada", "AC", "ACA", "Canada", true);
    }

    /**
     * Creates Lufthansa resource.
     */
    public static AirlineResource createLufthansaResource() {
        return createAirlineResource("3", "Lufthansa", "LH", "DLH", "Germany", true);
    }

    /**
     * Creates an inactive airline entity.
     */
    public static AirlineEntity createInactiveAirlineEntity() {
        return createAirlineEntity(99L, "Defunct Company", "DA", "DEF", "Unknown", false);
    }

    /**
     * Creates an inactive airline resource.
     */
    public static AirlineResource createInactiveAirlineResource() {
        return createAirlineResource("99", "Defunct Company", "DA", "DEF", "Unknown", false);
    }
}
