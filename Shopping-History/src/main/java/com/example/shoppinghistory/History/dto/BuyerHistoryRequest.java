package com.example.shoppinghistory.History.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BuyerHistoryRequest {
    @NotBlank
    private String user_id;

    @NotEmpty
    private List<HistoryItemDTO> history;
}
