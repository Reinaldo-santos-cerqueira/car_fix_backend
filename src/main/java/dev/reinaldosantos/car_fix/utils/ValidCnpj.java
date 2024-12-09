package dev.reinaldosantos.car_fix.utils;

public class ValidCnpj {
    private static int calculateCnpjDigit(String cnpj, int length) {
        int sum = 0;
        int[] weights = length == 12 ? new int[] { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 }
                : new int[] { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
        for (int i = 0; i < length; i++) {
            sum += (cnpj.charAt(i) - '0') * weights[i];
        }
        int remainder = sum % 11;
        return (remainder < 2) ? 0 : 11 - remainder;
    }

    public static boolean isValid(String cnpj) {
        int firstDigit = calculateCnpjDigit(cnpj, 12);
        int secondDigit = calculateCnpjDigit(cnpj, 13);

        return firstDigit == Integer.parseInt(String.valueOf(cnpj.charAt(12)))
                && secondDigit == Integer.parseInt(String.valueOf(cnpj.charAt(13)));
    }
}
