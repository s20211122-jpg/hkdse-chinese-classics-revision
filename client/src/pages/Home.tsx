import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Bookmark, FileText, Lightbulb } from 'lucide-react';

interface TextsData {
  texts: TextItem[];
}

/**
 * 古典文人風格設計指南：
 * - 背景：米白色 (oklch(0.97 0.01 80))
 * - 文字：墨黑色 (oklch(0.1 0.02 30))
 * - 強調：古銅紅 (oklch(0.4 0.08 30))
 * - 留白充足，層級分明，節奏感強
 * - 毛筆筆觸分割線、篆刻印章圖標
 */

interface TextItem {
  id: number;
  title: string;
  author: string;
  period: string;
  category: string;
  mainTheme: string;
  keyPoints?: any;
  rhetoricalDevices?: string[];
  argumentationMethods?: string[];
  importantPhrases?: string[];
  examinationFocus?: string[];
  fullText?: string;
  translation?: string;
  analysis?: string;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedTextId, setSelectedTextId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [textsData, setTextsData] = useState<TextsData | null>(null);

  useEffect(() => {
    fetch('/texts-detailed.json')
      .then((res) => res.json())
      .then((data) => setTextsData(data))
      .catch((err) => console.error('Failed to load texts data:', err));
  }, []);

  if (!textsData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground/60">載入中...</p>
        </div>
      </div>
    );
  }

  const selectedText = textsData.texts.find((t: TextItem) => t.id === selectedTextId);

  return (
    <div className="min-h-screen bg-background">
      {/* 頁頭 */}
      <header className="border-b border-border bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-6">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-accent" />
            <h1 className="text-3xl font-bold text-foreground">HKDSE 中文 12 篇範文</h1>
          </div>
          <p className="text-muted-foreground">精讀複習站 · 詳細分析 · 互動測試</p>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左側導航欄 */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-accent" />
                範文清單
              </h2>
              <div className="space-y-2">
                {textsData.texts.map((text) => (
                  <button
                    key={text.id}
                    onClick={() => {
                      setSelectedTextId(text.id);
                      setActiveTab('overview');
                    }}
                    className={`w-full text-left px-4 py-3 rounded-md transition-all duration-300 ${
                      selectedTextId === text.id
                        ? 'bg-accent text-accent-foreground shadow-md'
                        : 'hover:bg-secondary text-foreground'
                    }`}
                  >
                    <div className="font-medium text-sm">{text.title}</div>
                    <div className="text-xs opacity-75">{text.author}</div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* 右側內容區 */}
          <main className="lg:col-span-3">
            {selectedText && (
              <div className="space-y-6">
                {/* 文章標題卡片 */}
                <Card className="border-border shadow-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <CardTitle className="text-2xl text-foreground mb-2">
                          {selectedText.title}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {selectedText.author} · {selectedText.period}
                        </CardDescription>
                      </div>
                      <span className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full font-medium">
                        {selectedText.category}
                      </span>
                    </div>
                    <p className="text-foreground/80 mt-4 leading-relaxed">
                      主題：<span className="font-semibold text-accent">{selectedText.mainTheme}</span>
                    </p>
                  </CardHeader>
                </Card>

                {/* 標籤頁 */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span className="hidden sm:inline">概覽</span>
                    </TabsTrigger>
                    <TabsTrigger value="content" className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span className="hidden sm:inline">內容</span>
                    </TabsTrigger>
                    <TabsTrigger value="techniques" className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      <span className="hidden sm:inline">手法</span>
                    </TabsTrigger>
                    <TabsTrigger value="key-phrases" className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4" />
                      <span className="hidden sm:inline">重點</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* 概覽標籤 */}
                  <TabsContent value="overview" className="space-y-4 mt-6">
                    <Card className="border-border">
                      <CardHeader>
                        <CardTitle className="text-lg">文章概覽</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedText.keyPoints && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-3">核心要點</h4>
                            <div className="space-y-3 text-foreground/80">
                              {typeof selectedText.keyPoints === 'object' &&
                                Object.entries(selectedText.keyPoints).map(([key, value]: any) => (
                                  <div key={key} className="pl-4 border-l-2 border-accent/30">
                                    <p className="font-medium text-foreground capitalize mb-1">
                                      {key}
                                    </p>
                                    <p className="text-sm">{value.theme || value}</p>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* 內容標籤 */}
                  <TabsContent value="content" className="space-y-4 mt-6">
                    <Card className="border-border">
                      <CardHeader>
                        <CardTitle className="text-lg">原文</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-secondary/30 p-4 rounded-md mb-4">
                          <p className="text-foreground leading-relaxed whitespace-pre-wrap font-serif text-base">
                            {selectedText.fullText}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border">
                      <CardHeader>
                        <CardTitle className="text-lg">全文語譯</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-secondary/30 p-4 rounded-md">
                          <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                            {selectedText.translation}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border">
                      <CardHeader>
                        <CardTitle className="text-lg">段落分析</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-secondary/30 p-4 rounded-md">
                          <p className="text-foreground/80 leading-relaxed">
                            {selectedText.analysis}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* 寫作手法標籤 */}
                  <TabsContent value="techniques" className="space-y-4 mt-6">
                    <Card className="border-border">
                      <CardHeader>
                        <CardTitle className="text-lg">寫作手法分析</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedText.rhetoricalDevices && selectedText.rhetoricalDevices.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">修辭手法</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedText.rhetoricalDevices.map((device: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                                >
                                  {device}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedText.argumentationMethods && selectedText.argumentationMethods.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">論證手法</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedText.argumentationMethods.map((method: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-secondary border border-border rounded-full text-sm"
                                >
                                  {method}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* 重點詞語標籤 */}
                  <TabsContent value="key-phrases" className="space-y-4 mt-6">
                    <Card className="border-border">
                      <CardHeader>
                        <CardTitle className="text-lg">重點詞語與短語</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedText.importantPhrases && selectedText.importantPhrases.length > 0 && (
                          <div className="space-y-2">
                            {selectedText.importantPhrases.map((phrase: string, idx: number) => (
                              <div
                                key={idx}
                                className="p-3 bg-secondary/30 rounded-md border-l-2 border-accent"
                              >
                                <p className="font-medium text-foreground">{phrase}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* 考試重點卡片 */}
                <Card className="border-accent/30 bg-accent/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-accent" />
                      考試重點
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedText.examinationFocus && selectedText.examinationFocus.length > 0 && (
                      <ul className="space-y-2">
                        {selectedText.examinationFocus.map((focus: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-foreground/80">
                            <span className="text-accent font-bold mt-1">✓</span>
                            <span>{focus}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>

                {/* 操作按鈕 */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setLocation('/quiz')}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    開始測試
                  </Button>
                  <Button variant="outline" className="flex-1">
                    下載筆記
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* 頁尾 */}
      <footer className="border-t border-border bg-secondary/30 mt-12">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-3">關於本站</h3>
              <p className="text-sm text-foreground/70 leading-relaxed">
                為 HKDSE 考生精心打造的 12 篇範文複習平台，提供詳細的內容分析、寫作手法講解及互動測試。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">功能特色</h3>
              <ul className="text-sm text-foreground/70 space-y-2">
                <li>✓ 12 篇範文完整分析</li>
                <li>✓ 寫作手法詳細講解</li>
                <li>✓ 互動式測試系統</li>
                <li>✓ 進度追蹤</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">學習建議</h3>
              <p className="text-sm text-foreground/70 leading-relaxed">
                建議先閱讀概覽，理解主旨，再深入學習寫作手法，最後通過測試鞏固知識。
              </p>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-foreground/60">
            <p>© 2026 HKDSE 中文 12 篇範文複習站 · 為夢想而讀書</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
