import React, { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Button from './components/Button';
import ChatInterface from './components/ChatInterface';
import Input from './components/Input';
import Sidebar from './components/Sidebar';
import { ICONS } from './constants';
import { GeminiService } from './services/geminiService';
import { AuthState, ChatState, Conversation, Message, Role } from './types';

const App: React.FC = () => {
  // --- Auth State ---
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('nebula_auth');
    return saved ? JSON.parse(saved) : { user: null, isAuthenticated: false };
  });

  const [nameInput, setNameInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // --- Chat State ---
  const [chatState, setChatState] = useState<ChatState>(() => {
    const saved = localStorage.getItem('nebula_chats');
    return saved
      ? JSON.parse(saved)
      : { conversations: [], activeConversationId: null, isTyping: false };
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [gemini, setGemini] = useState<GeminiService | null>(null);

  // --- Persistence Effects ---
  useEffect(() => {
    localStorage.setItem('nebula_auth', JSON.stringify(auth));
    if (auth.isAuthenticated) {
      setGemini(new GeminiService(auth.user?.name || 'User'));
    }
  }, [auth]);

  useEffect(() => {
    localStorage.setItem('nebula_chats', JSON.stringify(chatState));
  }, [chatState]);

  // --- Handlers ---

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!nameInput.trim()) {
      setLoginError('Display Name is required.');
      return;
    }
    // Simple mock auth
    const user = {
      id: uuidv4(),
      name: nameInput,
    };
    setAuth({ user, isAuthenticated: true });

    // Create first chat if none
    if (chatState.conversations.length === 0) {
      createNewChat();
    }
  };

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
    setChatState({ ...chatState, activeConversationId: null });
  };

  const createNewChat = useCallback(() => {
    const newChat: Conversation = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setChatState(prev => ({
      ...prev,
      conversations: [...prev.conversations, newChat],
      activeConversationId: newChat.id,
    }));
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, []);

  const deleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatState(prev => {
      const newConvs = prev.conversations.filter(c => c.id !== id);
      return {
        ...prev,
        conversations: newConvs,
        activeConversationId:
          prev.activeConversationId === id
            ? newConvs.length > 0
              ? newConvs[newConvs.length - 1].id
              : null
            : prev.activeConversationId,
      };
    });
  };

  const handleSendMessage = async (text: string) => {
    if (!gemini || !chatState.activeConversationId) return;

    const currentChatId = chatState.activeConversationId;

    // 1. Add User Message
    const userMsg: Message = {
      id: uuidv4(),
      role: Role.USER,
      content: text,
      timestamp: Date.now(),
    };

    setChatState(prev => {
      const updatedConvs = prev.conversations.map(c => {
        if (c.id === currentChatId) {
          return { ...c, messages: [...c.messages, userMsg], updatedAt: Date.now() };
        }
        return c;
      });
      return { ...prev, conversations: updatedConvs, isTyping: true };
    });

    try {
      // 2. Prepare for AI Response
      const aiMsgId = uuidv4();
      const placeholderAiMsg: Message = {
        id: aiMsgId,
        role: Role.MODEL,
        content: '',
        timestamp: Date.now(),
        isStreaming: true,
      };

      setChatState(prev => ({
        ...prev,
        conversations: prev.conversations.map(c =>
          c.id === currentChatId ? { ...c, messages: [...c.messages, placeholderAiMsg] } : c
        ),
      }));

      // 3. Get History for context
      const currentConversation = chatState.conversations.find(c => c.id === currentChatId);
      const history = currentConversation ? currentConversation.messages : [];
      const effectiveHistory = [...history, userMsg];

      // 4. Stream Response
      const stream = await gemini.streamChat(effectiveHistory, text);

      let accumulatedText = '';

      for await (const chunk of stream) {
        accumulatedText += chunk;
        setChatState(prev => ({
          ...prev,
          conversations: prev.conversations.map(c => {
            if (c.id === currentChatId) {
              const newMessages = c.messages.map(m =>
                m.id === aiMsgId ? { ...m, content: accumulatedText } : m
              );
              return { ...c, messages: newMessages };
            }
            return c;
          }),
        }));
      }

      // 5. Finalize
      setChatState(prev => ({
        ...prev,
        isTyping: false,
        conversations: prev.conversations.map(c => {
          if (c.id === currentChatId) {
            const newMessages = c.messages.map(m =>
              m.id === aiMsgId ? { ...m, isStreaming: false } : m
            );
            return { ...c, messages: newMessages };
          }
          return c;
        }),
      }));

      // Title generation omitted for visual similarity consistency - focusing on the single session flow
    } catch (error) {
      console.error('Chat error', error);
      setChatState(prev => {
        return { ...prev, isTyping: false };
      });
      alert('Failed to generate response. Please check your configuration.');
    }
  };

  // --- Render Login ---
  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-ayur-bg flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-ayur-dark to-ayur-leaf"></div>
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-ayur-dark rounded-full shadow-lg text-white">
              <ICONS.Sparkles />
            </div>
          </div>
          <h2 className="text-3xl font-serif font-bold text-center text-ayur-dark mb-2">
            Ayurvedic Assistant
          </h2>
          <p className="text-center text-gray-500 mb-8 font-sans">
            Begin your journey to balanced health.
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Patient Name"
              placeholder="e.g. Rajesh Verma"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
            />

            {loginError && (
              <div className="bg-red-50 text-red-600 border border-red-100 rounded-lg p-3 text-sm text-center">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 text-lg bg-ayur-dark hover:bg-ayur-green text-white font-serif rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Enter Consultation
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Render Chat App ---
  const activeConversation = chatState.conversations.find(
    c => c.id === chatState.activeConversationId
  );

  return (
    <div className="flex h-screen overflow-hidden bg-ayur-bg font-sans">
      <Sidebar onLogout={handleLogout} isOpen={isSidebarOpen} userName={auth.user?.name} />

      <div className="flex-1 flex flex-col min-w-0 relative bg-ayur-bg">
        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="absolute inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {activeConversation ? (
          <ChatInterface
            messages={activeConversation.messages}
            onSendMessage={handleSendMessage}
            isTyping={chatState.isTyping}
            onToggleSidebar={() => setIsSidebarOpen(true)}
            userName={auth.user?.name}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Button onClick={createNewChat}>Start Consultation</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
