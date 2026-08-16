package com.studylog.global.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 잘못된 요청 처리
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException (
            IllegalArgumentException exception
    ) {
        return createErrorResponse(
                HttpStatus.BAD_REQUEST,
                exception.getMessage()
        );
    }

    // @Valid 검증 실패 처리
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException exception
    ) {
        String message = exception.getBindingResult()
                .getFieldErrors().stream().map(
                        error->error.getField() + ": " + error.getDefaultMessage()
                ).collect(Collectors.joining(", "));

        return createErrorResponse(HttpStatus.BAD_REQUEST,message);
    }

    // 예상하지 못한 서버 오류 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception exception) {
        log.error("처리되지 않은 서버 오류", exception);

        return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR,"서버 내부 오류가 발생했습니다.");
    }

    private ResponseEntity<ErrorResponse> createErrorResponse(
            HttpStatus status, String message
    ) {
        ErrorResponse response = new ErrorResponse(
                status.value(), status.getReasonPhrase(),
                message, LocalDateTime.now()
        );

        return ResponseEntity.status(status).body(response);
    }
}
