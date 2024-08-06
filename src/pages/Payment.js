import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const [postalCode, setPostalCode] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handlePlanChange = (event) => {
    setSelectedPlan(event.target.id);
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!/^\d{5}$/.test(postalCode)) {
      newErrors.postalCode = "Postal code must be 5 digits";
    }
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = validateInputs();
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        if (!stripe || !elements) {
          return;
        }

        const cardElement = elements.getElement(CardElement);
        const { error, token } = await stripe.createToken(cardElement, {
          address_zip: postalCode,
        });

        if (error) {
          setErrors({ card: error.message });
          setLoading(false);
          return;
        }

        const amount = selectedPlan === "yearly" ? 8000 : 700;
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/subscription/charge`,
          {},
          {
            headers: {
              token: token.id,
              amount: amount,
            },
          },
        );

        if (response.status === 200) {
          alert("Payment processed successfully!");
        } else {
          alert("Payment failed. Please try again.");
        }
      } catch (error) {
        alert("Payment failed. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="creditCard" className="block text-lg font-medium mb-2">
          Payment details
        </label>
        <div className="relative">
          <CardElement className="w-full p-2 border rounded mb-2" />
        </div>
        {errors.card && <p className="text-red-500 text-sm">{errors.card}</p>}
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
        disabled={loading}
      >
        {loading ? "Processing..." : "Submit"}
      </button>
    </form>
  );
};

const Payment = () => {
  const [selectedPlan, setSelectedPlan] = useState("yearly");

  const handlePlanChange = (event) => {
    setSelectedPlan(event.target.id);
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
              className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer ${
                selectedPlan === "yearly"
                  ? "border-purple-500 bg-purple-100"
                  : ""
              }`}
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
              <div className="text-2xl font-bold">$80</div>
            </label>
            <label
              htmlFor="monthly"
              className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer ${
                selectedPlan === "monthly"
                  ? "border-purple-500 bg-purple-100"
                  : ""
              }`}
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
              <div className="text-2xl font-bold">$7</div>
            </label>
          </div>
        </div>
        <Elements stripe={stripePromise}>
          <PaymentForm />
        </Elements>
      </div>
    </div>
  );
};

export default Payment;
