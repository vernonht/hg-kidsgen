<template>
    <div class="">
        <a-result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        v-if="error.statusCode == 404"
        >
        <template v-slot:extra>
            <a-button type="primary">Back Home</a-button>
        </template>
    </a-result>
        <a-result
        status="500"
        :title="error.statusCode"
        :subTitle="error.message"
        v-else
        >
        <template v-slot:extra>
            <nuxt-link to="/">
                <a-button type="primary">Back Home</a-button>
            </nuxt-link>
        </template>
    </a-result>
    </div>
</template>

<script>
  export default {
      props: {
          error: {
              type: Object,
              default: null
          }
      },
    data() {
      return {
      };
    },
  };
</script>
