"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { useLocation } from "react-router-dom"; // Make sure react-router-dom is installed
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_BASE_URL } from './config';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  PanelLeftClose,
  Search,
  Paperclip,
  Sparkles,
  Send,
} from "lucide-react";

// API Response and Interaction types
interface ApiResponse {
  manim_code: string;
  video_path: string | null;
  summary: string;
  stdout: string;
  stderr: string;
}

interface Interaction {
  id: string;
  prompt: string;
  manimCode?: string;
  summary?: string;
  stdout?: string;
  stderr?: string;
  videoPath?: string | null;
  isLoading?: boolean;
  error?: string;
}

// Props for ChatSidePanel
interface ChatSidePanelProps {
  onVideoSelect: (path: string | null) => void;
}

// Top user profile section
function UserProfile() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <p className="text-sm font-medium text-foreground">Krishna Rathore</p>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <PanelLeftClose className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

// Search bar section
function SearchBar() {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-muted py-2 pr-2 pl-4 h-[42px]">
      <div className="flex items-center gap-1">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Search for chats</span>
      </div>
    </div>
  );
}

// Style info box
function InfoBox({ prompt }: { prompt: string }) {
  return (
    <div className="flex items-center bg-muted rounded-[18px] px-4 py-2 ml-auto my-2 w-fit max-w-[80%]">
      <p className="text-xs text-muted-foreground text-left break-words">
        {prompt || "No prompt provided."}
      </p>
    </div>
  );
}

// ChatItem props
interface ChatItemProps {
  manimCode?: string;
  summary?: string;
  stdout?: string;
  stderr?: string;
  videoPath?: string | null;
  isLoading?: boolean;
  error?: string;
}

