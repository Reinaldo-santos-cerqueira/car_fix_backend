package dev.reinaldosantos.car_fix.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvConfig {
    static {
        Dotenv dotenv = Dotenv.load();
    }
}
