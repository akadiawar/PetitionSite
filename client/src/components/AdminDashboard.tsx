import { useState } from 'react';
import { Petition, ResponseType } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  BarChart3,
  FileText,
  Users,
  Flag,
} from 'lucide-react';

interface AdminDashboardProps {
  petitions: Petition[];
  reports: any[];
  onUpdatePetition: (petitionId: string, updates: Partial<Petition>) => void;
  onViewDetail: (id: string) => void;
  showStats?: boolean;
}

export function AdminDashboard({ petitions, reports, onUpdatePetition, onViewDetail, showStats }: AdminDashboardProps) {
  const [selectedPetition, setSelectedPetition] = useState<Petition | null>(null);
  const [responseType, setResponseType] = useState<ResponseType>('수용');
  const [responseContent, setResponseContent] = useState('');
  const [actionPlan, setActionPlan] = useState('');
  const [showResponseDialog, setShowResponseDialog] = useState(false);

  const pendingReview = petitions.filter(p => p.status === '검토중');
  const collecting = petitions.filter(p => p.status === '의견수렴중');
  const answered = petitions.filter(p => p.status === '답변완료');
  const closed = petitions.filter(p => p.status === '종결');

  const urgentPetitions = collecting.filter(p => {
    const daysRemaining = Math.ceil((p.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysRemaining <= 3;
  });

  const handleRespond = () => {
    if (!selectedPetition) return;

    onUpdatePetition(selectedPetition.id, {
      status: '답변완료',
      response: {
        type: responseType,
        content: responseContent,
        actionPlan: responseType === '수용' ? actionPlan : undefined,
        respondedAt: new Date(),
      },
    });

    setShowResponseDialog(false);
    setSelectedPetition(null);
    setResponseContent('');
    setActionPlan('');
  };

  const handleClosePetition = (petitionId: string) => {
    onUpdatePetition(petitionId, { status: '종결' });
  };

  const getCategoryStats = () => {
    const categories = ['학사', '시설', '급식', '동아리', '복지', '기타'];
    return categories.map(cat => ({
      category: cat,
      count: petitions.filter(p => p.category === cat).length,
    }));
  };

  const getResponseTypeStats = () => {
    const withResponse = petitions.filter(p => p.response);
    const total = withResponse.length;
    if (total === 0) return [];

    return [
      {
        type: '수용',
        count: withResponse.filter(p => p.response?.type === '수용').length,
        percentage: Math.round((withResponse.filter(p => p.response?.type === '수용').length / total) * 100),
      },
      {
        type: '부분수용',
        count: withResponse.filter(p => p.response?.type === '부분수용').length,
        percentage: Math.round((withResponse.filter(p => p.response?.type === '부분수용').length / total) * 100),
      },
      {
        type: '불가',
        count: withResponse.filter(p => p.response?.type === '불가').length,
        percentage: Math.round((withResponse.filter(p => p.response?.type === '불가').length / total) * 100),
      },
    ];
  };

  const getDaysRemaining = (deadline: Date) => {
    return Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  if (showStats) {
    const categoryStats = getCategoryStats();
    const responseStats = getResponseTypeStats();
    const avgAgreements = Math.round(
      petitions.reduce((sum, p) => sum + p.agreementCount, 0) / (petitions.length || 1)
    );
    
    // Calculate average response time
    const answeredPetitions = petitions.filter(p => p.response);
    const avgResponseTime = answeredPetitions.length > 0
      ? Math.round(
          answeredPetitions.reduce((sum, p) => {
            if (p.response) {
              const days = (p.response.respondedAt.getTime() - p.createdAt.getTime()) / (1000 * 60 * 60 * 24);
              return sum + days;
            }
            return sum;
          }, 0) / answeredPetitions.length
        )
      : 0;

    // Near target petitions (80% or more)
    const nearTargetPetitions = petitions.filter(
      p => p.status === '의견수렴중' && (p.agreementCount / p.targetAgreements) >= 0.8
    );

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-2xl text-gray-900">{petitions.length}</p>
                  <p className="text-sm text-gray-600">총 청원 수</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-2xl text-gray-900">{pendingReview.length}</p>
                  <p className="text-sm text-gray-600">검토 대기</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-2xl text-gray-900">{answered.length}</p>
                  <p className="text-sm text-gray-600">답변 완료</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-2xl text-gray-900">{reports.length}</p>
                  <p className="text-sm text-gray-600">신고 건수</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">평균 동의 수</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl text-blue-600">{avgAgreements}</p>
                  <p className="text-sm text-gray-500">명</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">평균 응답 시간</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl text-green-600">{avgResponseTime}</p>
                  <p className="text-sm text-gray-500">일</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">목표 임박 청원</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl text-purple-600">{nearTargetPetitions.length}</p>
                  <p className="text-sm text-gray-500">건 (80% 이상)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                카테고리별 분포
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryStats.map(stat => {
                  const percentage = petitions.length > 0 
                    ? (stat.count / petitions.length) * 100 
                    : 0;
                  return (
                    <div key={stat.category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-900">{stat.category}</span>
                        <span className="text-gray-600">{stat.count}건</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                답변 유형별 통계
              </CardTitle>
            </CardHeader>
            <CardContent>
              {responseStats.length > 0 ? (
                <div className="space-y-4">
                  {responseStats.map(stat => (
                    <div key={stat.type} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-900">{stat.type}</span>
                        <span className="text-gray-600">
                          {stat.count}건 ({stat.percentage}%)
                        </span>
                      </div>
                      <Progress value={stat.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600 py-8">
                  답변한 청원이 없습니다
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reports Section */}
        {reports.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-red-600" />
                신고된 청원 ({reports.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reports.map(report => {
                  const petition = petitions.find(p => p.id === report.petitionId);
                  if (!petition) return null;
                  return (
                    <div key={report.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-gray-900">{petition.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">신고 사유: {report.reason}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {report.createdAt.toLocaleDateString('ko-KR')}
                          </p>
                        </div>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => onViewDetail(petition.id)}
                        >
                          확인
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Urgent Alerts */}
      {urgentPetitions.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-gray-900">긴급: 마감 임박 청원 {urgentPetitions.length}건</h3>
                <p className="text-sm text-gray-600 mt-1">
                  3일 이내 마감되는 청원이 있습니다
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Review */}
      {pendingReview.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h2 className="text-gray-900">검토 대기 ({pendingReview.length})</h2>
          </div>
          <div className="space-y-3">
            {pendingReview.map(petition => (
              <Card key={petition.id} className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-yellow-100 text-yellow-800">
                            {petition.category}
                          </Badge>
                          <Badge className="bg-yellow-600 text-white">검토중</Badge>
                        </div>
                        <h3 className="text-gray-900">{petition.title}</h3>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {petition.background}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {petition.agreementCount}명 동의
                      </span>
                      <span>D-{getDaysRemaining(petition.deadline)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1"
                        onClick={() => onViewDetail(petition.id)}
                      >
                        상세보기
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => {
                          setSelectedPetition(petition);
                          setShowResponseDialog(true);
                        }}
                      >
                        답변 작성
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tabs for other statuses */}
      <Tabs defaultValue="collecting" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="collecting">
            의견수렴중 ({collecting.length})
          </TabsTrigger>
          <TabsTrigger value="answered">
            답변완료 ({answered.length})
          </TabsTrigger>
          <TabsTrigger value="closed">
            종결 ({closed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collecting" className="space-y-3 mt-4">
          {collecting.map(petition => {
            const progress = (petition.agreementCount / petition.targetAgreements) * 100;
            const daysRemaining = getDaysRemaining(petition.deadline);
            const isUrgent = daysRemaining <= 3;

            return (
              <Card key={petition.id} className={isUrgent ? 'border-red-300' : ''}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          {petition.category}
                        </Badge>
                        {isUrgent && (
                          <Badge variant="destructive">마감임박</Badge>
                        )}
                      </div>
                      <h3 className="text-gray-900">{petition.title}</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {petition.agreementCount} / {petition.targetAgreements}명
                        </span>
                        <span className={isUrgent ? 'text-red-600' : 'text-gray-600'}>
                          D-{daysRemaining}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => onViewDetail(petition.id)}
                    >
                      상세보기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {collecting.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <p className="text-gray-600">의견수렴중인 청원이 없습니다</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="answered" className="space-y-3 mt-4">
          {answered.map(petition => (
            <Card key={petition.id} className="border-green-200">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-green-100 text-green-800">
                        {petition.category}
                      </Badge>
                      <Badge className="bg-green-600 text-white">답변완료</Badge>
                      {petition.response && (
                        <Badge variant="outline">
                          {petition.response.type}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-gray-900">{petition.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => onViewDetail(petition.id)}
                    >
                      상세보기
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleClosePetition(petition.id)}
                    >
                      종결하기
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {answered.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <p className="text-gray-600">답변 완료된 청원이 없습니다</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="closed" className="space-y-3 mt-4">
          {closed.map(petition => (
            <Card key={petition.id} className="bg-gray-50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-gray-100 text-gray-800">
                        {petition.category}
                      </Badge>
                      <Badge className="bg-gray-600 text-white">종결</Badge>
                    </div>
                    <h3 className="text-gray-900">{petition.title}</h3>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => onViewDetail(petition.id)}
                  >
                    상세보기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {closed.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <p className="text-gray-600">종결된 청원이 없습니다</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Response Dialog */}
      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>답변 작성</DialogTitle>
            <DialogDescription>
              {selectedPetition?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>답변 유형</Label>
              <Select value={responseType} onValueChange={(v) => setResponseType(v as ResponseType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="수용">수용</SelectItem>
                  <SelectItem value="부분수용">부분수용</SelectItem>
                  <SelectItem value="불가">불가</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>답변 내용</Label>
              <Textarea
                placeholder="청원에 대한 답변을 작성하세요 (최대 1000자)"
                value={responseContent}
                onChange={(e) => setResponseContent(e.target.value)}
                maxLength={1000}
                rows={6}
              />
              <p className="text-sm text-gray-600 text-right">
                {responseContent.length}/1000
              </p>
            </div>

            {responseType === '수용' && (
              <div className="space-y-2">
                <Label>실행 계획 및 일정</Label>
                <Textarea
                  placeholder="구체적인 실행 계획과 일정을 입력하세요"
                  value={actionPlan}
                  onChange={(e) => setActionPlan(e.target.value)}
                  rows={4}
                />
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowResponseDialog(false)}
              >
                취소
              </Button>
              <Button 
                className="flex-1"
                onClick={handleRespond}
                disabled={!responseContent}
              >
                답변 제출
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}