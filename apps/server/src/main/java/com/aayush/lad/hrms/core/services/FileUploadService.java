package com.aayush.lad.hrms.core.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class FileUploadService {

    private final Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("resource_type", "auto"));
            return (String) uploadResult.get("url");
        } catch (IOException e) {
            return "Error";
        }
    }

    public String deleteFileById(String publicId) throws IOException {
        Map deleteResult = cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "auto"));
        return (String) deleteResult.get("result");
    }

    public String deleteFileByURL(String URL) {
        try {
            String publicId = extractPublicId(URL);
            if (publicId == null) return "Invalid URL";
            return deleteFileById(publicId);
        } catch (Exception e) {
            return "Error";
        }
    }

    private static String extractPublicId(String imageUrl) {
        if (imageUrl == null) return null;

//        String regex = "http://res\\.cloudinary\\.com/[^/]+/image/upload(?:/v[0-9]+)?/([^/]+)\\.[a-zA-Z]{3,4}$";
        String regex = "https?://res\\.cloudinary\\.com/[^/]+/(image|video|raw)/upload(?:/v\\d+)?/(.+)\\.[a-zA-Z0-9]+$";

        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(imageUrl);

        if (matcher.find())
            return matcher.group(2);
        else
            return "OK";
    }
}

