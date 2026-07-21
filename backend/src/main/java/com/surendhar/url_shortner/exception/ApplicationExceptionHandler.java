package com.surendhar.url_shortner.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.surendhar.url_shortner.responsestructure.UrlResponseStructure;

@ControllerAdvice
public class ApplicationExceptionHandler {
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<UrlResponseStructure<String>> handleValidationException(
	        MethodArgumentNotValidException ex) {

	    String errorMessage = ex.getBindingResult()
	                            .getFieldError()
	                            .getDefaultMessage();

	    UrlResponseStructure<String> response = new UrlResponseStructure<>();

	    response.setStatusCode(HttpStatus.BAD_REQUEST.value());
	    response.setMessage(errorMessage);
	    response.setData(null);

	    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}
}
