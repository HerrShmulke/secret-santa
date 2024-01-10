import fastify from "fastify";

export const fastifyInstance = fastify();

fastifyInstance.addContentTypeParser('text/json', { parseAs: 'string' }, fastifyInstance.getDefaultJsonParser('ignore', 'ignore'));
fastifyInstance.setErrorHandler((err, req, res) => {
  req.log.error({ req, res, err }, err && err.message)
  err.message = 'An error has occurred'
  res.send(err)
});