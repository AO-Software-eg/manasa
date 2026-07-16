import { type Request, type Response } from 'express';

import * as auth from '../../auth.ts';
import * as service from './user.service.ts';
import * as validation from './user.validation.ts';

import jwt from 'jsonwebtoken';

import { RowNotFoundError } from './../../database.ts';

const { JsonWebTokenError } = jwt;

export class UserTokenNotFoundError extends Error {
  constructor() {
    super('User token not found');
  }
}

function getUserPayload(req: Request) {
  if (!req.cookies.user_token) {
    throw new UserTokenNotFoundError();
  }

  const userPayload = auth.verifyToken(req.cookies.user_token);

  if (!userPayload.id) {
    throw new Error("Malformed token: payload missing 'id' field");
  }
  if (!userPayload.email) {
    throw new Error("Malformed token: payload missing 'email' field");
  }

  return userPayload;
}

function isNumberParameter(param: string | string[]): param is string {
  if (typeof param !== 'string') {
    return false;
  }
  if (/^\d+$/.test(param) === false) {
    return false;
  }

  return true;
}

export async function getMe(req: Request, res: Response) {
  const me = await service.getMe(getUserPayload(req));

  return res.status(200).json(me);
}

export async function getBalance(req: Request, res: Response) {
  const balance = await service.getBalance(getUserPayload(req));

  return res.status(200).json(balance);
}

export async function enrollCourse(req: Request, res: Response) {
  const payload = getUserPayload(req);

  const data: validation.enrollData = validation.enrollSchema.parse(req.body);

  await service.enrollCourse(payload, data);

  return res.status(201).send();
}

export async function getEnrollments(req: Request, res: Response) {
  const payload = getUserPayload(req);

  const enrollments = await service.getEnrollments(payload);

  return res.status(200).json(enrollments);
}

export async function getGrades(req: Request, res: Response) {
  const payload = getUserPayload(req);

  const grades = await service.getGrades(payload);

  return res.status(200).json(grades);
}

export async function getExamGrades(req: Request, res: Response) {
  const payload = getUserPayload(req);
  const examId = req.params.examId;

  if (!isNumberParameter(examId)) {
    return res.status(400).send();
  }

  const grades = await service.getExamGrades(payload, Number(examId));

  return res.status(200).json(grades);
}

export async function getCourseProgress(req: Request, res: Response) {
  const payload = getUserPayload(req);
  const courseId = req.params.courseId;

  if (!isNumberParameter(courseId)) {
    return res.status(400).send();
  }

  const progress = await service.getCourseProgress(payload, Number(courseId));

  return res.status(200).json(progress);
}
