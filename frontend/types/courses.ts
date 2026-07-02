export type courses = {
    id: number;
    title: string;
    imageUrl: string;
    price: number;
    year: string;
    specialization: string | null;
    description: string;
    tags: string | null;
}

export interface Enrollment {
  createdAt: string;
  studentId: number;
  course: {
    id: number;
    title: string;
    imageUrl: string;
    createdAt: string;
    price: number;
    description: string;
  };
}

export type EnrollmentsResponse = Enrollment[];