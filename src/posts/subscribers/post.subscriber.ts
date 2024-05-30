import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  Repository,
} from 'typeorm';

import { Point } from 'src/points/entities/point.entity';
import { Post } from '../entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';

// FAILED: pointRepository is undefined
@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<Post> {
  constructor(
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
  ) {}

  listenTo() {
    return Post;
  }

  async afterInsert(event: InsertEvent<Post>) {
    const userId = event.entity.userId;
    let userPoints = await this.pointRepository.findOneBy({
      user: { id: userId },
    });
    if (!userPoints) {
      userPoints = new Point();
      userPoints.user = event.entity.user;
      userPoints.balance = 0;
    }
    userPoints.adjustBalance(10);
    await this.pointRepository.save(userPoints);
  }
}
