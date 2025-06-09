package com.example.shoppinghistory.History.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistoryItemDTO {
    @NotBlank
    private String product;

    @NotBlank
    private String category;

    @Min(0)
    private double price;
}
