import * as db from './database.ts';
import * as schema from './validation.ts';

export type Grade = {
  grade: number;
  questionCount: number;
};

export async function gradeExam(
  data: schema.examSubmissionData,
): Promise<Grade> {
  const questions = await db.getExamQuestions(data.examId);
  let grade = 0;

  for (const answer of data.answers) {
    const choice = await db.getQuestionChoice(answer.choiceId);

    if (answer.questionId != choice.questionId) {
      throw new Error(
        `Submitted choice with id ${choice.id} belongs to a question with id ${choice.questionId}, but the submitted question has id ${answer.questionId}`,
      );
    }

    let question = null;

    let i = 0;
    for (const q of questions) {
      if (q.id == choice.questionId) {
        question = q;
        break;
      }

      i++;
    }

    if (!question) {
      throw new Error(
        `Submitted question with id ${choice.questionId} is not part of exam with id ${data.examId}`,
      );
    }

    if (choice.isCorrect) {
      grade += 1;
    }
  }

  const result: Grade = {
    grade: grade,
    questionCount: questions.length,
  };

  return result;
}
