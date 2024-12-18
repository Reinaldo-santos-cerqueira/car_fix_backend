package dev.reinaldosantos.car_fix.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private final String UPLOAD_DIR = "/home/king/projetos/java/car_fix/src/storage/images/";

    public String saveFileWithRandomName(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String randomFileName = UUID.randomUUID().toString() + getFileExtension(file.getOriginalFilename());

        Path filePath = uploadPath.resolve(randomFileName);

        Files.copy(file.getInputStream(), filePath);

        return filePath.toString();
    }

    private String getFileExtension(String originalFileName) {
        if (originalFileName == null || originalFileName.isEmpty()) {
            return "";
        }
        int lastIndex = originalFileName.lastIndexOf(".");
        return (lastIndex != -1) ? originalFileName.substring(lastIndex) : "";
    }

    public void deleteFile(String filePath) throws Exception {
        Path path = Paths.get(filePath);
        
        if (Files.exists(path)) {
            Files.delete(path);
        } else {
            throw new RuntimeException("Arquivo não encontrado: " + filePath);
        }
    }

}
