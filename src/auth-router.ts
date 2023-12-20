import fastify, { FastifyInstance, errorCodes } from "fastify";
import S from 'fluent-json-schema'
import { FromSchema } from 'json-schema-to-ts';
import { createOneTimeCode, getOneTimeCodeByPersonIdAndCode } from './one-time-code';
import { getPersonByEmail, createPerson } from './persons';
import { NotFound } from 'http-errors'
import jwt from 'jsonwebtoken';
import { Settings } from '../config/settings';
import nodemailer from 'nodemailer';

function generateOneTimeCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function registerAuthRoutes(fastifyInstance: FastifyInstance) {
  type Body = {
    email: string
  }
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
      user: Settings.getMailUser(),
      pass: Settings.getMailPassword()
    }
  });

  const bodyJsonSchema = S.object()
  .prop('email', S.string().required());
  
  fastifyInstance.post<{
    Body: Body
  }>('/auth/login', { schema: {
    body: bodyJsonSchema
  } }, async (request, reply) => {
    try {
      console.log('1');
      const person = await getPersonByEmail(request.body.email);
      const isPersonFound = person !== undefined;

      let personId = null;
      
      if (!isPersonFound) {
        const [ newPerson ] = await createPerson(request.body.email);
        console.log('2');
        personId = newPerson;
      } else {
        console.log('3');
        personId = person.id;
      }
      
      if (personId !== null) {
        console.log('4');
        const oneTimeCode = generateOneTimeCode();
        await createOneTimeCode(personId, oneTimeCode, new Date(Date.now() + 60_000 * 60));
      
        console.log('5');

        transporter.sendMail({
          from: Settings.getMailUser(),
          to: request.body.email,
          text: `Ваш код авторизации: ${oneTimeCode}`
        }).catch((e) => {
          console.log('Send mail error', e);
        });

        console.log('6');
        return reply.status(200).send({ success: true });
      }
      
      console.log('person id is undefined');
      reply.code(500).send({ message: 'Server error' })
    } catch (error) {
      console.log(error)
      reply.code(500).send({ message: 'Server error' })
    }
  });

  const verifyBodyJsonSchema = S.object()
  .prop('email', S.string().required())
  .prop('oneTimeCode', S.string().minLength(6).maxLength(6).required());

  type VerifyBody = {
    email: string;
    oneTimeCode: string;
  }

  fastifyInstance.post<{
    Body: VerifyBody
  }>('/auth/verify', { schema: {
    body: verifyBodyJsonSchema
  } }, async (request, reply) => {
    try {
      const person = await getPersonByEmail(request.body.email);
  
      if (person !== undefined) {
        const code = await getOneTimeCodeByPersonIdAndCode(person.id, request.body.oneTimeCode);
  
        if (code !== undefined) {
          console.log(new Date(code.expiration_time) < new Date())
        }

        if (code === undefined || new Date(code.expiration_time) < new Date()) {
          return reply.code(400).send({ message: 'Code not found' });
        }
  
        const accessToken = jwt.sign({ personId: person.id }, Settings.getJwtSecret(), {
          expiresIn: '100 days'
        })

        reply.code(200).send({ accessToken });
      }
  
      return reply.code(400).send({ message: 'Code not found' });
    } catch (err) {
      console.log(err);

      reply.code(500).send({ message: 'Server error' })
    }
  });
}