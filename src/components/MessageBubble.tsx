import React from 'react';
import { Message, Role } from '../types';
import { ICONS } from '../constants';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  // Simple formatter to handle bolding and basic spacing from Markdown
  const formatContent = (content: string) => {
    // Basic Markdown bold parsing (**text**)
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-ayur-dark font-bold">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mt-1 shadow-sm ${
            isUser 
            ? 'ml-3 bg-ayur-dark text-white' 
            : 'mr-3 bg-ayur-dark text-white'
        }`}>
          {isUser ? <ICONS.User /> : <ICONS.User />}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}>
            <div className={`px-5 py-4 text-base leading-relaxed shadow-sm ${
                isUser 
                ? 'bg-[#f0eadd] text-ayur-text rounded-2xl rounded-tr-none border border-[#e8dfcf]' 
                : 'bg-ayur-card text-ayur-text rounded-2xl rounded-tl-none border border-[#e8e4dc] shadow-sm'
            }`}>
                <div className="whitespace-pre-wrap text-gray-800">
                    {formatContent(message.content)}
                </div>
                {message.isStreaming && (
                    <span className="inline-block w-2 h-4 ml-1 align-middle bg-ayur-leaf animate-pulse"></span>
                )}
            </div>
            
            {/* Timestamp / Action Icons (mocked from image) */}
            <div className={`mt-1 flex items-center space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                 {/* Only show "Read" or extra icons for AI messages to match look if desired, keeping it simple for now */}
            </div>
        </div>
        
        {/* Context Icon (Right side for AI) */}
        {!isUser && (
            <div className="ml-3 mt-4 h-8 w-8 rounded-full bg-ayur-leaf text-white flex items-center justify-center shadow-md">
                <ICONS.Leaf />
            </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;