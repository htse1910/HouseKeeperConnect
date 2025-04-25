package com.example.housekeeperapplication.Model;

public class Service {
    private int serviceID;
    private String serviceName;
    private double price;
    private int serviceTypeID;
    private String description;

    public Service(int serviceID, String serviceName, double price, int serviceTypeID, String description) {
        this.serviceID = serviceID;
        this.serviceName = serviceName;
        this.price = price;
        this.serviceTypeID = serviceTypeID;
        this.description = description;
    }

    public int getServiceID() {
        return serviceID;
    }

    public void setServiceID(int serviceID) {
        this.serviceID = serviceID;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getServiceTypeID() {
        return serviceTypeID;
    }

    public void setServiceTypeID(int serviceTypeID) {
        this.serviceTypeID = serviceTypeID;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
