import React, { useEffect, useRef, useState } from 'react';
import { ICONS } from '../constants';
import { Message } from '../types';
import MessageBubble from './MessageBubble';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
  onToggleSidebar: () => void;
  userName?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isTyping,
  onToggleSidebar,
  userName = 'User',
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    onSendMessage(input.trim());
    setInput('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-ayur-bg relative font-sans">
      {/* Header */}
      <div className="h-16 bg-gradient-to-r from-ayur-dark to-ayur-green shadow-md flex items-center justify-between px-6 z-10">
        <div className="flex items-center">
          <button onClick={onToggleSidebar} className="md:hidden text-white mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <h1 className="text-white font-serif text-lg tracking-wide hidden sm:block">
            Ayurvedic AI Health Assistant
          </h1>
          <h1 className="text-white font-serif text-lg tracking-wide sm:hidden">
            Ayurvedic Assistant
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-[10px] text-green-200 uppercase tracking-widest">
              Supervising Dr.
            </span>
            <span className="text-sm font-semibold text-white leading-none">Kavita Sharma</span>
            <span className="text-[10px] text-white/70">Ayurvedic Specialist</span>
          </div>
          <div className="h-10 w-10 bg-white rounded-full overflow-hidden border-2 border-green-300">
            <img
              src="https://ui-avatars.com/api/?name=Kavita+Sharma&background=random"
              alt="Doctor"
              className="h-full w-full object-cover"
            />
          </div>
          <button className="text-green-100 hover:text-white">
            <ICONS.Bell />
          </button>
          <button className="text-green-100 hover:text-white">
            <ICONS.Settings />
          </button>
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-ayur-card border-b border-ayur-dark/5 py-2 px-4 text-center">
        <p className="text-xs text-gray-500">
          You are chatting about a{' '}
          <strong className="text-gray-700">doctor-approved Ayurvedic plan</strong>. This chat does
          not replace medical consultation.
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
            <div className="w-16 h-16 bg-ayur-leaf/20 rounded-full flex items-center justify-center mb-4 text-ayur-dark">
              <ICONS.Sparkles />
            </div>
            <h3 className="text-2xl font-serif text-ayur-dark mb-2">Namaste, {userName}.</h3>
            <p className="text-gray-600 max-w-md">
              I am here to guide you through your Pitta balancing plan. Ask me about your diet,
              herbs, or therapy.
            </p>
          </div>
        ) : (
          messages.map(msg => <MessageBubble key={msg.id} message={msg} />)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-ayur-bg border-t border-ayur-dark/10">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="relative bg-white rounded-2xl shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-ayur-leaf/50 focus-within:border-ayur-leaf transition-all"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full bg-transparent text-ayur-text rounded-2xl pl-4 pr-14 py-4 focus:outline-none resize-none overflow-hidden max-h-[150px]"
              rows={1}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className={`absolute right-2 bottom-2 p-2 rounded-xl transition-all ${
                input.trim() && !isTyping
                  ? 'bg-ayur-dark text-white hover:bg-ayur-green shadow-md'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              {isTyping ? (
                <svg
                  className="animate-spin h-5 w-5 text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <ICONS.Send />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
