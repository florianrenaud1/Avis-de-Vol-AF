package fr.florianrenaud.avisdevol.dao.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import fr.florianrenaud.avisdevol.dao.entity.AirlineEntity;
import fr.florianrenaud.avisdevol.dao.repository.AirlineRepository;
import fr.florianrenaud.avisdevol.dao.service.AirlineService;

@Service
public class AirlineServiceImpl implements AirlineService {
	
	private final AirlineRepository airlineRepository;
	
	public AirlineServiceImpl(AirlineRepository airlineRepository) {
		this.airlineRepository = airlineRepository;
	}

	@Override
	public List<AirlineEntity> getAirlinesWhereNameContains(String name) {
		return this.airlineRepository.findTop5ByNameContainingIgnoreCase(name);
	}
	

	
	@Override
	public Optional<AirlineEntity> getAirlineByName(String name) {
		return this.airlineRepository.findByNameIgnoreCase(name);
	}

}
