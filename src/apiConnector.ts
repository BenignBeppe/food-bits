const API_URL = "https://dataportal.livsmedelsverket.se/livsmedel";
const API_ENDPOINT = API_URL + "/api/v1/livsmedel";

export async function fetchIngredients(): Promise<{ [key: string]: { name: string; }; }> {
    let ingredients: { [key: string]: {name: string} } = {};

    let url: URL | null = new URL(API_ENDPOINT);
    console.log(url.toString());
    while(url) {
        url.searchParams.set("limit", "1000");
        let response = await (await fetch(url)).json();
        console.log(await response);

        for(let ingredient of response.livsmedel) {
            ingredients[ingredient.nummer] = { name: ingredient.namn };
        }

        if(!response._links) {
            break;
        }

        url = null;
        for(let link of response._links) {
            if(link.rel === "next") {
                url = new URL(API_URL + link.href);
            }
        }
    }

    console.log(ingredients);
    return ingredients;
}

export async function fetchIngredient(id: string) {
    let url = new URL(API_ENDPOINT);
    url.href += `/${id}/naringsvarden`;
    let response = await (await fetch(url)).json();
    return response;
}
