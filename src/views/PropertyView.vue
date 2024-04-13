<script setup>
    import { watch } from 'vue';
    import { useRoute } from 'vue-router'
    import { doc } from 'firebase/firestore'
    import { useDocument, useFirestore } from 'vuefire'
    import "leaflet/dist/leaflet.css";
    import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
    import useLocationMap from '@/composables/useLocationMap';
    import { priceProperty } from '@/helpers';

    const { zoom, center } = useLocationMap()

    const route = useRoute()
    const db = useFirestore()
    const docRef = doc(db, 'properties', route.params.id)

    const property = useDocument(docRef)

    watch(property, (property) => {
        center.value = property.location
    })
</script>

<template>
    <v-card flat>
        <v-card-title class="mt-5 text-h3 text-center font-weight-bold">
            {{ property?.title }}
        </v-card-title>
        <v-img :src="property?.image" height="550" cover />
        <div class="bg-blue-grey-lighten-5 d-flex flex-column flex-md-row align-center">
            <v-card-text class="text-truncate">
            Precio: <span class="font-weight-bold">{{ priceProperty(property?.price) }}</span>
            </v-card-text>
            <v-card-text class="text-truncate">
            Baños: <span class="font-weight-bold">{{ property?.wc }}</span>
            </v-card-text>
            <v-card-text class="text-truncate">
            Estacionamiento: <span class="font-weight-bold">{{ property?.garages }}</span>
            </v-card-text>
            <v-card-text class="text-truncate">
            Habitaciones: <span class="font-weight-bold">{{ property?.rooms }}</span>
            </v-card-text>
        </div>
        <v-row>
            <v-col cols="120" md="7">
                <div class="test-pre-wrap py-10">
                    {{ property?.description }}
                </div>
            </v-col>
            <v-col cols="120" md="5">
                <div class="py-10" style="height: 600px;">
                    <LMap
                        v-model:zoom="zoom"
                        :center="center"
                        :use-global-leaflet="false"
                    >
                        <LMarker
                        :lat-lng="center"
                        >
                            <LPopup>{{ property?.title }}</LPopup>
                        </LMarker>
                        <LTileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        ></LTileLayer>
                    </LMap>
                </div>
            </v-col>
        </v-row>
    </v-card>
  
</template>
<style>
    .text-pre-wrap {
        white-space: pre-wrap;
    }
</style>
