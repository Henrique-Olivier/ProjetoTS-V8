export class Product {
    constructor (
        public readonly id: string,
        public readonly name: string,
        public readonly resume: string ,
        public readonly category_id: string,
        public readonly price: number
    ) {}
}