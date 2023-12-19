import S from 'fluent-json-schema'
import { FastifyInstance } from "fastify";
import jwt from 'jsonwebtoken';
import { authGuard } from './auth-guard';
import { getPersonById, updatePersonById } from './persons';

export function registerProfileRoutes(fastifyInstance: FastifyInstance) {
  type ProfilePatchBodyJsonSchema = {
    name?: string;
  }
  
  const profilePatchBodyJsonSchema = S.object()
  .prop('name', S.string());
  
  fastifyInstance.patch<{
    Body: ProfilePatchBodyJsonSchema
  }>('/api/profile', { preValidation: authGuard, schema: { body: profilePatchBodyJsonSchema } }, async (request, reply) => {
    try {
      const { bearer } = request.headers;
      const { name } = request.body;
    
      const { personId } = jwt.decode(bearer as string) as { personId: number };
  
      await updatePersonById({ id: personId, name });
      reply.status(200).send({ success: true });
    } catch (e) {
      console.log(e);
      reply.status(500).send({ message: 'Server error' })
    }
  });

  fastifyInstance.get('/api/profile', { preValidation: authGuard }, async (request, reply) => {
    try {
      const { bearer } = request.headers;
      const { personId } = jwt.decode(bearer as string) as { personId: number };

      const person = await getPersonById(personId);

      reply.status(200).send({
        email: person?.email,
        id: person?.id,
        name: person?.name
      });
    } catch (e) {
      console.log(e);
      reply.status(500).send({ message: 'Server error' })
    }
  });
}