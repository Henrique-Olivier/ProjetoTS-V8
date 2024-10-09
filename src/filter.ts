import { Product } from "./model/products";


export function productsFilter(input: HTMLInputElement ,products: Product[], categorieId: HTMLSelectElement): Product[] {
    let filteredProducts: Product[] = products
    
    let toSearch =  removeAccents(input.value);
    console.log(toSearch)


    if(toSearch) {
        const normalizedSearch = removeAccents(toSearch.toLowerCase())

        filteredProducts = products.filter( product => {
            const normalizedProductName = removeAccents(product.name.toLowerCase())
            return normalizedProductName.includes(normalizedSearch)
        })
    }

    if(categorieId.value) {
        filteredProducts = filteredProducts.filter(product => {
            return product.category_id === categorieId.value
        }) 
    }
    
    return filteredProducts;
}

function removeAccents(string: String): string {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}