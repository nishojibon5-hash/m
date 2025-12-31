/**
 * Google Drive Integration Library
 * Handles video uploads and metadata storage using Google Drive + Google Sheets API
 *
 * Note: In production, implement proper OAuth 2.0 flow with Google API
 * Currently using localStorage as placeholder for demonstration
 */

export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  creator: string;
  creatorId: string;
  fileUrl: string;
  fileSizeBytes: number;
  duration: number;
  uploadedAt: number;
  views: number;
  likes: number;
  category: string;
  thumbnail: string;
  format: "long" | "short" | "photo_text";
  status: "uploading" | "processing" | "ready" | "failed";
}

export interface UploadProgress {
  fileId: string;
  progress: number;
  bytesUploaded: number;
  totalBytes: number;
  speed: number; // bytes per second
  eta: number; // seconds remaining
}

// Simulate Google Drive storage (in production, use real Google Drive API)
const STORAGE_KEY = "bilibili_videos_metadata";
const UPLOAD_KEY = "bilibili_upload_progress";

/**
 * Initialize Google Drive API (OAuth would happen here in production)
 */
export async function initializeGoogleDrive(): Promise<boolean> {
  try {
    // In production, implement proper OAuth 2.0 with Google
    // For now, just return true
    const isInitialized = localStorage.getItem("google_drive_initialized");
    if (!isInitialized) {
      localStorage.setItem("google_drive_initialized", "true");
    }
    return true;
  } catch (error) {
    console.error("Failed to initialize Google Drive:", error);
    return false;
  }
}

/**
 * Upload video to Google Drive
 * Simulates the upload with progress tracking
 */
export async function uploadVideoToDrive(
  file: File,
  metadata: Omit<
    VideoMetadata,
    | "id"
    | "uploadedAt"
    | "fileUrl"
    | "views"
    | "likes"
    | "status"
    | "fileSizeBytes"
  >,
  onProgress: (progress: UploadProgress) => void,
): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const fileId = `video_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const totalBytes = file.size;
    let uploadedBytes = 0;
    const startTime = Date.now();

    // Simulate chunked upload
    const chunkSize = 1024 * 1024; // 1MB chunks
    let chunkIndex = 0;

    const uploadNextChunk = () => {
      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, totalBytes);
      uploadedBytes = end;

      const elapsed = (Date.now() - startTime) / 1000;
      const speed = uploadedBytes / Math.max(elapsed, 0.1);
      const eta = (totalBytes - uploadedBytes) / Math.max(speed, 1);

      onProgress({
        fileId,
        progress: (uploadedBytes / totalBytes) * 100,
        bytesUploaded: uploadedBytes,
        totalBytes,
        speed,
        eta,
      });

      if (end < totalBytes) {
        chunkIndex++;
        // Simulate network delay
        setTimeout(uploadNextChunk, 100);
      } else {
        // Upload complete
        const videoMetadata: VideoMetadata = {
          id: fileId,
          ...metadata,
          uploadedAt: Date.now(),
          fileUrl: URL.createObjectURL(file), // In production, use Drive file URL
          fileSizeBytes: totalBytes,
          views: 0,
          likes: 0,
          status: "ready",
        };

        // Save to mock database (localStorage)
        saveVideoMetadata(videoMetadata);
        resolve(videoMetadata);
      }
    };

    uploadNextChunk();
  });
}

/**
 * Save video metadata to Google Sheets (simulated with localStorage)
 */
export function saveVideoMetadata(metadata: VideoMetadata): void {
  const allVideos = getAllVideoMetadata();
  allVideos.push(metadata);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allVideos));
}

/**
 * Get all videos metadata
 */
export function getAllVideoMetadata(): VideoMetadata[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to retrieve videos metadata:", error);
    return [];
  }
}

/**
 * Get video metadata by ID
 */
export function getVideoMetadata(videoId: string): VideoMetadata | null {
  const videos = getAllVideoMetadata();
  return videos.find((v) => v.id === videoId) || null;
}

/**
 * Get videos by creator
 */
export function getVideosByCreator(creatorId: string): VideoMetadata[] {
  const videos = getAllVideoMetadata();
  return videos.filter((v) => v.creatorId === creatorId);
}

/**
 * Get videos by category
 */
export function getVideosByCategory(category: string): VideoMetadata[] {
  const videos = getAllVideoMetadata();
  return videos.filter((v) => v.category === category);
}

/**
 * Update video metadata (likes, views, etc)
 */
export function updateVideoMetadata(
  videoId: string,
  updates: Partial<VideoMetadata>,
): VideoMetadata | null {
  const videos = getAllVideoMetadata();
  const index = videos.findIndex((v) => v.id === videoId);

  if (index !== -1) {
    videos[index] = { ...videos[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
    return videos[index];
  }

  return null;
}

/**
 * Delete video from Drive
 */
export function deleteVideo(videoId: string): boolean {
  const videos = getAllVideoMetadata();
  const filtered = videos.filter((v) => v.id !== videoId);

  if (filtered.length < videos.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  return false;
}

/**
 * Get upload progress for a specific file
 */
export function getUploadProgress(fileId: string): UploadProgress | null {
  try {
    const progress = localStorage.getItem(`${UPLOAD_KEY}_${fileId}`);
    return progress ? JSON.parse(progress) : null;
  } catch (error) {
    return null;
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Format upload speed
 */
export function formatSpeed(bytesPerSecond: number): string {
  return formatFileSize(bytesPerSecond) + "/s";
}

/**
 * Format time remaining
 */
export function formatTimeRemaining(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${Math.round(seconds / 3600)}h`;
}