// Single chat item
function ChatItem({ manimCode, summary, stdout, stderr, videoPath, isLoading, error }: ChatItemProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex justify-between items-center h-5">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground" style={{ fontFamily: 'Pixelify Sans' }}>Manimator</p>
          <Separator orientation="vertical" className="h-4 bg-border" />
        </div>
      </div>

      <div className="flex flex-col pt-1 text-xs">
        {isLoading && (
          <div className="flex items-center gap-2 my-2 text-muted-foreground">
            <Sparkles className="h-4 w-4 animate-spin text-primary" />
            <p>Generating Manim code & video...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 px-3 py-2 rounded-md my-2">
            <p className="font-semibold text-sm mb-1">Error:</p>
            <p className="break-words text-xs">{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {summary && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 my-2">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary/70">Animation Summary</p>
                </div>
                <p className="text-sm text-foreground/90 italic leading-relaxed">
                  "{summary}"
                </p>
              </div>
            )}
            {manimCode && (
              <div className="my-1">
                <p className="text-xs font-semibold text-foreground mb-1">Manim Code:</p>
                <pre className="bg-muted/50 p-3 rounded-md overflow-x-auto text-xs border border-border">
                  <code className="font-mono whitespace-pre-wrap break-all text-foreground/80">{manimCode}</code>
                </pre>
              </div>
            )}
            {stdout && stdout.trim() && (
              <div className="my-1">
                <p className="text-xs font-semibold text-foreground mb-1">Output (stdout):</p>
                <pre className="bg-muted/50 p-3 rounded-md overflow-x-auto text-xs border border-border">
                  <code className="font-mono whitespace-pre-wrap break-all text-foreground/80">{stdout}</code>
                </pre>
              </div>
            )}
            {stderr && stderr.trim() && (
              <div className="my-1">
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">Logged Messages/Warnings (stderr):</p>
                <pre className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 p-3 rounded-md overflow-x-auto text-xs border border-amber-200 dark:border-amber-700">
                  <code className="font-mono whitespace-pre-wrap break-all">{stderr}</code>
                </pre>
              </div>
            )}
            {!manimCode && !(stdout && stdout.trim()) && !(stderr && stderr.trim()) && !videoPath && (
                <p className="italic text-muted-foreground">No Manim code, output, or video was generated for this prompt.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function PromptInput({ onSubmitPrompt }: { onSubmitPrompt: (text: string) => void }) {
    const [inputValue, setInputValue] = useState("");
    const handleSubmit = () => {
        if (inputValue.trim()) {
            onSubmitPrompt(inputValue);
            setInputValue("");
        }
    };
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };
    return (
      <div className="p-4 bg-background border-t border-border">
        <div className="flex flex-col bg-card border border-border rounded-lg p-3 shadow-sm">
          <div className="flex flex-col gap-3">
            <Input
              type="text"
              placeholder="What do you want to create or update?"
              className="w-full bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 border-0 placeholder:text-muted-foreground text-sm"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <div className="flex justify-between items-center">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="text-muted-foreground relative overflow-hidden group">
                  <Sparkles className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:animate-pulse group-hover:text-yellow-400" />
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                </Button>
                <Button variant="default" size="icon" className="h-8 w-8" onClick={handleSubmit} disabled={!inputValue.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default function ChatSidePanel({ onVideoSelect }: ChatSidePanelProps) {
  const location = useLocation();
  const initialPromptFromRouter = location.state?.prompt as string | undefined;

  const [interactions, setInteractions] = useState<Interaction[]>(() => {
    const initialInteractions: Interaction[] = [];
    if (initialPromptFromRouter) {
      initialInteractions.push({
        id: `initial-${Date.now()}`,
        prompt: initialPromptFromRouter,
        videoPath: null,
      });
    }
    return initialInteractions;
  });

  // Renamed from fetchManimCode to fetchAnimationData
  const fetchAnimationData = useCallback(async (
    interactionId: string,
    promptText: string,
    previousManimCode?: string,
    previousSummary?: string
  ) => {
    setInteractions(prev =>
      prev.map(item =>
        item.id === interactionId
        ? { ...item, isLoading: true, error: undefined, manimCode: undefined, stdout: undefined, stderr: undefined, videoPath: null }
        : item
      )
    );

    try {
      let url: string;
      const encodedPrompt = encodeURIComponent(promptText);

      if (previousManimCode) {
        // Use /update-animation endpoint
        const encodedManimCode = encodeURIComponent(previousManimCode);
        const encodedSummary = encodeURIComponent(previousSummary || "");
        url = `${API_BASE_URL}/update-animation?query=${encodedPrompt}&manim_code_input=${encodedManimCode}&summary=${encodedSummary}`;
        console.log("Calling /update-animation with:", { query: promptText, manim_code_input: previousManimCode, summary: previousSummary });
      } else {
        // Use /generate-animation endpoint for initial creation
        url = `${API_BASE_URL}/generate-animation?query=${encodedPrompt}`;
        console.log("Calling /generate-animation with:", { query: promptText });
      }

      const response = await fetch(url);

      if (!response.ok) {
        let errorMsg = `API Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.detail) {
            errorMsg = Array.isArray(errorData.detail)
              ? errorData.detail.map((d: any) => `${d.loc ? d.loc.join('.')+': ' : ''}${d.msg}`).join('; ')
              : typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
          }
        } catch (e) { console.warn("Could not parse error response as JSON:", e); }
        throw new Error(errorMsg);
      }

      const data: ApiResponse = await response.json();

      setInteractions(prevInteractions =>
        prevInteractions.map(interaction =>
          interaction.id === interactionId
            ? {
                ...interaction,
                manimCode: data.manim_code,
                summary: data.summary,
                stdout: data.stdout,
                stderr: data.stderr,
                videoPath: data.video_path,
                isLoading: false,
              }
            : interaction
        )
      );
      onVideoSelect(data.video_path);

    } catch (err: any) {
      console.error("Failed to fetch animation data:", err);
      setInteractions(prevInteractions =>
        prevInteractions.map(interaction =>
          interaction.id === interactionId
            ? { ...interaction, isLoading: false, error: err.message || "A network or unknown error occurred." }
            : interaction
        )
      );
      onVideoSelect(null);
    }
  }, [onVideoSelect]);

  useEffect(() => {
    const initialInteraction = interactions.find(
      i => i.id.startsWith('initial-') && i.prompt === initialPromptFromRouter
    );
    if (initialInteraction && !initialInteraction.manimCode && !initialInteraction.videoPath && !initialInteraction.isLoading && !initialInteraction.error) {
      // For initial prompt from router, always generate, so no previousManimCode
      fetchAnimationData(initialInteraction.id, initialInteraction.prompt);
    }
  }, [initialPromptFromRouter, interactions, fetchAnimationData]);


  const handleNewPromptSubmit = (promptText: string) => {
    if (promptText.trim()) {
      const newInteractionId = `user-${Date.now()}`;

      let previousManimCode: string | undefined = undefined;
      let previousSummary: string | undefined = undefined;
      // Find the manimCode and summary from the most recent successful interaction
      if (interactions.length > 0) {
        for (let i = interactions.length - 1; i >= 0; i--) {
          const lastInteraction = interactions[i];
          if (lastInteraction.manimCode && !lastInteraction.error) {
            previousManimCode = lastInteraction.manimCode;
            previousSummary = lastInteraction.summary;
            break;
          }
        }
      }

      setInteractions(prevInteractions => [
        ...prevInteractions,
        {
          id: newInteractionId,
          prompt: promptText,
          videoPath: null, // Initialize for the new interaction
        }
      ]);
      // Pass previousManimCode and previousSummary if available (for updates)
      fetchAnimationData(newInteractionId, promptText, previousManimCode, previousSummary);
    }
  };

  return (
    <div className="flex flex-col md:w-[369px] w-full h-screen bg-background text-foreground overflow-hidden">
      <div className="p-4 space-y-3 overflow-y-auto flex-1">
        <div className="flex flex-col gap-4 sticky top-0 bg-background z-10 pt-0 pb-2 -mx-4 px-4 border-b border-border mb-2">
          <UserProfile />
          <SearchBar />
        </div>
        <div className="pt-2">
          {interactions.map(interaction => (
            <React.Fragment key={interaction.id}>
              <InfoBox prompt={interaction.prompt} />
              <div className="mt-2 mb-4">
                <ChatItem
                  isLoading={interaction.isLoading}
                  manimCode={interaction.manimCode}
                  summary={interaction.summary}
                  stdout={interaction.stdout}
                  stderr={interaction.stderr}
                  videoPath={interaction.videoPath}
                  error={interaction.error}
                />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <PromptInput onSubmitPrompt={handleNewPromptSubmit} />
    </div>
  );
}