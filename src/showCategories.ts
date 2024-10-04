import { Categorie } from "./model/categories.ts";

export function showCategories (categories: Categorie[], elemento: HTMLElement): void {

    const template = ` 
        <option>Todas</option>
        ${categories.map(categorie => {
            return `
            <option>${categorie.name}</option>
            `
        })}
    ` 

    elemento.innerHTML = template;
}