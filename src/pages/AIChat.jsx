import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/context/AuthContext';
import { 
  Send, 
  Bot, 
  User, 
  Plus, 
  Trash2, 
  Menu,
  X,
  Edit3,
  Check,
} from 'lucide-react';

const AIChat = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState(1);
  const [editingConversationId, setEditingConversationId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const messagesEndRef = useRef(null);

  // Sample conversations data
  const [conversations, setConversations] = useState([
    {
      id: 1,
      title: 'Tư vấn ngành CNTT',
      lastMessage: 'Trường nào có ngành CNTT tốt nhất?',
      timestamp: new Date(),
      messageCount: 5
    },
    {
      id: 2,
      title: 'Điểm chuẩn các trường Y',
      lastMessage: 'Điểm chuẩn năm nay thế nào?',
      timestamp: new Date(Date.now() - 86400000),
      messageCount: 3
    },
    {
      id: 3,
      title: 'Học phí trường tư thục',
      lastMessage: 'Học phí khoảng bao nhiều?',
      timestamp: new Date(Date.now() - 172800000),
      messageCount: 8
    }
  ]);

  // Sample messages for active conversation
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

    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId 
        ? { ...conv, lastMessage: inputValue, timestamp: new Date(), messageCount: conv.messageCount + 1 }
        : conv
    ));

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

  const createNewConversation = () => {
    const newConv = {
      id: Date.now(),
      title: 'Cuộc trò chuyện mới',
      lastMessage: '',
      timestamp: new Date(),
      messageCount: 0
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setMessages([{
      id: 1,
      type: 'bot',
      content: `Xin chào ${user?.displayName || 'bạn'}! Tôi là trợ lý AI hỗ trợ tư vấn tuyển sinh đại học. Bạn muốn tìm hiểu điều gì?`,
      timestamp: new Date()
    }]);
  };

  const deleteConversation = (convId) => {
    setConversations(prev => prev.filter(conv => conv.id !== convId));
    if (convId === activeConversationId && conversations.length > 1) {
      const remainingConvs = conversations.filter(conv => conv.id !== convId);
      setActiveConversationId(remainingConvs[0].id);
    }
    setConversationToDelete(null);
  };

  const confirmDeleteConversation = (conv) => {
    setConversationToDelete(conv);
  };

  const startEditingTitle = (conv) => {
    setEditingConversationId(conv.id);
    setEditingTitle(conv.title);
  };

  const saveTitle = () => {
    setConversations(prev => prev.map(conv => 
      conv.id === editingConversationId 
        ? { ...conv, title: editingTitle }
        : conv
    ));
    setEditingConversationId(null);
    setEditingTitle('');
  };

  const quickQuestions = [
    "Trường nào có ngành CNTT tốt nhất?",
    "Điểm chuẩn các trường y khoa",
    "Học phí trường tư thục bao nhiều?",
    "Học bổng cho sinh viên giỏi"
  ];

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hôm nay';
    if (days === 1) return 'Hôm qua';
    if (days < 7) return `${days} ngày trước`;
    return timestamp.toLocaleDateString('vi-VN');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col overflow-hidden`}>
        {/* Sidebar Header */}
        <div className="flex justify-between p-4 border-gray-200">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-lg font-semibold">Trợ lý AI</span>
          </div>
          <Button
            onClick={createNewConversation}
            className="w-8 flex bg-white shadow-none hover:bg-gray-100 transition-all duration-300"
          >
            <Plus className="h-4 w-4 text-black" />
          </Button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                  conversation.id === activeConversationId 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setActiveConversationId(conversation.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {editingConversationId === conversation.id ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="h-6 text-sm"
                          onKeyPress={(e) => e.key === 'Enter' && saveTitle()}
                          autoFocus
                        />
                        <Button size="sm" variant="ghost" onClick={saveTitle}>
                          <Check className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <h3 className="font-medium text-sm truncate">
                        {conversation.title}
                      </h3>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-gray-400">
                        {formatTimestamp(conversation.timestamp)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {conversation.messageCount} tin nhắn
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditingTitle(conversation);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDeleteConversation(conversation);
                        }}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <h1 className="text-lg font-semibold">Trợ lý AI Tuyển sinh</h1>
            </div>
            <div className="flex items-center ml-auto">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-500">Online</span>
            </div>
          </div>
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="p-4 bg-white border-b">
            <div className="flex flex-wrap gap-2">
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
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
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
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8 bg-gray-100">
                  <AvatarFallback>
                    <Bot className="h-4 w-4 text-gray-600" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white border border-gray-200 p-3 rounded-lg">
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
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập câu hỏi của bạn..."
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputValue.trim() || isTyping}
                className="px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!conversationToDelete} onOpenChange={(open) => !open && setConversationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa cuộc trò chuyện</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa cuộc trò chuyện "{conversationToDelete?.title}" không? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteConversation(conversationToDelete?.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AIChat; 