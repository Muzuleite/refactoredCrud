import { Component, signal, inject, OnInit } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ProductApi } from '../../DataAccess/product-api'; // ProductApi servisi
import { ProductResponseModel } from '../../Models/Products/ProductResponseModel';
import { createProductForm, toCreateProductRequest } from '../../Validations/Products/CreateProductFormFactory'; // Product form validator
import { updateProductForm, toUpdateProductRequest } from '../../Validations/Products/UpdateProductFormFactory'; // Product form validator

@Component({
  selector: 'app-product-operation',
  imports: [ReactiveFormsModule],
  templateUrl: './product-operation.html',
  styleUrls: ['./product-operation.css'],
})
export class ProductOperation implements OnInit {
  private productApi = inject(ProductApi);  // Product API servisinin injekte edilmesi

  protected products = signal<ProductResponseModel[]>([]);  // Ürün listesini tutacak signal

  protected selectedProduct = signal<ProductResponseModel | null>(null);  // Seçili ürünü tutacak signal

  protected createForm = createProductForm();  // Ürün oluşturma formu
  protected updateForm = updateProductForm();  // Ürün güncelleme formu

  private async refreshProducts(): Promise<void> {
    try {
      const values = await this.productApi.getAll();  // Ürünleri API'den çek
      this.products.set(values);  // Ürün listesine verileri set et
    } catch (error) {
      console.log("Ürün listesi alınamadı:", error);  // Hata mesajı
    }
  }

  async ngOnInit(): Promise<void> {
    await this.refreshProducts();  // Sayfa açıldığında ürünleri çek
  }

  async onCreate(): Promise<void> {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();  // Formun tüm alanlarını işaretle
      return;
    }

    const req = toCreateProductRequest(this.createForm);  // Formdan gelen veriyi request modeline çevir

    await this.productApi.create(req);  // API'ye yeni ürünü gönder

    this.createForm.reset();  // Formu sıfırla

    await this.refreshProducts();  // Ürün listesini yenile
  }

  startUpdate(product: ProductResponseModel): void {
    this.selectedProduct.set(product);  // Seçili ürünü set et

    this.updateForm.patchValue({
      id: product.id,
      productName: product.productName,
      unitPrice: product.unitPrice,
      categoryId: product.categoryId,
    }, { emitEvent: false });  // Ürün verilerini güncelleme formuna set et
  }

  cancelUpdate(): void {
    this.selectedProduct.set(null);  // Seçili ürünü temizle
    this.updateForm.reset({ id: 0, productName: '', unitPrice: 0, categoryId: 0 });  // Formu sıfırla
  }

  async onUpdate(): Promise<void> {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();  // Formun tüm alanlarını işaretle
      return;
    }

    const req = toUpdateProductRequest(this.updateForm);  // Formdan gelen veriyi request modeline çevir
    await this.productApi.update(req);  // API'ye güncellenmiş ürünü gönder
    this.cancelUpdate();  // Güncelleme işlemini iptal et
    await this.refreshProducts();  // Ürün listesini yenile
  }

  async onDelete(id: number): Promise<void> {
    const confirmDelete = window.confirm(`Id'si ${id} olan ürünü silmek istediğinize emin misiniz?`);  // Silme işlemi için onay al

    if (!confirmDelete) return;  // Eğer onay verilmezse işlem yapma

    try {
      const message = await this.productApi.deleteById(id);  // API'ye silme isteği gönder
      console.log('Delete mesajı:', message);  // Silme mesajını konsola yaz

      this.products.update((x) => x.filter((p) => p.id !== id));  // Ürün listesinden silinen ürünü çıkar

      const selected = this.selectedProduct();
      if (selected && selected.id === id) {
        this.selectedProduct.set(null);  // Seçili ürünü temizle
      }
    } catch (error) {
      console.log(error);  // Hata mesajı
    }
  }

  protected labels: Record<string, string> = {
    productName: 'Ürün Adı',
    unitPrice: 'Birim Fiyat',
    categoryId: 'Kategori ID',
    id: 'Id',
  };

  protected getErrorMessage(control: AbstractControl | null, label = 'Bu alan'): string | null {
    if (!control || (!control.touched && !control.dirty) || !control.invalid) return null;

    if (control.hasError('required')) return `${label} zorunludur.`;
    if (control.hasError('minlength')) {
      const e = control.getError('minlength');
      return `${label} en az ${e.requiredLength} karakter olmalıdır`;
    }
    if (control.hasError('maxlength')) {
      const e = control.getError('maxlength');
      return `${label} en fazla ${e.requiredLength} karakter olmalıdır`;
    }

    return `${label} geçersiz`;
  }

  protected getErrorMessageByName(form: { controls: Record<string, AbstractControl> }, controlName: string): string | null {
    const control = form.controls[controlName];
    const label = this.labels[controlName] ?? controlName;
    return this.getErrorMessage(control, label);
  }
}
