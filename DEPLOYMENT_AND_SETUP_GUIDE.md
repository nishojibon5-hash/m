# VideoShare Platform - Complete Deployment & Setup Guide

## বাংলায় দ্রুত গাইড | Quick Guide in Bengali

এই গাইডটি আপনার অ্যাপকে GitHub → Vercel-এ ডিপ্লয় করতে এবং Google Drive + Sheets-কে ডাটাবেস হিসেবে সংযুক্ত করতে সাহায্য করবে।

---

## TABLE OF CONTENTS

1. [Step 1: GitHub Repository Setup](#step-1-github-repository-setup)
2. [Step 2: Prepare Code for Production](#step-2-prepare-code-for-production)
3. [Step 3: Deploy to Vercel](#step-3-deploy-to-vercel)
4. [Step 4: Google Drive Integration](#step-4-google-drive-integration)
5. [Step 5: Google Sheets Setup for Database](#step-5-google-sheets-setup-for-database)
6. [Step 6: Connect APIs to Your App](#step-6-connect-apis-to-your-app)
7. [Troubleshooting](#troubleshooting)

---

## STEP 1: GitHub Repository Setup

### 1.1 Create GitHub Repository

```bash
# First, initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: VideoShare platform with device tracking and video upload"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/videoshare.git

# Rename branch to main if needed
git branch -M main

# Push to GitHub
git push -u origin main
```

### 1.2 Create .gitignore

Create a `.gitignore` file to exclude sensitive files:

```
node_modules/
dist/
.env
.env.local
.env.production.local
*.log
.DS_Store
```

### 1.3 Update package.json

Make sure your `package.json` has:

```json
{
  "name": "videoshare",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build",
    "build:server": "vite build --config vite.config.server.ts",
    "start": "node dist/server/node-build.mjs",
    "preview": "vite preview"
  }
}
```

---

## STEP 2: Prepare Code for Production

### 2.1 Update Environment Variables

Create `.env.production` file:

```
# Google Drive API
VITE_GOOGLE_DRIVE_API_KEY=YOUR_API_KEY
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com

# Google Sheets
VITE_GOOGLE_SHEETS_API_KEY=YOUR_API_KEY

# App Settings
VITE_APP_URL=https://your-app.vercel.app
VITE_NODE_ENV=production
```

### 2.2 Update Configuration Files

**vite.config.ts** - Ensure it's properly configured:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  build: {
    outDir: "dist/spa",
    emptyOutDir: true,
  },
});
```

### 2.3 Add Production Build Script

Update `package.json`:

```json
{
  "scripts": {
    "build": "npm run typecheck && npm run build:client && npm run build:server",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## STEP 3: Deploy to Vercel

### 3.1 Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select "Import Git Repository"
4. Paste your GitHub repo URL: `https://github.com/YOUR_USERNAME/videoshare.git`
5. Authorize GitHub

### 3.2 Configure Vercel Project

**Environment Variables:**

1. Go to Project Settings → Environment Variables
2. Add these variables:

```
VITE_GOOGLE_DRIVE_API_KEY=YOUR_API_KEY
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
VITE_GOOGLE_SHEETS_API_KEY=YOUR_API_KEY
VITE_APP_URL=https://your-app.vercel.app
```

**Build Settings:**

- Framework: `Other`
- Build Command: `npm run build`
- Output Directory: `dist/spa`
- Install Command: `npm install`

### 3.3 Deploy

```bash
# Vercel will automatically deploy when you push to main
git push origin main

# Or deploy manually:
# npm install -g vercel
# vercel --prod
```

---

## STEP 4: Google Drive Integration

### 4.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Create Project"
3. Enter name: `VideoShare Platform`
4. Click "Create"

### 4.2 Enable Google Drive API

1. In the Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Drive API"
3. Click on it
4. Click "Enable"

### 4.3 Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth Client ID"
3. Select "Web application"
4. Add Authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://your-app.vercel.app` (production)
5. Add Authorized redirect URIs:
   - `http://localhost:3000/callback`
   - `https://your-app.vercel.app/callback`
6. Click "Create"
7. Copy your **Client ID** and **Client Secret**

### 4.4 Get API Key

1. Go to "Credentials"
2. Click "Create Credentials" → "API Key"
3. Restrict the key to "Google Drive API"
4. Copy the **API Key**

### 4.5 Create Service Account (for server-side operations)

1. Go to "Credentials" → "Create Credentials" → "Service Account"
2. Fill in the details:
   - Service account name: `videoshare-service`
   - Click "Create and Continue"
3. Grant these roles:
   - `Editor` (or more restrictive: Drive Editor)
4. Click "Continue" → "Done"
5. Click on the service account
6. Go to "Keys" → "Add Key" → "Create new key"
7. Select JSON format
8. Click "Create"
9. Save the JSON file securely - this is your **Service Account Key**

---

## STEP 5: Google Sheets Setup for Database

### 5.1 Create Google Sheet for Video Metadata

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new sheet: `VideoShare Database`
3. Add these columns in Row 1:

```
A: Video ID
B: Title
C: Description
D: Creator
E: Creator ID
F: File URL
G: File Size
H: Duration
I: Uploaded At
J: Views
K: Likes
L: Category
M: Thumbnail URL
N: Format (long/short/photo_text)
O: Status
```

### 5.2 Share Sheet with Service Account

1. Copy the email from your Service Account
2. In the Google Sheet, click "Share"
3. Paste the service account email
4. Give **Editor** access
5. Click "Share"

### 5.3 Get Sheet ID

Your sheet ID is in the URL:

```
https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
```

Copy the `{SHEET_ID}` part.

---

## STEP 6: Connect APIs to Your App

### 6.1 Update Google Drive Integration

Create/update `client/lib/googleDriveIntegration.ts`:

```typescript
/**
 * Initialize Google Drive API with real authentication
 */
export async function initializeGoogleDrive(
  clientId: string,
): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/client.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      gapi.load("client:auth2", async () => {
        try {
          await gapi.client.init({
            apiKey: import.meta.env.VITE_GOOGLE_DRIVE_API_KEY,
            clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
              "https://www.googleapis.com/discovery/v1/apis/sheets/v4/rest",
            ],
            scope: "https://www.googleapis.com/auth/drive",
          });
          localStorage.setItem("google_drive_initialized", "true");
          resolve(true);
        } catch (error) {
          console.error("Google Drive initialization failed:", error);
          resolve(false);
        }
      });
    };
    document.body.appendChild(script);
  });
}

/**
 * Upload video file to Google Drive
 */
export async function uploadVideoFileToDrive(
  file: File,
  folderName: string = "VideoShare Videos",
): Promise<string> {
  try {
    // Find or create folder
    const folderId = await ensureFolder(folderName);

    // Upload file
    const fileMetadata = {
      name: file.name,
      parents: [folderId],
    };

    const form = new FormData();
    form.append(
      "metadata",
      new Blob([JSON.stringify(fileMetadata)], { type: "application/json" }),
    );
    form.append("file", file);

    const response = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token}`,
        },
        body: form,
      },
    );

    const data = await response.json();
    return data.id; // Google Drive file ID
  } catch (error) {
    console.error("Upload to Google Drive failed:", error);
    throw error;
  }
}

/**
 * Ensure folder exists in Google Drive
 */
async function ensureFolder(folderName: string): Promise<string> {
  try {
    // Check if folder exists
    const response = await gapi.client.drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      spaces: "drive",
      fields: "files(id, name)",
      pageSize: 1,
    });

    if (response.result.files && response.result.files.length > 0) {
      return response.result.files[0].id;
    }

    // Create folder if it doesn't exist
    const createResponse = await gapi.client.drive.files.create({
      resource: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      },
      fields: "id",
    });

    return createResponse.result.id;
  } catch (error) {
    console.error("Folder operation failed:", error);
    throw error;
  }
}

