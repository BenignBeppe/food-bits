<template>

<v-container>
    <v-list :items="recipeList" @click:select="setRecipe"></v-list>
</v-container>

</template>

<script setup lang="ts">

import { computed } from "vue";

import { recipe, recipeName, recipeBook } from "../recipes.ts";

let recipeList = computed(() => {
    let list = [];
    for(let name of Object.keys(recipeBook.value)) {
        list.push({title: name, value: name});
    }
    return list;
});

function setRecipe(e) {
    console.log(e);
    let name = e.id;
    let newRecipe = recipeBook.value[name];
    recipe.value = newRecipe;
    recipeName.value = name;
}

</script>
