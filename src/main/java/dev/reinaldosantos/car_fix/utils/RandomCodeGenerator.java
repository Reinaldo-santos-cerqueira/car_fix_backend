package dev.reinaldosantos.car_fix.utils;

import java.util.Random;

public class RandomCodeGenerator {

    public String generateRandomCode() {
        String characters = "0123456789";
        Random random = new Random();
        StringBuilder code = new StringBuilder(6);

        for (int i = 0; i < 6; i++) {
            int randomIndex = random.nextInt(characters.length());
            code.append(characters.charAt(randomIndex));
        }

        return code.toString();
    }
}
