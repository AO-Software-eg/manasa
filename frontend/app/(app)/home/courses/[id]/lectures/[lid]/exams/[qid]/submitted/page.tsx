"use client";
import { useMe } from "@/app/hooks/queries/useMe"
import { useGetOnSubmit } from "@/app/hooks/queries/useExams"
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


type Grade = {
    id: number;
    createdAt: string;
    grade: number;
};


function page() {
    const { data: useData } = useMe();
    const { qid, id } = useParams();
    const examId = qid ? Number(qid) : NaN;
    const { data: grades, isLoading } = useGetOnSubmit(examId, useData?.id ?? '');


    const queryClient = useQueryClient();

    queryClient.invalidateQueries({
        queryKey: ['examId', examId],
    });

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(dateString));
    };

    if (isLoading) {
        <div className="container mx-auto py-6 w-full min-h-screen flex items-center justify-center" dir="rtl">
            <h1 className="text-2xl font-bold mb-6">
                درجات الامتحان
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

                    </TableBody>
                </Table>
            </div>
            <div>
                <Link href={`http://localhost:3000/home/courses/${id}/lectures`}>
                    <button >
                        العودة للكورس
                    </button>
                </Link>
            </div>
        </div>
    }

    return (
        <Card className="bg-[#13131] text-white  w-full min-h-screen " >
            <CardHeader>
                <CardTitle className="text-2xl text-right">
                    درجات الامتحان
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
                                    تاريخ التقديم
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {grades?.map((grade: Grade) => (
                                <TableRow
                                    key={grade.id}
                                    className="border-slate-700 hover:bg-slate-800"
                                >
                                    <TableCell className="text-right">
                                        #{grade.id}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <Badge
                                            variant={
                                                grade.grade >= 4
                                                    ? "default"
                                                    : "destructive"
                                            }
                                        >
                                            {grade.grade}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-right text-slate-300">
                                        {formatDate(grade.createdAt)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-6 flex justify-start">
                    <Button asChild>
                        <Link href={`/home/courses/${id}/lectures`}>
                            العودة للكورس
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card >
    )
}

export default page
