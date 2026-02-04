/**
 * Model: InvoiceLineItem
 *
 * Represents a single line item on an invoice.
 * Designed for use in the client application.
 */

export class InvoiceLineItem {
  id?: string;
  invoiceId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // expressed as decimal (e.g., 0.2 for 20%)
  discount: number; // absolute discount amount applied to the line
  createdAt?: string | Date;
  updatedAt?: string | Date;

  constructor(init?: Partial<InvoiceLineItem>) {
    this.id = init?.id;
    this.invoiceId = init?.invoiceId;
    this.description = init?.description ?? '';
    this.quantity = init?.quantity ?? 1;
    this.unitPrice = init?.unitPrice ?? 0;
    this.taxRate = init?.taxRate ?? 0;
    this.discount = init?.discount ?? 0;
    this.createdAt = init?.createdAt;
    this.updatedAt = init?.updatedAt;
  }

  // Subtotal before tax (and after discount)
  get subtotal(): number {
    const raw = this.quantity * this.unitPrice - this.discount;
    return InvoiceLineItem.roundToCents(Math.max(0, raw));
  }

  // Tax amount for this line
  get taxAmount(): number {
    return InvoiceLineItem.roundToCents(this.subtotal * this.taxRate);
  }

  // Total including tax
  get total(): number {
    return InvoiceLineItem.roundToCents(this.subtotal + this.taxAmount);
  }

  // Simple validation that returns an array of error messages (empty when valid)
  validate(): string[] {
    const errors: string[] = [];
    if (!this.description || this.description.trim().length === 0) {
      errors.push('Description is required.');
    }
    if (!Number.isFinite(this.quantity) || this.quantity <= 0) {
      errors.push('Quantity must be greater than 0.');
    }
    if (!Number.isFinite(this.unitPrice) || this.unitPrice < 0) {
      errors.push('Unit price must be 0 or greater.');
    }
    if (!Number.isFinite(this.taxRate) || this.taxRate < 0) {
      errors.push('Tax rate must be 0 or greater.');
    }
    if (!Number.isFinite(this.discount) || this.discount < 0) {
      errors.push('Discount must be 0 or greater.');
    }
    if (this.discount > this.quantity * this.unitPrice) {
      errors.push('Discount cannot exceed line subtotal before discount.');
    }
    return errors;
  }

  // Serialize to plain object (suitable for API)
  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      invoiceId: this.invoiceId,
      description: this.description,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      taxRate: this.taxRate,
      discount: this.discount,
      subtotal: this.subtotal,
      taxAmount: this.taxAmount,
      total: this.total,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Create model from API/plain object
  static fromJSON(obj: Partial<InvoiceLineItem> | null | undefined): InvoiceLineItem {
    if (!obj) return new InvoiceLineItem();
    return new InvoiceLineItem({
      id: obj.id,
      invoiceId: obj.invoiceId,
      description: typeof obj.description === 'string' ? obj.description : '',
      quantity: typeof obj.quantity === 'number' ? obj.quantity : Number(obj.quantity) || 0,
      unitPrice: typeof obj.unitPrice === 'number' ? obj.unitPrice : Number(obj.unitPrice) || 0,
      taxRate: typeof obj.taxRate === 'number' ? obj.taxRate : Number(obj.taxRate) || 0,
      discount: typeof obj.discount === 'number' ? obj.discount : Number(obj.discount) || 0,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    });
  }

  // Helper to round to two decimal places (cents)
  private static roundToCents(amount: number): number {
    return Math.round((amount + Number.EPSILON) * 100) / 100;
  }
}
