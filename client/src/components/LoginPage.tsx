import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { User } from '../App';
import { GraduationCap } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - check if admin
    if (studentId === 'admin' && password === 'admin') {
      onLogin({
        id: 'admin',
        name: '총학생회',
        studentId: 'admin',
        role: 'admin',
        petitionsThisMonth: 0,
        bookmarkedPetitions: [],
        notifications: [],
      });
    } else {
      // Regular student login
      onLogin({
        id: `user_${studentId}`,
        name: studentId === '20241234' ? '김선문' : '학생',
        studentId: studentId,
        role: 'student',
        petitionsThisMonth: 1,
        bookmarkedPetitions: [],
        notifications: [
          {
            id: '1',
            type: 'milestone',
            title: '청원이 50명의 동의를 받았습니다!',
            message: '"도서관 24시간 운영 요청" 청원이 50명의 동의를 받았습니다.',
            petitionId: '1',
            createdAt: new Date('2025-11-20'),
            read: false,
          },
        ],
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle>선문대학교 청원 시스템</CardTitle>
            <CardDescription className="mt-2">
              포털 계정으로 로그인하세요
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">학번</Label>
              <Input
                id="studentId"
                placeholder="학번을 입력하세요"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              로그인
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg space-y-2">
            <p className="text-sm text-gray-600">💡 데모 계정:</p>
            <p className="text-sm">• 학생: 아무 학번/비밀번호</p>
            <p className="text-sm">• 총학생회: admin / admin</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
