"use client";
// Prompt input section
import { Input } from "@/components/ui/input";
import { useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  PanelLeftClose,
  Search,
  CommandIcon,
  Paperclip,
  Sparkles,
  Send,
  MoreHorizontal,
} from "lucide-react";

// Top user profile section
function UserProfile() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://github.com/shadcn.png" alt="Mauro Sicard" />
          <AvatarFallback>MS</AvatarFallback>
        </Avatar>
        <p className="text-sm font-medium text-foreground">Krishna Rathore</p>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon">
          <Settings className="h-8 w-8" />
        </Button>
        <Button variant="ghost" size="icon">
          <PanelLeftClose className="h-8 w-8" />
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
function InfoBox() {
  const location = useLocation();
  const initialPrompt = location.state?.prompt ?? "";
  return (
    <div className="flex justify-center items-center bg-muted rounded-[18px] px-4 py-2 h-[96px] w-4/5 ml-auto">
      <p className="text-xs text-muted-foreground text-left w-full">
        {initialPrompt}
      </p>
    </div>
  );
}

// Single chat item
function ChatItem() {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex justify-between items-center h-5">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">Manimator</p>
          <Separator orientation="vertical" className="h-4 bg-border" />
          <p className="text-xs font-medium text-muted-foreground">2:46 PM</p>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>

      <div className="flex flex-col pt-1 text-xs text-muted-foreground">
        <p>Dolor sit ame consectur</p>
        <p className="pt-1">
          Quis faucibus massa sit egestas sit fermentum<br />
          Cras mi purus viverra vitae felis sit amet tincidunt fringi<br />
          Non mattis urna ex nec sem donec varius<br />
          Morbi fringilla molestie magna sed dictum praesent<br />
          Quisque euismod posuere lacus sit
        </p>
        <p className="pt-1">Dolor sit ame consectur</p>
      </div>
    </div>
  );
}



export function PromptInput() {
    return (
      <div className="p-4 bg-background">
        <div className="flex flex-col bg-card border border-border rounded-lg p-3 shadow-sm">
          <div className="flex flex-col gap-3">
            <Input
              type="text"
              placeholder="What do you want to create?"
              className="w-full bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 border-0 placeholder:text-muted-foreground text-sm"
            />
            <div className="flex justify-between items-center">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground relative overflow-hidden group"
                >
                  <Sparkles className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:animate-pulse group-hover:text-yellow-400" />
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                </Button>
                <Button variant="default" size="icon" className="h-8 w-8">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


export default function ChatSidePanel() {
  return (
    <div className="flex flex-col md:w-[369px] w-full h-screen bg-background text-foreground overflow-hidden">
      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        <div className="flex flex-col gap-4">
          <UserProfile />
          <SearchBar />
        </div>
        <InfoBox />
        <div className="flex flex-col gap-[11px]">
          <ChatItem />
        </div>
      </div>
      <PromptInput />
    </div>
  );
}
