package com.bloodbank.donorcampservice.service;

import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.bloodbank.donorcampservice.dto.CampDTO;
import com.bloodbank.donorcampservice.entity.Camp;
import com.bloodbank.donorcampservice.mapper.CampMapper;
import com.bloodbank.donorcampservice.repository.CampRepository;

@Service
public class CampService {

    private final CampRepository campRepository;

    public CampService(CampRepository campRepository) {
        this.campRepository = campRepository;
    }

    // CREATE
    public CampDTO saveCamp(CampDTO dto) {
        Camp camp = CampMapper.toEntity(dto);   // mapper handles date conversion
        Camp saved = campRepository.save(camp);
        return CampMapper.toDTO(saved);
    }

    // GET ALL
    public List<CampDTO> getAllCamps() {
        return campRepository.findAll()
                .stream()
                .map(CampMapper::toDTO)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public CampDTO getCampById(Long id) {
        Camp camp = campRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Camp not found with id " + id));
        return CampMapper.toDTO(camp);
    }

    // UPDATE
    public CampDTO updateCamp(Long id, CampDTO dto) {
        Camp existing = campRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Camp not found with id " + id));

        existing.setCampName(dto.getCampName());
        existing.setLocation(dto.getLocation());

        // ⭐ convert String → LocalDate safely
        if (dto.getCampDate() != null && !dto.getCampDate().isEmpty()) {
            existing.setCampDate(LocalDate.parse(dto.getCampDate()));
        }

        existing.setOrganizer(dto.getOrganizer());

        Camp updated = campRepository.save(existing);
        return CampMapper.toDTO(updated);
    }

    // DELETE
    public void deleteCamp(Long id) {
        campRepository.deleteById(id);
    }
}
