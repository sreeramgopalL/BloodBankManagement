package com.bloodbank.backend.config;

import com.bloodbank.backend.auth.Role;
import com.bloodbank.backend.auth.User;
import com.bloodbank.backend.auth.UserRepository;
import com.bloodbank.backend.donor.Camp;
import com.bloodbank.backend.donor.CampRepository;
import com.bloodbank.backend.donor.Donor;
import com.bloodbank.backend.donor.DonorRepository;
import com.bloodbank.backend.inventory.BloodBag;
import com.bloodbank.backend.inventory.BloodBagRepository;
import com.bloodbank.backend.inventory.BloodTest;
import com.bloodbank.backend.inventory.BloodTestRepository;
import com.bloodbank.backend.request.BloodRequest;
import com.bloodbank.backend.request.BloodRequestRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final CampRepository campRepository;
    private final BloodBagRepository bloodBagRepository;
    private final BloodTestRepository bloodTestRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           DonorRepository donorRepository,
                           CampRepository campRepository,
                           BloodBagRepository bloodBagRepository,
                           BloodTestRepository bloodTestRepository,
                           BloodRequestRepository bloodRequestRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.donorRepository = donorRepository;
        this.campRepository = campRepository;
        this.bloodBagRepository = bloodBagRepository;
        this.bloodTestRepository = bloodTestRepository;
        this.bloodRequestRepository = bloodRequestRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedDonors();
        seedCamps();
        seedInventory();
        seedRequests();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            userRepository.save(new User(
                    "System Admin",
                    "admin@bloodbank.org",
                    passwordEncoder.encode("admin@123"),
                    Role.ADMIN
            ));

            userRepository.save(new User(
                    "City General Hospital",
                    "hospital@citygeneral.org",
                    passwordEncoder.encode("hospital@123"),
                    Role.HOSPITAL
            ));

            userRepository.save(new User(
                    "John Doe",
                    "donor@example.com",
                    passwordEncoder.encode("donor@123"),
                    Role.DONOR
            ));
            System.out.println("✅ Seeded default users (Admin, Hospital, Donor).");
        }
    }

    private void seedDonors() {
        if (donorRepository.count() == 0) {
            Donor d1 = new Donor(null, "John Doe", "A+", "Chennai", "9876543210", true);
            d1.setEmail("donor@example.com");
            d1.setStatus("VERIFIED");
            d1.setHealthStatus("Excellent");
            d1.setAge(28);
            d1.setWeight(72.0);
            d1.setHemoglobin(14.5);
            d1.setLastDonationDate("2026-08-15");
            donorRepository.save(d1);

            Donor d2 = new Donor(null, "Jane Smith", "O+", "Coimbatore", "9876543211", true);
            d2.setEmail("jane@example.com");
            d2.setStatus("PENDING");
            d2.setHealthStatus("Good");
            d2.setAge(24);
            d2.setWeight(58.0);
            d2.setHemoglobin(13.2);
            donorRepository.save(d2);

            Donor d3 = new Donor(null, "Rahul Sharma", "B+", "Madurai", "9876543212", true);
            d3.setEmail("rahul@example.com");
            d3.setStatus("VERIFIED");
            d3.setHealthStatus("Good");
            d3.setAge(31);
            d3.setWeight(68.0);
            d3.setHemoglobin(15.0);
            d3.setLastDonationDate("2026-07-20");
            donorRepository.save(d3);

            Donor d4 = new Donor(null, "Priya Patel", "AB+", "Salem", "9876543213", true);
            d4.setEmail("priya@example.com");
            d4.setStatus("VERIFIED");
            d4.setHealthStatus("Good");
            d4.setAge(26);
            d4.setWeight(62.0);
            d4.setHemoglobin(13.8);
            donorRepository.save(d4);

            Donor d5 = new Donor(null, "Ramesh Kumar", "O-", "Trichy", "9876543214", true);
            d5.setEmail("ramesh@example.com");
            d5.setStatus("VERIFIED");
            d5.setHealthStatus("Excellent");
            d5.setAge(35);
            d5.setWeight(75.0);
            d5.setHemoglobin(15.2);
            donorRepository.save(d5);

            System.out.println("✅ Seeded sample donors.");
        }
    }

    private void seedCamps() {
        if (campRepository.count() == 0) {
            campRepository.save(new Camp(
                    "Red Cross Mega Blood Drive",
                    "Anna Nagar Community Hall, Chennai",
                    LocalDate.now().plusDays(10),
                    "Indian Red Cross Society"
            ));

            campRepository.save(new Camp(
                    "Rotary Life Savers Camp",
                    "Rotary Club Central, Coimbatore",
                    LocalDate.now().plusDays(18),
                    "Rotary International"
            ));

            campRepository.save(new Camp(
                    "City Youth Voluntary Camp",
                    "Government Arts College, Madurai",
                    LocalDate.now().plusDays(25),
                    "Youth Red Cross (YRC)"
            ));

            System.out.println("✅ Seeded sample donation camps.");
        }
    }

    private void seedInventory() {
        if (bloodBagRepository.count() == 0) {
            createBloodBagWithTest("A+", "RBC", 12, "Anna Nagar Center", "John Doe");
            createBloodBagWithTest("O+", "Whole Blood", 18, "Central Blood Bank", "Jane Smith");
            createBloodBagWithTest("B+", "Platelets", 8, "City Hospital Center", "Rahul Sharma");
            createBloodBagWithTest("AB+", "Plasma", 6, "Coimbatore Hub", "Priya Patel");
            createBloodBagWithTest("O-", "RBC", 10, "Trichy Regional Center", "Ramesh Kumar");
            createBloodBagWithTest("A-", "Whole Blood", 5, "Madurai Center", "Karthik Raja");
            createBloodBagWithTest("B-", "Plasma", 4, "Salem Hub", "Anitha Mohan");
            createBloodBagWithTest("AB-", "Platelets", 3, "Central Blood Bank", "Deepak Rao");
            System.out.println("✅ Seeded sample blood inventory and laboratory tests.");
        }
    }

    private void createBloodBagWithTest(String bloodGroup, String component, int units, String location, String donorName) {
        BloodBag bag = new BloodBag();
        bag.setBloodGroup(bloodGroup);
        bag.setComponent(component);
        bag.setUnits(units);
        bag.setLocation(location);
        bag.setStatus("AVAILABLE");
        bag.setTestStatus("PASSED");
        bag.setCollectedDate(LocalDate.now().minusDays(3));
        bag.setExpiryDate(LocalDate.now().plusDays(35));
        BloodBag savedBag = bloodBagRepository.save(bag);

        BloodTest test = new BloodTest();
        test.setBloodBagId(savedBag.getId());
        test.setBloodGroup(bloodGroup);
        test.setDonorName(donorName);
        test.setCollectionDate(savedBag.getCollectedDate().toString());
        test.setHiv(false);
        test.setHbv(false);
        test.setHcv(false);
        test.setSyphilis(false);
        test.setMalaria(false);
        test.setResult("PASSED");
        test.setTestStatus("SAFE");
        bloodTestRepository.save(test);
    }

    private void seedRequests() {
        if (bloodRequestRepository.count() == 0) {
            BloodRequest req1 = new BloodRequest();
            req1.setHospitalId("hospital@citygeneral.org");
            req1.setBloodGroup("A+");
            req1.setComponent("RBC");
            req1.setUnits(3);
            req1.setStatus("PENDING");
            req1.setRequestedAt(LocalDateTime.now().minusHours(4));
            bloodRequestRepository.save(req1);

            BloodRequest req2 = new BloodRequest();
            req2.setHospitalId("apollo@hospital.org");
            req2.setBloodGroup("O-");
            req2.setComponent("RBC");
            req2.setUnits(2);
            req2.setStatus("APPROVED");
            req2.setRequestedAt(LocalDateTime.now().minusDays(1));
            req2.setProcessedAt(LocalDateTime.now().minusHours(6));
            bloodRequestRepository.save(req2);

            System.out.println("✅ Seeded sample blood requests.");
        }
    }
}
