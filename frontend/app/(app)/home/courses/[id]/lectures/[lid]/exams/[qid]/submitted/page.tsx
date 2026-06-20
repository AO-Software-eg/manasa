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
import { ExamGrade } from '@/types';

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
      <div className="w-full min-h-screen flex items-center justify-center text-white">
        جاري التحميل...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-red-500">
        حدث خطأ أثناء تحميل البيانات
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-white">
        لا توجد بيانات
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#131313] p-6 space-y-6">
      <Card className="bg-[#1a1a1a] border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="text-2xl">{data.exam.title}</div>
              <Badge variant="outline" className="text-white">
                امتحان #{data.exam.id}
              </Badge>
            </div>
            <div className="text-sm text-slate-400">
              <div>تاريخ إنشاء الامتحان: {formatDate(data.exam.createdAt)}</div>
              <div>Lecture ID: {data.exam.lectureId}</div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-hidden rounded-lg border border-slate-700">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-right text-slate-300">
                    رقم المحاولة
                  </TableHead>
                  <TableHead className="text-right text-slate-300">
                    الدرجة
                  </TableHead>
                  <TableHead className="text-right text-slate-300">
                    عدد الأسئلة
                  </TableHead>
                  <TableHead className="text-right text-slate-300">
                    تاريخ التقديم
                  </TableHead>
                  <TableHead className="text-right text-slate-300">
                    النتايج
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.submissions.length ? (
                  data.submissions.map((submission: ExamGrade) => (
                    <TableRow
                      key={submission.id}
                      className="border-slate-700 hover:bg-slate-800"
                    >
                      <TableCell className="text-right">
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
                      <TableCell className="text-right text-slate-300">
                        {formatDate(submission.createdAt)}
                      </TableCell>
                      <TableCell className="text-right text-slate-300">
                        <Link href={`/home/history/exams_results/${submission.id}?examId=${examId}`}>
                          <button className="bg-slate-800 p-2 rounded-2xl transition-opacity hover:opacity-65">
                            تصحيح الاجابات
                          </button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-slate-400"
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
        <Button asChild>
          <Link href={`/home/courses/${id}/lectures`}>العودة للكورس</Link>
        </Button>
      </div>
    </div>
  );
}

export default Page;
