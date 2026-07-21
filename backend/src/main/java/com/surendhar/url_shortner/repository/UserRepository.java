package com.surendhar.url_shortner.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.surendhar.url_shortner.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);
	boolean existsByEmail(String email);
	Optional<User> findByResetToken(String resetToken);

}
