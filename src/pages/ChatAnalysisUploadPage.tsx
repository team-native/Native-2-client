import { useNavigate } from 'react-router-dom';
import { useRef, useState, type DragEvent } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import PageHeading from '@/components/common/PageHeading';
import { uploadChatImages } from '@/api/chatAnalysis';
import { isApiConfigured } from '@/api/client';
import { ROUTES } from '@/constants/nav';
import { createDemoChatAnalysis, saveDemoChatAnalysis } from '@/utils/chatAnalysisDemo';

const STEPS = [
  { title: '1. 이미지 업로드', description: '대화가 잘 보이도록 캡처해 주세요.' },
  { title: '2. AI 텍스트 분석', description: 'OCR로 텍스트를 추출한 뒤 위험 신호를 확인합니다.' },
  { title: '3. 결과 확인', description: '위험도를 이해하기 쉬운 문장으로 안내합니다.' },
];

export default function ChatAnalysisUploadPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startAnalysis(files: File[]) {
    if (files.length === 0) return;
    const invalid = files.find((file) => !['image/png', 'image/jpeg'].includes(file.type));
    if (invalid) {
      setError('PNG 또는 JPG 이미지만 업로드할 수 있습니다.');
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      if (!isApiConfigured) {
        const demoResult = createDemoChatAnalysis(files);
        saveDemoChatAnalysis(demoResult);
        await new Promise((resolve) => window.setTimeout(resolve, 250));
        navigate(ROUTES.chatAnalysisProgress, { state: { jobId: demoResult.jobId, isDemo: true } });
        return;
      }
      const job = await uploadChatImages(files);
      navigate(ROUTES.chatAnalysisProgress, { state: { jobId: job.jobId } });
    } catch {
      setError('서버 연결이 되지 않아 데모 분석으로 진행합니다.');
      const demoResult = createDemoChatAnalysis(files);
      saveDemoChatAnalysis(demoResult);
      window.setTimeout(() => navigate(ROUTES.chatAnalysisProgress, { state: { jobId: demoResult.jobId, isDemo: true } }), 500);
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileSelect(fileList: FileList | null) {
    if (fileList) void startAnalysis(Array.from(fileList));
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    handleFileSelect(event.dataTransfer.files);
  }

  return (
    <div>
      <PageHeading eyebrow="AI 대화 분석" title="대화 내용을 캡처해서 올려주세요." description="AI가 텍스트를 분석하고 의심스러운 표현과 위험 신호를 정리합니다." />

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="p-8">
          <div
            onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center rounded-2xl border border-dashed px-6 py-12 text-center transition-colors ${isDragging ? 'border-brand-blue bg-brand-blue-bg' : 'border-border-input bg-surface-input'}`}
          >
            <span className="text-[44px] leading-none font-bold text-brand-blue">↑</span>
            <p className="mt-5 text-[20px] font-semibold text-ink-900 sm:text-[22px]">대화 캡처 이미지를 여기에 올리세요</p>
            <p className="mt-3 text-[14px] text-ink-500">PNG 또는 JPG · 여러 장의 이미지를 순서대로 업로드할 수 있습니다</p>
            <input ref={inputRef} type="file" accept="image/png,image/jpeg" multiple className="hidden" onChange={(event) => handleFileSelect(event.target.files)} />
            <Button className="mt-6" disabled={isUploading} onClick={() => inputRef.current?.click()}>{isUploading ? '업로드 중…' : '파일 선택'}</Button>
          </div>
          {error && <p className="mt-4 text-center text-[14px] text-danger">{error}</p>}
          <p className="mt-5 text-center text-[14px] text-ink-500">업로드한 이미지는 분석 후 결과 화면에서 확인할 수 있습니다.</p>
        </Card>

        <div className="flex flex-col gap-5">
          {STEPS.map((step) => (
            <Card key={step.title} className="group p-6 transition-all hover:border-[#2F6BFF] hover:bg-[#2F6BFF] hover:shadow-md">
              <h3 className="text-[18px] font-semibold text-ink-900 transition-colors group-hover:text-white">{step.title}</h3>
              <p className="mt-3 text-[14px] text-ink-500 transition-colors group-hover:text-white/90">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
