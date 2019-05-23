<template>
  <div class="flex" v-if="detected == ''">
    <qrcode-stream @decode="onDecode"></qrcode-stream>
  </div>
  <div class="flex flex-col my-10" v-else>
      <span class="mx-auto mb-4">Barcode:</span>
      <span class="mx-auto mb-10">{{ detected }}</span>
      <div class="mx-auto">
          <button class="button--grey" @click="detected = ''">
              Rescan QR Code
          </button>
      </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueQuagga from 'vue-quaggajs';

// register component 'v-quagga'
Vue.use(VueQuagga);

export default {
  name: 'VueBarcodeTest',
  data () {
    return {
      detected: '',
    }
  },
  methods: {
    onDecode (decodedString) {
        this.detected = decodedString
      console.log('detected', decodedString)
    }

  }
}
</script>
