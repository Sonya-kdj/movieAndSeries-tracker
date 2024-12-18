import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { User } from './User'

@Entity()
export class Movie {
	@PrimaryGeneratedColumn()
	id!: number

	@Column({ default: 'Untitled' })
	title!: string

	@Column()
	year!: number

	@Column({ nullable: true })
	country!: string

	@Column({ nullable: true })
	runtime!: number

	@Column({ default: false })
	watched!: boolean

	@Column({ nullable: true })
	currentMinute!: number

	@Column({ nullable: true })
	imdbID!: string // Новое поле для IMDb ID

	@CreateDateColumn()
	createdAt!: Date

	@UpdateDateColumn()
	updatedAt!: Date

	@ManyToOne(() => User, user => user.movies, { onDelete: 'CASCADE' })
	user!: User
}
