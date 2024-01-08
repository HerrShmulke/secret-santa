import { initTables } from './src/init-tables';
import { fastifyInstance } from './src/configurations/fastify';
import { registerAuthRoutes } from './src/auth-router';
import { registerGiftRoutes } from './src/gift-router';
import { registerProfileRoutes } from './src/profile-router';
import cors from '@fastify/cors'
import { Settings } from './config/settings';
import { container } from './src/configurations/inversify';
import { INFRASTRUCTURE_TYPES } from './src/infrastructure/constants/infrastructure-types';
import { IMigration } from './src/infrastructure/migrations/migration.interfaces';
import { PRESENTATION_TYPES } from './src/presentation/constants/presentation-types';
import { IBaseController } from './src/presentation/controllers/base-controller';

async function main() {
  const migrations: IMigration[] = [];
  migrations.push(container.get(INFRASTRUCTURE_TYPES.PERSON_MIGRATION));
  migrations.push(container.get(INFRASTRUCTURE_TYPES.ONE_TIME_CODE_MIGRATION));

  await Promise.all(migrations.map((migration) => migration.migrate()));

  const controllers: IBaseController[] = [];
  controllers.push(container.get(PRESENTATION_TYPES.AUTH_CONTROLLER));

  controllers.forEach((controller) => controller.registerRoutes());

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
