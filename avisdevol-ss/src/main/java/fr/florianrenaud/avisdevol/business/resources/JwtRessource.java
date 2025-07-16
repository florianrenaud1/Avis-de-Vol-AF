package fr.florianrenaud.avisdevol.business.resources;

public class JwtRessource {
    private String token;

    public JwtRessource(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
