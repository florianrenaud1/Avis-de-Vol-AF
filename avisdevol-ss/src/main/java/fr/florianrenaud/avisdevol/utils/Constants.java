package fr.florianrenaud.avisdevol.utils;

import java.util.Set;

/**
 * Constants class
 */
public final class Constants {

	/** For Rating search */
	public static final String DEFAULT_SORT_COLUMN_RATING = "date";
	public static final String DEFAULT_SECONDARY_SORT_COLUMN_RATING = "rating";
	
	/** Valid sort columns for Rating */
	public static final Set<String> VALID_RATING_SORT_COLUMNS = Set.of(
		"id", "flightNumber", "date", "rating", "comment", "createdAt", "updatedAt", "airline.name", "status"
	);

	private Constants() {
	}

}
