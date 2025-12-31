/**
 * Device Tracking System
 * Generates a unique device ID based on device characteristics
 * Enables automatic account creation without requiring login
 */

interface DeviceInfo {
  userAgent: string;
  language: string;
  platform: string;
  screenResolution: string;
  timezone: string;
  hardwareConcurrency: number;
  deviceMemory?: number;
}

export interface DeviceFingerprint {
  id: string;
  createdAt: number;
  lastSeen: number;
  info: DeviceInfo;
}

/**
 * Generates a simple hash from a string
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Collects device information for fingerprinting
 */
function getDeviceInfo(): DeviceInfo {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: (navigator as any).deviceMemory,
  };
}

/**
 * Generates a unique device fingerprint
 */
export function generateDeviceFingerprint(): string {
  const info = getDeviceInfo();
  const fingerprintString = JSON.stringify(info);
  return simpleHash(fingerprintString);
}

/**
 * Gets or creates a device ID from localStorage
 */
export function getOrCreateDeviceId(): string {
  const STORAGE_KEY = "bilibili_device_id";
  const STORAGE_VERSION_KEY = "bilibili_device_version";

  let deviceId = localStorage.getItem(STORAGE_KEY);
  const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);

  // Regenerate if version changed (for security)
  if (!deviceId || storedVersion !== "1") {
    const fingerprint = generateDeviceFingerprint();
    const timestamp = Date.now().toString(36);
    const randomSuffix = Math.random().toString(36).substring(2, 15);
    deviceId = `${fingerprint}-${timestamp}-${randomSuffix}`;

    localStorage.setItem(STORAGE_KEY, deviceId);
    localStorage.setItem(STORAGE_VERSION_KEY, "1");
  }

  return deviceId;
}

/**
 * Gets the complete device fingerprint record
 */
export function getDeviceFingerprint(): DeviceFingerprint {
  const STORAGE_KEY = "bilibili_device_fp";
  let stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    try {
      const fp: DeviceFingerprint = JSON.parse(stored);
      fp.lastSeen = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fp));
      return fp;
    } catch (e) {
      console.error("Failed to parse stored fingerprint:", e);
    }
  }

  // Create new fingerprint
  const id = getOrCreateDeviceId();
  const info = getDeviceInfo();
  const now = Date.now();
  const fp: DeviceFingerprint = {
    id,
    createdAt: now,
    lastSeen: now,
    info,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(fp));
  return fp;
}

/**
 * Checks if this is a new device (first visit)
 */
export function isNewDevice(): boolean {
  const STORAGE_KEY = "bilibili_device_fp";
  return !localStorage.getItem(STORAGE_KEY);
}

/**
 * Gets device info for API calls
 */
export function getDeviceContext() {
  const fp = getDeviceFingerprint();
  return {
    deviceId: fp.id,
    deviceInfo: fp.info,
    isFirstVisit: isNewDevice(),
  };
}
