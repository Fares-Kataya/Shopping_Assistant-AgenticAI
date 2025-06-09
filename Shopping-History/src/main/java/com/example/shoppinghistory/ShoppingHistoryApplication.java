package com.example.shoppinghistory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(
        exclude = {
                SecurityAutoConfiguration.class
        }
)
public class ShoppingHistoryApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShoppingHistoryApplication.class, args);
    }

}
