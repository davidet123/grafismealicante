<template>
  <v-row>
    <v-col class="text-center">
      <h3>GRAFISME ALICANTE</h3>
      
    </v-col>
  </v-row>
  <v-row>
    <v-col class="text-center">
      <video id="myVideoId" width="620" height="349" autoplay muted playsinline/>
    </v-col>
  </v-row>
  <v-divider></v-divider>
  <v-row>
    <v-col>

      <Vumetro />

    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <GraphViewer />
    </v-col>
  </v-row>
  <v-divider>

  </v-divider>
</template>

<script setup>
  import { onMounted, ref, watch } from 'vue'
  import { useVumetroStore } from '@/stores/vumetro'
  import { useSwiftConnectionStore } from '@/stores/swiftconnection'
  import Vumetro from '@/components/Vumetro.vue'
  import GraphViewer from '@/components/GraphViewer.vue'
import { storeToRefs } from 'pinia'

  const swiftConnectionStore = useSwiftConnectionStore()
  const vumetro = useVumetroStore()

  const { levelMapped, level130 } = storeToRefs(vumetro)

  onMounted(() => {
    vumetro.fetchAudioDevices()
  })

  swiftConnectionStore.startVideo()
  swiftConnectionStore.startConnection()

  watch(() => level130.value, val => {
    swiftConnectionStore.rtRemote.updateFields("VALOR_VUMETRO::VALOR_VUMETROTEXT","String",val)
  })
  watch(() => levelMapped.value, val => {
    swiftConnectionStore.rtRemote.updateFields("CLIP_VUMETRO","Translate",val)
  })

</script>

<style lang="scss" scoped>

</style>