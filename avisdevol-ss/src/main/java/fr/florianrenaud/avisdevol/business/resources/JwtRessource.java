package fr.florianrenaud.avisdevol.business.resources;

/**
 * Resource class for JWT token.
 * This class is used to encapsulate the JWT token string.
 */
public class JwtRessource {

    /** The JWT token string. */
    private String token;

    /**
     * Default constructor.
     * Initializes the token to an empty string.
     */
    public JwtRessource(String token) {
        this.token = token;
    }

    /**
     * Getter for the token attribute.
     * @return the JWT token string
     */
    public String getToken() {
        return token;
    }

    /**
     * Setter for the token attribute.
     * @param token the JWT token string to set
     */
    public void setToken(String token) {
        this.token = token;
    }
}
