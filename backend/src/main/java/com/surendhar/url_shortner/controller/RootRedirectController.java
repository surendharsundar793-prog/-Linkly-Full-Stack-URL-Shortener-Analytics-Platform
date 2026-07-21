package com.surendhar.url_shortner.controller;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.surendhar.url_shortner.entity.Url;
import com.surendhar.url_shortner.service.UrlSevice;

@CrossOrigin("*")
@RestController
public class RootRedirectController {

	@Autowired
	private UrlSevice service;

	@GetMapping("/{shortUrl:[a-zA-Z0-9-_]+}")
	public ResponseEntity<Void> rootRedirect(@PathVariable String shortUrl) {
		Url url = service.reDirectUrl(shortUrl);
		return ResponseEntity
				.status(HttpStatus.FOUND)
				.location(URI.create(url.getOriginalUrl()))
				.build();
	}
}
