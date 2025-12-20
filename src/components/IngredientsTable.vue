<template>

<v-toolbar>
    <template v-slot:default>
        <v-text-field
            v-model="newIngredientName"
            label="New ingredient"
            @keypress.enter="addIngredient"
        ></v-text-field>
        <v-number-input
            v-model="newIngredientCarbs"
            label="Carbs"
            @keypress.enter="addIngredient"
            :min="0"
        ></v-number-input>
        <v-number-input
            v-model="newIngredientSugar"
            label="Sugar"
            @keypress.enter="addIngredient"
            :min="0"
            :max="newIngredientCarbs"
        ></v-number-input>
        <v-btn prepend-icon="mdi-plus" @click="addIngredient">
            Add ingredient
        </v-btn>
    </template>
</v-toolbar>

<v-data-table :headers="headers" :items="ingredients" hide-default-footer>
    <!-- eslint-disable-next-line vue/valid-v-slot this is from the example, not sure why linting dislikes -->
    <template v-slot:item.remove={item}>
        <v-btn
            icon="mdi-delete"
            variant="flat"
            @click="removeIngredient(item.name)"
        ></v-btn>
    </template>
</v-data-table>

</template>

<script setup lang="ts">

import { ref, type Ref } from "vue";

let newIngredientName = ref("");
let newIngredientCarbs = ref(0);
let newIngredientSugar = ref(0);
let ingredients: Ref<{name: string, carbs: number, sugar: number}[]> = ref([]);

let headers = [
    {
        key: "name",
        title: "Name"
    },
    {
        key: "carbs",
        title: "Carbs"
    },
    {
        key: "sugar",
        title: "Sugar"
    },
    {
        key: "remove",
        title: "Remove",
        sortable: false
    }
];

function addIngredient() {
    if(!newIngredientName.value.trim()) {
        // No name.
        return;
    }

    if(ingredients.value.some(
        (i) => isEquivalent(i.name, newIngredientName.value)
    )) {
        // Already exists.
        return;
    }

    if(newIngredientSugar.value > newIngredientCarbs.value) {
        // There can't be more sugar than total carbs.
        return;
    }

    ingredients.value.push({
        name: newIngredientName.value,
        carbs: newIngredientCarbs.value,
        sugar: newIngredientSugar.value
    });
}

function isEquivalent(string1: string, string2: string): boolean {
    return string1.toLowerCase().trim() === string2.toLowerCase().trim();
}

function removeIngredient(name: string) {
    let index = ingredients.value.findIndex(i => i.name === name);
    ingredients.value.splice(index, 1);
}

</script>
