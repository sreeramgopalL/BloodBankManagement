package com.bloodbank.donorcampservice.mapper;

import com.bloodbank.donorcampservice.dto.CampDTO;
import com.bloodbank.donorcampservice.entity.Camp;

import java.time.LocalDate;   // ⭐ MUST import

public class CampMapper {

    public static CampDTO toDTO(Camp camp) {
        CampDTO dto = new CampDTO();

        dto.setId(camp.getId());
        dto.setCampName(camp.getCampName());
        dto.setLocation(camp.getLocation());

        // LocalDate → String
        if (camp.getCampDate() != null) {
            dto.setCampDate(camp.getCampDate().toString());
        }

        dto.setOrganizer(camp.getOrganizer());

        return dto;
    }

    public static Camp toEntity(CampDTO dto) {
        Camp camp = new Camp();

        camp.setId(dto.getId());
        camp.setCampName(dto.getCampName());
        camp.setLocation(dto.getLocation());

        // String → LocalDate
        if (dto.getCampDate() != null && !dto.getCampDate().isEmpty()) {
            camp.setCampDate(LocalDate.parse(dto.getCampDate()));
        }

        camp.setOrganizer(dto.getOrganizer());

        return camp;
    }
}
