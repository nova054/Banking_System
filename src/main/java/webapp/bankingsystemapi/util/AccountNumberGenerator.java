package webapp.bankingsystemapi.util;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Component;

import java.time.Year;

@Component
public class AccountNumberGenerator {
    @PersistenceContext
    private EntityManager entityManager;

    public String generate() {

        Number seqValue = (Number) entityManager
                .createNativeQuery("SELECT ACCOUNT_NUMBER_SEQ.NEXTVAL FROM DUAL")
                .getSingleResult();

        int year = Year.now().getValue();
        String formattedSeq = String.format("%06d", seqValue.longValue());

        return "ACC-" + year + "-" + formattedSeq;
    }
}

