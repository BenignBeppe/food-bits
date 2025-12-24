import { useStorage } from "@vueuse/core";

interface Ingredient {
    name: string;
    weight: number;
    carbs: number;
    sugar: number;
}
let defaultRecipe: Ingredient[] = [];
export let recipe = useStorage("recipe", defaultRecipe);
export let recipeName = useStorage("recipeName", "");
let defaultRecipeBook: { [key: string]: Ingredient[] } = {};
export let recipeBook = useStorage("recipeBook", defaultRecipeBook);
