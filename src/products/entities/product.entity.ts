import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: 'bc69ab4f-edb5-48f1-b0dd-0acc06919532',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ApiProperty() @Column('text', { unique: true }) title: string;
  @ApiProperty() @Column('float', { default: 0 }) price: number;
  @ApiProperty({
    example:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pretium gravida urna, nec ornare neque malesuada ut. Nullam at risus in ligula lacinia accumsan.',
    description: 'Product description',
    default: null,
  })
  @Column('text', { nullable: true })
  description: string;
  @ApiProperty() @Column('text', { unique: true }) slug: string;
  @ApiProperty() @Column('int', { default: 0 }) stock: number;
  @ApiProperty() @Column('text', { array: true }) sizes: string[];
  @ApiProperty() @Column('text') gender: string;
  @ApiProperty() @Column('text', { array: true, default: [] }) tags: string[];

  //Images
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  //user
  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
      this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", '');
    }
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
