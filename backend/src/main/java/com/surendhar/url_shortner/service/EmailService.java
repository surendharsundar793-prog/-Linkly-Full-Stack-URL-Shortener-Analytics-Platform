package com.surendhar.url_shortner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

	@Autowired(required = false)
	private JavaMailSender mailSender;

	public void sendPasswordResetEmail(String toEmail, String resetToken) {
		if (mailSender == null) {
			System.out.println("⚠️ [WARN] JavaMailSender is not configured (mail settings missing in application.properties). Cannot send real email to: " + toEmail);
			System.out.println("🔗 [MOCK LINK] Reset Link: http://localhost:5173/reset-password?token=" + resetToken);
			return;
		}

		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setTo(toEmail);
			helper.setSubject("🔒 Reset Your Linkly Password");

			String resetUrl = "http://localhost:5173/reset-password?token=" + resetToken;

			String htmlContent = "<div style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;\">"
					+ "<div style=\"text-align: center; margin-bottom: 24px;\">"
					+ "<span style=\"font-size: 28px; font-weight: 800; color: #1a56db; letter-spacing: -0.5px;\">Linkly</span>"
					+ "</div>"
					+ "<h2 style=\"color: #0f172a; font-size: 20px; margin-bottom: 12px; text-align: center;\">Password Reset Request</h2>"
					+ "<p style=\"color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 24px;\">"
					+ "We received a request to reset your password for your Linkly account. Click the button below to set a new password. This link expires in 15 minutes."
					+ "</p>"
					+ "<div style=\"text-align: center; margin-bottom: 28px;\">"
					+ "<a href=\"" + resetUrl + "\" style=\"background-color: #1a56db; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: 600; font-size: 15px; display: inline-block;\">Reset Password</a>"
					+ "</div>"
					+ "<p style=\"color: #64748b; font-size: 13px; margin-bottom: 16px;\">"
					+ "If the button doesn't work, copy and paste this link into your browser:<br/>"
					+ "<a href=\"" + resetUrl + "\" style=\"color: #1a56db; word-break: break-all;\">" + resetUrl + "</a>"
					+ "</p>"
					+ "<hr style=\"border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;\"/>"
					+ "<p style=\"color: #94a3b8; font-size: 12px; text-align: center; margin: 0;\">"
					+ "If you didn't request a password reset, you can safely ignore this email.<br/>© Linkly Platform"
					+ "</p>"
					+ "</div>";

			helper.setText(htmlContent, true);
			mailSender.send(message);
			System.out.println("✅ Password reset email successfully sent to: " + toEmail);
		} catch (MessagingException e) {
			System.err.println("❌ Failed to send password reset email to " + toEmail + ": " + e.getMessage());
			throw new RuntimeException("Failed to send email: " + e.getMessage());
		}
	}
}
