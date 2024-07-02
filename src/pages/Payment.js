import React, { useState, useEffect } from "react";

const Payment = () => {
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [errors, setErrors] = useState({});

  const handlePlanChange = (event) => {
    setSelectedPlan(event.target.id);
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!/^\d{16}$/.test(cardNumber.replace(/\s+/g, ""))) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }
    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiry)) {
      newErrors.expiry = "Expiry date must be in MM/YY format";
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      newErrors.cvv = "CVV must be 3 or 4 digits";
    }
    if (!/^\d{5}$/.test(postalCode)) {
      newErrors.postalCode = "Postal code must be 5 digits";
    }
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = validateInputs();
    if (Object.keys(newErrors).length === 0) {
      alert("Payment processed successfully!");
      // Process payment here
    } else {
      setErrors(newErrors);
    }
  };

  useEffect(() => {
    setErrors(validateInputs());
  }, [cardNumber, expiry, cvv, postalCode]);

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(" ") : value;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        <div className="mb-4">
          <div className="text-lg font-semibold">PolyglotBot Pro</div>
        </div>
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <label
              htmlFor="yearly"
              className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer ${selectedPlan === "yearly" ? "border-purple-500 bg-purple-100" : ""}`}
              onClick={handlePlanChange}
            >
              <input
                type="radio"
                name="billingPlan"
                id="yearly"
                className="hidden"
                checked={selectedPlan === "yearly"}
                onChange={handlePlanChange}
              />
              <div className="text-lg font-medium">Billed Yearly</div>
              <div className="text-2xl font-bold">$5</div>
            </label>
            <label
              htmlFor="monthly"
              className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer ${selectedPlan === "monthly" ? "border-purple-500 bg-purple-100" : ""}`}
              onClick={handlePlanChange}
            >
              <input
                type="radio"
                name="billingPlan"
                id="monthly"
                className="hidden"
                checked={selectedPlan === "monthly"}
                onChange={handlePlanChange}
              />
              <div className="text-lg font-medium">Billed Monthly</div>
              <div className="text-2xl font-bold">$9</div>
            </label>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="creditCard"
              className="block text-lg font-medium mb-2"
            >
              Payment details
            </label>
            <div className="relative">
              <input
                type="text"
                id="creditCard"
                placeholder="Card Number"
                className={`w-full p-2 border rounded mb-2 ${errors.cardNumber ? "border-red-500" : ""}`}
                value={formatCardNumber(cardNumber)}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
              />
              <div className="absolute top-1/2 transform -translate-y-1/2 right-4 flex space-x-2">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                  alt="Visa"
                  className="w-8 h-8"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  alt="MasterCard"
                  className="w-8 h-8"
                />
              </div>
            </div>
            {errors.cardNumber && (
              <p className="text-red-500 text-sm">{errors.cardNumber}</p>
            )}
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="MM/YY"
                className={`w-full p-2 border rounded mb-2 ${errors.expiry ? "border-red-500" : ""}`}
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                maxLength={5}
              />
              <input
                type="text"
                placeholder="CVV"
                className={`w-full p-2 border rounded mb-2 ${errors.cvv ? "border-red-500" : ""}`}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                maxLength={4}
              />
            </div>
            {errors.expiry && (
              <p className="text-red-500 text-sm">{errors.expiry}</p>
            )}
            {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
            <div className="flex space-x-2">
              <select
                className="w-full p-2 border rounded mb-2"
                defaultValue="United States"
              >
                <option value="United States">United States</option>
                {/* Add more options as needed */}
              </select>
              <input
                type="text"
                placeholder="Postal Code"
                className={`w-full p-2 border rounded ${errors.postalCode ? "border-red-500" : ""}`}
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                maxLength={5}
              />
            </div>
            {errors.postalCode && (
              <p className="text-red-500 text-sm">{errors.postalCode}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-2 rounded mt-4"
          >
            Upgrade
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
