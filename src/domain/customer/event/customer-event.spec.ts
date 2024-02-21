import EventDispatcher from '../../@shared/event/event-dispatcher';
import { CustomerCreatedEvent } from './customer-created.event';
import { CustomerChangedAddressEvent } from './custormer-changed-address.event';
import { EnviaConsoleLogHandler } from './handler/envia-console-log.handler';
import { EnviaConsoleLog1Handler } from './handler/envia-console-log1.handler';
import { EnviaConsoleLog2Handler } from './handler/envia-console-log2.handler';

describe('Tests about Customer events', () => {
  it('should notify customer created', () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new EnviaConsoleLog1Handler();
    const eventHandler2 = new EnviaConsoleLog2Handler();
    const spyEventHandler = jest.spyOn(eventHandler1, 'handle');
    const spyEventHandler2 = jest.spyOn(eventHandler2, 'handle');

    eventDispatcher.register('CustomerCreatedEvent', eventHandler1);
    eventDispatcher.register('CustomerCreatedEvent', eventHandler2);

    expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][0]).toMatchObject(eventHandler1);

    expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][1]).toMatchObject(eventHandler2);

    const customerCreatedEvent = new CustomerCreatedEvent({
      name: 'Leandro'
    });

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });

  it('should notify customer changed address', () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();
    const spyEventHandler = jest.spyOn(eventHandler, 'handle');

    eventDispatcher.register('CustomerChangedAddressEvent', eventHandler);

    expect(eventDispatcher.getEventHandlers['CustomerChangedAddressEvent'][0]).toMatchObject(eventHandler);

    const customerChangedAddressEvent = new CustomerChangedAddressEvent({
      id: 1,
      name: 'Leandro',
      address: 'Rua dos bobos numero 0'
    });

    eventDispatcher.notify(customerChangedAddressEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});
