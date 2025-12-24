import { BaseProductViewModel } from "./BaseProductViewModel";
import { BaseCategoryViewModel } from "../Categories/BaseCategoryViewModel";
export class ProductResponseModel extends BaseProductViewModel {
    id: number;
    category: BaseCategoryViewModel;

    constructor(
        id: number,
        productName: string,
        unitPrice: number,
        categoryId: number,
        category: BaseCategoryViewModel
    ) {
        super(productName, unitPrice, categoryId);
        this.id = id;
        this.category = category;
    }

    
}
