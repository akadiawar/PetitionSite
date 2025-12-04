import { useState } from 'react';
import { Petition, User, Comment } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  ThumbsUp,
  Bookmark,
  Share2,
  Flag,
  Edit,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PetitionDetailProps {
  petition: Petition;
  currentUser: User;
  comments: Comment[];
  onAgree: (petitionId: string) => void;
  onBack: () => void;
  onBookmark: (petitionId: string) => void;
  onAddComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  onReport: (petitionId: string, reason: string) => void;
  onEdit: (petitionId: string, updates: Partial<Petition>) => void;
}

export function PetitionDetail({ 
  petition, 
  currentUser, 
  comments,
  onAgree, 
  onBack,
  onBookmark,
  onAddComment,
  onReport,
  onEdit,
}: PetitionDetailProps) {
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [newComment, setNewComment] = useState('');
  const [commentAnonymous, setCommentAnonymous] = useState(false);
  const [editData, setEditData] = useState({
    background: petition.background,
    request: petition.request,
  });

  const daysRemaining = Math.ceil(
    (petition.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const progress = (petition.agreementCount / petition.targetAgreements) * 100;
  const hasAgreed = petition.agreedUserIds.includes(currentUser.id);
  const isUrgent = daysRemaining <= 3 && petition.status === '의견수렴중';
  const isBookmarked = currentUser.bookmarkedPetitions.includes(petition.id);
  const isAuthor = petition.authorId === currentUser.id;
  const canEdit = isAuthor && petition.status === '의견수렴중';

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '학사': 'bg-purple-100 text-purple-800',
      '시설': 'bg-blue-100 text-blue-800',
      '급식': 'bg-orange-100 text-orange-800',
      '동아리': 'bg-pink-100 text-pink-800',
      '복지': 'bg-green-100 text-green-800',
      '기타': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors['기타'];
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

  const getResponseTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      '수용': 'bg-green-100 text-green-800',
      '부분수용': 'bg-yellow-100 text-yellow-800',
      '불가': 'bg-red-100 text-red-800',
    };
    return colors[type];
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('링크가 복사되었습니다!');
  };

  const handleReport = () => {
    if (reportReason.trim()) {
      onReport(petition.id, reportReason);
      setShowReportDialog(false);
      setReportReason('');
      toast.success('신고가 접수되었습니다');
    }
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment({
        petitionId: petition.id,
        authorId: currentUser.id,
        authorName: commentAnonymous ? '익명' : currentUser.name,
        content: newComment,
        isAnonymous: commentAnonymous,
      });
      setNewComment('');
      setCommentAnonymous(false);
      toast.success('댓글이 작성되었습니다');
    }
  };

  const handleEdit = () => {
    onEdit(petition.id, editData);
    setShowEditDialog(false);
    toast.success('청원이 수정되었습니다');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </Button>
        <div className="flex items-center gap-2">
          <Button 
            variant={isBookmarked ? "default" : "outline"}
            size="sm"
            onClick={() => {
              onBookmark(petition.id);
              toast.success(isBookmarked ? '북마크가 해제되었습니다' : '북마크에 추가되었습니다');
            }}
            className="gap-2"
          >
            <Bookmark className="w-4 h-4" />
            {isBookmarked ? '북마크됨' : '북마크'}
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-2"
          >
            <Share2 className="w-4 h-4" />
            공유
          </Button>
          {canEdit && (
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setShowEditDialog(true)}
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              수정
            </Button>
          )}
          {!isAuthor && (
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setShowReportDialog(true)}
              className="gap-2"
            >
              <Flag className="w-4 h-4" />
              신고
            </Button>
          )}
        </div>
      </div>

      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getCategoryColor(petition.category)}>
                {petition.category}
              </Badge>
              <Badge className={getStatusColor(petition.status)}>
                {petition.status}
              </Badge>
              {isUrgent && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="w-3 h-3" />
                  마감임박
                </Badge>
              )}
            </div>
            <CardTitle>{petition.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {petition.isAnonymous ? '익명' : petition.authorName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {petition.createdAt.toLocaleDateString('ko-KR')}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {petition.viewCount} 조회
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {petition.commentCount} 댓글
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Agreement Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-4xl text-gray-900">
                    {petition.agreementCount}
                  </p>
                  <p className="text-sm text-gray-600">
                    / {petition.targetAgreements}명
                  </p>
                </div>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{Math.round(progress)}% 달성</span>
                <span className={isUrgent ? 'text-red-600' : ''}>
                  D-{daysRemaining}
                </span>
              </div>
              {petition.status === '의견수렴중' && petition.agreementCount < petition.targetAgreements && (
                <div className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3">
                  <p className="flex items-center gap-1 justify-center">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    검토 단계로 넘어가려면 <span className="text-blue-600 mx-1">{petition.targetAgreements - petition.agreementCount}명</span> 더 필요합니다
                  </p>
                </div>
              )}
            </div>

            {currentUser.role === 'student' && petition.status === '의견수렴중' && (
              <Button 
                className="w-full gap-2"
                onClick={() => onAgree(petition.id)}
                disabled={hasAgreed}
              >
                <ThumbsUp className="w-4 h-4" />
                {hasAgreed ? '동의 완료' : '이 청원에 동의합니다'}
              </Button>
            )}

            {hasAgreed && (
              <Alert className="bg-blue-50 border-blue-200">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-900">
                  이 청원에 동의하셨습니다
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">진행 타임라인</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Created */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div className="w-0.5 h-full bg-blue-200 flex-1 mt-2" />
              </div>
              <div className="flex-1 pb-8">
                <h4 className="text-gray-900">청원 작성</h4>
                <p className="text-sm text-gray-600">
                  {petition.createdAt.toLocaleDateString('ko-KR')} {petition.createdAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm text-gray-500 mt-1">청원이 등록되었습니다</p>
              </div>
            </div>

            {/* In Progress */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  petition.status === '의견수렴중' ? 'bg-blue-600 animate-pulse' : 'bg-blue-600'
                }`}>
                  <Users className="w-4 h-4 text-white" />
                </div>
                {petition.agreementCount >= petition.targetAgreements && (
                  <div className="w-0.5 h-full bg-blue-200 flex-1 mt-2" />
                )}
              </div>
              <div className="flex-1 pb-8">
                <h4 className="text-gray-900">의견 수렴</h4>
                <p className="text-sm text-gray-600">
                  목표: {petition.targetAgreements}명 동의
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {petition.status === '의견수렴중' 
                    ? `현재 ${petition.agreementCount}명 동의 (${Math.round(progress)}%)` 
                    : `${petition.agreementCount}명이 동의했습니다`}
                </p>
              </div>
            </div>

            {/* Review */}
            {petition.agreementCount >= petition.targetAgreements && (
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    petition.status === '검토중' ? 'bg-yellow-600 animate-pulse' : 
                    (petition.status === '답변완료' || petition.status === '종결') ? 'bg-yellow-600' : 'bg-gray-300'
                  }`}>
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  {(petition.status === '답변완료' || petition.status === '종결') && (
                    <div className="w-0.5 h-full bg-blue-200 flex-1 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h4 className="text-gray-900">총학생회 검토</h4>
                  <p className="text-sm text-gray-600">
                    {petition.status === '검토중' 
                      ? '현재 검토 진행 중' 
                      : petition.response 
                        ? `${petition.response.respondedAt.toLocaleDateString('ko-KR')} 답변 완료`
                        : '검토 대기'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {petition.status === '검토중' && '총학생회에서 청원을 검토하고 있습니다'}
                  </p>
                </div>
              </div>
            )}

            {/* Response */}
            {petition.response && (
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    petition.status === '답변완료' ? 'bg-green-600 animate-pulse' : 'bg-green-600'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  {petition.status === '종결' && (
                    <div className="w-0.5 h-full bg-blue-200 flex-1 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h4 className="text-gray-900">답변 완료</h4>
                  <p className="text-sm text-gray-600">
                    {petition.response.respondedAt.toLocaleDateString('ko-KR')}
                  </p>
                  <Badge className={`${getResponseTypeColor(petition.response.type)} mt-2`}>
                    {petition.response.type}
                  </Badge>
                </div>
              </div>
            )}

            {/* Closed */}
            {petition.status === '종결' && (
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900">종결</h4>
                  <p className="text-sm text-gray-600">청원이 종결되었습니다</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">청원 배경 / 문제점</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-wrap">{petition.background}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">요청 사항</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-wrap">{petition.request}</p>
        </CardContent>
      </Card>

      {/* Response */}
      {petition.response && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                총학생회 답변
              </CardTitle>
              <Badge className={getResponseTypeColor(petition.response.type)}>
                {petition.response.type}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              {petition.response.respondedAt.toLocaleDateString('ko-KR')}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-gray-900 mb-2">답변 내용</h4>
              <p className="text-gray-700 whitespace-pre-wrap">
                {petition.response.content}
              </p>
            </div>
            
            {petition.response.actionPlan && (
              <div>
                <h4 className="text-gray-900 mb-2">실행 계획</h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {petition.response.actionPlan}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            댓글 ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Comment Form */}
          <div className="space-y-3">
            <Textarea
              placeholder="댓글을 작성하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={commentAnonymous}
                  onCheckedChange={setCommentAnonymous}
                  id="comment-anonymous"
                />
                <Label htmlFor="comment-anonymous">익명으로 작성</Label>
              </div>
              <Button 
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
              >
                댓글 작성
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">{comment.authorName}</span>
                      {comment.isAnonymous && (
                        <Badge variant="outline" className="text-xs">익명</Badge>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {comment.createdAt.toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 py-8">
                아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">진행 상태</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-gray-900">의견수렴중</p>
                <p className="text-sm text-gray-600">
                  {petition.createdAt.toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
            
            {(petition.status === '검토중' || petition.status === '답변완료' || petition.status === '종결') && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-gray-900">검토중</p>
                  <p className="text-sm text-gray-600">
                    {petition.agreementCount >= petition.targetAgreements ? '동의 수 달성' : ''}
                  </p>
                </div>
              </div>
            )}
            
            {(petition.status === '답변완료' || petition.status === '종결') && petition.response && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-gray-900">답변완료</p>
                  <p className="text-sm text-gray-600">
                    {petition.response.respondedAt.toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
            )}
            
            {petition.status === '종결' && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-gray-900">종결</p>
                  <p className="text-sm text-gray-600">청원이 종결되었습니다</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>청원 신고</DialogTitle>
            <DialogDescription>
              이 청원을 신고하는 이유를 작성해주세요
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="신고 사유를 입력하세요..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>
              취소
            </Button>
            <Button onClick={handleReport} disabled={!reportReason.trim()}>
              신고하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>청원 수정</DialogTitle>
            <DialogDescription>
              의견수렴중 상태에서만 청원을 수정할 수 있습니다
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>청원 배경 / 문제점</Label>
              <Textarea
                value={editData.background}
                onChange={(e) => setEditData({ ...editData, background: e.target.value })}
                rows={6}
                maxLength={500}
              />
              <p className="text-sm text-gray-600 text-right">
                {editData.background.length}/500
              </p>
            </div>
            <div className="space-y-2">
              <Label>요청 사항</Label>
              <Textarea
                value={editData.request}
                onChange={(e) => setEditData({ ...editData, request: e.target.value })}
                rows={6}
                maxLength={500}
              />
              <p className="text-sm text-gray-600 text-right">
                {editData.request.length}/500
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              취소
            </Button>
            <Button onClick={handleEdit}>
              수정 완료
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
