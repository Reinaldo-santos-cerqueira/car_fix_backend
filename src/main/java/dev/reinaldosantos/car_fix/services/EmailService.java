package dev.reinaldosantos.car_fix.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import io.github.cdimascio.dotenv.Dotenv;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        Dotenv dotenv = Dotenv.load();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setFrom(dotenv.get("MAIL_USERNAME"));
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
}