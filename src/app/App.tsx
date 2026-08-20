// src/app/App.tsx
import { useState, useEffect } from "react";
import { WelcomeAnimation } from "./components/WelcomeAnimation";
import { ChatSidebar } from "./components/ChatSidebar";
import { MobileSidebar } from "./components/MobileSidebar";
import { ChatPanel } from "./components/ChatPanel";
import { TourGuide } from "./components/Tourguide";
import { FoxyAlert } from "./components/FoxyAlert"; // <-- Importar
import { useN8nChat } from "../hooks/useN8nChat";
import { createNewChat } from "../models/chat.model";
import { InstallPWA } from '@/app/components/InstallPWA';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showAlert, setShowAlert] = useState(true); // <-- Nuevo estado

  const {
    chats, activeChat, setActiveChat,
    createChat, deleteChat,
    sendMessage, isTyping, activeMessages,
  } = useN8nChat([createNewChat()]);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  // Efecto para ocultar la alerta después de un tiempo (por si el usuario no cierra)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 15000); // 15 segundos

    return () => clearTimeout(timer);
  }, []);

  if (showWelcome) {
    return <WelcomeAnimation onComplete={() => setShowWelcome(false)} />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        onChatSelect={setActiveChat}
        onNewChat={createChat}
        onDeleteChat={deleteChat}
        isDark={isDark}
        onThemeToggle={() => setIsDark(!isDark)}
        onHelpClick={() => { setShowTour(false); setTimeout(() => setShowTour(true), 50); }}
      />
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        chats={chats}
        activeChat={activeChat}
        onChatSelect={setActiveChat}
        onNewChat={createChat}
        onDeleteChat={deleteChat}
        isDark={isDark}
        onThemeToggle={() => setIsDark(!isDark)}
        onHelpClick={() => { setShowTour(false); setTimeout(() => setShowTour(true), 50); }}
        tourActive={showTour}
      />
      <ChatPanel
        key={activeChat}
        chatId={activeChat}
        messages={activeMessages}
        isTyping={isTyping}
        onSend={sendMessage}
        onMenuClick={() => setIsMobileMenuOpen(true)}
      />

      {/* Tour — controla la sidebar mobile internamente */}
      <TourGuide
        forceOpen={showTour}
        onClose={() => setShowTour(false)}
        onMobileSidebarChange={setIsMobileMenuOpen}
      />

      {/* Alerta de Foxy - solo si showAlert es true */}
      {showAlert && (
        <FoxyAlert
          message="¡Ya está disponible la guía visual de 360! Puedes hacerme preguntas sobre la exploración del ecosistema 360"
          duration={15}
          onClose={() => setShowAlert(false)}
        />
      )}

      {/* PWA Install Prompt */}
      <InstallPWA />
    </div>
  );
}