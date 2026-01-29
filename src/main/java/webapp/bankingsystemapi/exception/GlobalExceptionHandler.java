package webapp.bankingsystemapi.exception;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import webapp.bankingsystemapi.DTO.ApiErrorResponse;
import webapp.bankingsystemapi.enums.AuditAction;
import webapp.bankingsystemapi.enums.AuditEntityType;
import webapp.bankingsystemapi.service.AuditService;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

//@ControllerAdvice - Global Exception Handler
//@ResponseBody - Return JSON
//@RestControllerAdvice - Conbination of both
@RequiredArgsConstructor
@RestControllerAdvice
public class GlobalExceptionHandler {
    private final AuditService auditService;


    // 404 - Resource not found
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex) {

        ApiErrorResponse response = ApiErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .error("NOT_FOUND")
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    // 403 - Forbidden - Custom AccessDeniedException (thrown by services)
    @ExceptionHandler(webapp.bankingsystemapi.exception.AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleCustomAccessDeniedException(
            webapp.bankingsystemapi.exception.AccessDeniedException ex) {

        ApiErrorResponse response = ApiErrorResponse.builder()
                .status(HttpStatus.FORBIDDEN.value())
                .error("ACCESS_DENIED")
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    // 403 - Forbidden - Spring Security AccessDeniedException
    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleSpringAccessDeniedException(
            org.springframework.security.access.AccessDeniedException ex) {

        ApiErrorResponse response = ApiErrorResponse.builder()
                .status(HttpStatus.FORBIDDEN.value())
                .error("ACCESS_DENIED")
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }


    // 400 - Bad request
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiErrorResponse> handleBadRequest(
            BadRequestException ex) {

        ApiErrorResponse response = ApiErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error("BAD_REQUEST")
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // 400 - Validation errors (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        ApiErrorResponse response = ApiErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error("VALIDATION_ERROR")
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // 500 - Generic fallback
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(
            Exception ex) {

        ApiErrorResponse response = ApiErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("INTERNAL_SERVER_ERROR")
                .message("Something went wrong")
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    // 403 - Forbidden - User validation
    @ExceptionHandler(UserValidationException.class)
    public ResponseEntity<ApiErrorResponse> handleUserValidation(
            UserValidationException ex) {

        auditService.logFailure(
                AuditAction.SECURITY_VIOLATION,
                AuditEntityType.USER,
                null,
                ex.getMessage()
        );

        ApiErrorResponse response = ApiErrorResponse.builder()
                .status(HttpStatus.FORBIDDEN.value())
                .error("SECURITY_VIOLATION")
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    // 403 - Forbidden - Account validation
    @ExceptionHandler(AccountValidationException.class)
    public ResponseEntity<ApiErrorResponse> handleAccountValidation(
            AccountValidationException ex) {

        auditService.logFailure(
                AuditAction.SECURITY_VIOLATION,
                AuditEntityType.ACCOUNT,
                null,
                ex.getMessage()
        );

        ApiErrorResponse response = ApiErrorResponse.builder()
                .status(HttpStatus.FORBIDDEN.value())
                .error("SECURITY_VIOLATION")
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }






}
