import Route from '@ioc:Adonis/Core/Route'

export default () => {
  Route.group(() => {
    Route.group(() => {
      Route.post('/', 'pods_controller.store').as('cluster.pods.store')
    }).prefix('/pods')


    Route.group(() => {
      Route.post('/', 'servers_controller.store').as('servers.store')
    }).prefix('/servers')

    Route.group(() => {
      Route.get('/', 'bundles_controller.index').as('bundles.index')
      Route.post('/', 'bundles_controller.store').as('bundles.store')
    }).prefix('/bundles')
  })
    .namespace('App/cluster/controllers')
    .middleware('auth:jwt')
}
