import React, { useState, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface GameChatProps {
  gameId: string;
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  type: 'user' | 'system' | 'bet' | 'aid';
}

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    user: 'System',
    message: 'Game started! Welcome to Neon Cityscape',
    timestamp: new Date(Date.now() - 600000),
    type: 'system',
  },
  {
    id: '2',
    user: 'ViewerOne',
    message: 'CyberSamurai looking strong early!',
    timestamp: new Date(Date.now() - 480000),
    type: 'user',
  },
  {
    id: '3',
    user: 'BettingBot',
    message: 'SpectatorX placed 100 coins on NeonWarrior',
    timestamp: new Date(Date.now() - 420000),
    type: 'bet',
  },
  {
    id: '4',
    user: 'CyberFan99',
    message: 'That was an insane dodge!',
    timestamp: new Date(Date.now() - 360000),
    type: 'user',
  },
  {
    id: '5',
    user: 'AidBot',
    message: 'QuantumSupporter sent Health Pack to QuantumHunter',
    timestamp: new Date(Date.now() - 300000),
    type: 'aid',
  },
  {
    id: '6',
    user: 'GameMaster',
    message: 'VoidRider eliminated! 3 players remaining',
    timestamp: new Date(Date.now() - 240000),
    type: 'system',
  },
];

const GameChat = ({ gameId }: GameChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');

  // Simulate new messages
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessages = [
        'QuantumHunter is making a comeback!',
        'This is getting intense!',
        'Who do you think will win?',
        'Amazing gameplay so far',
        'CyberSamurai with the lead!',
      ];

      const randomUsers = ['ViewerX', 'GameFan', 'CyberWatcher', 'NeonLover', 'BattleObserver'];

      if (Math.random() > 0.7) {
        const newMsg: ChatMessage = {
          id: Date.now().toString(),
          user: randomUsers[Math.floor(Math.random() * randomUsers.length)],
          message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
          timestamp: new Date(),
          type: 'user',
        };

        setMessages(prev => [...prev, newMsg]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      user: 'You',
      message: newMessage,
      timestamp: new Date(),
      type: 'user',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const getMessageStyle = (type: string) => {
    switch (type) {
      case 'system':
        return 'text-yellow-400 font-medium';
      case 'bet':
        return 'text-green-400';
      case 'aid':
        return 'text-blue-400';
      default:
        return 'text-foreground';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Live Chat
          <Badge variant="outline" className="ml-auto">
            {messages.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Messages */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className="group">
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-xs text-muted-foreground min-w-fit">
                    {formatTime(message.timestamp)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className={`font-medium ${getMessageStyle(message.type)}`}>
                      {message.user}:{' '}
                    </span>
                    <span className="break-words">
                      {message.message}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            disabled={!newMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Chat Rules */}
        <div className="text-xs text-muted-foreground border-t pt-2">
          <p>Be respectful • No spam • Keep it game-related</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameChat;