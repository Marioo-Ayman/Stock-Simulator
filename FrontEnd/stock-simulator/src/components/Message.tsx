import React from 'react';
import { useAppSelector } from '../store/hooks';

const Message: React.FC = () => {
  const { message } = useAppSelector((state) => state.ui);

  if (!message) return null;

  return (
    <div className="container mx-auto px-4 mt-4 animate-slideDown">
      <div
        className={`max-w-4xl mx-auto rounded-lg px-6 py-4 text-center font-medium shadow-md ${
          message.type === 'success'
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-red-100 text-red-800 border border-red-300'
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};

export default Message;
