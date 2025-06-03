<template>
  <v-row>
    <v-col cols="3" class="text-center">
      <v-btn color="success" :to="'/vumetro'">VUMETRO</v-btn>
    </v-col>
    <v-col cols="3" class="text-center">
      <v-btn color="success" :to="'/retransmision'">RETRANSMISION</v-btn>
    </v-col>
  </v-row>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { onMounted, ref, watch } from 'vue'
  import { useSwiftConnectionStore } from '@/stores/swiftconnection'
  import { storeToRefs } from 'pinia'

  const swiftConnectionStore = useSwiftConnectionStore()

  const router = useRouter()


  

</script>

<style lang="scss" scoped>

</style>