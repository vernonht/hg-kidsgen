<template>
  <div class="flex py-4 sticky top-0 border-b">
  <div class="ml-auto mx-4">
    <el-button size="small" plain>Login</el-button>
  </div>
</div>
</template>
<script>
  export default {
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>
<style>
</style>
