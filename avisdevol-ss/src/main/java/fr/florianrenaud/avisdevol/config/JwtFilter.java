package fr.florianrenaud.avisdevol.config;

import fr.florianrenaud.avisdevol.business.service.impl.JwtServiceImpl;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Implementation of JwtFilter.
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

	    private JwtServiceImpl jwtServiceImpl;
	    private UserDetailsService userDetailsService;

		public JwtFilter(JwtServiceImpl jwtServiceImpl, UserDetailsService userDetailsService) {
			this.jwtServiceImpl = jwtServiceImpl;
			this.userDetailsService = userDetailsService;
		}

		/**
	     * Filter method to intercept requests and validate JWT tokens.
	     * @param request the HTTP request
	     * @param response the HTTP response
	     * @param filterChain the filter chain
	     * @throws ServletException if an error occurs during filtering
	     * @throws IOException if an I/O error occurs
	     */
	    @Override
	    protected void doFilterInternal(HttpServletRequest request,
	                                    HttpServletResponse response,
	                                    FilterChain filterChain)
	                                    throws ServletException, IOException {

	    	try {
	    		final String authHeader = request.getHeader("Authorization");
		        final String jwt;
		        final String userEmail;

		        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
		            filterChain.doFilter(request, response);
		            return;
		        }

		        jwt = authHeader.substring(7);
		        userEmail = jwtServiceImpl.extractUsername(jwt);

		        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
		            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

		            if (jwtServiceImpl.isTokenValid(jwt, userDetails)) {
		                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
		                        userDetails, null, userDetails.getAuthorities());

		                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
		                SecurityContextHolder.getContext().setAuthentication(authToken);
		            }
		        }

		        filterChain.doFilter(request, response);
	    	} catch (ExpiredJwtException e) {
	    		this.handleUnauthorized(response, "Token expired");
	    	    return;
	        
	    }
	    }

		/**
	     * Handles unauthorized access by setting the appropriate headers and status code.
	     * @param response the HTTP response
	     * @param message the message to write in the response
	     * @throws IOException if an I/O error occurs
	     */
	    private void handleUnauthorized(HttpServletResponse response, String message) throws IOException {
	        response.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
	        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	        response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
	        response.setHeader("Access-Control-Allow-Credentials", "true");

	        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
	        response.getWriter().write(message);
	    }
}
