package com.example.housekeeperapplication.Model.DTOs;

public class PaymentLinkDTO {
    private String paymentUrl;

    public PaymentLinkDTO(String paymentUrl) {
        this.paymentUrl = paymentUrl;
    }

    public String getPaymentUrl() {
        return paymentUrl;
    }

    public void setPaymentUrl(String paymentUrl) {
        this.paymentUrl = paymentUrl;
    }
}
