package com.surendhar.url_shortner.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class SaveUrlRequest {
	
	@NotBlank(message = "Original URL cannot be empty")
    @Pattern(
            regexp = "^(https?://).+",
            message = "Please enter a valid URL"
    )
	
	private String originalUrl;

	public String getOriginalUrl() {
		return originalUrl;
	}

	public void setOriginalUrl(String originalUrl) {
		this.originalUrl = originalUrl;
	}
	

}
