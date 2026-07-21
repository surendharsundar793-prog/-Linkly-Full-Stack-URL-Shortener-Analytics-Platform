package com.surendhar.url_shortner.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.surendhar.url_shortner.entity.Url;
import com.surendhar.url_shortner.entity.User;

public interface UrlRepository extends JpaRepository<Url, Long> {
	
	Optional<Url> findByShortUrl(String shortUrl);
	boolean existsByShortUrl(String shorturl);
	List<Url> findByUser(User user);
	Optional<Url> findByIdAndUser(Long id, User user);

}
