package dev.reinaldosantos.car_fix.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import dev.reinaldosantos.car_fix.dto.ServiceDto;
import dev.reinaldosantos.car_fix.model.Service;
import dev.reinaldosantos.car_fix.repositories.ServiceRepository;

@org.springframework.stereotype.Service
public class ServiceService {
    @Autowired
    ServiceRepository serviceRepository;

    public Service create(ServiceDto data){
        Service newService = new Service(data.getDescription(), data.getTitle());
        serviceRepository.save(newService);
        return  newService;
    }

    public List<Service> get(){
        return  serviceRepository.findAll();
    }
}
