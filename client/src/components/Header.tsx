import { Button } from './ui/button';
import { User } from '../App';
import { GraduationCap, LogOut, Plus, Bell, FileText, HelpCircle, Menu } from 'lucide-react';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onNavigate: (view: 'list' | 'detail' | 'create' | 'myPetitions' | 'notifications' | 'help' | 'settings') => void;
  currentView: string;
  unreadNotifications: number;
}

export function Header({ user, onLogout, onNavigate, currentView, unreadNotifications }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('list')}
          >
            <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900">선문대 청원</h1>
              <p className="text-sm text-gray-600 hidden sm:block">Student Petition System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {user.role === 'student' && (
              <>
                <Button 
                  onClick={() => onNavigate('create')}
                  size="sm"
                  className="gap-2 hidden sm:flex"
                >
                  <Plus className="w-4 h-4" />
                  청원 작성
                </Button>
                
                <Button 
                  onClick={() => onNavigate('create')}
                  size="sm"
                  className="sm:hidden"
                  variant="ghost"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </>
            )}
            
            {user.role === 'student' && (
              <>
                <Button
                  variant={currentView === 'notifications' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onNavigate('notifications')}
                  className="relative"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifications > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Menu className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="text-sm">{user.name}</span>
                        <span className="text-xs text-gray-600">{user.studentId}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onNavigate('myPetitions')}>
                      <FileText className="w-4 h-4 mr-2" />
                      내 청원
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate('help')}>
                      <HelpCircle className="w-4 h-4 mr-2" />
                      도움말
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            
            {user.role === 'admin' && (
              <div className="flex items-center gap-3">
                <Badge variant="default" className="bg-blue-600">관리자</Badge>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onLogout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">로그아웃</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
