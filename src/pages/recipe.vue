<!-- eslint-disable vue/multi-word-component-names -->
<template>

<v-container>
    <v-row>
        <v-col cols="12">
            <v-combobox
                label="New ingredient"
                :items="ingredientNames"
                v-model="newIngredientName"
                @keypress.enter="addIngredient"
            ></v-combobox>
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
                :precision="1"
            ></v-number-input>
        </v-col>
        <v-col cols="6" md="3">
            <v-number-input
                v-model="newIngredientSugar"
                label="Sugar (g/100 g)"
                @keypress.enter="addIngredient"
                :min="0"
                :precision="1"
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

<v-container>
    <v-row>
        <v-col>
            <v-text-field label="Recipe name" v-model="recipeName"></v-text-field>
        </v-col>
        <v-col cols="auto">
            <v-btn prepend-icon="mdi-content-save" @click="saveRecipe">
                Save recipe
            </v-btn>
        </v-col>
    </v-row>
</v-container>

<v-data-table
    :headers="headers"
    :items="recipe"
    items-per-page="-1"
    hide-default-footer
>
    <!-- eslint-disable-next-line vue/valid-v-slot this is from the example, not sure why linting dislikes -->
    <template v-slot:item.remove={item}>
        <v-btn
            icon="mdi-delete"
            variant="flat"
            @click="removeIngredient(item.name)"
        ></v-btn>
    </template>
</v-data-table>

<v-footer>
    <p>Uses data from <a href="https://www.livsmedelsverket.se/om-oss/psidata/livsmedelsdatabasen">Livsmedelsverket's API</a> licensed under <a href="https://creativecommons.org/licenses/by/4.0/legalcode.sv">CC-BY</a></p>
</v-footer>

</template>

<script setup lang="ts">

import { computed, ref, watch, type Ref } from "vue";

import { fetchIngredient, fetchIngredients } from "../apiConnector.ts";
import { recipe, recipeBook, recipeName } from "../recipes.ts";

let availableIngredients: object;
let ingredientNames: Ref<string[]> = ref([]);
let newIngredientName = ref("");
let newIngredientWeight = ref(100);
let newIngredientCarbs = ref(0);
let newIngredientSugar = ref(0);
let servingWeight = ref(100);

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

loadIngredients();

async function loadIngredients() {
    availableIngredients = await fetchIngredients();
    ingredientNames.value = Object.values(availableIngredients).map((i) => i.name);
}

watch(newIngredientName, async () => {
    let id;
    for(let i of Object.entries(availableIngredients)) {
        if(i[1].name === newIngredientName.value) {
            id = i[0];
            break;
        }
    }
    if(!id) {
        return;
    }

    let ingredientValues = await fetchIngredient(id);
    for(let value of ingredientValues) {
        if(value.euroFIRkod === "CHO") {
            newIngredientCarbs.value = value.varde;
        } else if(value.euroFIRkod === "SUGAR") {
            newIngredientSugar.value = value.varde;
        }
    }
});

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

function saveRecipe() {
    // Need to create a new array here so it doesn't point to object in another
    // recipe.
    recipeBook.value[recipeName.value] = Array.from(recipe.value);
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
