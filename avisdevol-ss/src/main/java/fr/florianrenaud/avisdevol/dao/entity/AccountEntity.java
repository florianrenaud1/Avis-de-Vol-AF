package fr.florianrenaud.avisdevol.dao.entity;

import fr.florianrenaud.avisdevol.business.enums.Role;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

/**
 * Entity representing an account.
 */
@Entity
@Table(name = "ACCOUNT")
@SequenceGenerator(name = "SEQ_ACCOUNT", sequenceName = "SEQ_ACCOUNT", allocationSize = 1)
public class AccountEntity {
	
	/** id */
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ_ACCOUNT")
	private Long id;
	
	@Column(name = "EMAIL", nullable = false, length = 100)
	private String email;
	
	@Column(name = "USERNAME", nullable = false, length = 100)
	private String username;
	
	@Column(name = "PASSWORD", nullable = false, length = 100)
	private String password;
	
	@Column(name = "ROLE", nullable = false, length = 100)
	@Enumerated(EnumType.STRING)
	private Role role;

	/**
	 * Returns the id of the account.
	 * @return the id
	 */
	public Long getId() {
		return id;
	}

	/**
	 * Sets the id of the account.
	 * @param id the id to set
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * Returns the email of the account.
	 * @return the email
	 */
	public String getEmail() {
		return email;
	}

	/**
	 * Sets the email of the account.
	 * @param email the email to set
	 */
	public void setEmail(String email) {
		this.email = email;
	}

	/**
	 * Returns the username of the account.
	 * @return the username
	 */
	public String getUsername() {
		return username;
	}

	/**
	 * Sets the username of the account.
	 * @param username the username to set
	 */
	public void setUsername(String username) {
		this.username = username;
	}

	/**
	 * Returns the password of the account.
	 * @return the password
	 */
	public String getPassword() {
		return password;
	}

	/**
	 * Sets the password of the account.
	 * @param password the password to set
	 */
	public void setPassword(String password) {
		this.password = password;
	}

	/**
	 * Returns the role of the account.
	 * @return the role
	 */
	public Role getRole() {
		return role;
	}

	/**
	 * Sets the role of the account.
	 * @param role the role to set
	 */
	public void setRole(Role role) {
		this.role = role;
	}
	
	


}
