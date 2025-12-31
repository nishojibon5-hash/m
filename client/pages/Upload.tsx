import MainLayout from "@/components/MainLayout";
import { Upload as UploadIcon } from "lucide-react";

export default function Upload() {
  return (
    <MainLayout>
      <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8 h-96 flex items-center justify-center">
        <div className="text-center">
          <UploadIcon className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Upload Video</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            Upload your videos in any format (Long, Short, Photo+Text). Device tracking authentication coming soon!
          </p>
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
            Select Video to Upload
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
