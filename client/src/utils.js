export function mergeRefs(...refs) {
  return (value) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(value);
      } else {
        ref.current = value;
      }
    }
  };
}

export function getHostUrl() {
  return `${window.location.protocol}//${window.location.host}`;
}

export function getCurrencySymbol(currencyCode) {
  const symbols = {
    NGN: "₦",
    KES: "Ksh",
    GHS: "GH₵",
  };

  return symbols[currencyCode.trim().toUpperCase()];
}
