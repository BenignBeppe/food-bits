<template>

<v-app>
    <v-main>
        <router-view />
    </v-main>
    <v-bottom-navigation>
        <v-btn value="recipe" to="/recipe">
            <v-icon>mdi-list-box</v-icon>
            <span>Recipe</span>
        </v-btn>
        <v-btn value="recipe-book" to="/recipe-book">
            <v-icon>mdi-book</v-icon>
            <span>Recipe book</span>
        </v-btn>
    </v-bottom-navigation>
</v-app>

</template>

<script lang="ts" setup>
//
</script>
