import { useState, useEffect } from 'react';
import { PetitionList } from './components/PetitionList';
import { PetitionDetail } from './components/PetitionDetail';
import { CreatePetition } from './components/CreatePetition';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { MyPetitions } from './components/MyPetitions';
import { NotificationCenter } from './components/NotificationCenter';
import { HelpFAQ } from './components/HelpFAQ';
import { AdminSettings } from './components/AdminSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Toaster } from './components/ui/sonner';

export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  studentId: string;
  role: UserRole;
  petitionsThisMonth: number;
  bookmarkedPetitions: string[];
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'status_change' | 'response' | 'milestone' | 'deadline' | 'comment';
  title: string;
  message: string;
  petitionId?: string;
  createdAt: Date;
  read: boolean;
}

export type PetitionCategory = '학사' | '시설' | '급식' | '동아리' | '복지' | '기타';
export type PetitionStatus = '의견수렴중' | '검토중' | '답변완료' | '종결';
export type ResponseType = '수용' | '부분수용' | '불가';

export interface Comment {
  id: string;
  petitionId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  isAnonymous: boolean;
}

export interface Report {
  id: string;
  petitionId: string;
  reporterId: string;
  reason: string;
  createdAt: Date;
}

export interface Petition {
  id: string;
  title: string;
  category: PetitionCategory;
  background: string;
  request: string;
  images?: string[];
  authorId: string;
  authorName: string;
  isAnonymous: boolean;
  status: PetitionStatus;
  agreementCount: number;
  targetAgreements: number;
  createdAt: Date;
  deadline: Date;
  agreedUserIds: string[];
  viewCount: number;
  commentCount: number;
  response?: {
    type: ResponseType;
    content: string;
    actionPlan?: string;
    respondedAt: Date;
  };
}

