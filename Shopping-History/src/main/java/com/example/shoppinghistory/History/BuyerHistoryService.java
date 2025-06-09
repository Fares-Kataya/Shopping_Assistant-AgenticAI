package com.example.shoppinghistory.History;

import com.example.shoppinghistory.History.dto.BuyerHistoryRequest;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BuyerHistoryService {
    private final BuyerHistoryRepository repo;

    public BuyerHistoryService(BuyerHistoryRepository repo) {
        this.repo = repo;
    }

    public void saveBuyerHistory(@Valid BuyerHistoryRequest req) {
        BuyerHistory bh = new BuyerHistory(
                req.getUser_id(),
                req.getHistory().stream()
                        .map(dto -> new HistoryItem(dto.getProduct(), dto.getCategory(), dto.getPrice()))
                        .toList()
        );
        repo.save(bh);
    }
    public Optional<BuyerHistory> getBuyerHistory(String userId) {
        return repo.findById(userId);
    }
}

