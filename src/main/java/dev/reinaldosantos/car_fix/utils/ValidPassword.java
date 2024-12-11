package dev.reinaldosantos.car_fix.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ValidPassword {
    public boolean isValid(String password){
        
        String regex = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,}$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(password);
        return matcher.matches();
    }
}
