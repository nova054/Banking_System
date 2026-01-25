package webapp.bankingsystemapi.util;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public final class RequestContextUtil {

    private RequestContextUtil() {}

    public static String getIpAddress() {
        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attrs == null) return "UNKNOWN";

        HttpServletRequest request = attrs.getRequest();

        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }

    public static String getUserAgent() {
        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attrs == null) return "UNKNOWN";

        return requestSafe(attrs.getRequest().getHeader("User-Agent"));
    }

    private static String requestSafe(String value) {
        return value != null ? value : "UNKNOWN";
    }
}
