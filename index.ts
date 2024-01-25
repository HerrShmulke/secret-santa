import { initTables } from './src/init-tables';
import { fastifyInstance } from './src/configurations/fastify';
import { registerGiftRoutes } from './src/gift-router';
import { registerProfileRoutes } from './src/profile-router';
import cors from '@fastify/cors'
import { Settings } from './config/settings';
import { containter } from './src/configurations/inversify';
import { INFRASTRUCTURE_TYPES } from './src/infrastructure/constants/infrastructure-types';
import { IRouterConfiguration } from './src/domain/configurations/router-configuration';

async function main() {
  const fastifyConfiguration = containter.get<IRouterConfiguration>(INFRASTRUCTURE_TYPES.FASTIFY_CONFIGURATION);

  fastifyConfiguration.setupRoutes();

  await initTables();

  // fastifyInstance.register(cors, {
  //   origin: '*',
  //   allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization', 'Bearer'],
  //   methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE']
  // })

  registerGiftRoutes(fastifyInstance);
  registerProfileRoutes(fastifyInstance);

  await fastifyInstance.listen({ port: Settings.getServerPort() }, () => {
    console.log(`!!Server start on port: ${Settings.getServerPort()}`);
  });
}

main();
