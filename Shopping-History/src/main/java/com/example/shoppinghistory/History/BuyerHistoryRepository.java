package com.example.shoppinghistory.History;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BuyerHistoryRepository extends MongoRepository<BuyerHistory, String> {
     List<BuyerHistory> findByUserId(String userId);
}
