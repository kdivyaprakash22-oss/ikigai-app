// Razorpay Configuration
const razorpayConfig = {
  keyId: "rzp_live_Re5FKIQm8RXuzJ",
  keySecret: "8gBs7o3Z9mK2pL5xN8vQ1wR4sT7uV0yA", // Keep this secret - never expose in frontend
  businessName: "Ikigai Journey",
  businessDescription: "Find your purpose and live with intention",
  contactEmail: "kdivyaprakash22@gmail.com",
  contactPhone: "8867368911",
  supportEmail: "support@ikigaijourney.com",
  supportPhone: "8867368911"
};

// Razorpay Payment Options
const razorpayPaymentOptions = {
  key: razorpayConfig.keyId, // Enter the Key ID generated from Dashboard → Settings → API Keys
  amount: 0, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise or 500 INR
  currency: "INR",
  name: razorpayConfig.businessName,
  description: razorpayConfig.businessDescription,
  image: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'><rect fill='%23667eea' width='192' height='192' rx='45'/><text x='96' y='96' font-size='120' text-anchor='middle' dy='.3em' fill='white'>🌸</text></svg>",
  order_id: "", // This should be generated from your backend
  handler: function(response) {
    alert('Payment Successful!');
    alert('Payment ID: ' + response.razorpay_payment_id);
    // Send payment details to your backend for verification
  },
  prefill: {
    name: "",
    email: razorpayConfig.contactEmail,
    contact: razorpayConfig.contactPhone
  },
  notes: {
    note_key_1: "Ikigai Journey Premium",
    note_key_2: "Monthly Subscription"
  },
  theme: {
    color: "#667eea"
  }
};

// Premium Subscription Plans
const premiumPlans = [
  {
    id: "monthly",
    name: "Monthly Plan",
    price: 99, // in INR
    duration: "1 month",
    features: [
      "Unlimited Ikigai tracking",
      "Advanced analytics",
      "Priority support",
      "Weekly personalized insights"
    ]
  },
  {
    id: "quarterly",
    name: "Quarterly Plan",
    price: 249, // in INR (saves ₹48)
    duration: "3 months",
    features: [
      "All Monthly features",
      "Community access",
      "Custom goals",
      "Export reports"
    ]
  },
  {
    id: "yearly",
    name: "Yearly Plan",
    price: 799, // in INR (saves ₹388)
    duration: "1 year",
    features: [
      "All Quarterly features",
      "Lifetime updates",
      "Priority onboarding",
      "Dedicated support channel",
      "Annual performance report"
    ]
  }
];

// Helper function to initiate Razorpay payment
function initiateRazorpayPayment(planId) {
  const plan = premiumPlans.find(p => p.id === planId);
  if (!plan) {
    alert('Invalid plan selected');
    return;
  }

  // Update payment options with selected plan
  razorpayPaymentOptions.amount = plan.price * 100; // Convert to paise
  razorpayPaymentOptions.description = `Ikigai Journey - ${plan.name}`;
  razorpayPaymentOptions.notes.note_key_1 = plan.name;

  // Open Razorpay checkout
  const rzp = new Razorpay(razorpayPaymentOptions);
  rzp.open();
}

// Error handler for Razorpay
function handleRazorpayError(error) {
  console.error('Razorpay Error:', error);
  alert('Payment failed. Please try again.');
}
