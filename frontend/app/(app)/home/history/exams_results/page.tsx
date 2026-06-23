'use client';

import { useMe } from '@/app/hooks/queries/useMe';
import { useGetExamSubmissions } from '@/app/hooks/queries/useExams';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Link from 'next/link';

type Submission = {
    id: number;
    studentId: number;
    createdAt: string;
    grade: number;
    questionCount: number;
    exam: {
        id: number;
        title: string;
    };
};

export default function Page() {
    const { data: userData } = useMe();
    const userId = userData?.id;
    const { data: submissions } = useGetExamSubmissions(userId);

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(dateString));
    };

    return (
        <div className="container mx-auto py-6" dir="rtl">
            <h1 className="text-2xl font-bold mb-6">درجات الامتحانات</h1>

            <div className="rounded-md border" dir="rtl">
                <Table>
                    <TableHeader>
                        <TableRow>
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
                        {submissions?.map((submission: Submission) => (
                            <TableRow key={submission.id}>
                                <TableCell className="text-right text-white">
                                    #{submission.id}
                                </TableCell>

                                <TableCell className="text-right text-white">
                                    <div className="flex flex-col gap-1">
                                        <span>{submission.exam.title.trim()}</span>
                                        <Badge
                                            variant="outline"
                                            className="w-fit text-xs text-white"
                                        >
                                            #{submission.exam.id}
                                        </Badge>
                                    </div>
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

                                <TableCell className="text-right text-white">
                                    {submission.questionCount}
                                </TableCell>

                                <TableCell className="text-right text-white">
                                    {formatDate(submission.createdAt)}
                                </TableCell>
                                <TableCell className="text-right text-slate-300">
                                    <Link href={`/home/history/exams_results/${submission.id}?examId=${submission.exam.id}`}>
                                        <button className="bg-slate-800 p-2 rounded-2xl transition-opacity hover:opacity-65">
                                            تصحيح الاجابات
                                        </button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
