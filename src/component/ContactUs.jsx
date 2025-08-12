import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";

function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear messages when user starts typing
    if (message) setMessage("");
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/contact/send`,
        formData
      );

      if (response.data.success) {
        setMessage("Message sent successfully! We'll get back to you soon.");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        setError(response.data.message || "Failed to send message");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mb-16 relative">
      <div
        className="bg-white rounded-xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 border border-gray-100"
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)",
          transform: "translateZ(0)",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left Section - Contact Information */}
          <div className="bg-white p-6 sm:p-8 lg:p-12 relative">
            <div className="max-w-md mx-auto lg:mx-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center lg:text-left">
                Contact
              </h2>
              <h3
                className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center lg:text-left"
                style={{ color: "#023047", fontStyle: "italic" }}
              >
                Our Sales Team
              </h3>
              <p className="text-gray-600 mb-6 sm:mb-8 text-center lg:text-left text-sm sm:text-base">
                Need a tailored solution for your business? Simply fill out the
                contact form, and our sales team will reach out to assist you.
              </p>

              <div className="space-y-4 text-center lg:text-left">
                <div>
                  <p className="font-bold text-gray-900 text-sm sm:text-base">
                    Address:
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base">
                    3815 9 ave n north Lethbridge Alberta
                  </p>
                  {/* Embedded Google Map */}
                  <div className="mt-3 bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Our location
                        </p>
                        <p className="text-xs text-gray-500">Interactive map</p>
                      </div>
                      <a
                        href="https://maps.app.goo.gl/s73i5Gbd8q33GZfC8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-[#023047] text-white text-xs font-bold hover:bg-[#012537]"
                      >
                        Open in Maps
                      </a>
                    </div>
                    <div className="h-44">
                      <iframe
                        title="YQL Appliances Location"
                        src="https://www.google.com/maps?q=3815%209%20Ave%20N%2C%20Lethbridge%2C%20Alberta&z=14&output=embed"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen=""
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm sm:text-base">
                    Phone Number (WhatsApp):
                  </p>
                  <p className="text-gray-600 underline text-sm sm:text-base">
                    +1 403 331 1342
                  </p>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm sm:text-base">
                    Email Address:
                  </p>
                  <p className="text-gray-600 underline text-sm sm:text-base">
                    Yqlusedappliances@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Contact Form */}
          <div className="bg-gray-50 p-6 sm:p-8 lg:p-12 relative">
            {message && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-md">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#023047] focus:border-transparent shadow-sm text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#023047] focus:border-transparent shadow-sm text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#023047] focus:border-transparent shadow-sm text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#023047] focus:border-transparent shadow-sm text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  write us your idea *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  required
                  className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#023047] focus:border-transparent resize-none shadow-sm text-base"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 md:py-3 px-6 text-white font-semibold rounded-md transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                style={{ backgroundColor: "#023047" }}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
