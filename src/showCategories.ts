import { Categorie } from "./model/categories.ts";

export function showCategories (categories: Categorie[], elemento: HTMLElement): void {

    const template = ` 
        <option value = ''>Todas</option>
        ${categories.map(categorie => {
            return `
            <option value = '${categorie.id}'>${categorie.name}</option>
            `
        })}
    ` 
    elemento.innerHTML = template;
}