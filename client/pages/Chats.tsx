import MainLayout from "@/components/MainLayout";
import { MessageCircle } from "lucide-react";

export default function Chats() {
  return (
    <MainLayout>
      <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8 h-96 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Messages</h1>
          <p className="text-muted-foreground">
            This page is ready for you to customize! Prompt us to add the
            content you want here.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
