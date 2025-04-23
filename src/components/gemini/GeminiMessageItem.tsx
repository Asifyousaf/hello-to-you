
import React from 'react';
import { User, Bot, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Message } from './GeminiChat';

interface GeminiMessageItemProps {
  message: Message;
}

const GeminiMessageItem: React.FC<GeminiMessageItemProps> = ({ message }) => {
  // Format message content as array of React elements
  const formatMessageContent = (content: string) => {
    if (!content) return [];
    
    return content.split('\n').map((line, i) => {
      if (!line.trim()) return <React.Fragment key={i}>&nbsp;</React.Fragment>;
      return <React.Fragment key={i}>{line}<br /></React.Fragment>;
    });
  };

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative flex items-start gap-2 max-w-[90%] group ${
          message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <div 
          className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center
            ${message.sender === 'user' ? 'bg-purple-100 text-purple-700 ml-2' : 'bg-blue-100 text-blue-700 mr-2'}
          `}
        >
          {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>
        
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`relative px-4 py-2 rounded-lg ${
              message.sender === 'user'
                ? 'bg-purple-600 text-white rounded-tr-none'
                : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
            }`}
          >
            <div className="text-sm whitespace-pre-wrap">
              {formatMessageContent(message.content)}
            </div>
            <div className="text-[10px] opacity-70 mt-1 text-right">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GeminiMessageItem;
