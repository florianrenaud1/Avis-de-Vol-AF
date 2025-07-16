package fr.florianrenaud.avisdevol.utils;

import ch.qos.logback.classic.pattern.MessageConverter;
import ch.qos.logback.classic.spi.ILoggingEvent;
import org.apache.commons.lang3.StringEscapeUtils;

public class SanitizedUserInputConverter extends MessageConverter {

	/**
	 * {@inheritDoc}
	 */
	@Override
	public String convert(ILoggingEvent event) {
		return StringEscapeUtils.escapeJson(StringEscapeUtils.escapeXml11(StringEscapeUtils.escapeHtml4(event.getFormattedMessage())));
	}
}
