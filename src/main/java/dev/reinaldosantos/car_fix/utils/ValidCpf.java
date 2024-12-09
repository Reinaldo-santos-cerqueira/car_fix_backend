package dev.reinaldosantos.car_fix.utils;

public class ValidCpf {
    private static int calculateCpfDigit(String cpf, int length) {
        int sum = 0;
        int weight = length;
        for (int i = 0; i < length - 1; i++) {
            sum += (cpf.charAt(i) - '0') * weight--;
        }
        int remainder = sum % 11;
        return (remainder < 2) ? 0 : 11 - remainder;
    }

    public static boolean isValid(String cpf){
        int firstDigit = calculateCpfDigit(cpf, 10);
        int secondDigit = calculateCpfDigit(cpf, 11);
        return firstDigit == Integer.parseInt(String.valueOf(cpf.charAt(9))) &&
        secondDigit == Integer.parseInt(String.valueOf(cpf.charAt(10)));
    }

}
