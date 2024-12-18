package dev.reinaldosantos.car_fix.exception;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalException {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, List<String>>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<String> errorMessages = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.toList());

        Map<String, List<String>> response = new HashMap<>();
        response.put("errors", errorMessages);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(FieldAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleFieldAlreadyExistsException(FieldAlreadyExistsException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("errors", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    @ExceptionHandler(NotRegisterFieldException.class)
    public ResponseEntity<Map<String, String>> handleFNotRegisterFieldException(NotRegisterFieldException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("errors", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(InternalServerErrorCustom.class)
    public ResponseEntity<Map<String, String>> internalServerError(InternalServerErrorCustom ex) {
        Map<String, String> response = new HashMap<>();
        response.put("errors", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
