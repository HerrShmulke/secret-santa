import { initTables } from './src/init-tables';
import { fastifyInstance } from './src/configurations/fastify';
import { registerAuthRoutes } from './src/auth-router';
import { registerGiftRoutes } from './src/gift-router';
import { registerProfileRoutes } from './src/profile-router';
import cors from '@fastify/cors'
import { Settings } from './config/settings';

async function main() {
  await initTables();

  // fastifyInstance.register(cors, {
  //   origin: '*',
  //   allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization', 'Bearer'],
  //   methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE']
  // })

  registerAuthRoutes(fastifyInstance);
  registerGiftRoutes(fastifyInstance);
  registerProfileRoutes(fastifyInstance);

  await fastifyInstance.listen({ port: Settings.getServerPort() }, () => {
    console.log(`!!Server start on port: ${Settings.getServerPort()}`);
  });
}

main();
