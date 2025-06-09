package com.example.shoppinghistory.History;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistoryItem {
    private String product;
    private String category;
    private double price;
}
