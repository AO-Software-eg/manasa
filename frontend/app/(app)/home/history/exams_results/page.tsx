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
    const { data: submissions } = useGetExamSubmissions(userData?.id ?? NaN);

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
                            <TableHead className="text-right text-white">رقم المحاولة</TableHead>
                            <TableHead className="text-right text-white">الامتحان</TableHead>
                            <TableHead className="text-right text-white">الدرجة</TableHead>
                            <TableHead className="text-right text-white">عدد الأسئلة</TableHead>
                            <TableHead className="text-right text-white">تاريخ التقديم</TableHead>
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
                                        <Badge variant="outline" className="w-fit text-xs text-white">
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}