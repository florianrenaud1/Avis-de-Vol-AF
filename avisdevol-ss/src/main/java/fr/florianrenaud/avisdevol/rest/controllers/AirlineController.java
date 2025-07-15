package fr.florianrenaud.avisdevol.rest.controllers;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import fr.florianrenaud.avisdevol.business.resources.AirlineResource;
import fr.florianrenaud.avisdevol.business.service.BizAirlineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Controller for managing airline endpoints.
 */
@RestController
@CrossOrigin(originPatterns = "http://localhost:4200", allowCredentials = "true")
@Tag(name = "Airline", description = "Airline endpoints")
@RequestMapping("/rest/airline")
public class AirlineController {
	
	private final BizAirlineService bizAirlineService;
	
	/**
	 * Constructor for AirlineController.
	 * @param bizAirlineService the BizAirlineService to use
	 */
	public AirlineController(BizAirlineService bizAirlineService) {
		this.bizAirlineService = bizAirlineService;
	}

	/**
	 * Retrieves a list of airlines by their name.
	 * @param name the name to search for
	 * @return List of AirlineResource matching the name
	 */
	@Operation(summary = "Search rating")
	@GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
	public List<AirlineResource> getAirlineByName(@RequestParam("name") String name) {
		return bizAirlineService.getAirlinesByName(name);
	}

}
