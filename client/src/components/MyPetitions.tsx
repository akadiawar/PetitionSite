import { useState } from 'react';
import { Petition, User } from '../App';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { FileText, ThumbsUp, Bookmark, TrendingUp } from 'lucide-react';

interface MyPetitionsProps {
  petitions: Petition[];
  currentUser: User;
  onViewDetail: (id: string) => void;
}

export function MyPetitions({ petitions, currentUser, onViewDetail }: MyPetitionsProps) {
  const myPetitions = petitions.filter(p => p.authorId === currentUser.id);
  const agreedPetitions = petitions.filter(p => p.agreedUserIds.includes(currentUser.id));
  const bookmarkedPetitions = petitions.filter(p => currentUser.bookmarkedPetitions.includes(p.id));

  const getDaysRemaining = (deadline: Date) => {
    return Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      '의견수렴중': 'bg-blue-100 text-blue-800',
      '검토중': 'bg-yellow-100 text-yellow-800',
      '답변완료': 'bg-green-100 text-green-800',
      '종결': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || colors['의견수렴중'];
  };

  const renderPetitionCard = (petition: Petition) => {
    const progress = (petition.agreementCount / petition.targetAgreements) * 100;
    const daysRemaining = getDaysRemaining(petition.deadline);

    return (
      <Card 
        key={petition.id}
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onViewDetail(petition.id)}
      >
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getStatusColor(petition.status)}>
                  {petition.status}
                </Badge>
                <Badge variant="outline">
                  {petition.category}
                </Badge>
              </div>
              <h3 className="text-gray-900">{petition.title}</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {petition.agreementCount} / {petition.targetAgreements}명 동의
                </span>
                <span className="text-gray-600">D-{daysRemaining}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>조회 {petition.viewCount}</span>
              <span>댓글 {petition.commentCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-gray-900">내 청원 활동</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl text-gray-900">{myPetitions.length}</p>
                <p className="text-sm text-gray-600">작성한 청원</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <ThumbsUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl text-gray-900">{agreedPetitions.length}</p>
                <p className="text-sm text-gray-600">동의한 청원</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Bookmark className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl text-gray-900">{bookmarkedPetitions.length}</p>
                <p className="text-sm text-gray-600">북마크</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="created" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="created">
            작성한 청원 ({myPetitions.length})
          </TabsTrigger>
          <TabsTrigger value="agreed">
            동의한 청원 ({agreedPetitions.length})
          </TabsTrigger>
          <TabsTrigger value="bookmarked">
            북마크 ({bookmarkedPetitions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="created" className="space-y-3 mt-4">
          {myPetitions.length > 0 ? (
            myPetitions.map(renderPetitionCard)
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">작성한 청원이 없습니다</p>
                <p className="text-sm text-gray-500 mt-2">
                  새로운 청원을 작성하여 학교에 의견을 전달해보세요!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="agreed" className="space-y-3 mt-4">
          {agreedPetitions.length > 0 ? (
            agreedPetitions.map(renderPetitionCard)
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <ThumbsUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">동의한 청원이 없습니다</p>
                <p className="text-sm text-gray-500 mt-2">
                  관심있는 청원에 동의하여 힘을 보태주세요!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="bookmarked" className="space-y-3 mt-4">
          {bookmarkedPetitions.length > 0 ? (
            bookmarkedPetitions.map(renderPetitionCard)
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">북마크한 청원이 없습니다</p>
                <p className="text-sm text-gray-500 mt-2">
                  관심있는 청원을 북마크하여 나중에 쉽게 확인하세요!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
