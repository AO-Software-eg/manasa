import { lecture ,ExamStatus, EXAM_STATUS_LABEL} from '@manasa/shared';
import PopUp from '@/app/components/PopUp';

interface ExamItemProps {
  exam: lecture['exams'][0];
  status: ExamStatus;
  isOpen: boolean;
  onOpenConfirm: () => void;
  onCloseConfirm: () => void;
  onStartExam: () => void;
}

export default function ExamItem({
  exam,
  status,
  isOpen,
  onOpenConfirm,
  onCloseConfirm,
  onStartExam,
}: ExamItemProps) {
  const isLocked = status === 'locked';
  const isCurrent = status === 'current';
  const disabled = !isCurrent; // solved or locked exams are not clickable

  return (
    <div className="w-full flex flex-col">
      <button
        disabled={disabled}
        onClick={() => {
          if (isCurrent) onOpenConfirm();
        }}
        className={`
          flex items-center justify-between
          w-full rounded-xl border p-4 transition-all text-right
          ${
            isLocked
              ? 'border-border/60 bg-muted/20 opacity-60 cursor-not-allowed'
              : 'border-border bg-secondary/20 hover:border-primary/50 hover:bg-secondary/40 cursor-pointer'
          }
          disabled:opacity-50
        `}
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-foreground">{exam.title}</span>
        </div>
        <span className="text-sm text-muted-foreground font-medium">
          {EXAM_STATUS_LABEL[status]}
        </span>
      </button>

      {isCurrent && (
        <PopUp
          open={isOpen}
          title="هل انت متأكد من بدأ الأمتحان ؟"
          description="تنبيه هام جدا جدا جدا&#10;خلي بالك الامتحان مدته : 45 دقيقة&#10;مينفعش تخرج من الاختبار قبل ما تكون خلصت الاختبار ..."
          confirmText="بدء الأمتحان"
          confirmClassName="bg-primary hover:bg-primary/90"
          onClose={onCloseConfirm}
          pending={false}
          done={false}
          onConfirm={onStartExam}
        />
      )}
    </div>
  );
}