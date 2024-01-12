import { ArchitectConfig } from '@ioc:Adonis/Core/Architect'

const architectConfig: ArchitectConfig = {
  domains: ['users'],
  applications: {
    authentication: {
      prefix: 'authentication',
      as: 'authentication',
    },
    security: {
      prefix: '',
      as: 'security',
    },
    storage: {
      prefix: 'storage',
      as: 'storage',
    },
    cluster: {
      prefix: 'cluster',
      as: 'cluster',
    },
  },
}

export default architectConfig
