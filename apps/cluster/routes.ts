import Route from '@ioc:Adonis/Core/Route'

export default () => {
  Route.group(() => {
    Route.group(() => {
      Route.post('/', 'pods_controller.store').as('cluster.pods.store')
    }).prefix('/pods')
  })
    .namespace('App/cluster/controllers')
    .middleware('auth:jwt')
}
