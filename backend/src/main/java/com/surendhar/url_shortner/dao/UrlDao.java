package com.surendhar.url_shortner.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.surendhar.url_shortner.entity.Url;
import com.surendhar.url_shortner.entity.User;
import com.surendhar.url_shortner.exception.UrlNotFoundException;
import com.surendhar.url_shortner.repository.UrlRepository;

@Repository
public class UrlDao {
	
	@Autowired
	private UrlRepository ur;
	
	public Url saveUrl(Url url) {
		return ur.save(url);
	}
	
	public List<Url> getAllUrl(){
		return ur.findAll();
	}

	public List<Url> getAllUrlByUser(User user) {
		return ur.findByUser(user);
	}
	
	public Url getUrlById(Long id) {
		return ur.findById(id).orElse(null);
	}

	public Url getUrlByIdAndUser(Long id, User user) {
		return ur.findByIdAndUser(id, user).orElse(null);
	}
	
	public Url updateUrl(Long id, Url url) {
		
		Url daourl = ur.findById(id).orElse(null);
		if(daourl != null) {
			daourl.setOriginalUrl(url.getOriginalUrl());
			
			return ur.save(daourl);
		}
		 throw new UrlNotFoundException("URL not found with ID: " + id);
	}
	
	public String deleteUrl(Long id) {
		Url u = ur.findById(id).orElse(null);
		if(u != null) {
			ur.delete(u);
			return "URL Deleted Successfully";
		}
		throw new UrlNotFoundException("URL not found with ID: " + id);
	}
	
	public boolean existsByShortUrl(String shortUrl) {
	    return ur.existsByShortUrl(shortUrl);
	}
	
	public Url getByShortUrl(String shortUrl) {
		return ur.findByShortUrl(shortUrl).orElse(null);
	}
	
	public Url redirectUrl(String shortUrl) {

	    Url url = ur.findByShortUrl(shortUrl)
	            .orElseThrow(() -> new UrlNotFoundException("Short URL not found"));

	    url.setClickcount(url.getClickcount() + 1);
	    url.setUpdatedAt(java.time.LocalDateTime.now());

	    return ur.save(url);
	}
}
