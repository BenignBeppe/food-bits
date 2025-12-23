<template>

<v-container>
    <v-row>
        <v-col cols="12">
            <v-text-field
                v-model="newIngredientName"
                label="New ingredient"
                @keypress.enter="addIngredient"
            ></v-text-field>
        </v-col>
        <v-col cols="6" md="3">
            <v-number-input
                v-model="newIngredientWeight"
                label="Weight (g)"
                @keypress.enter="addIngredient"
                :min="1"
            ></v-number-input>
        </v-col>
        <v-col cols="6" md="3">
            <v-number-input
                v-model="newIngredientCarbs"
                label="Carbs (g/100 g)"
                @keypress.enter="addIngredient"
                :min="0"
            ></v-number-input>
        </v-col>
        <v-col cols="6" md="3">
            <v-number-input
                v-model="newIngredientSugar"
                label="Sugar (g/100 g)"
                @keypress.enter="addIngredient"
                :min="0"
            ></v-number-input>
        </v-col>
        <v-col cols="6" md="3">
            <v-btn prepend-icon="mdi-plus" @click="addIngredient">
                Add ingredient
            </v-btn>
        </v-col>
    </v-row>
</v-container>

<v-container>
    <v-number-input
        v-model="servingWeight"
        label="Serving weight (g)"
        :min="1"
    ></v-number-input>

    <v-card>
        <p>
            {{ serving.carbs }} g carbs
        </p>
        <p>
            {{ serving.sugar }} g sugar
        </p>
    </v-card>
</v-container>

<v-data-table :headers="headers" :items="recipe" hide-default-footer>
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

import { computed, ref, type Ref } from "vue";

let newIngredientName = ref("");
let newIngredientWeight = ref(100);
let newIngredientCarbs = ref(0);
let newIngredientSugar = ref(0);
let servingWeight = ref(100);
interface Ingredient {
    name: string;
    weight: number;
    carbs: number;
    sugar: number;
}
let recipe: Ref<Ingredient[]> = ref([]);

let headers = [
    {
        key: "name",
        title: "Name"
    },
    {
        key: "weight",
        title: "Weight (g)"
    },
    {
        key: "carbs",
        title: "Carbs (g/100 g)"
    },
    {
        key: "sugar",
        title: "Sugar (g/100 g)"
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

    if(recipe.value.some(
        (i) => isEquivalent(i.name, newIngredientName.value)
    )) {
        // Already exists.
        return;
    }

    if(newIngredientSugar.value > newIngredientCarbs.value) {
        // There can't be more sugar than total carbs.
        return;
    }

    recipe.value.push({
        name: newIngredientName.value,
        weight: newIngredientWeight.value,
        carbs: newIngredientCarbs.value,
        sugar: newIngredientSugar.value
    });
}

function isEquivalent(string1: string, string2: string): boolean {
    return string1.toLowerCase().trim() === string2.toLowerCase().trim();
}

function removeIngredient(name: string) {
    let index = recipe.value.findIndex(i => i.name === name);
    recipe.value.splice(index, 1);
}

let serving = computed(() => {
    if(!recipe.value.length) {
        return { carbs: 0, sugar: 0 };
    }

    let carbsWeight = 0;
    let sugarWeight = 0;
    let recipeWeight = 0;
    recipe.value.forEach((i) => { recipeWeight += i.weight; });
    recipe.value.forEach((i) => {
        carbsWeight += i.carbs / 100 * i.weight;
        sugarWeight += i.sugar / 100 * i.weight;
    });
    let partCarbs = carbsWeight / recipeWeight;
    let partSugar = sugarWeight / recipeWeight;
    let totals = {
        carbs: partCarbs * servingWeight.value,
        sugar: partSugar * servingWeight.value
    };
    return totals;
});

</script>
