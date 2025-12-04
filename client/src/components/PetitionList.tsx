import { useState } from 'react';
import { Petition, User, PetitionCategory, PetitionStatus } from '../App';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { QuickStats } from './QuickStats';
import { 
  Search, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  Users,
  AlertCircle,
} from 'lucide-react';

interface PetitionListProps {
  petitions: Petition[];
  currentUser: User;
  onViewDetail: (id: string) => void;
  onCreate: () => void;
  onBookmark: (petitionId: string) => void;
}

export function PetitionList({ petitions, currentUser, onViewDetail, onCreate, onBookmark }: PetitionListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'deadline'>('latest');

  const categories: PetitionCategory[] = ['학사', '시설', '급식', '동아리', '복지', '기타'];
  const statuses: PetitionStatus[] = ['의견수렴중', '검토중', '답변완료', '종결'];

  // Filter and sort petitions
  const filteredPetitions = petitions
    .filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.background.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'latest') {
        return b.createdAt.getTime() - a.createdAt.getTime();
      } else if (sortBy === 'popular') {
        return b.agreementCount - a.agreementCount;
      } else {
        return a.deadline.getTime() - b.deadline.getTime();
      }
    });

  const popularPetitions = petitions.filter(p => p.agreementCount >= 50);

  const getStatusColor = (status: PetitionStatus) => {
    switch (status) {
      case '의견수렴중': return 'bg-blue-100 text-blue-800';
      case '검토중': return 'bg-yellow-100 text-yellow-800';
      case '답변완료': return 'bg-green-100 text-green-800';
      case '종결': return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: PetitionCategory) => {
    const colors = {
      '학사': 'bg-purple-100 text-purple-800',
      '시설': 'bg-blue-100 text-blue-800',
      '급식': 'bg-orange-100 text-orange-800',
      '동아리': 'bg-pink-100 text-pink-800',
      '복지': 'bg-green-100 text-green-800',
      '기타': 'bg-gray-100 text-gray-800',
    };
    return colors[category];
  };

  const getDaysRemaining = (deadline: Date) => {
    const diff = deadline.getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const canCreatePetition = currentUser.petitionsThisMonth < 3;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <QuickStats petitions={petitions} />

      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl text-gray-900">{petitions.length}</p>
                <p className="text-sm text-gray-600">전체 청원</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-2xl text-gray-900">
                  {petitions.filter(p => p.status === '의견수렴중').length}
                </p>
                <p className="text-sm text-gray-600">진행 중</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl text-gray-900">
                  {petitions.filter(p => p.status === '답변완료').length}
                </p>
                <p className="text-sm text-gray-600">답변 완료</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl text-gray-900">
                  {popularPetitions.length}
                </p>
                <p className="text-sm text-gray-600">인기 청원</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Petition Status */}
      <Card className={canCreatePetition ? "bg-blue-50 border-blue-200" : "bg-yellow-50 border-yellow-200"}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <AlertCircle className={`w-5 h-5 mt-0.5 ${canCreatePetition ? 'text-blue-600' : 'text-yellow-600'}`} />
              <div className="flex-1">
                <p className="text-gray-900">
                  {canCreatePetition 
                    ? `이번 달 청원 작성 가능 횟수: ${3 - currentUser.petitionsThisMonth}회 남음`
                    : '이번 달 청원 작성 한도를 모두 사용했습니다'
                  }
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {canCreatePetition
                    ? '매월 최대 3건의 청원을 작성할 수 있습니다.'
                    : '다음 달부터 다시 청원을 작성할 수 있습니다.'
                  }
                </p>
                <div className="mt-3">
                  <Progress value={(currentUser.petitionsThisMonth / 3) * 100} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {currentUser.petitionsThisMonth}/3 사용
                  </p>
                </div>
              </div>
            </div>
            <Button onClick={onCreate} disabled={!canCreatePetition}>
              청원 작성
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Popular Petitions */}
      {popularPetitions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h2 className="text-gray-900">인기 청원 (동의 50명 이상)</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {popularPetitions.slice(0, 4).map(petition => (
              <Card 
                key={petition.id} 
                className="cursor-pointer hover:shadow-md transition-shadow border-purple-200"
                onClick={() => onViewDetail(petition.id)}
              >
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-gray-900 line-clamp-2">{petition.title}</h3>
                      <Badge className={getCategoryColor(petition.category)}>
                        {petition.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-purple-600 flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {petition.agreementCount}명 동의
                      </span>
                      <Badge className={getStatusColor(petition.status)}>
                        {petition.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="청원 제목이나 내용으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 카테고리</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="정렬" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">최신순</SelectItem>
                  <SelectItem value="popular">동의순</SelectItem>
                  <SelectItem value="deadline">마감임박순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Petition List */}
      <div className="space-y-4">
        <h2 className="text-gray-900">
          전체 청원 ({filteredPetitions.length})
        </h2>
        
        <div className="space-y-3">
          {filteredPetitions.map(petition => {
            const daysRemaining = getDaysRemaining(petition.deadline);
            const progress = (petition.agreementCount / petition.targetAgreements) * 100;
            const isUrgent = daysRemaining <= 3 && petition.status === '의견수렴중';
            
            return (
              <Card 
                key={petition.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  isUrgent ? 'border-red-300 bg-red-50' : ''
                }`}
                onClick={() => onViewDetail(petition.id)}
              >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={getCategoryColor(petition.category)}>
                            {petition.category}
                          </Badge>
                          <Badge className={getStatusColor(petition.status)}>
                            {petition.status}
                          </Badge>
                          {petition.response && (
                            <Badge 
                              className={
                                petition.response.type === '수용' 
                                  ? 'bg-green-100 text-green-800' 
                                  : petition.response.type === '부분수용'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }
                            >
                              {petition.response.type}
                            </Badge>
                          )}
                          {isUrgent && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertCircle className="w-3 h-3" />
                              마감임박
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-gray-900">{petition.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {petition.background}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {petition.agreementCount} / {petition.targetAgreements}명 
                          <span className="text-blue-600">({Math.round(progress)}%)</span>
                        </span>
                        <span className={`flex items-center gap-1 ${isUrgent ? 'text-red-600' : 'text-gray-600'}`}>
                          <Clock className="w-4 h-4" />
                          D-{daysRemaining}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      {petition.status === '의견수렴중' && petition.agreementCount >= petition.targetAgreements * 0.8 && (
                        <p className="text-xs text-purple-600 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          목표까지 {petition.targetAgreements - petition.agreementCount}명 남음!
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>
                        {petition.isAnonymous ? '익명' : petition.authorName}
                      </span>
                      <span>
                        {petition.createdAt.toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {filteredPetitions.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <p className="text-gray-600">검색 결과가 없습니다</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}