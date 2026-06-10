'use client';

import { useMe } from '@/app/hooks/queries/useMe';
import { useGetExamSubmissions } from '@/app/hooks/queries/useExams';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type Grade = {
    id: number;
    createdAt: string;
    grade: number;
};

export default function Page() {
    const { data: userData } = useMe();
    const { data: grades } = useGetExamSubmissions(userData?.id ?? NaN);

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
            <h1 className="text-2xl font-bold mb-6">
                درجات الامتحانات
            </h1>

            <div className="rounded-md border" dir="rtl">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-right text-white">
                                رقم المحاولة
                            </TableHead>
                            <TableHead className="text-right text-white">
                                الدرجة
                            </TableHead>
                            <TableHead className="text-right text-white">
                                تاريخ التقديم
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {grades?.map((grade: Grade) => (
                            <TableRow key={grade.id}>
                                <TableCell className="text-right text-white">
                                    {grade.id}
                                </TableCell>

                                <TableCell className="text-right text-white">
                                    {grade.grade}
                                </TableCell>

                                <TableCell className="text-right text-white">
                                    {formatDate(grade.createdAt)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}