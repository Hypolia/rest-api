import { DateTime } from 'luxon'
import { column, BaseModel, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { randomUUID } from 'node:crypto'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public email: string

  @column()
  public firstname: string

  @column()
  public lastname: string

  @column()
  public oidcId: string

  @column()
  public isAdmin: boolean

  @column()
  public hasAccessPanel: boolean

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUuid(model: User) {
    model.id = randomUUID()
  }
}
