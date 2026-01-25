package webapp.bankingsystemapi.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum AccountType {
    SAVING,
    CURRENT;

    @JsonCreator
    public static AccountType fromString(String value) {
        if (value == null) {
            return null;
        }
        return AccountType.valueOf(value.toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}
