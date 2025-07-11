package fr.florianrenaud.avisdevol.utils;

import java.util.Locale;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/**
 * Helpers class
 */
public final class Helpers {

	/** Constructor. */
	private Helpers() {
		throw new IllegalStateException("Utility class");
	}

	/**
	 * Create a new pageable object in order to match the entity field from which the request will be done.
	 * @param page Page index
	 * @param size Number of elements
	 * @param column Sort column
	 * @param direction Sort direction
	 * @param defaultSelectOrder field from which the order will be sorted by default
	 * @param secondaryOrder field that will be used to sort the page if the default one is no use
	 * @return new pageable object used for sorting
	 */
	public static Pageable createPageable(Integer page, Integer size, String column, String direction, String defaultSelectOrder, String secondaryOrder) {
		// Validate and sanitize sort column
		String validatedColumn = validateAndSanitizeSortColumn(column, defaultSelectOrder);
		
		// Forcing secondary order on a unique field to make sure data are always sorted on a unique data for pagination :
		// https://asktom.oracle.com/pls/apex/f?p=100:11:::::P11_QUESTION_ID:9541036000346055103
		Sort.Order selectedOrder = new Sort.Order(Sort.Direction.fromString(direction), validatedColumn);
		Sort.Order secondaryDeterministicOrder = Sort.Order.asc(secondaryOrder);
		return PageRequest.of(page, size, Sort.by(selectedOrder, secondaryDeterministicOrder));
	}
	
	/**
	 * Validates and sanitizes the sort column to prevent PropertyReferenceException.
	 * @param column The requested sort column
	 * @param defaultColumn The default column to use if validation fails
	 * @return A valid sort column
	 */
	public static String validateAndSanitizeSortColumn(String column, String defaultColumn) {
		// If column is null or empty, use default
		if (StringUtils.isBlank(column)) {
			return defaultColumn;
		}
		
		// Transform airline to airline.name for proper sorting
		if ("airline".equals(column)) {
			column = "airline.name";
		}
		
		// Check if the column is in the list of valid columns for Rating
		if (Constants.VALID_RATING_SORT_COLUMNS.contains(column)) {
			return column;
		}
		
		// If not valid, return default column
		return defaultColumn;
	}

	/**
	 * Add % around a lowercased value for like purpose.
	 * @param value Value to like
	 * @return Likable lowercased value for sql request
	 */
	public static String sqlContains(String value) {
		return sqlContains(value, true);
	}

	/**
	 * Add % around a value for like purpose.
	 * @param value Value to like
	 * @param lowerCase True to force lower case, false otherwise
	 * @return Likable value for sql request
	 */
	public static String sqlContains(String value, boolean lowerCase) {
		StringBuilder sb = new StringBuilder(100);
		sb.append("%");
		if (lowerCase) {
			sb.append(value.toLowerCase(Locale.ROOT));
		} else {
			sb.append(value);
		}
		sb.append("%");
		return sb.toString();
	}
}
