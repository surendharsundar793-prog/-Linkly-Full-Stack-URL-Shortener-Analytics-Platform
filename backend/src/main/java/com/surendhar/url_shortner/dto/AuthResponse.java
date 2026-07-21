package com.surendhar.url_shortner.dto;

public class AuthResponse {

	private String token;
	private String name;
	private String email;
	private Integer age;
	private String role;
	private String message;

	public AuthResponse() {
	}

	public AuthResponse(String token, String name, String email, Integer age, String role, String message) {
		this.token = token;
		this.name = name;
		this.email = email;
		this.age = age;
		this.role = role;
		this.message = message;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Integer getAge() {
		return age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}
