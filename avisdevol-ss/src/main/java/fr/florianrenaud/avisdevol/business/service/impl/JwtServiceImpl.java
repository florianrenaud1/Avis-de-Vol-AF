package fr.florianrenaud.avisdevol.business.service.impl;

import fr.florianrenaud.avisdevol.business.service.JwtService;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import fr.florianrenaud.avisdevol.business.resources.AccountResources;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

/**
 * Service for handling JWT operations such as token generation, validation, and extraction of claims.
 */
@Service
public class JwtServiceImpl implements JwtService {
    private static final String SECRET = "#put-secret-here";
    private static final Key SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes()); 

    
    public String generateToken(AccountResources user) {
    	System.out.println("test : " + user.getRole());
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole().name())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1h
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }
    
    private Key getSignInKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }
    
    public boolean validateToken(String token) {
        try {
        	Jwts.parser()
            .setSigningKey(SECRET_KEY)
            .build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String extractUsername(String token) {
        Claims claims = Jwts.parser()
        	    .setSigningKey(SECRET_KEY)
        	    .build()
        	    .parseClaimsJws(token).getBody();
        return claims.getSubject();
    }
    
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
    

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}
