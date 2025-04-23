
import React from 'react';
import { Message } from './GeminiChat';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GeminiMessageItemProps {
  message: Message;
}

const GeminiMessageItem: React.FC<GeminiMessageItemProps> = ({ message }) => {
  // Function to format the message content with proper line breaks
  const formatMessageContent = (content: string) => {
    // Replace normal line breaks with HTML breaks for rendering
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          message.sender === 'user' 
            ? 'bg-purple-600 text-white rounded-br-none' 
            : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{formatMessageContent(message.content)}</p>
        
        <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-purple-200' : 'text-gray-400'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default GeminiMessageItem;
