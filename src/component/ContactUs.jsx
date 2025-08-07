import React from "react";

function ContactUs() {
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
          <div className="bg-white p-8 lg:p-12 relative">
            <div className="max-w-md">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Contact</h2>
              <h3
                className="text-xl font-semibold mb-6"
                style={{ color: "#023047", fontStyle: "italic" }}
              >
                Our Sales Team
              </h3>
              <p className="text-gray-600 mb-8">
                Need a tailored solution for your business? Simply fill out the
                contact form, and our sales team will reach out to assist you.
              </p>

              <div className="space-y-4">
                <div>
                  <p className="font-bold text-gray-900">Address:</p>
                  <p className="text-gray-600">
                    3815 9 ave n north Lethbridge Alberta
                  </p>
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    Phone Number (WhatsApp):
                  </p>
                  <p className="text-gray-600 underline">+1 403 331 1342</p>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Email Address:</p>
                  <p className="text-gray-600 underline">
                    Yqlusedappliances@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Contact Form */}
          <div className="bg-gray-50 p-8 lg:p-12 relative">
            <form
              action="mailto:Yqlusedappliances@gmail.com"
              method="post"
              encType="text/plain"
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#023047] focus:border-transparent shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#023047] focus:border-transparent shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#023047] focus:border-transparent shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#023047] focus:border-transparent shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What idea do you plan to execute? *
                </label>
                <textarea
                  name="message"
                  rows="4"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#023047] focus:border-transparent resize-none shadow-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 text-white font-semibold rounded-md transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                style={{ backgroundColor: "#023047" }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
