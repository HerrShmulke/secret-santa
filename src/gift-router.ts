import { FastifyInstance } from "fastify";
import S from 'fluent-json-schema';
import { authGuard } from './auth-guard';
import jwt from 'jsonwebtoken';
import { getAllPersons, getPersonById, updatePersonById } from "./persons";
import { shuffle } from "./utils/list";
import { setPairings } from "./pairings";

export function registerGiftRoutes(fastifyInstance: FastifyInstance) {
  type AuthSchemaHeaders = {
    bearer: string;
  }

  fastifyInstance.get<{
    Headers: AuthSchemaHeaders
  }>('/gift', {
    preValidation: authGuard
  }, async (request, reply) => {
    const { bearer } = request.headers;
  
    const { personId } = jwt.decode(bearer as string) as { personId: number };

    const person = await getPersonById(personId);

    if (!person) return reply.status(500).send({ message: 'Server error' });

    reply.status(200).send({ text: person.gift });
  });

  type GiftCreateSchemaBody = {
    text: string
  }
  
  const giftCreateSchemaBody = S.object()
  .prop('text', S.string().required());
    

  fastifyInstance.post<{ 
    Body: GiftCreateSchemaBody,
    Headers: AuthSchemaHeaders 
  }>('/gift', { 
    preValidation: authGuard, 
    schema: { body: giftCreateSchemaBody } 
  }, async (request, reply) => {
    try {
      const { bearer } = request.headers;
      const { text } = request.body;
    
      const { personId } = jwt.decode(bearer as string) as { personId: number };
  
      await updatePersonById({ id: personId, gift: text });
  
      reply.status(200).send({ success: true });
    } catch (e) {
      console.log(e);
      reply.status(500).send({ message: 'Server error' });
    }
  });

  type GiftCreatePairsQuery = {
    password: string;
  }

  type Pair = {
    santaId: number;
    recipientId: number;
  }

  fastifyInstance.get<{
    Querystring: GiftCreatePairsQuery
  }>('/gift/create-pairs', async (request, reply) => {
    try {
      const { password } = request.query;
  
      if (password !== 'secret-leha') {
        reply.status(500).send({ message: 'Server error' });
      }
  
      const persons = await getAllPersons();
  
      const filteredPersons = persons.filter((person) => person.gift !== undefined && person.gift !== null && person.gift !== '');

      const personIds = filteredPersons.map((person) => person.id);
  
      const shufflePersonIds = shuffle(personIds);
  
      const pairs: Pair[] = shufflePersonIds.reduce((pairs, personId, index, array) => {
        return [...pairs, { santaId: personId, recipientId: array[(index + 1) % array.length] }]
      }, [] as Pair[]);
  
      await setPairings(pairs);

      reply.status(200).send({ success: true });
    } catch (e) {
      console.log(e)
      reply.status(500).send({ message: 'Server error' });
    }
  })
}