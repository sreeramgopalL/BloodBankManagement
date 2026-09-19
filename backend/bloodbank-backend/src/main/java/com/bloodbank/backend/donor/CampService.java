package com.bloodbank.backend.donor;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CampService {

    private final CampRepository campRepository;

    public CampService(CampRepository campRepository) {
        this.campRepository = campRepository;
    }

    public CampDTO saveCamp(CampDTO dto) {
        Camp camp = toEntity(dto);
        Camp saved = campRepository.save(camp);
        return toDTO(saved);
    }

    public List<CampDTO> getAllCamps() {
        return campRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CampDTO getCampById(Long id) {
        return campRepository.findById(id)
                .map(this::toDTO)
                .orElse(null);
    }

    public CampDTO updateCamp(Long id, CampDTO dto) {
        Camp existing = campRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Camp not found with id: " + id));

        if (dto.getCampName() != null) existing.setCampName(dto.getCampName());
        if (dto.getLocation() != null) existing.setLocation(dto.getLocation());
        if (dto.getOrganizer() != null) existing.setOrganizer(dto.getOrganizer());
        if (dto.getCampDate() != null && !dto.getCampDate().trim().isEmpty()) {
            try {
                existing.setCampDate(LocalDate.parse(dto.getCampDate()));
            } catch (Exception ignored) {}
        }

        Camp saved = campRepository.save(existing);
        return toDTO(saved);
    }

    public void deleteCamp(Long id) {
        campRepository.deleteById(id);
    }

    private Camp toEntity(CampDTO dto) {
        Camp camp = new Camp();
        camp.setId(dto.getId());
        camp.setCampName(dto.getCampName());
        camp.setLocation(dto.getLocation());
        camp.setOrganizer(dto.getOrganizer());
        if (dto.getCampDate() != null && !dto.getCampDate().trim().isEmpty()) {
            try {
                camp.setCampDate(LocalDate.parse(dto.getCampDate()));
            } catch (Exception ignored) {}
        }
        return camp;
    }

    private CampDTO toDTO(Camp camp) {
        CampDTO dto = new CampDTO();
        dto.setId(camp.getId());
        dto.setCampName(camp.getCampName());
        dto.setLocation(camp.getLocation());
        dto.setOrganizer(camp.getOrganizer());
        if (camp.getCampDate() != null) {
            dto.setCampDate(camp.getCampDate().toString());
        }
        return dto;
    }
}
