package com.aayush.lad.hrms.modules.travel.controllers;

import com.aayush.lad.hrms.modules.travel.services.DocumentTypeService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/document-types")
@AllArgsConstructor
public class DocumentTypeController {

    private final DocumentTypeService documentTypeService;
}
