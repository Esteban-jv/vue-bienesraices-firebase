<script setup>
  import usePropiedades from '@/composables/usePropiedades';
  import Propiedad from '@/components/Propiedad.vue';
  import { priceProperty } from '@/helpers';

  const { pool, filteredItems } = usePropiedades()
</script>

<template>
  <h1 class="text-center text-h3 font-weight-bold my-5">Nuestras propiedades</h1>
  <v-card class="py-10" flat>
    <v-card-title class="text-h5">
      Búsqueda
      <v-checkbox label="Alberca" v-model="pool" />
    </v-card-title>
    <v-row>
      <Propiedad
        v-for="property in filteredItems"
        :key="property.id"
        :property="property"
        :price="priceProperty(property.price)"
      />
    </v-row>
  </v-card>
</template>
