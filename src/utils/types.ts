import { ServiceRequested } from "@prisma/client";

export type DateString = string | Date | undefined;
export type ServiceProviderSignupSocketIoRequest = {socketIoId: string, serviceProviderId: string,state: number }
export type aceptService = {
    serviceProviderId: string, 
    serviceRequestedId: string,
    latitudeServiceProvider: number,
    longitudeServiceProvider: number, 
    serviceProviderSocketId: string,
    status: number,
}

export interface LegData {
    steps: [];
    summary: string;
    weight: number;
    duration: number;
    distance: number;
}

export type AcceptedServiceToServiceProvider = {distance: number, duration: number, requestedService: ServiceRequested};