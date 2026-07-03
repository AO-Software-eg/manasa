'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useMe } from '@/app/hooks/queries/useMe';
import { useGetOnSubmit } from '@/app/hooks/queries/useExams';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Submissions } from '@/types';

function Page() {
  const { data: user } = useMe();
  const { qid, id } = useParams();
  const examId = Number(qid);

  const { data, isLoading, isError } = useGetOnSubmit(examId, user?.id ?? '');

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['examId', examId] });
  }, [examId, queryClient]);

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-foreground bg-background">
        جاري التحميل...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-destructive bg-background">
        حدث خطأ أثناء تحميل البيانات
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-foreground bg-background">
        لا توجد بيانات
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground p-6 space-y-6 pt-28">
      <Card className="bg-card border-border text-foreground shadow-xs">
        <CardHeader>
          <CardTitle className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{data.exam.title}</div>
              <Badge variant="outline" className="text-foreground">
                امتحان #{data.exam.id}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground font-sans">
              <div>تاريخ إنشاء الامتحان: {formatDate(data.exam.createdAt)}</div>
              <div>Lecture ID: {data.exam.lectureId}</div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-secondary/20">
                  <TableHead className="text-right text-muted-foreground font-bold">
                    رقم المحاولة
                  </TableHead>
                  <TableHead className="text-right text-muted-foreground font-bold">
                    الدرجة
                  </TableHead>
                  <TableHead className="text-right text-muted-foreground font-bold">
                    عدد الأسئلة
                  </TableHead>
                  <TableHead className="text-right text-muted-foreground font-bold">
                    تاريخ التقديم
                  </TableHead>
                  <TableHead className="text-right text-muted-foreground font-bold">
                    النتائج
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.submissions.length ? (
                  data.submissions.map((submission: Submissions) => (
                    <TableRow
                      key={submission.id}
                      className="border-border hover:bg-secondary/40 transition-colors"
                    >
                      <TableCell className="text-right font-medium">
                        #{submission.id}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            submission.grade >= submission.questionCount / 2
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {submission.grade} / {submission.questionCount}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {submission.questionCount}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatDate(submission.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/home/history/exams_results/${submission.id}?examId=${examId}`}>
                          <button className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-xl transition-all duration-300 font-semibold cursor-pointer shadow-xs text-xs md:text-sm">
                            تصحيح الإجابات
                          </button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-6"
                    >
                      لا توجد محاولات لهذا الامتحان
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-start">
        <Button asChild className="rounded-xl px-6 cursor-pointer">
          <Link href={`/home/courses/${id}/lectures`}>العودة للكورس</Link>
        </Button>
      </div>
    </div>
  );
}

export default Page;
