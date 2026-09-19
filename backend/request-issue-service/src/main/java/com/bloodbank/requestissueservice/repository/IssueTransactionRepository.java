package com.bloodbank.requestissueservice.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.bloodbank.requestissueservice.model.IssueTransaction;

public interface IssueTransactionRepository 
        extends MongoRepository<IssueTransaction, String> {

}
