class RealtimeSync {
  constructor() {
    this.listeners = new Map();
    this.polling = false;
    this.pollInterval = null;
    this.lastDataSnapshots = new Map();
    this.API_BASE = "https://papaiaapi.onrender.com/api/owner";
  }

  // Subscribe to data changes
  subscribe(dataType, callback) {
    if (!this.listeners.has(dataType)) {
      this.listeners.set(dataType, new Set());
    }
    this.listeners.get(dataType).add(callback);

    // Start polling if not already running
    if (!this.polling) {
      this.startPolling();
    }

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(dataType);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(dataType);
        }
      }
      // Stop polling if no listeners
      if (this.listeners.size === 0) {
        this.stopPolling();
      }
    };
  }

  // Emit changes to all listeners of a specific data type
  emit(dataType, newData) {
    const callbacks = this.listeners.get(dataType);
    if (callbacks) {
      callbacks.forEach((callback) => callback(newData));
    }
  }

  // Check for data changes
  async checkForChanges() {
    if (document.hidden) return; // Don't poll when tab is hidden

    const token = localStorage.getItem("token");
    if (!token) return;

    const dataTypes = [
      { key: "farms", endpoint: "/farms" },
      { key: "activities", endpoint: "/activities" },
      { key: "scans", endpoint: "/identification-history" },
      { key: "farmers", endpoint: "/count-farmers" },
      { key: "farm_count", endpoint: "/count-farms" },
    ];

    for (const { key, endpoint } of dataTypes) {
      // Only check if someone is listening
      if (!this.listeners.has(key)) continue;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${this.API_BASE}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const dataHash = this.hashData(data);
          const lastHash = this.lastDataSnapshots.get(key);

          // If data changed, notify listeners
          if (lastHash !== dataHash) {
            this.lastDataSnapshots.set(key, dataHash);
            this.emit(key, data);
          }
        }
      } catch (error) {
        // Silently fail - don't disrupt user experience
      }
    }
  }

  // Simple hash function to detect changes
  hashData(data) {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  startPolling() {
    if (this.polling) return;
    this.polling = true;

    // Initial check
    this.checkForChanges();

    // Poll every 10 seconds when tab is visible
    this.pollInterval = setInterval(() => {
      this.checkForChanges();
    }, 10000);

    // Listen for visibility changes
    document.addEventListener(
      "visibilitychange",
      this.handleVisibilityChange.bind(this)
    );
  }

  stopPolling() {
    this.polling = false;
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange.bind(this)
    );
  }

  handleVisibilityChange() {
    if (!document.hidden && this.polling) {
      // Tab became visible, check immediately
      this.checkForChanges();
    }
  }

  // Manual trigger for when you know data changed (e.g., after adding a farm)
  notifyChange(dataType, newData = null) {
    this.lastDataSnapshots.delete(dataType);
    if (newData) {
      this.emit(dataType, newData);
    } else {
      this.checkForChanges();
    }
  }
}
const realtimeSync = new RealtimeSync();
export default realtimeSync;
