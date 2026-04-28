export type lecture = {
    id: string;
    course_id: string;
    title: string;
}

export type lectureVideoSchema = {
    id: string;
    lecture_id: string;
    title: string;
    video_id: string;
}