package com.bloodbank.backend.donor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/camps")
public class CampController {

    private final CampService campService;

    public CampController(CampService campService) {
        this.campService = campService;
    }

    @PostMapping
    public ResponseEntity<CampDTO> createCamp(@RequestBody CampDTO campDTO) {
        return ResponseEntity.ok(campService.saveCamp(campDTO));
    }

    @GetMapping
    public ResponseEntity<List<CampDTO>> getAllCamps() {
        return ResponseEntity.ok(campService.getAllCamps());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampDTO> getCampById(@PathVariable Long id) {
        CampDTO camp = campService.getCampById(id);
        return camp != null ? ResponseEntity.ok(camp) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCamp(@PathVariable Long id, @RequestBody CampDTO campDTO) {
        try {
            return ResponseEntity.ok(campService.updateCamp(id, campDTO));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCamp(@PathVariable Long id) {
        campService.deleteCamp(id);
        return ResponseEntity.ok("Camp deleted successfully");
    }
}
