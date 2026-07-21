package com.surendhar.url_shortner.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.surendhar.url_shortner.dto.AuthResponse;
import com.surendhar.url_shortner.dto.ForgotPasswordRequest;
import com.surendhar.url_shortner.dto.LoginRequest;
import com.surendhar.url_shortner.dto.RegisterRequest;
import com.surendhar.url_shortner.dto.ResetPasswordRequest;
import com.surendhar.url_shortner.entity.User;
import com.surendhar.url_shortner.repository.UserRepository;
import com.surendhar.url_shortner.security.CustomUserDetailsService;
import com.surendhar.url_shortner.security.JwtService;
import com.surendhar.url_shortner.service.EmailService;

import jakarta.validation.Valid;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtService jwtService;

	@Autowired
	private CustomUserDetailsService userDetailsService;

	@Autowired
	private EmailService emailService;

	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
		if (userRepository.existsByEmail(request.getEmail())) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(new AuthResponse(null, null, null, null, null, "Email is already registered!"));
		}

		User user = new User(
				request.getName(),
				request.getEmail(),
				passwordEncoder.encode(request.getPassword()),
				request.getAge() != null ? request.getAge() : 24,
				"ROLE_USER"
		);
		userRepository.save(user);

		UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
		String token = jwtService.generateToken(userDetails);

		AuthResponse response = new AuthResponse(
				token,
				user.getName(),
				user.getEmail(),
				user.getAge(),
				user.getRole(),
				"User registered successfully"
		);

		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
			);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(new AuthResponse(null, null, null, null, null, "Invalid email or password"));
		}

		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new RuntimeException("User not found"));

		UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
		String token = jwtService.generateToken(userDetails);

		AuthResponse response = new AuthResponse(
				token,
				user.getName(),
				user.getEmail(),
				user.getAge(),
				user.getRole(),
				"Login successful"
		);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping("/forgot-password")
	public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
		Map<String, String> response = new HashMap<>();

		Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
		if (userOpt.isEmpty()) {
			response.put("message", "❌ If that email exists in our database, a password reset link has been sent.");
			return ResponseEntity.status(HttpStatus.OK).body(response);
		}

		User user = userOpt.get();
		String resetToken = UUID.randomUUID().toString();
		user.setResetToken(resetToken);
		user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(5));
		userRepository.save(user);

		try {
			emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
			response.put("message", "✅ We have sent a password reset link to " + user.getEmail() + ". Please check your inbox!");
			return ResponseEntity.status(HttpStatus.OK).body(response);
		} catch (Exception e) {
			response.put("message", "❌ Could not send email right now. Please check SMTP settings. Error: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	@PostMapping("/reset-password")
	public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
		Map<String, String> response = new HashMap<>();

		Optional<User> userOpt = userRepository.findByResetToken(request.getToken());
		if (userOpt.isEmpty()) {
			response.put("message", "❌ Invalid or expired password reset link.");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}

		User user = userOpt.get();
		if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
			response.put("message", "❌ Password reset token has expired. Please request a new link.");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}

		user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		user.setResetToken(null);
		user.setResetTokenExpiry(null);
		userRepository.save(user);

		response.put("message", "✅ Your password has been changed successfully! You can now log in.");
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}
}
