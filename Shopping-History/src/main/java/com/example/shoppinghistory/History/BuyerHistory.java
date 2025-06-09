package com.example.shoppinghistory.History;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "buyer_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BuyerHistory {
    @Id
    private String userId;
    private List<HistoryItem> history;
}
