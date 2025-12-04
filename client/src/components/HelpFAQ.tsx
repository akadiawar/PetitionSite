import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { ArrowLeft, HelpCircle, FileText, ThumbsUp, Clock, CheckCircle2 } from 'lucide-react';

interface HelpFAQProps {
  onBack: () => void;
}

export function HelpFAQ({ onBack }: HelpFAQProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          돌아가기
        </Button>
      </div>

      <div>
        <h1 className="text-2xl text-gray-900 mb-2">도움말 및 FAQ</h1>
        <p className="text-gray-600">
          청원 시스템 사용 방법과 자주 묻는 질문들을 확인하세요
        </p>
      </div>

      {/* Quick Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            청원 시스템 이용 가이드
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-gray-900">1. 청원 작성</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    문제점과 요청사항을 명확히 작성하세요. 월 3건까지 작성 가능합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                  <ThumbsUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-gray-900">2. 동의 받기</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    30일 이내에 100명 이상의 동의를 받아야 합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 p-2 rounded-lg flex-shrink-0">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-gray-900">3. 총학생회 검토</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    100명 이상 동의 시 자동으로 검토 단계로 전환됩니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-gray-900">4. 답변 확인</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    총학생회의 답변과 실행 계획을 확인하세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>자주 묻는 질문 (FAQ)</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                청원은 어떻게 작성하나요?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                상단의 "청원 작성" 버튼을 클릭하여 3단계 양식을 작성하면 됩니다. 
                제목, 카테고리, 문제점, 요청사항을 명확하게 작성하세요. 
                익명 작성도 가능합니다.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                한 달에 몇 개의 청원을 작성할 수 있나요?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                남용 방지를 위해 학생 1인당 월 3건까지 청원을 작성할 수 있습니다. 
                신중하게 작성해 주세요.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>
                청원이 성사되려면 몇 명의 동의가 필요한가요?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                기본적으로 100명 이상의 동의가 필요합니다. 
                100명 이상 동의를 받으면 자동으로 "검토중" 상태로 변경되어 
                총학생회의 검토를 받게 됩니다.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>
                청원 기간은 얼마나 되나요?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                청원 작성일로부터 30일간 동의를 받을 수 있습니다. 
                30일 이내에 100명 이상의 동의를 받지 못하면 자동으로 종결됩니다.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>
                동의를 취소할 수 있나요?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                중복 동의 방지를 위해 한 번 동의한 청원은 취소할 수 없습니다. 
                신중하게 동의해 주세요.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>
                청원을 수정하거나 삭제할 수 있나요?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                "의견수렴중" 상태일 때만 청원 내용을 수정할 수 있습니다. 
                검토중 이후 단계에서는 수정이 불가능합니다. 
                삭제는 총학생회에 문의하세요.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>
                익명으로 청원을 작성할 수 있나요?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                네, 청원 작성 시 익명 옵션을 선택할 수 있습니다. 
                익명으로 작성하면 다른 학생들에게 작성자 이름이 "익명"으로 표시됩니다. 
                단, 총학생회는 작성자 정보를 확인할 수 있습니다.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger>
                부적절한 청원은 어떻게 신고하나요?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                각 청원 상세 페이지에서 "신고하기" 버튼을 클릭하여 
                부적절한 청원을 신고할 수 있습니다. 
                총학생회가 검토 후 조치합니다.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger>
                총학생회의 답변은 언제 받을 수 있나요?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                100명 이상의 동의를 받은 청원은 총학생회가 검토 후 
                가능한 한 빠른 시일 내에 답변을 작성합니다. 
                답변이 등록되면 알림으로 안내됩니다.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
              <AccordionTrigger>
                북마크는 어떻게 사용하나요?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                관심있는 청원을 북마크하여 나중에 쉽게 찾아볼 수 있습니다. 
                청원 상세 페이지의 북마크 버튼을 클릭하면 
                "내 청원" 페이지의 북마크 탭에서 확인할 수 있습니다.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>추가 문의</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p className="text-gray-600">
              위 내용으로 해결되지 않는 문제가 있나요?
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-gray-900">📧 이메일: student@sunmoon.ac.kr</p>
              <p className="text-gray-900 mt-2">📞 전화: 041-530-XXXX</p>
              <p className="text-gray-900 mt-2">🏢 방문: 학생회관 3층 총학생회실</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}