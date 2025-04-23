const basicBlockedSites = [
  "*://www.mako.co.il/*",
  "*://www.walla.co.il/*",
  "*://www.sport5.co.il/*",
  "*://www.youtube.com/*",
  "*://www.facebook.com/*",
  "*://www.ynet.co.il/*"
];

// Initialize blocked sites when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  // Save initial blocked sites to storage
  chrome.storage.sync.set({ blockedSites: basicBlockedSites }, () => {
    updateBlockedSites();
  });
});

// Function to update blocked sites rules
function updateBlockedSites() {
  chrome.storage.sync.get(['blockedSites'], (result) => {
    const blockedSites = result.blockedSites || basicBlockedSites;
    
    // Remove all existing rules
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: blockedSites.map((_, index) => index + 1)
    }, () => {
      // Add new rules
      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: blockedSites.map((site, index) => ({
          id: index + 1,
          priority: 1,
          action: { 
            type: "redirect",
            redirect: {
              extensionPath: "/blocked.html?url=" + encodeURIComponent(site)
            }
          },
          condition: {
            urlFilter: site,
            resourceTypes: ["main_frame"]
          }
        }))
      });
    });
  });
}

// Listen for changes in storage to update blocked sites
chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedSites) {
    updateBlockedSites();
  }
});