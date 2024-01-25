import 'reflect-metadata';
import { Container, interfaces } from 'inversify';
import { bindInfrastructureContainer } from '../infrastructure/configurations/container';

export const containter = new Container();

function bind<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>) {
  return containter.bind(serviceIdentifier)
}

bindInfrastructureContainer(bind);