/**
 * Save metadata to Google Sheets
 */
export async function saveVideoMetadataToSheets(
  metadata: VideoMetadata,
): Promise<boolean> {
  try {
    const sheetId = import.meta.env.VITE_GOOGLE_SHEETS_ID;

    const values = [
      [
        metadata.id,
        metadata.title,
        metadata.description,
        metadata.creator,
        metadata.creatorId,
        metadata.fileUrl,
        metadata.fileSizeBytes,
        metadata.duration,
        new Date(metadata.uploadedAt).toISOString(),
        metadata.views,
        metadata.likes,
        metadata.category,
        metadata.thumbnail,
        metadata.format,
        metadata.status,
      ],
    ];

    await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:O",
      valueInputOption: "USER_ENTERED",
      resource: {
        values,
      },
    });

    return true;
  } catch (error) {
    console.error("Save to Google Sheets failed:", error);
    throw error;
  }
}

/**
 * Get all videos from Google Sheets
 */
export async function getVideosFromSheets(): Promise<VideoMetadata[]> {
  try {
    const sheetId = import.meta.env.VITE_GOOGLE_SHEETS_ID;

    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Sheet1!A:O",
    });

    const values = response.result.values || [];
    const videos: VideoMetadata[] = [];

    // Skip header row
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      videos.push({
        id: row[0],
        title: row[1],
        description: row[2],
        creator: row[3],
        creatorId: row[4],
        fileUrl: row[5],
        fileSizeBytes: parseInt(row[6]),
        duration: parseInt(row[7]),
        uploadedAt: new Date(row[8]).getTime(),
        views: parseInt(row[9]),
        likes: parseInt(row[10]),
        category: row[11],
        thumbnail: row[12],
        format: row[13],
        status: row[14],
      });
    }

    return videos;
  } catch (error) {
    console.error("Get from Google Sheets failed:", error);
    return [];
  }
}
```

### 6.2 Update .env Files

**.env.local** (Development):

```
VITE_GOOGLE_DRIVE_API_KEY=YOUR_DEV_API_KEY
VITE_GOOGLE_CLIENT_ID=YOUR_DEV_CLIENT_ID.apps.googleusercontent.com
VITE_GOOGLE_SHEETS_API_KEY=YOUR_DEV_API_KEY
VITE_GOOGLE_SHEETS_ID=YOUR_GOOGLE_SHEET_ID
VITE_APP_URL=http://localhost:5173
```

**.env.production** (Production - set in Vercel):

```
VITE_GOOGLE_DRIVE_API_KEY=YOUR_PROD_API_KEY
VITE_GOOGLE_CLIENT_ID=YOUR_PROD_CLIENT_ID.apps.googleusercontent.com
VITE_GOOGLE_SHEETS_API_KEY=YOUR_PROD_API_KEY
VITE_GOOGLE_SHEETS_ID=YOUR_GOOGLE_SHEET_ID
VITE_APP_URL=https://videoshare.vercel.app
```

### 6.3 Update Upload Component

Add Google Drive upload in `client/pages/Upload.tsx`:

```typescript
// Import the new function
import {
  uploadVideoFileToDrive,
  saveVideoMetadataToSheets,
} from "@/lib/googleDriveIntegration";

