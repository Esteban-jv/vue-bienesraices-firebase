<script setup>
  import { useForm, useField } from 'vee-validate'
  import { collection, addDoc } from "firebase/firestore"; 
  import { useFirestore } from 'vuefire'
  import { useRouter } from 'vue-router';
  import { validationSchema, imageSchema } from '@/validation/propiedadSchema'
  import useImage from '@/composables/useImage';
  import useLocationMap from '@/composables/useLocationMap';
  import "leaflet/dist/leaflet.css";
  import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";

  const items = [1,2,3,4]
  const { handleSubmit } = useForm({
    validationSchema: {
      ...validationSchema,
      ...imageSchema
    }
  })
  const { url, uploadImage, imageComputed } = useImage()
  const { zoom, center, pin } = useLocationMap()

  const router = useRouter()
  const db = useFirestore()

  const title = useField('title')
  const image = useField('image')
  const price = useField('price')
  const rooms = useField('rooms')
  const wc = useField('wc')
  const garages = useField('garages')
  const description = useField('description')
  const pool = useField('pool', null, {
    initialValue: false
  })

  const submit = handleSubmit(async (values) => {
    const { image, ... propiedad } = values
    // Add a new document with a generated id.
    const docRef = await addDoc(collection(db, "properties"), {
      ...propiedad,
      image: url.value,
      location: center.value
    });
    // console.log("Document written with ID: ", docRef.id);
    if(docRef.id) {
      router.push({name: 'admin-properties'})
    }
  })
</script>

<template>
  <v-card
    class="mx-auto my-10" max-width="800" flat
  >
  <v-card-title
      class="text-h4 font-weight-bold"
      tag="h3"
    >
      Nueva propiedad
    </v-card-title>
    <v-card-subtitle
      class="text-h5 py-5"
    >
      Crea una nueva propiedad llenando el siguiente formulario
    </v-card-subtitle>

    <v-form class="mt-10">
      <v-text-field
        class="mb-5"
        label="Título propiedad"
        v-model="title.value.value"
        :error-messages="title.errorMessage.value"
      />
      <v-file-input
        class="mb-5"
        label="Fotografía"
        accept="image/.jpg"
        prepend-icon="mdi-camera"
        v-model="image.value.value"
        :error-messages="image.errorMessage.value"
        @change="uploadImage"
      />
      <div v-if="imageComputed" class="my-5">
        <p class="font-weight-bold">Imagen propiedad</p>
        <img :src="imageComputed" alt="Vista cargada" class="w-50" />
      </div>
      <v-text-field
        type="number"
        class="mb-5"
        label="Precio"
        v-model="price.value.value"
        :error-messages="price.errorMessage.value"
      />
      <v-row>
        <v-col cols="12" md="4">
          <v-select
            label="Habitaciones"
            class="mb-5"
            :items="items"
            v-model="rooms.value.value"
            :error-messages="rooms.errorMessage.value"
          >
          </v-select>
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            :items="items"
            class="mb-5"
            label="WC"
            v-model="wc.value.value"
            :error-messages="wc.errorMessage.value"
          >
          </v-select>
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            :items="items"
            class="mb-5"
            label="Lugares de estacionamiento"
            v-model="garages.value.value"
            :error-messages="garages.errorMessage.value"
          >

          </v-select>
        </v-col>
      </v-row>
      <v-textarea
        class="mb-5"
        label="Descripción"
        v-model="description.value.value"
        :error-messages="description.errorMessage.value"
      ></v-textarea>
      <v-checkbox
        label="Alberca"
        v-model="pool.value.value"
        :error-messages="pool.errorMessage.value"
      />
      <h2 class="font-weight-bold text-center mb-3">Ubicación</h2>
      <div class="py-10">
        <div style="height:600px">
          <LMap
            v-model:zoom="zoom"
            :center="center"
            :use-global-leaflet="false"
        >
            <LMarker
              :lat-lng="center"
              draggable
              @moveend="pin"
            />
            <LTileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            ></LTileLayer>
          </LMap>
        </div>
      </div>

      <v-btn
        color="pink-accent-3"
        block
        @click="submit"
      >
        Agregar propiedad
      </v-btn>
    </v-form>
  </v-card>
</template>
