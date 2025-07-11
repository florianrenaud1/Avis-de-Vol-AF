package fr.florianrenaud.avisdevol.dao.service;

import java.util.List;
import java.util.Optional;

import fr.florianrenaud.avisdevol.dao.entity.AirlineEntity;

public interface AirlineService {
	
	List<AirlineEntity> getAirlinesWhereNameContains(String filters);
	
	Optional<AirlineEntity> getAirlineByName(String name);
	
}
