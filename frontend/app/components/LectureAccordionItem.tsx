import { useRouter } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { lecture ,getExamStatus } from '@/types';
import VideoButton from './VideoButton';
import ExamItem from './ExamItem';

interface LectureAccordionItemProps {
  lecture: lecture;
  solvedExamCount: number;
  openExamId: number | null;
  onOpenExam: (examId: number) => void;
  onCloseExam: () => void;
  courseId: string;
}

export default function LectureAccordionItem({
  lecture,
  solvedExamCount,
  openExamId,
  onOpenExam,
  onCloseExam,
  courseId
}: LectureAccordionItemProps) {
  const router = useRouter();

  const videos = lecture.lectureVideos ?? [];
  const exams = lecture.exams ?? [];
  const isEmpty = videos.length + exams.length === 0;

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full rounded-2xl bg-card border border-border shadow-xs overflow-hidden transition-all duration-300"
    >
      <AccordionItem value={`item-${lecture.id}`} className="border-none">
        <AccordionTrigger className="gap-2 rounded-t rounded-b-none bg-secondary/30 text-right px-6 py-4 hover:no-underline">
          <span className="text-lg font-bold text-primary">{lecture.title}</span>
        </AccordionTrigger>

        <AccordionContent className="bg-card">
          <div className="my-2 flex flex-col gap-3 p-4">
            {isEmpty && (
              <p className="py-10 text-center text-muted-foreground">
                لا توجد مواد متاحة
              </p>
            )}

            {videos.map((video) => (
              <VideoButton
                key={video.id}
                video={video}
                onClick={() => router.push(`/videos/${video.id}?lid=${lecture.id}`)}
              />
            ))}

            {exams.map((exam, index) => (
              <ExamItem
                key={exam.id}
                exam={exam}
                status={getExamStatus(index, solvedExamCount)}
                isOpen={openExamId === exam.id}
                onOpenConfirm={() => onOpenExam(exam.id)}
                onCloseConfirm={onCloseExam}
                onStartExam={() => router.push(`/exams/${exam.id}?courseId=${courseId}`)}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}