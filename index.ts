import { initTables } from './src/init-tables';
import { fastifyInstance } from './config/fastify';
import { registerAuthRoutes } from './src/auth-router';
import { registerGiftRoutes } from './src/gift-router';
import { registerProfileRoutes } from './src/profile-router';
import cors from '@fastify/cors'
import { Settings } from './config/settings';
import { container } from './src/configurations/inversify';
import { INFRASTRUCTURE_TYPES } from './src/infrastructure/constants/infrastructure-types';
import { IMigration } from './src/infrastructure/migrations/migration.interfaces';

async function main() {
  const migrations: IMigration[] = [];
  migrations.push(container.get(INFRASTRUCTURE_TYPES.PERSON_MIGRATION));

  await Promise.all(migrations.map((migration) => migration.migrate()));

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