export interface AppSettings {
  defaultThreshold: number;
  collectionPeriodDays: number;
  categories: PetitionCategory[];
  monthlyPetitionLimit: number;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'create' | 'myPetitions' | 'notifications' | 'help' | 'settings'>('list');
  const [selectedPetitionId, setSelectedPetitionId] = useState<string | null>(null);
  
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      petitionId: '1',
      authorId: 'student5',
      authorName: '정선문',
      content: '정말 필요한 청원입니다. 시험기간마다 도서관 자리가 없어서 고생했어요.',
      createdAt: new Date('2025-10-27'),
      isAnonymous: false,
    },
    {
      id: '2',
      petitionId: '1',
      authorId: 'student6',
      authorName: '익명',
      content: '24시간은 어렵더라도 최소 자정까지는 운영해주면 좋겠습니다.',
      createdAt: new Date('2025-10-28'),
      isAnonymous: true,
    },
  ]);
  
  const [reports, setReports] = useState<Report[]>([]);
  
  const [settings, setSettings] = useState<AppSettings>({
    defaultThreshold: 100,
    collectionPeriodDays: 30,
    categories: ['학사', '시설', '급식', '동아리', '복지', '기타'],
    monthlyPetitionLimit: 3,
  });

  // Auto-close expired petitions and reset monthly limits
  useEffect(() => {
    const checkAndUpdatePetitions = () => {
      const now = new Date();
      
      setPetitions(prevPetitions => 
        prevPetitions.map(petition => {
          // Auto-close petitions that passed 30-day deadline
          if (petition.status === '의견수렴중' && petition.deadline < now) {
            addNotification({
              type: 'deadline',
              title: '청원이 마감되었습니다',
              message: `"${petition.title}" 청원의 의견수렴 기간이 종료되었습니다.`,
              petitionId: petition.id,
            });
            return { ...petition, status: '종결' as PetitionStatus };
          }
          return petition;
        })
      );

      // Reset monthly petition count on the 1st of each month
      if (currentUser && now.getDate() === 1) {
        setCurrentUser(prev => prev ? { ...prev, petitionsThisMonth: 0 } : null);
      }
    };

    // Check every hour
    const interval = setInterval(checkAndUpdatePetitions, 60 * 60 * 1000);
    checkAndUpdatePetitions(); // Run immediately on mount

    return () => clearInterval(interval);
  }, [currentUser]);
  
  // Mock petitions data
  const [petitions, setPetitions] = useState<Petition[]>([
    {
      id: '1',
      title: '도서관 24시간 운영 요청',
      category: '시설',
      background: '시험 기간마다 도서관 좌석이 부족하고, 야간에 공부할 공간이 없어 학생들이 불편을 겪고 있습니다. 특히 기말고사 기간에는 새벽 시간대에도 학습 공간이 필요합니다.',
      request: '도서관을 24시간 운영하거나, 최소한 시험 기간에는 심야 시간대까지 개방해 주시기 바랍니다. 1층 일부 공간만이라도 24시간 운영을 요청드립니다.',
      images: [],
      authorId: 'student1',
      authorName: '김선문',
      isAnonymous: false,
      status: '검토중',
      agreementCount: 143,
      targetAgreements: 100,
      createdAt: new Date('2025-10-26'),
      deadline: new Date('2025-11-25'),
      agreedUserIds: [],
      viewCount: 523,
      commentCount: 2,
    },
    {
      id: '2',
      title: '학생식당 메뉴 다양화 및 가격 인하',
      category: '급식',
      background: '학생식당의 메뉴가 매주 반복되고, 가격도 외부 식당과 비슷하거나 더 비싼 경우가 많습니다. 학생들의 경제적 부담이 큽니다.',
      request: '메뉴를 다양화하고, 학생 복지 차원에서 가격을 인하해 주시기 바랍니다. 또한 채식 메뉴도 추가해 주시면 감사하겠습니다.',
      images: [],
      authorId: 'student2',
      authorName: '익명',
      isAnonymous: true,
      status: '의견수렴중',
      agreementCount: 67,
      targetAgreements: 100,
      createdAt: new Date('2025-11-01'),
      deadline: new Date('2025-12-01'),
      agreedUserIds: [],
      viewCount: 234,
      commentCount: 0,
    },
    {
      id: '3',
      title: '캠퍼스 와이파이 속도 개선',
      category: '시설',
      background: '강의실과 도서관에서 와이파이 연결이 자주 끊기고 속도가 느려서 온라인 강의 수강과 과제 제출에 어려움을 겪고 있습니다.',
      request: '캠퍼스 전역의 와이파이 인프라를 개선하고, AP를 추가 설치해 주시기 바랍니다.',
      images: [],
      authorId: 'student3',
      authorName: '이선문',
      isAnonymous: false,
      status: '답변완료',
      agreementCount: 156,
      targetAgreements: 100,
      createdAt: new Date('2025-10-15'),
      deadline: new Date('2025-11-14'),
      agreedUserIds: [],
      viewCount: 678,
      commentCount: 0,
      response: {
        type: '수용',
        content: '학생 여러분의 불편을 인지하고 있으며, 이미 와이파이 인프라 개선 프로젝트를 진행 중입니다. 11월 말까지 주요 건물에 고성능 AP를 추가 설치할 예정입니다.',
        actionPlan: '11월 25일까지 도서관, 강의동, 학생회관에 AP 50대 추가 설치 완료 예정',
        respondedAt: new Date('2025-11-10'),
      },
    },
    {
      id: '4',
      title: '체육관 운영 시간 연장 요청',
      category: '시설',
      background: '현재 체육관이 평일 오후 6시에 문을 닫아서 수업이 끝난 후 운동하기 어렵습니다.',
      request: '체육관 운영 시간을 평일 오후 9시까지 연장해 주시기 바랍니다.',
      images: [],
      authorId: 'student4',
      authorName: '박선문',
      isAnonymous: false,
      status: '의견수렴중',
      agreementCount: 23,
      targetAgreements: 100,
      createdAt: new Date('2025-11-15'),
      deadline: new Date('2025-12-15'),
      agreedUserIds: [],
      viewCount: 89,
      commentCount: 0,
    },
  ]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('list');
  };

  const handleCreatePetition = (newPetition: Omit<Petition, 'id' | 'agreementCount' | 'status' | 'createdAt' | 'deadline' | 'agreedUserIds' | 'viewCount' | 'commentCount'>) => {
    const petition: Petition = {
      ...newPetition,
      id: Date.now().toString(),
      agreementCount: 0,
      status: '의견수렴중',
      createdAt: new Date(),
      deadline: new Date(Date.now() + settings.collectionPeriodDays * 24 * 60 * 60 * 1000),
      agreedUserIds: [],
      viewCount: 0,
      commentCount: 0,
    };
    setPetitions([petition, ...petitions]);
    
    // Update user's petition count
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        petitionsThisMonth: currentUser.petitionsThisMonth + 1,
      });
    }
    
    setCurrentView('list');
  };

  const handleAgree = (petitionId: string) => {
    if (!currentUser) return;
    
    setPetitions(petitions.map(p => {
      if (p.id === petitionId && !p.agreedUserIds.includes(currentUser.id)) {
        const newAgreementCount = p.agreementCount + 1;
        const newAgreedUserIds = [...p.agreedUserIds, currentUser.id];
        
        // Auto transition to "검토중" if threshold is met
        const newStatus = newAgreementCount >= p.targetAgreements && p.status === '의견수렴중' 
          ? '검토중' 
          : p.status;
        
        // Add notification for milestone
        if (newAgreementCount === 50 || newAgreementCount === p.targetAgreements) {
          addNotification({
            type: 'milestone',
            title: `청원이 ${newAgreementCount}명의 동의를 받았습니다!`,
            message: `"${p.title}" 청원이 ${newAgreementCount}명의 동의를 받았습니다.`,
            petitionId: p.id,
          });
        }
        
        return {
          ...p,
          agreementCount: newAgreementCount,
          agreedUserIds: newAgreedUserIds,
          status: newStatus,
        };
      }
      return p;
    }));
  };

  const handleUpdatePetition = (petitionId: string, updates: Partial<Petition>) => {
    setPetitions(petitions.map(p => {
      if (p.id === petitionId) {
        // Add notification for status change
        if (updates.status && updates.status !== p.status) {
          addNotification({
            type: 'status_change',
            title: '청원 상태가 변경되었습니다',
            message: `"${p.title}" 청원의 상태가 "${updates.status}"(으)로 변경되었습니다.`,
            petitionId: p.id,
          });
        }
        
        // Add notification for response
        if (updates.response) {
          addNotification({
            type: 'response',
            title: '총학생회 답변이 등록되었습니다',
            message: `"${p.title}" 청원에 대한 답변이 등록되었습니다.`,
            petitionId: p.id,
          });
        }
        
        return { ...p, ...updates };
      }
      return p;
    }));
  };
  
  const handleBookmark = (petitionId: string) => {
    if (!currentUser) return;
    
    const isBookmarked = currentUser.bookmarkedPetitions.includes(petitionId);
    setCurrentUser({
      ...currentUser,
      bookmarkedPetitions: isBookmarked
        ? currentUser.bookmarkedPetitions.filter(id => id !== petitionId)
        : [...currentUser.bookmarkedPetitions, petitionId],
    });
  };
  
  const handleAddComment = (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setComments([...comments, newComment]);
    
    // Update comment count
    setPetitions(petitions.map(p => 
      p.id === comment.petitionId 
        ? { ...p, commentCount: p.commentCount + 1 }
        : p
    ));
    
    // Add notification for petition author
    const petition = petitions.find(p => p.id === comment.petitionId);
    if (petition && petition.authorId !== comment.authorId) {
      addNotification({
        type: 'comment',
        title: '새로운 댓글이 달렸습니다',
        message: `"${petition.title}" 청원에 새로운 댓글이 달렸습니다.`,
        petitionId: petition.id,
      });
    }
  };
  
  const handleReport = (petitionId: string, reason: string) => {
    if (!currentUser) return;
    
    const newReport: Report = {
      id: Date.now().toString(),
      petitionId,
      reporterId: currentUser.id,
      reason,
      createdAt: new Date(),
    };
    setReports([...reports, newReport]);
  };
  
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    if (!currentUser) return;
    
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
      read: false,
    };
    
    setCurrentUser({
      ...currentUser,
      notifications: [newNotification, ...currentUser.notifications],
    });
  };
  
  const handleMarkNotificationAsRead = (notificationId: string) => {
    if (!currentUser) return;
    
    setCurrentUser({
      ...currentUser,
      notifications: currentUser.notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ),
    });
  };
  
  const handleMarkAllNotificationsAsRead = () => {
    if (!currentUser) return;
    
    setCurrentUser({
      ...currentUser,
      notifications: currentUser.notifications.map(n => ({ ...n, read: true })),
    });
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={currentUser} 
        onLogout={handleLogout}
        onNavigate={setCurrentView}
        currentView={currentView}
        unreadNotifications={currentUser.notifications.filter(n => !n.read).length}
      />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {currentUser.role === 'admin' ? (
          <>
            {currentView === 'detail' && selectedPetitionId ? (
              <PetitionDetail
                petition={petitions.find(p => p.id === selectedPetitionId)!}
                currentUser={currentUser}
                comments={comments.filter(c => c.petitionId === selectedPetitionId)}
                onAgree={handleAgree}
                onBack={() => setCurrentView('list')}
                onBookmark={handleBookmark}
                onAddComment={handleAddComment}
                onReport={handleReport}
                onEdit={handleUpdatePetition}
              />
            ) : (
              <Tabs defaultValue="petitions" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="petitions">청원 관리</TabsTrigger>
                  <TabsTrigger value="dashboard">통계 대시보드</TabsTrigger>
                  <TabsTrigger value="settings">설정</TabsTrigger>
                </TabsList>
                
                <TabsContent value="petitions">
                  <AdminDashboard 
                    petitions={petitions}
                    reports={reports}
                    onUpdatePetition={handleUpdatePetition}
                    onViewDetail={(id) => {
                      setSelectedPetitionId(id);
                      setCurrentView('detail');
                    }}
                  />
                </TabsContent>
                
                <TabsContent value="dashboard">
                  <AdminDashboard 
                    petitions={petitions}
                    reports={reports}
                    onUpdatePetition={handleUpdatePetition}
                    onViewDetail={(id) => {
                      setSelectedPetitionId(id);
                      setCurrentView('detail');
                    }}
                    showStats={true}
                  />
                </TabsContent>
                
                <TabsContent value="settings">
                  <AdminSettings 
                    settings={settings}
                    onUpdateSettings={setSettings}
                  />
                </TabsContent>
              </Tabs>
            )}
          </>
        ) : (
          <>
            {currentView === 'list' && (
              <PetitionList
                petitions={petitions}
                currentUser={currentUser}
                onViewDetail={(id) => {
                  // Increment view count
                  setPetitions(petitions.map(p => 
                    p.id === id ? { ...p, viewCount: p.viewCount + 1 } : p
                  ));
                  setSelectedPetitionId(id);
                  setCurrentView('detail');
                }}
                onCreate={() => setCurrentView('create')}
                onBookmark={handleBookmark}
              />
            )}
            
            {currentView === 'detail' && selectedPetitionId && (
              <PetitionDetail
                petition={petitions.find(p => p.id === selectedPetitionId)!}
                currentUser={currentUser}
                comments={comments.filter(c => c.petitionId === selectedPetitionId)}
                onAgree={handleAgree}
                onBack={() => setCurrentView('list')}
                onBookmark={handleBookmark}
                onAddComment={handleAddComment}
                onReport={handleReport}
                onEdit={handleUpdatePetition}
              />
            )}
            
            {currentView === 'create' && (
              <CreatePetition
                currentUser={currentUser}
                settings={settings}
                onSubmit={handleCreatePetition}
                onCancel={() => setCurrentView('list')}
              />
            )}
            
            {currentView === 'myPetitions' && (
              <MyPetitions
                petitions={petitions}
                currentUser={currentUser}
                onViewDetail={(id) => {
                  setSelectedPetitionId(id);
                  setCurrentView('detail');
                }}
              />
            )}
            
            {currentView === 'notifications' && (
              <NotificationCenter
                notifications={currentUser.notifications}
                onMarkAsRead={handleMarkNotificationAsRead}
                onMarkAllAsRead={handleMarkAllNotificationsAsRead}
                onViewPetition={(id) => {
                  setSelectedPetitionId(id);
                  setCurrentView('detail');
                }}
              />
            )}
            
            {currentView === 'help' && (
              <HelpFAQ onBack={() => setCurrentView('list')} />
            )}
          </>
        )}
      </main>
      <Toaster />
    </div>
  );
}