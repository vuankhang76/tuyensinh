import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { MessageCircle, Send, Bot, User, Sparkles } from 'lucide-react';

const AIChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Xin chào ${user?.displayName || 'bạn'}! Tôi là trợ lý AI hỗ trợ tư vấn tuyển sinh đại học. Bạn có thể hỏi tôi về:
      
• Thông tin các trường đại học
• Ngành học và điểm chuẩn
• Học phí và học bổng
• Chương trình đào tạo
• Quy trình tuyển sinh

Bạn muốn tìm hiểu điều gì?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const mockAIResponses = [
    "Đó là một câu hỏi hay! Dựa trên thông tin hiện tại, tôi có thể chia sẻ rằng...",
    "Theo dữ liệu mới nhất từ các trường đại học, điểm chuẩn năm nay có xu hướng...",
    "Về vấn đề này, tôi khuyên bạn nên xem xét các yếu tố sau...",
    "Thông tin về học phí và học bổng hiện tại cho thấy...",
    "Dựa trên sở thích và năng lực của bạn, tôi gợi ý một số trường phù hợp..."
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const randomResponse = mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)];
      const aiMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: randomResponse + " Bạn có muốn tôi giải thích chi tiết hơn không?",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "Trường nào có ngành CNTT tốt nhất?",
    "Điểm chuẩn các trường y khoa",
    "Học phí trường tư thục bao nhiều?",
    "Học bổng cho sinh viên giỏi"
  ];

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-full">
            <MessageCircle className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Trợ lý AI Tuyển sinh</h1>
            <p className="text-gray-600">Hỗ trợ tư vấn thông tin đại học 24/7</p>
          </div>
        </div>
        
        {/* Quick Questions */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-sm text-gray-500 mr-2">Câu hỏi gợi ý:</span>
          {quickQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setInputValue(question)}
              className="text-xs"
            >
              {question}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <Card className="h-[500px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <span>Chat với AI</span>
            <div className="flex items-center ml-auto">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-500">Online</span>
            </div>
          </CardTitle>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Avatar className={`h-8 w-8 ${message.type === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <AvatarFallback>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Bot className="h-4 w-4 text-gray-600" />
                    )}
                  </AvatarFallback>
                </Avatar>
                
                <div
                  className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <span className={`text-xs mt-1 block ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <Avatar className="h-8 w-8 bg-gray-100">
                  <AvatarFallback>
                    <Bot className="h-4 w-4 text-gray-600" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Nhấn Enter để gửi tin nhắn • AI có thể có những thông tin không chính xác
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AIChat; 