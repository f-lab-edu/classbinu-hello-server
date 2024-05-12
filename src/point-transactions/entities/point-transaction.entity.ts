import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Point } from 'src/points/entities/point.entity';

export class PointTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Point)
  @JoinColumn({ name: 'point_id' })
  point: Point;

  @Column()
  type: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
