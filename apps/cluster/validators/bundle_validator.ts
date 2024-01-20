import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class CreateBundleValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    key: schema.string({ trim: true }),
    namespace: schema.string({ trim: true }),
    claimName: schema.string({ trim: true }),
  })

  public messages: CustomMessages = {}
}

export type CreateBundleValidatorSchema = CreateBundleValidator['schema']['props']
