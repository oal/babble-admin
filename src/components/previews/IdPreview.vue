<template>
  <div>
    <span
      v-for="part in parts"
      :key="part"
    >{{ part }}</span>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: String
  },

  computed: {
    parts () {
      return this.modelValue.split('/')
    }
  }
}
</script>

<style scoped>
div {
  white-space: nowrap;
}

span {
  text-transform: uppercase;
  font-size: 80%;
  font-weight: bold;
  opacity: 0.7;
}

span:after {
  content: '/';
  padding: 0 0.5rem;
  font-weight: bolder;
  text-shadow: 1px 0 0 #000;
  opacity: 0.5;
  font-size: 160%;
  vertical-align: middle;
}

span:last-child:after {
  display: none;
}
</style>
