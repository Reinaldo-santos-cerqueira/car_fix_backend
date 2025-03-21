import { ServiceRequested } from "@prisma/client";

export type DateString = string | Date | undefined;
export interface ServiceRequest {
    created_at: string;
    updated_at: string;
    user_id: string;
    status: number;
    latitude_client: number;
    longitude_client: number;
    service_id: string;
}

export interface AceptService {
    serviceProviderId: string;
    serviceRequestedId: string;
    latitudeServiceProvider: number;
    longitudeServiceProvider: number;
    serviceProviderSocketId: string;
    status: number;
}

export interface ConfirmedStartService {
    serviceRequestedId: string;
    status: number;
}

export interface CanceledService {
    serviceRequestedId: string;
}

export interface LegData {
    steps: [];
    summary: string;
    weight: number;
    duration: number;
    distance: number;
}

export interface ServiceProviderSignupSocketIoRequest {
    socketIoId: string,
    serviceProviderId: string,
    state: number
}

export type AcceptedServiceToServiceProvider = {
    distance: number,
    duration: number,
    requestedService: ServiceRequested
}