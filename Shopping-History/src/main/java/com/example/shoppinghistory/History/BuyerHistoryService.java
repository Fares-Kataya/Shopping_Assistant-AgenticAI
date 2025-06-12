package com.example.shoppinghistory.History;

import com.example.shoppinghistory.History.dto.BuyerHistoryRequest;
import com.example.shoppinghistory.History.dto.HistoryItemDTO;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BuyerHistoryService {
    private final BuyerHistoryRepository repo;

    public BuyerHistoryService(BuyerHistoryRepository repo) {
        this.repo = repo;
    }

    public void saveBuyerHistory(@Valid BuyerHistoryRequest req) {
        BuyerHistory bh = repo.findById(req.getUser_id())
                .orElseGet(() -> new BuyerHistory(req.getUser_id(), new ArrayList<>()));

        req.getHistory().stream()
                .map(dto -> new HistoryItem(dto.getProduct(), dto.getCategory(), dto.getPrice()))
                .forEach(bh.getHistory()::add);

        repo.save(bh);
    }

    public Optional<BuyerHistory> getBuyerHistory(String userId) {
        return repo.findById(userId);
    }

    public BuyerHistory appendHistory(String userId, List<HistoryItemDTO> newItems) {
        BuyerHistory bh = repo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("No buyer with id " + userId));

        newItems.stream()
                .map(dto -> new HistoryItem(dto.getProduct(), dto.getCategory(), dto.getPrice()))
                .forEach(bh.getHistory()::add);

        return repo.save(bh);
    }

    public void clearHistory(String userId) {
        BuyerHistory bh = repo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("No buyer with id " + userId));
        bh.getHistory().clear();
        repo.save(bh);
    }
}
