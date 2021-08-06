import Vue from 'vue'

declare module 'vue/types/vue' {
    interface VueConstructor  {
      $keycloak: any
      $window: any
    }
  }
