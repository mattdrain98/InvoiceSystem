export enum InvoiceStatus {
  Draft = 'Draft',
  Sent = 'Sent',
  Paid = 'Paid',
  Overdue = 'Overdue',
  Cancelled = 'Cancelled'
}

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number; // percentage, e.g., 20 for 20%
  discount?: number; // absolute value discount
}

export interface InvoiceDTO {
  id?: string;
  number?: string;
  customerId?: string;
  issueDate?: string; // ISO string
  dueDate?: string; // ISO string
  items: InvoiceItem[];
  currency?: string;
  notes?: string;
  status?: InvoiceStatus;
  createdAt?: string;
  updatedAt?: string;
}

export class Invoice {
  id?: string;
  number?: string;
  customerId?: string;
  issueDate?: Date;
  dueDate?: Date;
  items: InvoiceItem[] = [];
  currency: string = 'USD';
  notes?: string;
  status: InvoiceStatus = InvoiceStatus.Draft;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data?: Partial<InvoiceDTO>) {
    if (!data) return;
    this.id = data.id;
    this.number = data.number;
    this.customerId = data.customerId;
    this.issueDate = data.issueDate ? new Date(data.issueDate) : undefined;
    this.dueDate = data.dueDate ? new Date(data.dueDate) : undefined;
    this.items = (data.items || []).map(i => ({
      id: i.id,
      description: i.description,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      taxRate: i.taxRate ?? 0,
      discount: i.discount ?? 0
    }));
    this.currency = data.currency ?? this.currency;
    this.notes = data.notes;
    this.status = data.status ?? this.status;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : undefined;
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : undefined;
  }

  addItem(item: InvoiceItem) {
    this.items.push({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      taxRate: item.taxRate ?? 0,
      discount: item.discount ?? 0
    });
    this.touch();
  }

  removeItem(index: number) {
    if (index < 0 || index >= this.items.length) return;
    this.items.splice(index, 1);
    this.touch();
  }

  updateItem(index: number, item: Partial<InvoiceItem>) {
    if (index < 0 || index >= this.items.length) return;
    const existing = this.items[index];
    this.items[index] = {
      ...existing,
      ...item,
      taxRate: item.taxRate ?? existing.taxRate ?? 0,
      discount: item.discount ?? existing.discount ?? 0
    };
    this.touch();
  }

  calculateLineTotal(item: InvoiceItem): number {
    const qty = Math.max(0, item.quantity || 0);
    const unit = Math.max(0, item.unitPrice || 0);
    const discount = Math.max(0, item.discount || 0);
    const net = qty * unit - discount;
    const tax = (item.taxRate ?? 0) / 100;
    return Math.max(0, net + net * tax);
  }

  calculateSubtotal(): number {
    return this.items.reduce((sum, item) => {
      const qty = Math.max(0, item.quantity || 0);
      const unit = Math.max(0, item.unitPrice || 0);
      const discount = Math.max(0, item.discount || 0);
      return sum + Math.max(0, qty * unit - discount);
    }, 0);
  }

  calculateTaxTotal(): number {
    return this.items.reduce((sum, item) => {
      const qty = Math.max(0, item.quantity || 0);
      const unit = Math.max(0, item.unitPrice || 0);
      const discount = Math.max(0, item.discount || 0);
      const net = Math.max(0, qty * unit - discount);
      const tax = (item.taxRate ?? 0) / 100;
      return sum + net * tax;
    }, 0);
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateTaxTotal();
  }

  isOverdue(referenceDate?: Date): boolean {
    if (!this.dueDate) return false;
    const now = referenceDate ?? new Date();
    return this.status !== InvoiceStatus.Paid && this.dueDate < now;
  }

  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!this.customerId) errors.push('Customer is required.');
    if (!this.issueDate) errors.push('Issue date is required.');
    if (!this.items || this.items.length === 0) errors.push('At least one invoice item is required.');
    for (let i = 0; i < this.items.length; i++) {
      const it = this.items[i];
      if (!it.description) errors.push(`Item ${i + 1}: description is required.`);
      if ((it.quantity ?? 0) <= 0) errors.push(`Item ${i + 1}: quantity must be greater than zero.`);
      if ((it.unitPrice ?? 0) < 0) errors.push(`Item ${i + 1}: unit price cannot be negative.`);
    }
    return { valid: errors.length === 0, errors };
  }

  toDTO(): InvoiceDTO {
    return {
      id: this.id,
      number: this.number,
      customerId: this.customerId,
      issueDate: this.issueDate ? this.issueDate.toISOString() : undefined,
      dueDate: this.dueDate ? this.dueDate.toISOString() : undefined,
      items: this.items.map(i => ({ ...i })),
      currency: this.currency,
      notes: this.notes,
      status: this.status,
      createdAt: this.createdAt ? this.createdAt.toISOString() : undefined,
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : undefined
    };
  }

  private touch() {
    this.updatedAt = new Date();
  }
}
