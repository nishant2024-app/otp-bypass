(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("testmode");

  if (token !== "sv") {
    console.warn("🛡️ OTP Mock not active — missing or wrong token.");
    return;
  }

  console.log("🧪 OTP Mock activated for token:", token);

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
    }

    return originalSend.apply(this, arguments);
  };
})();
