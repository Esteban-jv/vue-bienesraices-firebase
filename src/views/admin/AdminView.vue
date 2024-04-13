<script setup>
  import usePropiedades from '@/composables/usePropiedades';
  import { priceProperty } from '@/helpers';

  const { propertiesCollection, deleteItem } = usePropiedades()
  console.log(propertiesCollection)
</script>

<template>
  <h2 class="text-center text-h3 font-weight-bold my-5">Admin panel</h2>

  <v-btn
    color="blue"
    variant="flat"
    :to="{name :'new-porperty'}"
  >
    Nueva propiedad
  </v-btn>

  <v-card
    class="mx-auto mt-10"
    flat
  >
    <v-list>
      <v-list-item
        v-for="property in propertiesCollection"
        :key="property.id"
      >
        <template v-slot:prepend>
          <v-list-item-media :start="true">
            <img width="180" :src="property.image" />
          </v-list-item-media>
        </template>
        <v-list-item-title>{{ property.title }}</v-list-item-title>
        <v-list-item-subtitle>{{ priceProperty(property.price) }}</v-list-item-subtitle>
        <template v-slot:append>
          <v-btn
            color="info"
            flat
            class="mr-2"
            :to="{name: 'edit-property', params: {
              id: property.id
            }}"
          >
            Editar
          </v-btn>

          <v-btn
            color="red-darken-3"
            flat
            @click="deleteItem(property.id, property.image)"
          >
            Eliminar
          </v-btn>
        </template>

      </v-list-item>
    </v-list>


  </v-card>
</template>
