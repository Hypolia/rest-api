import Route from '@ioc:Adonis/Core/Route'

export default () => {
  Route.group(() => {
    Route.post('/login', 'authentication_controller.login').as('authentication.login')
    Route.post('/register', 'authentication_controller.register').as('authentication.register')

    Route.get('/certs', 'authentication_controller.cert').as('authentication.cert')
    Route.group(() => {
      Route.get('/me', 'authentication_controller.me').as('authentication.me')
    }).middleware('auth:jwt')
  }).namespace('App/authentication/controllers')
}
