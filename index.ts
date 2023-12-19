import { initTables } from './src/init-tables';
import { fastifyInstance } from './config/fastify';
import { registerAuthRoutes } from './src/auth-router';
import { registerGiftRoutes } from './src/gift-router';
import { registerProfileRoutes } from './src/profile-router';
import cors from '@fastify/cors'
import { Settings } from './config/settings';

async function main() {
  await initTables();

  fastifyInstance.register(cors, {
    origin: (origin, cb) => {
      const hostname = new URL(origin as string).hostname
      if(hostname === "localhost"){
        //  Request from localhost will pass
        cb(null, true)
        return
      }
      // Generate an error on other origins, disabling access
      cb(new Error("Not allowed"), false)
    }
  })

  registerAuthRoutes(fastifyInstance);
  registerGiftRoutes(fastifyInstance);
  registerProfileRoutes(fastifyInstance);

  fastifyInstance.addHook('onError', (req, reply) => {
    console.dir(req)
    reply.status(500).send()
  })

  await fastifyInstance.listen({ port: Settings.getServerPort() }, () => {
    console.log('Server start on port ' + Settings.getServerPort());
  });

}

main();
