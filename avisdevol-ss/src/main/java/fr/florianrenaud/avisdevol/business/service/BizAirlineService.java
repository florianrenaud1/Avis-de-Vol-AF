package fr.florianrenaud.avisdevol.business.service;

import java.util.List;

import fr.florianrenaud.avisdevol.business.resources.AirlineResource;

public interface BizAirlineService {

	List<AirlineResource> getAirlinesByName(String name);
}
