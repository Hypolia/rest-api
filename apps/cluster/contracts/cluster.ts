declare module '@ioc:Adonis/Core/Cluster' {
  export type PodMessagePayload = {
    type: string
    user_id: string
    namespace: string
    name: string
    image: string
  }
}
