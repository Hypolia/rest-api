import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class CreateServerValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    type: schema.string({ trim: true }),
    version: schema.string({ trim: true }),
  })

  public messages: CustomMessages = {}
}

export type CreateServerValidatorSchema = CreateServerValidator['schema']['props']
