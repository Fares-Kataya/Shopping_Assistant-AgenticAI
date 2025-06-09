package com.example.shoppinghistory.History;
import com.example.shoppinghistory.History.dto.BuyerHistoryRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/buyers")
public class BuyerHistoryController {

    private final BuyerHistoryService service;
    public BuyerHistoryController(BuyerHistoryService service) {
        this.service = service;
    }

    @PostMapping(
            path = "/history",
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<String> inputBuyerHistory(
            @Valid @RequestBody BuyerHistoryRequest req
    ) {
        service.saveBuyerHistory(req);
        return ResponseEntity.ok("Buyer history saved for user: " + req.getUser_id());
    }
    @GetMapping(
            path = "/{userId}/history",
            produces = "application/json"
    )
    public ResponseEntity<BuyerHistory> fetchBuyerHistory(
            @PathVariable String userId
    ) {
        return service.getBuyerHistory(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
