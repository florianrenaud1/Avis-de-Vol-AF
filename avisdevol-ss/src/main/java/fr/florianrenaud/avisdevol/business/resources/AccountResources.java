package fr.florianrenaud.avisdevol.business.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import fr.florianrenaud.avisdevol.business.enums.Role;

/**
 * AccountResources class represents the resources related to user accounts.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AccountResources {

	/** The email of the user. */
	private String email;

	/** The username of the user. */
	private String username;

	/** The password of the user. */
	private String password;

	/** The role of the user. */
	private Role role;

	/**
	 * Gets the username of the user.
	 * @return the email
	 */
	public String getUsername() {
		return username;
	}

	/**
	 * Sets the username of the user.
	 * @param username
	 */
	public void setUsername(String username) {
		this.username = username;
	}

	/**
	 * Gets the email of the user.
	 * @return the email
	 */
	public String getEmail() {
		return email;
	}

	/**
	 * Sets the email of the user.
	 * @param email
	 */
	public void setEmail(String email) {
		this.email = email;
	}

	/**
	 * Gets the password of the user.
	 * @return the password
	 */
	public String getPassword() {
		return password;
	}

	/**
	 * Sets the password of the user.
	 * @param password
	 */
	public void setPassword(String password) {
		this.password = password;
	}

	/**
	 * Gets the role of the user.
	 * @return the role
	 */
	public Role getRole() {
		return role;
	}

	/**
	 * Sets the role of the user.
	 * @param role
	 */
	public void setRole(Role role) {
		this.role = role;
	}
	
	
}
