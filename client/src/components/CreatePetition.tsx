import { useState } from 'react';
import { Petition, User, PetitionCategory, AppSettings } from '../App';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface CreatePetitionProps {
  currentUser: User;
  settings: AppSettings;
  onSubmit: (petition: Omit<Petition, 'id' | 'agreementCount' | 'status' | 'createdAt' | 'deadline' | 'agreedUserIds' | 'viewCount' | 'commentCount'>) => void;
  onCancel: () => void;
}

export function CreatePetition({ currentUser, settings, onSubmit, onCancel }: CreatePetitionProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '' as PetitionCategory,
    background: '',
    request: '',
    isAnonymous: false,
  });

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      authorId: currentUser.id,
      authorName: currentUser.name,
      targetAgreements: settings.defaultThreshold,
      images: [],
    });
  };

  const isStep1Valid = formData.title.length > 0 && formData.title.length <= 50 && formData.category;
  const isStep2Valid = formData.background.length > 0 && formData.background.length <= 500;
  const isStep3Valid = formData.request.length > 0 && formData.request.length <= 500;

  const progress = (step / 3) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onCancel} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          취소
        </Button>
        <div className="text-sm text-gray-600">
          {currentUser.petitionsThisMonth}/3 청원 작성
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">단계 {step}/3</span>
              <span className="text-gray-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>기본 정보</span>
              <span>문제점</span>
              <span>요청사항</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>1단계: 기본 정보</CardTitle>
            <CardDescription>
              청원의 제목과 카테고리를 선택해주세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">청원 제목 *</Label>
              <Input
                id="title"
                placeholder="청원 제목을 입력하세요 (최대 50자)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                maxLength={50}
              />
              <p className="text-sm text-gray-600 text-right">
                {formData.title.length}/50
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">카테고리 *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value as PetitionCategory })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {settings.categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="anonymous">익명으로 작성</Label>
                <p className="text-sm text-gray-600">
                  작성자 이름을 '익명'으로 표시합니다
                </p>
              </div>
              <Switch
                id="anonymous"
                checked={formData.isAnonymous}
                onCheckedChange={(checked) => setFormData({ ...formData, isAnonymous: checked })}
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                한 달에 최대 {settings.monthlyPetitionLimit}건의 청원을 작성할 수 있습니다. 신중하게 작성해주세요.
              </AlertDescription>
            </Alert>

            <Button 
              className="w-full gap-2" 
              onClick={() => setStep(2)}
              disabled={!isStep1Valid}
            >
              다음
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Background */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>2단계: 청원 배경 / 문제점</CardTitle>
            <CardDescription>
              어떤 문제가 있는지 구체적으로 설명해주세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="background">청원 배경 / 문제점 *</Label>
              <Textarea
                id="background"
                placeholder="현재 상황과 문제점을 자세히 설명해주세요 (최대 500자)"
                value={formData.background}
                onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                maxLength={500}
                rows={8}
              />
              <p className="text-sm text-gray-600 text-right">
                {formData.background.length}/500
              </p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                구체적인 사례와 데이터를 포함하면 더 설득력 있는 청원이 됩니다.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 gap-2" 
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="w-4 h-4" />
                이전
              </Button>
              <Button 
                className="flex-1 gap-2" 
                onClick={() => setStep(3)}
                disabled={!isStep2Valid}
              >
                다음
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Request */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>3단계: 요청 사항</CardTitle>
            <CardDescription>
              학교에 요청하고 싶은 구체적인 개선 방안을 작성해주세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="request">요청 사항 *</Label>
              <Textarea
                id="request"
                placeholder="구체적인 개선 방안이나 요청사항을 작성해주세요 (최대 500자)"
                value={formData.request}
                onChange={(e) => setFormData({ ...formData, request: e.target.value })}
                maxLength={500}
                rows={8}
              />
              <p className="text-sm text-gray-600 text-right">
                {formData.request.length}/500
              </p>
            </div>

            {/* Summary */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <h4 className="text-gray-900">청원 요약</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">제목: </span>
                  <span className="text-gray-900">{formData.title}</span>
                </div>
                <div>
                  <span className="text-gray-600">카테고리: </span>
                  <span className="text-gray-900">{formData.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">작성자: </span>
                  <span className="text-gray-900">
                    {formData.isAnonymous ? '익명' : currentUser.name}
                  </span>
                </div>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                청원이 작성되면 {settings.collectionPeriodDays}일 동안 동의를 받을 수 있습니다. {settings.defaultThreshold}명 이상의 동의를 받으면 총학생회의 검토를 받게 됩니다.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 gap-2" 
                onClick={() => setStep(2)}
              >
                <ArrowLeft className="w-4 h-4" />
                이전
              </Button>
              <Button 
                className="flex-1 gap-2"
                onClick={handleSubmit}
                disabled={!isStep3Valid}
              >
                <CheckCircle2 className="w-4 h-4" />
                청원 제출
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}