// In the upload handler:
const handleUploadToGoogleDrive = async () => {
  try {
    // Upload file to Google Drive
    const driveFileId = await uploadVideoFileToDrive(state.file!);

    // Get shareable link
    const fileUrl = `https://drive.google.com/file/d/${driveFileId}/view`;

    // Save metadata to Google Sheets
    const metadata = {
      id: `video_${Date.now()}`,
      title: state.title,
      description: state.description,
      creator: user?.username || "Anonymous",
      creatorId: user?.id || "unknown",
      fileUrl,
      fileSizeBytes: state.file!.size,
      duration: 0, // Would calculate from video
      uploadedAt: Date.now(),
      views: 0,
      likes: 0,
      category: state.category,
      thumbnail: state.thumbnail,
      format: state.format,
      status: "ready",
    };

    await saveVideoMetadataToSheets(metadata);

    // Success!
    setState((prev) => ({ ...prev, success: true }));
  } catch (error) {
    setState((prev) => ({
      ...prev,
      error: `Upload failed: ${error.message}`,
    }));
  }
};
```

---

## STEP 7: Testing & Verification

### 7.1 Local Testing

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your Google credentials

# Start development server
npm run dev

# Test at http://localhost:5173
```

### 7.2 Test Checklist

- [ ] Device tracking works (check localStorage)
- [ ] Auto-account creation on first visit
- [ ] Video upload completes successfully
- [ ] Files appear in Google Drive folder
- [ ] Metadata appears in Google Sheets
- [ ] Videos play smoothly
- [ ] Mobile navigation visible at bottom
- [ ] Admin panel loads at `/admin`

### 7.3 Production Testing

1. Push changes to GitHub
2. Vercel auto-deploys
3. Visit your production URL
4. Verify all features work
5. Check Google Drive for uploaded files
6. Check Google Sheets for metadata

---

## IS THIS APPROACH SUITABLE?

**YES! Here's why:**

✅ **GitHub + Vercel is Perfect for:**

- Easy deployment and updates
- Automatic builds on push
- Free SSL/HTTPS
- Good performance
- Easy rollbacks
- GitHub Actions for CI/CD

✅ **Google Drive + Sheets is Suitable for:**

- Small to medium video libraries
- Free storage (up to 15GB)
- Easy to manage and debug
- Good for prototyping
- Can migrate to professional storage later

⚠️ **Considerations:**

- Google Drive has rate limits (be aware)
- For huge scale, consider Wasabi or S3 later
- Sheets can be slow with 10,000+ rows (use real database then)
- Current approach is great for MVP/prototype

---

## TROUBLESHOOTING

### Issue: "API key not valid"

- Check if API is enabled in Google Cloud Console
- Verify API key in .env file
- Make sure API is restricted to correct origins

### Issue: "Service account doesn't have permission"

- Share the Google Sheet with service account email
- Give Editor permissions
- Wait 30 seconds before retrying

### Issue: "Videos not uploading"

- Check Google Drive folder permissions
- Verify API quotas not exceeded
- Check browser console for errors

### Issue: "Mobile nav still not visible"

- Clear browser cache (Ctrl+Shift+Delete)
- Check if `pb-24` class is applied to main div
- Inspect in DevTools to verify z-index

### Issue: "Vercel deployment fails"

- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Run `npm run build` locally to test
- Check Node.js version compatibility

---

## NEXT STEPS

After successful deployment:

1. **Set up CI/CD**: Use GitHub Actions for automated testing
2. **Monitor Performance**: Use Vercel Analytics
3. **Scale Storage**: Migrate to AWS S3 or Google Cloud Storage when needed
4. **Add Real Database**: Move to Firebase or PostgreSQL for production scale
5. **Implement Transcoding**: Use FFmpeg for video processing
6. **Add CDN**: Use Cloudflare for edge caching
7. **Implement Payments**: Add Stripe for monetization

---

## HELPFUL RESOURCES

- [Vercel Docs](https://vercel.com/docs)
- [Google Drive API](https://developers.google.com/drive/api)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [React Guide](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

---

**Good luck with your deployment! 🚀**

If you need help with any step, feel free to ask!
