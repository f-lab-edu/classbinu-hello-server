import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Point } from 'src/points/entities/point.entity';

@Entity()
export class PointTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Point)
  @JoinColumn({ name: 'point_id' })
  point: Point;

  @Column()
  amount: number;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
