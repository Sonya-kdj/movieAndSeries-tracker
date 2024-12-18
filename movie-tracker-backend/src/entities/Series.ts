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
export class Series {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	title!: string

	@Column()
	year!: string

	@Column({ nullable: true })
	country!: string

	@Column()
	season!: number

	@Column()
	episode!: number

	@Column({ default: false })
	watched!: boolean

	@Column({ nullable: true })
	currentSeason!: number // Текущий сезон

	@Column({ nullable: true })
	currentEpisode!: number // Текущая серия

	@CreateDateColumn()
	createdAt!: Date

	@Column({ nullable: true })
	imdbID!: string // Новое поле для IMDb ID

	@UpdateDateColumn()
	updatedAt!: Date

	@ManyToOne(() => User, user => user.series, { onDelete: 'CASCADE' })
	user!: User
}
