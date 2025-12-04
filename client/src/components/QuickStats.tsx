import { Petition } from '../App';
import { Card, CardContent } from './ui/card';
import { TrendingUp, Clock, AlertCircle, Target } from 'lucide-react';

interface QuickStatsProps {
  petitions: Petition[];
}

export function QuickStats({ petitions }: QuickStatsProps) {
  const recentPetitions = petitions
    .filter(p => {
      const daysSinceCreated = (Date.now() - p.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceCreated <= 7 && p.status === '의견수렴중';
    })
    .sort((a, b) => {
      const growthA = a.agreementCount / Math.max(1, (Date.now() - a.createdAt.getTime()) / (1000 * 60 * 60 * 24));
      const growthB = b.agreementCount / Math.max(1, (Date.now() - b.createdAt.getTime()) / (1000 * 60 * 60 * 24));
      return growthB - growthA;
    });

  const urgentPetitions = petitions.filter(p => {
    const daysRemaining = Math.ceil((p.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysRemaining <= 3 && p.status === '의견수렴중';
  });

  const nearTargetPetitions = petitions.filter(
    p => p.status === '의견수렴중' && (p.agreementCount / p.targetAgreements) >= 0.8
  );

  if (recentPetitions.length === 0 && urgentPetitions.length === 0 && nearTargetPetitions.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {recentPetitions.length > 0 && (
        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h3 className="text-gray-900">급상승 청원</h3>
            </div>
            <div className="space-y-2">
              {recentPetitions.slice(0, 2).map(petition => (
                <div key={petition.id} className="text-sm">
                  <p className="text-gray-900 line-clamp-1">{petition.title}</p>
                  <p className="text-purple-600">{petition.agreementCount}명 동의</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {urgentPetitions.length > 0 && (
        <Card className="bg-gradient-to-br from-red-50 to-white border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="text-gray-900">마감 임박</h3>
            </div>
            <div className="space-y-2">
              {urgentPetitions.slice(0, 2).map(petition => {
                const daysRemaining = Math.ceil((petition.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={petition.id} className="text-sm">
                    <p className="text-gray-900 line-clamp-1">{petition.title}</p>
                    <p className="text-red-600">D-{daysRemaining}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {nearTargetPetitions.length > 0 && (
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="text-gray-900">목표 임박</h3>
            </div>
            <div className="space-y-2">
              {nearTargetPetitions.slice(0, 2).map(petition => {
                const remaining = petition.targetAgreements - petition.agreementCount;
                return (
                  <div key={petition.id} className="text-sm">
                    <p className="text-gray-900 line-clamp-1">{petition.title}</p>
                    <p className="text-blue-600">{remaining}명 남음</p>
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
