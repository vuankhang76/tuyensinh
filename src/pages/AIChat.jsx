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
import { chatService } from '@/services/chatService';
import { toast } from 'sonner';

const AIChat = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [editingConversationId, setEditingConversationId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history khi component mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Load messages khi chuyển conversation
  useEffect(() => {
    if (activeConversationId) {
      loadChatSession(activeConversationId);
    }
  }, [activeConversationId]);

  const loadChatHistory = async () => {
    try {
      setLoading(true);
      const history = await chatService.getChatHistory();
      setConversations(history);
      
      // Nếu có conversation, chọn conversation đầu tiên
      if (history.length > 0) {
        setActiveConversationId(history[0].id);
      } else {
        // Nếu không có conversation nào, tạo welcome message
        setMessages([{
          id: 'welcome',
          sender: 'Assistant',
          message: `Xin chào ${user?.displayName || 'bạn'}! Tôi là trợ lý AI hỗ trợ tư vấn tuyển sinh đại học. Bạn có thể hỏi tôi về:

• Thông tin các trường đại học
• Ngành học và điểm chuẩn
• Học phí và học bổng
• Chương trình đào tạo
• Quy trình tuyển sinh

Bạn muốn tìm hiểu điều gì?`,
          sentAt: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast.error('Không thể tải lịch sử chat');
    } finally {
      setLoading(false);
    }
  };

  const loadChatSession = async (sessionId) => {
    try {
      const session = await chatService.getChatSession(sessionId);
      setMessages(session.messages || []);
    } catch (error) {
      console.error('Error loading chat session:', error);
      toast.error('Không thể tải cuộc trò chuyện');
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      sender: 'User',
      message: inputValue,
      sentAt: new Date().toISOString()
    };

    // Thêm tin nhắn user vào UI ngay lập tức
    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Gửi tin nhắn đến backend
      const response = await chatService.sendMessage(currentMessage, activeConversationId);
      
      // Thêm phản hồi AI vào UI
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'Assistant',
        message: response.botResponse,
        sentAt: response.timestamp
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Cập nhật sessionId nếu là tin nhắn đầu tiên
      if (!activeConversationId) {
        setActiveConversationId(response.sessionId);
        // Load lại conversations để cập nhật sidebar
        const history = await chatService.getChatHistory();
        setConversations(history);
      } else {
        // Chỉ cập nhật conversation hiện tại trong sidebar
        setConversations(prev => prev.map(conv => 
          conv.id === activeConversationId 
            ? { ...conv, messages: [...conv.messages, userMessage, aiMessage] }
            : conv
        ));
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Không thể gửi tin nhắn');
      // Remove user message if failed
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const createNewConversation = async () => {
    try {
      // Reset để tạo session mới
      setActiveConversationId(null);
      setMessages([{
        id: 'welcome',
        sender: 'Assistant',
        message: `Xin chào ${user?.displayName || 'bạn'}! Tôi là trợ lý AI hỗ trợ tư vấn tuyển sinh đại học. Bạn muốn tìm hiểu điều gì?`,
        sentAt: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Error creating new conversation:', error);
      toast.error('Không thể tạo cuộc trò chuyện mới');
    }
  };

  const deleteConversation = async (convId) => {
    try {
      await chatService.deleteChatSession(convId);
      
      // Cập nhật conversations
      const updatedConversations = conversations.filter(conv => conv.id !== convId);
      setConversations(updatedConversations);
      
      // Nếu xóa conversation đang active, chọn conversation khác
      if (convId === activeConversationId) {
        if (updatedConversations.length > 0) {
          setActiveConversationId(updatedConversations[0].id);
        } else {
          await createNewConversation();
        }
      }
      
      toast.success('Đã xóa cuộc trò chuyện');
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error('Không thể xóa cuộc trò chuyện');
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

  const saveTitle = async () => {
    try {
      // Gọi API để cập nhật title
      await chatService.updateSessionTitle(editingConversationId, editingTitle);
      
      // Cập nhật title trong state local
      setConversations(prev => prev.map(conv => 
        conv.id === editingConversationId 
          ? { ...conv, title: editingTitle }
          : conv
      ));
      
      toast.success('Đã cập nhật tiêu đề');
    } catch (error) {
      console.error('Error updating title:', error);
      toast.error('Không thể cập nhật tiêu đề');
    }
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
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hôm nay';
    if (days === 1) return 'Hôm qua';
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

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
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {formatTimestamp(conversation.startedAt)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditingTitle(conversation);
                      }}
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
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
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
        {messages.length <= 1 && (
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
              className={`flex ${message.sender === 'User' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[80%] ${message.sender === 'User' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Avatar className={`h-8 w-8 ${message.sender === 'User' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <AvatarFallback>
                    {message.sender === 'User' ? (
                      <User className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Bot className="h-4 w-4 text-gray-600" />
                    )}
                  </AvatarFallback>
                </Avatar>
                
                <div
                  className={`p-3 rounded-lg ${
                    message.sender === 'User'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.message}</p>
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