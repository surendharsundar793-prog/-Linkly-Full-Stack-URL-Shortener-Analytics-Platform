package com.surendhar.url_shortner.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.surendhar.url_shortner.dao.UrlDao;
import com.surendhar.url_shortner.dto.SaveUrlRequest;
import com.surendhar.url_shortner.entity.Url;
import com.surendhar.url_shortner.entity.User;
import com.surendhar.url_shortner.exception.UrlNotFoundException;
import com.surendhar.url_shortner.repository.UserRepository;

@Service
public class UrlSevice {
	
	@Autowired
	private UrlDao dao;

	@Autowired
	private UserRepository userRepository;

	private User getAuthenticatedUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
			return null;
		}
		String email = auth.getName();
		return userRepository.findByEmail(email).orElse(null);
	}
	
	private String generateShortCode() {
		String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	    Random random = new Random();

	    StringBuilder shorturl = new StringBuilder();

	    for (int i = 0; i < 6; i++) {
	        shorturl.append(characters.charAt(random.nextInt(characters.length())));
	    }

	    return shorturl.toString();
	}
	
	public Url getByShortUrl(String shortUrl) {
		return dao.getByShortUrl(shortUrl);
	}
	
	public Url saveUrl(SaveUrlRequest request) {

	    String shortCode;

	    do {
	        shortCode = generateShortCode();
	    } while (dao.existsByShortUrl(shortCode));

	    Url url = new Url();

	    url.setOriginalUrl(request.getOriginalUrl());
	    url.setShortUrl(shortCode);
	    url.setClickcount(0L);
	    url.setCreatedAt(LocalDateTime.now());
	    url.setUpdatedAt(LocalDateTime.now());
	    url.setUser(getAuthenticatedUser());

	    return dao.saveUrl(url);
	}
	
	public List<Url> getAllUrl(){
		User user = getAuthenticatedUser();
		if (user != null) {
			return dao.getAllUrlByUser(user);
		}
		return dao.getAllUrl();
	}
	
	public Url getUrlById(Long id) {
		User user = getAuthenticatedUser();
		if (user != null) {
			return dao.getUrlByIdAndUser(id, user);
		}
		return dao.getUrlById(id);
	}
	
	public Url updateUrl(Long id, SaveUrlRequest request) {
		User user = getAuthenticatedUser();
		Url daourl = (user != null) ? dao.getUrlByIdAndUser(id, user) : dao.getUrlById(id);
		if (daourl != null) {
			daourl.setOriginalUrl(request.getOriginalUrl());
			daourl.setUpdatedAt(LocalDateTime.now());
			return dao.saveUrl(daourl);
		}
		throw new UrlNotFoundException("URL not found with ID: " + id);
	}
	
	public String deleteUrl(Long id) {
		User user = getAuthenticatedUser();
		Url u = (user != null) ? dao.getUrlByIdAndUser(id, user) : dao.getUrlById(id);
		if (u != null) {
			return dao.deleteUrl(id);
		}
		throw new UrlNotFoundException("URL not found with ID: " + id);
	}
	
	public Url reDirectUrl(String shortUrl) {
		return dao.redirectUrl(shortUrl);
	}
}
