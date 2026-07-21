package com.surendhar.url_shortner.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

	@NotBlank(message = "Name cannot be empty")
	private String name;

	@NotBlank(message = "Email cannot be empty")
	@Email(message = "Please enter a valid email address")
	private String email;

	@NotBlank(message = "Password cannot be empty")
	@Size(min = 6, message = "Password must be at least 6 characters long")
	private String password;

	private Integer age;

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

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Integer getAge() {
		return age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}
}
