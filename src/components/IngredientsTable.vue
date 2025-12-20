<template>

<v-toolbar>
    <template v-slot:default>
        <v-text-field v-model="newIngredientName" label="New ingredient"></v-text-field>
        <v-btn prepend-icon="mdi-plus" @click="addIngredient">Add ingredient</v-btn>
    </template>
</v-toolbar>

<v-data-table :headers="headers" :items="ingredients" hide-default-footer>
    <!-- eslint-disable-next-line vue/valid-v-slot this is from the example, not sure why linting dislikes -->
    <template v-slot:item.remove={item}>
        <v-btn icon="mdi-delete" variant="flat" @click="removeIngredient(item.name)"></v-btn>
    </template>
</v-data-table>

</template>

<script setup lang="ts">

import { ref, type Ref } from "vue";

let newIngredientName = ref("");
let ingredients: Ref<{name: string}[]> = ref([]);

let headers = [
    {
        key: "name",
        title: "Name"
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

    ingredients.value.push({name: newIngredientName.value});
}

function isEquivalent(string1: string, string2: string): boolean {
    return string1.toLowerCase().trim() === string2.toLowerCase().trim();
}

function removeIngredient(name: string) {
    let index = ingredients.value.findIndex(i => i.name === name);
    ingredients.value.splice(index, 1);
}

</script>
