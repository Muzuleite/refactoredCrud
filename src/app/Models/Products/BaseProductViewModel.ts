export abstract class BaseProductViewModel {
    productName: string;
    unitPrice: number;
    categoryId: number | null;  // CategoryId nullable olabilir

    constructor(productName: string, unitPrice: number, categoryId: number | null) {
        this.productName = productName;
        this.unitPrice = unitPrice;
        this.categoryId = categoryId;
    }
}
