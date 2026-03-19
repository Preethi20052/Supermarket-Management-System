package com.supermart.model;

import java.util.List;

public class DashboardStats {
    private long totalOrders;
    private double totalRevenue;
    private long totalProducts;
    private long lowStockProducts;
    private List<Product> fastMovingProducts;
    private List<Product> slowMovingProducts;
    private long urgentNotificationsCount;

    public DashboardStats() {
    }

    public DashboardStats(long totalOrders, double totalRevenue, long totalProducts, long lowStockProducts,
            List<Product> fastMovingProducts, List<Product> slowMovingProducts, long urgentNotificationsCount) {
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.totalProducts = totalProducts;
        this.lowStockProducts = lowStockProducts;
        this.fastMovingProducts = fastMovingProducts;
        this.slowMovingProducts = slowMovingProducts;
        this.urgentNotificationsCount = urgentNotificationsCount;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getLowStockProducts() {
        return lowStockProducts;
    }

    public void setLowStockProducts(long lowStockProducts) {
        this.lowStockProducts = lowStockProducts;
    }

    public List<Product> getFastMovingProducts() {
        return fastMovingProducts;
    }

    public void setFastMovingProducts(List<Product> fastMovingProducts) {
        this.fastMovingProducts = fastMovingProducts;
    }

    public List<Product> getSlowMovingProducts() {
        return slowMovingProducts;
    }

    public void setSlowMovingProducts(List<Product> slowMovingProducts) {
        this.slowMovingProducts = slowMovingProducts;
    }

    public long getUrgentNotificationsCount() {
        return urgentNotificationsCount;
    }

    public void setUrgentNotificationsCount(long urgentNotificationsCount) {
        this.urgentNotificationsCount = urgentNotificationsCount;
    }
}
