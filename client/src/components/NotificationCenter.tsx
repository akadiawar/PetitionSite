import { Notification } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Bell, 
  CheckCircle2, 
  TrendingUp, 
  MessageSquare,
  Clock,
  CheckCheck,
} from 'lucide-react';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onViewPetition: (petitionId: string) => void;
}

export function NotificationCenter({ 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead,
  onViewPetition 
}: NotificationCenterProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'status_change':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'response':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'milestone':
        return <TrendingUp className="w-5 h-5 text-purple-600" />;
      case 'deadline':
        return <Bell className="w-5 h-5 text-red-600" />;
      case 'comment':
        return <MessageSquare className="w-5 h-5 text-yellow-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'status_change':
        return 'bg-blue-50 border-blue-200';
      case 'response':
        return 'bg-green-50 border-green-200';
      case 'milestone':
        return 'bg-purple-50 border-purple-200';
      case 'deadline':
        return 'bg-red-50 border-red-200';
      case 'comment':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">알림</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              읽지 않은 알림 {unreadCount}개
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onMarkAllAsRead}
            className="gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            모두 읽음 처리
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map(notification => (
            <Card 
              key={notification.id}
              className={`${
                !notification.read ? getNotificationColor(notification.type) : 'bg-white'
              } ${notification.petitionId ? 'cursor-pointer hover:shadow-md' : ''} transition-shadow`}
              onClick={() => {
                if (!notification.read) {
                  onMarkAsRead(notification.id);
                }
                if (notification.petitionId) {
                  onViewPetition(notification.petitionId);
                }
              }}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-gray-900">{notification.title}</h3>
                          {!notification.read && (
                            <Badge variant="default" className="bg-blue-600 h-2 w-2 p-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center py-16">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">알림이 없습니다</h3>
            <p className="text-sm text-gray-600">
              청원 활동이 있으면 여기에 알림이 표시됩니다
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
