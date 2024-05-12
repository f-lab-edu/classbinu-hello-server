import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { PointsService } from 'src/points/points.service';
import { UserCreatedEvent } from 'src/users/events/user-created.event';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  constructor(private readonly pointsService: PointsService) {}

  async handle(event: UserCreatedEvent) {
    const newPoint = this.pointsService.create({ userId: event.userId });
    return newPoint;
  }
}
