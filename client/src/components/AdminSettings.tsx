import { useState } from 'react';
import { AppSettings, PetitionCategory } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Settings, Save, CheckCircle2 } from 'lucide-react';

interface AdminSettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

export function AdminSettings({ settings, onUpdateSettings }: AdminSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            시스템 설정
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            청원 시스템의 기본 설정을 관리합니다
          </p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          설정 저장
        </Button>
      </div>

      {saved && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-900">
            설정이 저장되었습니다!
          </AlertDescription>
        </Alert>
      )}

      {/* Threshold Settings */}
      <Card>
        <CardHeader>
          <CardTitle>동의 임계값 설정</CardTitle>
          <CardDescription>
            청원이 검토 단계로 전환되기 위한 최소 동의 수를 설정합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="threshold">기본 동의 임계값 (명)</Label>
            <Input
              id="threshold"
              type="number"
              min="1"
              value={localSettings.defaultThreshold}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                defaultThreshold: parseInt(e.target.value) || 100,
              })}
            />
            <p className="text-sm text-gray-600">
              현재 설정: {localSettings.defaultThreshold}명 이상 동의 시 검토 단계로 전환
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Period Settings */}
      <Card>
        <CardHeader>
          <CardTitle>의견수렴 기간 설정</CardTitle>
          <CardDescription>
            청원 작성 후 동의를 받을 수 있는 기간을 설정합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="period">의견수렴 기간 (일)</Label>
            <Input
              id="period"
              type="number"
              min="1"
              max="90"
              value={localSettings.collectionPeriodDays}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                collectionPeriodDays: parseInt(e.target.value) || 30,
              })}
            />
            <p className="text-sm text-gray-600">
              현재 설정: 청원 작성 후 {localSettings.collectionPeriodDays}일간 동의 수집
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Petition Limit Settings */}
      <Card>
        <CardHeader>
          <CardTitle>청원 작성 제한</CardTitle>
          <CardDescription>
            학생 1인당 월별 청원 작성 가능 횟수를 설정합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="limit">월별 청원 작성 제한 (건)</Label>
            <Input
              id="limit"
              type="number"
              min="1"
              max="10"
              value={localSettings.monthlyPetitionLimit}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                monthlyPetitionLimit: parseInt(e.target.value) || 3,
              })}
            />
            <p className="text-sm text-gray-600">
              현재 설정: 학생 1인당 월 {localSettings.monthlyPetitionLimit}건까지 작성 가능
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Category Management */}
      <Card>
        <CardHeader>
          <CardTitle>카테고리 관리</CardTitle>
          <CardDescription>
            청원 카테고리를 관리합니다 (현재 버전에서는 조회만 가능)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {localSettings.categories.map(category => (
              <Badge 
                key={category} 
                variant="outline"
                className="px-4 py-2"
              >
                {category}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            현재 {localSettings.categories.length}개의 카테고리가 활성화되어 있습니다
          </p>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>시스템 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">시스템 버전</p>
              <p className="text-gray-900">v1.0.0</p>
            </div>
            <div>
              <p className="text-gray-600">마지막 업데이트</p>
              <p className="text-gray-900">2025.11.23</p>
            </div>
            <div>
              <p className="text-gray-600">관리자</p>
              <p className="text-gray-900">선문대학교 총학생회</p>
            </div>
            <div>
              <p className="text-gray-600">운영 상태</p>
              <Badge variant="default" className="bg-green-600">정상 운영</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" className="gap-2">
          <Save className="w-4 h-4" />
          설정 저장
        </Button>
      </div>
    </div>
  );
}
