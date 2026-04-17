import { courses } from '@/data/courses';

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const course = courses.find(c => c.id === id);

    if (!course) {
        return <h1>course not found</h1>;
    }

    return (
        <div>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
        </div>
    );
}