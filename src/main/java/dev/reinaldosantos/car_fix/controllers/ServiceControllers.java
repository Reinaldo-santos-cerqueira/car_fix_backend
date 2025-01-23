package dev.reinaldosantos.car_fix.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.reinaldosantos.car_fix.dto.ServiceDto;
import dev.reinaldosantos.car_fix.model.Service;
import dev.reinaldosantos.car_fix.services.ServiceService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("/service")
public class ServiceControllers {

    @Autowired
    ServiceService serviceService;

    @PostMapping("")
    public ResponseEntity<Service> create(@RequestBody ServiceDto data) {
        Service serviceReturn =  this.serviceService.create(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceReturn);
    }

    @GetMapping("")
    public ResponseEntity<List<Service>> get() {
        return ResponseEntity.status(HttpStatus.OK).body(this.serviceService.get());
    }
    
}
