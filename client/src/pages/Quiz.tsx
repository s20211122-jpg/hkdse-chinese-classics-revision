import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

interface Question {
  id: number;
  textId: number;
  type: 'multiple-choice' | 'short-answer' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

const mockQuestions: Question[] = [];

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 載入題目
  useEffect(() => {
    fetch('/quiz-questions.json')
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions);
        setSelectedAnswers(new Array(data.questions.length).fill(null));
      })
      .catch((err) => console.error('Failed to load questions:', err));
  }, []);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground/60">載入題目中...</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (answer: string | number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowResults(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowResults(false);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
    setSubmitted(true);
  };

  const handleCheckAnswer = () => {
    setShowResults(true);
  };

  const isAnswerCorrect =
    selectedAnswers[currentQuestion] === question.correctAnswer;

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  if (submitted) {
    const score = calculateScore();
    const correct = questions.filter(
      (q, idx) => selectedAnswers[idx] === q.correctAnswer
    ).length;

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-white/50 sticky top-0 z-50">
          <div className="container py-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/')}
                className="mr-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-2xl font-bold text-foreground">測試結果</h1>
            </div>
          </div>
        </header>

        <div className="container py-12">
          <Card className="max-w-2xl mx-auto border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">恭喜完成測試！</CardTitle>
              <div className="text-6xl font-bold text-accent mb-4">{score}%</div>
              <p className="text-lg text-foreground/80">
                你答對了 <span className="font-semibold">{correct}</span> / {questions.length} 題
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <p className="text-sm text-foreground/60 mb-1">總題數</p>
                    <p className="text-2xl font-bold text-foreground">
                      {questions.length}
                    </p>
                  </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <p className="text-sm text-foreground/60 mb-1">答對</p>
                  <p className="text-2xl font-bold text-accent">{correct}</p>
                </div>
                  <div className="text-center p-4 bg-destructive/10 rounded-lg">
                    <p className="text-sm text-foreground/60 mb-1">答錯</p>
                    <p className="text-2xl font-bold text-destructive">
                      {questions.length - correct}
                    </p>
                  </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">詳細答案</h3>
                {questions.map((q, idx) => {
                  const isCorrect = selectedAnswers[idx] === q.correctAnswer;
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        isCorrect
                          ? 'border-accent bg-accent/5'
                          : 'border-destructive bg-destructive/5'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                        ) : (
                          <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-foreground">第 {idx + 1} 題</p>
                          <p className="text-sm text-foreground/70 mt-1">{q.question}</p>
                        </div>
                      </div>
                      {!isCorrect && (
                        <div className="ml-8 text-sm text-foreground/60 mb-2">
                          <p>你的答案：{q.options?.[selectedAnswers[idx] as number]}</p>
                          <p className="text-accent font-medium">
                            正確答案：{q.options?.[q.correctAnswer as number]}
                          </p>
                        </div>
                      )}
                      <p className="ml-8 text-sm text-foreground/70 italic">
                        {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setLocation('/')}
                >
                  返回主頁
                </Button>
                <Button
                  className="flex-1 bg-accent hover:bg-accent/90"
                  onClick={() => {
                    setCurrentQuestion(0);
                    setSelectedAnswers(new Array(questions.length).fill(null));
                    setShowResults(false);
                    setSubmitted(false);
                  }}
                >
                  重新測試
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white/50 sticky top-0 z-50">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/')}
                className="mr-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-2xl font-bold text-foreground">互動測試</h1>
            </div>
            <span className="text-sm text-foreground/60">
              第 {currentQuestion + 1} / {questions.length} 題
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-xl">{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {question.type === 'multiple-choice' && question.options && (
                <RadioGroup
                  value={String(selectedAnswers[currentQuestion] ?? '')}
                  onValueChange={(value) => handleAnswerSelect(Number(value))}
                >
                  <div className="space-y-3">
                    {question.options.map((option, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <RadioGroupItem value={String(idx)} id={`option-${idx}`} />
                        <Label
                          htmlFor={`option-${idx}`}
                          className="flex-1 cursor-pointer p-3 rounded-md hover:bg-secondary/30 transition-colors"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}

              {showResults && (
                <div
                  className={`p-4 rounded-lg border-l-4 ${
                    isAnswerCorrect
                      ? 'border-accent bg-accent/5'
                      : 'border-destructive bg-destructive/5'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    {isAnswerCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
                    )}
                    <div>
                      <p className="font-semibold text-foreground">
                        {isAnswerCorrect ? '答案正確！' : '答案錯誤'}
                      </p>
                      <p className="text-sm text-foreground/70 mt-2">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="flex-1"
                >
                  上一題
                </Button>

                {!showResults ? (
                  <Button
                    onClick={handleCheckAnswer}
                    disabled={selectedAnswers[currentQuestion] === null}
                    className="flex-1 bg-accent hover:bg-accent/90"
                  >
                    檢查答案
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={currentQuestion === questions.length - 1}
                    className="flex-1 bg-accent hover:bg-accent/90"
                  >
                    下一題
                  </Button>
                )}

                {currentQuestion === questions.length - 1 && showResults && (
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-accent hover:bg-accent/90"
                  >
                    提交測試
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
