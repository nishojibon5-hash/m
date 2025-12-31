import { useState } from "react";
import { Upload as UploadIcon, X, Check } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import {
  uploadVideoToDrive,
  formatFileSize,
  formatSpeed,
  formatTimeRemaining,
} from "@/lib/googleDriveIntegration";
import { useAuth } from "@/lib/authContext";

type VideoFormat = "long" | "short" | "photo_text";

interface UploadState {
  file: File | null;
  format: VideoFormat;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  isUploading: boolean;
  progress: number;
  speed: number;
  eta: number;
  error: string | null;
  success: boolean;
}

const FORMAT_INFO = {
  long: {
    label: "Long Video",
    description: "Full-length videos, streams, movies",
    maxSize: "5GB",
    maxDuration: "Unlimited",
  },
  short: {
    label: "Short Video",
    description: "Quick clips, shorts, highlights",
    maxSize: "500MB",
    maxDuration: "60 min",
  },
  photo_text: {
    label: "Photo + Text",
    description: "Slideshow with text overlay, image galleries",
    maxSize: "200MB",
    maxDuration: "Unlimited",
  },
};

export default function Upload() {
  const { user } = useAuth();
  const [state, setState] = useState<UploadState>({
    file: null,
    format: "long",
    title: "",
    description: "",
    category: "General",
    thumbnail: "",
    isUploading: false,
    progress: 0,
    speed: 0,
    eta: 0,
    error: null,
    success: false,
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setState((prev) => ({
        ...prev,
        file,
        error: null,
        success: false,
      }));
    }
  };

  const handleUpload = async () => {
    if (!state.file || !state.title.trim()) {
      setState((prev) => ({
        ...prev,
        error: "Please select a file and enter a title",
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isUploading: true,
      progress: 0,
      error: null,
    }));

    try {
      await uploadVideoToDrive(
        state.file,
        {
          title: state.title,
          description: state.description,
          creator: user?.username || "Anonymous",
          creatorId: user?.id || "unknown",
          category: state.category,
          duration: 0, // Would calculate from video
          format: state.format,
          thumbnail: state.thumbnail || "https://via.placeholder.com/320x180",
        },
        (progress) => {
          setState((prev) => ({
            ...prev,
            progress: progress.progress,
            speed: progress.speed,
            eta: progress.eta,
          }));
        },
      );

      setState((prev) => ({
        ...prev,
        isUploading: false,
        success: true,
      }));

      // Reset after 3 seconds
      setTimeout(() => {
        setState({
          file: null,
          format: "long",
          title: "",
          description: "",
          category: "General",
          thumbnail: "",
          isUploading: false,
          progress: 0,
          speed: 0,
          eta: 0,
          error: null,
          success: false,
        });
      }, 3000);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isUploading: false,
        error: `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      }));
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* Success Message */}
        {state.success && (
          <div className="mb-6 p-4 bg-green-500 bg-opacity-10 border border-green-500 rounded-lg flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-green-500 font-medium">Upload Successful!</p>
              <p className="text-green-500 text-sm">
                Your video is now processing and will be available shortly.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {state.error && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg flex items-center gap-3">
            <X className="w-5 h-5 text-red-500" />
            <p className="text-red-500 text-sm">{state.error}</p>
          </div>
        )}

        {/* Format Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Choose Video Format
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(
              Object.entries(FORMAT_INFO) as Array<
                [VideoFormat, (typeof FORMAT_INFO)[VideoFormat]]
              >
            ).map(([format, info]) => (
              <button
                key={format}
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    format,
                  }))
                }
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  state.format === format
                    ? "border-primary bg-primary bg-opacity-10"
                    : "border-border hover:border-muted"
                }`}
              >
                <h3 className="font-semibold text-foreground mb-2">
                  {info.label}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {info.description}
                </p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>Max: {info.maxSize}</p>
                  <p>Duration: {info.maxDuration}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Select Video File
          </h2>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer bg-card">
            <input
              type="file"
              accept="video/*,image/*"
              onChange={handleFileSelect}
              disabled={state.isUploading}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer block">
              <UploadIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-foreground font-semibold mb-2">
                {state.file ? state.file.name : "Click or drag to select file"}
              </p>
              <p className="text-muted-foreground text-sm">
                {state.file
                  ? `${formatFileSize(state.file.size)}`
                  : "Supports MP4, MKV, AVI, MOV, WebM and more"}
              </p>
            </label>
          </div>
        </div>

        {/* Video Details */}
        <div className="mb-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Video Title *
            </label>
            <input
              type="text"
              value={state.title}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              maxLength={100}
              placeholder="Enter video title"
              className="w-full bg-card text-foreground placeholder-muted-foreground px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {state.title.length}/100
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={state.description}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              maxLength={5000}
              placeholder="Enter video description"
              rows={4}
              className="w-full bg-card text-foreground placeholder-muted-foreground px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {state.description.length}/5000
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <select
              value={state.category}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              className="w-full bg-card text-foreground px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>General</option>
              <option>Anime</option>
              <option>Gaming</option>
              <option>Music</option>
              <option>Drama</option>
              <option>Comedy</option>
              <option>Tutorial</option>
              <option>Travel</option>
              <option>Sports</option>
            </select>
          </div>
        </div>

        {/* Upload Progress */}
        {state.isUploading && (
          <div className="mb-8 bg-card rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Uploading...
            </h3>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium text-foreground">
                  {Math.round(state.progress)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${state.progress}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Speed</p>
                <p className="text-sm font-medium text-foreground">
                  {formatSpeed(state.speed)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Time Remaining
                </p>
                <p className="text-sm font-medium text-foreground">
                  {formatTimeRemaining(state.eta)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <p className="text-sm font-medium text-primary">
                  Processing...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          {!state.isUploading && (
            <>
              <button
                onClick={handleUpload}
                disabled={!state.file || !state.title.trim()}
                className="flex-1 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <UploadIcon className="w-5 h-5" />
                Upload Video
              </button>
              <button
                onClick={() =>
                  setState({
                    file: null,
                    format: "long",
                    title: "",
                    description: "",
                    category: "General",
                    thumbnail: "",
                    isUploading: false,
                    progress: 0,
                    speed: 0,
                    eta: 0,
                    error: null,
                    success: false,
                  })
                }
                className="px-8 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-card transition-colors"
              >
                Clear
              </button>
            </>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-card rounded-lg border border-border">
          <h3 className="font-semibold text-foreground mb-2">Upload Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Supported formats: MP4, MKV, AVI, MOV, WebM, FLV</li>
            <li>✓ Maximum file size depends on your chosen format</li>
            <li>✓ Videos are automatically processed for optimal streaming</li>
            <li>
              ✓ Device tracking ensures your videos are saved to your account
            </li>
            <li>
              ✓ Use descriptive titles and descriptions for better
              discoverability
            </li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}
