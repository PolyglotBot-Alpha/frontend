import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ selectedPlan }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [postalCode, setPostalCode] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else {
        setUser(user);
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

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

        const userID = user.uid;
        const tokenID = token.id;
        console.log(userID);
        console.log(token.id);
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/user/users/subscribe`,
          {
            userId: userID,
            subscriptionType: selectedPlan,
            token: tokenID,
          },
        );

        if (response.status === 200) {
          alert("Payment processed successfully!");
          navigate("/");
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
  const [selectedPlan, setSelectedPlan] = useState("");

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
        <div className="mb-6 w">
          <div className="grid grid-cols-3 gap-4">
            <label
              htmlFor="ONE_YEAR"
              className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer ${
                selectedPlan === "ONE_YEAR"
                  ? "border-purple-500 bg-purple-100"
                  : ""
              }`}
              onClick={handlePlanChange}
            >
              <input
                type="radio"
                name="billingPlan"
                id="ONE_YEAR"
                className="hidden"
                checked={selectedPlan === "ONE_YEAR"}
                onChange={handlePlanChange}
              />
              <div className="text-lg font-medium">Billed Yearly</div>
              <div className="text-2xl font-bold">$80</div>
            </label>
            <label
              htmlFor="ONE_MONTH"
              className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer ${
                selectedPlan === "ONE_MONTH"
                  ? "border-purple-500 bg-purple-100"
                  : ""
              }`}
              onClick={handlePlanChange}
            >
              <input
                type="radio"
                name="billingPlan"
                id="ONE_MONTH"
                className="hidden"
                checked={selectedPlan === "ONE_MONTH"}
                onChange={handlePlanChange}
              />
              <div className="text-lg font-medium">Billed Monthly</div>
              <div className="text-2xl font-bold">$7</div>
            </label>
            <label
              htmlFor="ONE_WEEK"
              className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer ${
                selectedPlan === "ONE_WEEK"
                  ? "border-purple-500 bg-purple-100"
                  : ""
              }`}
              onClick={handlePlanChange}
            >
              <input
                type="radio"
                name="billingPlan"
                id="ONE_WEEK"
                className="hidden"
                checked={selectedPlan === "ONE_WEEK"}
                onChange={handlePlanChange}
              />
              <div className="text-lg font-medium">Billed Weekly</div>
              <div className="text-2xl font-bold">$1</div>
            </label>
          </div>
        </div>
        <Elements stripe={stripePromise}>
          <PaymentForm selectedPlan={selectedPlan} />
        </Elements>
      </div>
    </div>
  );
};

export default Payment;
