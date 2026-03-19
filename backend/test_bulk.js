const axios = require('axios');

const API_BASE = 'http://localhost:8081/api';

async function testFlow() {
  try {
    console.log("1. Admin Login");
    let res = await axios.post(`${API_BASE}/auth/login`, {
      email: "admin@supermart.com",
      password: "Admin@123"
    });
    const adminToken = res.data.token;
    const adminId = res.data.id;
    const adminAuth = { headers: { Authorization: `Bearer ${adminToken}` } };
    console.log("Admin logged in successfully.");

    console.log("2. Create Society");
    res = await axios.post(`${API_BASE}/societies/create?userId=${adminId}`, {
      name: "Auto Test Society",
      address: "123 Tech Park",
      city: "Bangalore",
      pincode: "560001",
      location: "Bangalore",
      threshold: 10,
      discountPercentage: 20.0
    }, adminAuth);
    const societyId = res.data.id;
    const inviteCode = res.data.inviteCode;
    console.log(`Society Created: ID=${societyId}, InviteCode=${inviteCode}`);

    console.log("3. Create Product");
    res = await axios.post(`${API_BASE}/admin/products`, {
      name: "Test Rice 5kg",
      description: "Premium Rice",
      price: 500.0,
      stockQuantity: 100,
      category: "GROCERY",
      imageUrl: "https://via.placeholder.com/150",
      seller: "SuperMart"
    }, adminAuth);
    const productId = res.data.id;
    console.log(`Product Created: ID=${productId}`);

    console.log("4. Create Bulk Order (Admin)");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    res = await axios.post(`${API_BASE}/bulk-orders/create`, {
      productId: productId,
      societyId: societyId,
      targetQuantity: 10,
      discountPercentage: 15.0,
      expiryTime: tomorrow.toISOString()
    }, adminAuth);
    const bulkOrderId = res.data.id;
    console.log(`Bulk Order Created: ID=${bulkOrderId}`);

    console.log("\n--- NOW ACTING AS CUSTOMER ---");
    console.log("5. Customer Login");
    
    // Register customer first
    try {
        await axios.post(`${API_BASE}/auth/signup`, {
            name: "Test Customer",
            email: "test.customer@example.com",
            password: "password123",
            phone: "9998887776",
            address: "Apt 101, Auto Test Society"
        });
    } catch (e) {
        // Ignore if already exists
    }

    res = await axios.post(`${API_BASE}/auth/login`, {
      email: "test.customer@example.com",
      password: "password123"
    });
    const customerToken = res.data.token;
    const customerId = res.data.id;
    const customerAuth = { headers: { Authorization: `Bearer ${customerToken}` } };
    console.log("Customer logged in successfully.");

    console.log("6. Join Society");
    res = await axios.post(`${API_BASE}/societies/join?userId=${customerId}&inviteCode=${inviteCode}`, {}, customerAuth);
    console.log("Customer joined society successfully.");

    console.log("7. View Society Bulk Deals");
    res = await axios.get(`${API_BASE}/bulk-orders/society/${societyId}`, customerAuth);
    console.log(`Found ${res.data.length} active bulk deals for this society.`);

    console.log("8. Join Bulk Deal");
    res = await axios.post(`${API_BASE}/bulk-orders/join`, {
      bulkOrderId: bulkOrderId,
      quantity: 5
    }, customerAuth);
    console.log(`Joined bulk deal. Current Quantity: ${res.data.currentQuantity} / Target: ${res.data.targetQuantity}`);
    
    console.log("\nAll API tests for Society Bulk Orders PASSED! ✅");

  } catch (err) {
    console.error("\n❌ Error during test:", err.response ? err.response.data : err.message);
  }
}

testFlow();
