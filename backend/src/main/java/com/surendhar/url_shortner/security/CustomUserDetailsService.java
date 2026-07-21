package com.surendhar.url_shortner.security;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.surendhar.url_shortner.entity.User;
import com.surendhar.url_shortner.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	@Autowired
	private UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByEmail(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

		return new org.springframework.security.core.userdetails.User(
				user.getEmail(),
				user.getPassword(),
				Collections.singletonList(new SimpleGrantedAuthority(user.getRole()))
		);
	}
}
