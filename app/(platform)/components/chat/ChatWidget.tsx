'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: number;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Charger les messages depuis le localStorage au démarrage
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Erreur lors du chargement des messages:', error);
        // Réinitialiser si erreur
        setMessages([{
          id: 'welcome',
          content: "Bonjour ! Comment puis-je vous aider avec votre budget ?",
          isUser: false,
          timestamp: Date.now()
        }]);
      }
    } else {
      // Message de bienvenue initial
      setMessages([{
        id: 'welcome',
        content: "Bonjour ! Comment puis-je vous aider avec votre budget ?",
        isUser: false,
        timestamp: Date.now()
      }]);
    }
  }, []);

  // Sauvegarder les messages dans le localStorage à chaque modification
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll automatique vers le dernier message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Gérer la fermeture avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    // Ajouter le message de l'utilisateur
    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      content: userMessage,
      isUser: true,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.response) {
        throw new Error('Réponse invalide du serveur');
      }

      // Ajouter la réponse de l'assistant
      setMessages(prev => [...prev, {
        id: `assistant-${Date.now()}`,
        content: data.response,
        isUser: false,
        timestamp: Date.now()
      }]);
    } catch (error) {
      console.error('Erreur:', error);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
        isUser: false,
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm('Voulez-vous vraiment effacer tout l\'historique de la conversation ?')) {
      setMessages([{
        id: 'welcome',
        content: "Bonjour ! Comment puis-je vous aider avec votre budget ?",
        isUser: false,
        timestamp: Date.now()
      }]);
      localStorage.removeItem('chatMessages');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-2xl w-[350px] h-[500px] flex flex-col backdrop-blur-sm">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/90 rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <h3 className="font-semibold text-white">Assistant Budget AI</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="text-slate-400 hover:text-white transition-colors p-1"
                title="Effacer la conversation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          <div 
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 ${
                  message.isUser ? 'ml-auto max-w-[80%]' : 'mr-auto max-w-[80%]'
                }`}
              >
                <div
                  className={`rounded-lg p-3 ${
                    message.isUser
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800/50 backdrop-blur-sm text-slate-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                </div>
                <div className="text-xs text-slate-500 mt-1 px-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            {isLoading && (
              <div className="flex justify-center items-center text-slate-400 text-sm mt-2">
                <div className="animate-pulse">Assistant en train d&apos;écrire...</div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-slate-800 bg-slate-900/90">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1 px-3 py-2 bg-slate-800 border-none text-white placeholder-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-emerald-500 text-white p-2 rounded-md hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-500 text-white p-3 rounded-full shadow-lg hover:bg-emerald-600 transition-colors"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
} 