package dev.reinaldosantos.car_fix.enums;

public enum UserRole {
    ADMIN("admin"),
    USER("user");
   
    private String role;

    UserRole(String role){
        this.role = role;
    }

    public String getRole(){
        return this.role;
    }
}