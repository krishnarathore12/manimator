"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Play, Plus } from "lucide-react";
import React from 'react'; // Import React if not already
import { API_BASE_URL } from './config';

// Props for MediaPreviewInterface
interface MediaPreviewInterfaceProps {
  videoPath?: string | null; // To be passed from a parent component
}

// Props for VideoPreview
interface VideoPreviewProps {
  videoPath?: string | null;
}

// Use environment variable for backend URL
const BACKEND_VIDEO_BASE_URL = API_BASE_URL;

function HeaderBar() {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm font-normal text-muted-foreground">Preview</p>
      <div className="flex items-center gap-4">
        <Button size='sm' variant="outline" onClick={() => console.log("Invite clicked")}>Invite</Button>
        <Button size="sm" onClick={() => console.log("Export clicked")}>Export</Button>
      </div>
    </div>
  );
}

function VideoPreview({ videoPath }: VideoPreviewProps) {
  let fullVideoUrl: string | null = null;

  if (videoPath && videoPath.trim() !== "") {
    // Ensure the base URL does not end with a slash if we are adding one
    const base = BACKEND_VIDEO_BASE_URL.endsWith('/')
      ? BACKEND_VIDEO_BASE_URL.slice(0, -1)
      : BACKEND_VIDEO_BASE_URL;
    // Ensure the videoPath part does not start with a slash if the base already provides it implicitly
    const path = videoPath.startsWith('/') ? videoPath.substring(1) : videoPath;
    fullVideoUrl = `${base}/${path}`;
  }

  return (
    <div className="w-full max-w-[1800px] mx-auto aspect-video bg-background rounded-2xl shadow-lg overflow-hidden flex items-center justify-center">
      {fullVideoUrl ? (
        <video
          key={fullVideoUrl} // Using fullVideoUrl as key helps React re-render correctly if the source changes
          className="w-full h-full object-contain" // 'object-contain' ensures the video fits and maintains aspect ratio
          src={fullVideoUrl} // Use the constructed full URL
          controls // Adds default video controls (play, pause, volume, etc.)
          // autoPlay // Uncomment if you want the video to play automatically (generally not recommended for UX)
          // loop // Uncomment if you want the video to loop
          // muted // Uncomment if you want the video to start muted (often required for autoplay in browsers)
        >
          Your browser does not support the video tag. {/* Fallback message */}
        </video>
      ) : (
        <p className="text-muted-foreground text-center px-4">
          {/* Informative placeholder text */}
          Video preview will appear here once a video is generated and its path is available.
        </p>
      )}
    </div>
  );
}

function VariantPreviewBoxes() {
  return (
    <div className="flex items-center gap-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="w-[91px] h-[92px] bg-popover border border-border rounded-lg" />
      ))}
    </div>
  );
}

function VariantSection() {
    return (
      <div className="flex flex-col items-center justify-center gap-3 w-full max-w-[1800px] px-2">
        <p className="text-sm font-normal text-muted-foreground text-center">Preview all variants</p>
        <div className="flex items-center gap-4">
          <VariantPreviewBoxes />
          <Button
            variant="outline"
            size="icon"
            className="opacity-50 bg-background rounded-full w-8 h-8 p-0 flex items-center justify-center hover:bg-neutral-100" // hover:bg-muted/80 might be better for dark mode
            onClick={() => console.log("Add clicked")}
            aria-label="Add"
          >
            <Plus className="w-4 h-4 text-foreground" />
          </Button>
        </div>
      </div>
    );
  }

function FloatingPlayButton() {
  return (
    <div className="absolute bottom-8 right-8 z-10">
      <Button
        size="icon"
        className="w-16 h-16 bg-background rounded-full shadow-lg hover:bg-neutral-100"
        aria-label="Play"
        onClick={() => console.log("Play clicked")}
      >
        <Play className="w-9 h-9 text-primary" />
      </Button>
    </div>
  );
}

export default function MediaPreviewInterface({ videoPath }: MediaPreviewInterfaceProps) {
  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 flex flex-col bg-muted p-4 lg:p-6 overflow-hidden rounded-2xl m-4">
        <div className="flex flex-col gap-3 max-w-[1800px] w-full mx-auto">
          <HeaderBar />
          <Separator />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-6 lg:gap-8 overflow-auto p-2">
          <VideoPreview videoPath={videoPath} />
          <VariantSection />
        </div>
      </div>
      <FloatingPlayButton />
    </div>
  );
}