async function verifyLicenseKey(key) {
  const response = await fetch("https://focus-license-server.onrender.com/validate-license", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ licenseKey: key })
  });

  const data = await response.json();
  return data.valid;
}

document.getElementById("verifyBtn").addEventListener("click", async () => {
  const key = document.getElementById("licenseInput").value;
  const status = document.getElementById("status");

  const valid = await verifyLicenseKey(key);
  if (valid) {
    status.textContent = "✅ רישיון תקף. פרו הופעל!";
    chrome.storage.sync.set({ licenseKey: key });
  } else {
    status.textContent = "❌ רישיון לא תקף";
  }
});

document.getElementById("buyBtn").addEventListener("click", () => {
  window.open("https://focus-israeli.lemonsqueezy.com/buy/390ef527-2831-4c55-a5d2-41066dfa67f9", "_blank");
});