<template>
  <section class="container">
    <div>
      <logo />
      <!-- <h1 class="title">
        KidsGen
      </h1> -->
      <!-- <h2 class="subtitle">
        Kidsgen attendance system
      </h2> -->
      <div class="">
          <nuxt-link to="/qrcode" class="button--grey mx-4" >Check In / Out</nuxt-link>
      </div>
      <div class="hidden links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          class="button--green"
        >Documentation</a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          class="button--grey"
        >GitHub</a>
        <nuxt-link
          to="/barcode"
          class="button--grey"
        >Scan Barcode</nuxt-link>
        <nuxt-link
          to="/qrcode"
          class="button--grey"
        >Scan QR Code</nuxt-link>
      </div>
    </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  data() {
    return {
      value1: ''
    }
  }
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  min-height: calc(100vh - 50px);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
