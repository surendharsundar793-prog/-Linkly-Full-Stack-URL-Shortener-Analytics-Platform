package com.surendhar.url_shortner.controller;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.surendhar.url_shortner.dto.SaveUrlRequest;
import com.surendhar.url_shortner.entity.Url;
import com.surendhar.url_shortner.responsestructure.UrlResponseStructure;
import com.surendhar.url_shortner.service.UrlSevice;

import jakarta.validation.Valid;

@CrossOrigin("*")
@RequestMapping("/api/v1/urls")
@RestController
public class UrlController {
	
	@Autowired
	private UrlSevice service;
	
	@PostMapping
	public ResponseEntity<UrlResponseStructure<Url>> saveUrl(@Valid @RequestBody SaveUrlRequest url) {
		Url saveurl = service.saveUrl(url);
		UrlResponseStructure<Url> rs = new UrlResponseStructure<>();
		rs.setStatusCode(HttpStatus.CREATED.value());
		rs.setMessage("URL Saved Successfully");
		rs.setData(saveurl);
		
		return new ResponseEntity<>(rs, HttpStatus.CREATED);
	}
	
	
	@GetMapping
	public ResponseEntity<UrlResponseStructure<List<Url>>> getAllUrl() {

	    List<Url> urls = service.getAllUrl();

	    UrlResponseStructure<List<Url>> response = new UrlResponseStructure<>();

	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("All URLs fetched successfully");
	    response.setData(urls);

	    return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	
	@GetMapping("/{id}")
	public ResponseEntity<UrlResponseStructure<Url>> getUrlById(@PathVariable Long id) {

	    Url url = service.getUrlById(id);

	    UrlResponseStructure<Url> response = new UrlResponseStructure<>();

	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("URL fetched successfully");
	    response.setData(url);

	    return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	
	@PutMapping("/{id}")
	public ResponseEntity<UrlResponseStructure<Url>> updateUrl(
	        @PathVariable Long id,
	        @Valid @RequestBody SaveUrlRequest request) {

	    Url updatedUrl = service.updateUrl(id, request);

	    UrlResponseStructure<Url> response = new UrlResponseStructure<>();

	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("URL updated successfully");
	    response.setData(updatedUrl);

	    return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	
	@DeleteMapping("/{id}")
	public ResponseEntity<UrlResponseStructure<String>> deleteUrl(@PathVariable Long id) {

	    String message = service.deleteUrl(id);

	    UrlResponseStructure<String> response = new UrlResponseStructure<>();

	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("URL deleted successfully");
	    response.setData(message);

	    return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@GetMapping("/redirect/{shortUrl}")
	public ResponseEntity<Void> reDirectUrl(@PathVariable String shortUrl){
		
		Url url = service.reDirectUrl(shortUrl);
		return ResponseEntity
				.status(HttpStatus.FOUND)
				.location(URI.create(url.getOriginalUrl()))
				.build();
	}
}
