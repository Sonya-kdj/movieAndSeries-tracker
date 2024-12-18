import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Movie } from './Movie'
import { Series } from './Series'

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id!: number

	@Column({ unique: true })
	email!: string

	@Column()
	password!: string

	@CreateDateColumn()
	createdAt!: Date

	@UpdateDateColumn()
	updatedAt!: Date

	@OneToMany(() => Movie, movie => movie.user)
	movies!: Movie[]

	@OneToMany(() => Series, series => series.user)
	series!: Series[]
}
