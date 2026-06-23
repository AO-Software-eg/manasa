export type lecture = {
    id: string;
    course_id: string;
    title: string;
    lectureVideos: [
        {
            id: number;
            title: string;
            video_id: string;
        }
    ];
    exams: [
        {
            id: number;
            title: string;
        }
    ];
}

export type lectureVideoSchema = {
    id: string;
    lecture_id: string;
    title: string;
    video_id: string;
}


export type progressSchema = {
    solvedExamCount: number;
    examCount: number;
    examProgressPercentage: number;
    lectureCount: number;
    finishedLectureCount: number;
    progressPercentage: number;
}