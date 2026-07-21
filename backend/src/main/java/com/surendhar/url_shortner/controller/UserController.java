package com.surendhar.url_shortner.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.surendhar.url_shortner.dto.AuthResponse;
import com.surendhar.url_shortner.dto.UpdateProfileRequest;
import com.surendhar.url_shortner.entity.Url;
import com.surendhar.url_shortner.entity.User;
import com.surendhar.url_shortner.repository.UrlRepository;
import com.surendhar.url_shortner.repository.UserRepository;
import com.surendhar.url_shortner.security.CustomUserDetailsService;
import com.surendhar.url_shortner.security.JwtService;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UrlRepository urlRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtService jwtService;

	@Autowired
	private CustomUserDetailsService userDetailsService;

	private User getAuthenticatedUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
			return null;
		}
		return userRepository.findByEmail(auth.getName()).orElse(null);
	}

	@PutMapping("/profile")
	public ResponseEntity<AuthResponse> updateProfile(@RequestBody UpdateProfileRequest request) {
		User user = getAuthenticatedUser();
		if (user == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(new AuthResponse(null, null, null, null, null, "Unauthorized"));
		}

		if (request.getName() != null && !request.getName().trim().isEmpty()) {
			user.setName(request.getName().trim());
		}

		if (request.getEmail() != null && !request.getEmail().trim().isEmpty() && !request.getEmail().equals(user.getEmail())) {
			if (userRepository.existsByEmail(request.getEmail().trim())) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.body(new AuthResponse(null, null, null, null, null, "Email is already registered by another user!"));
			}
			user.setEmail(request.getEmail().trim());
		}

		if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
			user.setPassword(passwordEncoder.encode(request.getPassword().trim()));
		}

		userRepository.save(user);

		UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
		String token = jwtService.generateToken(userDetails);

		AuthResponse response = new AuthResponse(
				token,
				user.getName(),
				user.getEmail(),
				user.getAge(),
				user.getRole(),
				"User data updated on database successfully"
		);

		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/profile")
	public ResponseEntity<AuthResponse> deleteAccount() {
		User user = getAuthenticatedUser();
		if (user == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(new AuthResponse(null, null, null, null, null, "Unauthorized"));
		}

		// 1. Delete all URL records belonging to this user from the database
		List<Url> userUrls = urlRepository.findByUser(user);
		if (userUrls != null && !userUrls.isEmpty()) {
			urlRepository.deleteAll(userUrls);
		}

		// 2. Delete the user record from the database
		userRepository.delete(user);

		AuthResponse response = new AuthResponse(
				null,
				null,
				null,
				null,
				null,
				"Account and all associated URL data deleted from database successfully"
		);

		return ResponseEntity.ok(response);
	}
}
