import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

export interface Invoice {
  id: string;
  number: string;
  date: string; // ISO date string
  dueDate?: string;
  customerName: string;
  total: number;
  status?: 'Draft' | 'Pending' | 'Paid' | 'Overdue';
  // preserve additional fields if present
  [key: string]: any;
}

@Component({
  selector: 'app-invoices',
  templateUrl: 'invoices.component.html',
})
export class InvoicesComponent implements OnInit, OnChanges {
  // Input array of invoices; if not provided component will use internal sample data
  @Input() invoices: Invoice[] = [];

  // Optional page size
  @Input() pageSize = 10;

  // Emits when an invoice is selected
  @Output() invoiceSelected = new EventEmitter<Invoice>();

  // Filter / UI state
  filterText = '';
  currentPage = 1;
  pagedInvoices: Invoice[] = [];
  totalPages = 1;

  // Internal copy to operate on
  private _workingSet: Invoice[] = [];

  constructor() {}

  ngOnInit(): void {
    if (!this.invoices || this.invoices.length === 0) {
      // Provide lightweight sample data so the component is usable without inputs.
      this.invoices = this.getSampleInvoices();
    }
    this.resetAndApply();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['invoices'] && !changes['invoices'].isFirstChange()) {
      this.resetAndApply();
    }
  }

  // Public API to refresh (useful when parent updates data in-place)
  refresh(): void {
    this.resetAndApply();
  }

  applyFilter(text: string): void {
    this.filterText = (text || '').trim().toLowerCase();
    this.currentPage = 1;
    this.resetAndApply();
  }

  gotoPage(page: number): void {
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;
    this.currentPage = page;
    this.updatePagedInvoices();
  }

  selectInvoice(inv: Invoice): void {
    this.invoiceSelected.emit(inv);
  }

  trackById(_: number, item: Invoice): string {
    return item.id;
  }

  private resetAndApply(): void {
    // clone to avoid mutating parent-provided array
    this._workingSet = Array.isArray(this.invoices) ? [...this.invoices] : [];
    this.applySearch();
    this.updatePagedInvoices();
  }

  private applySearch(): void {
    if (!this.filterText) {
      return;
    }
    const q = this.filterText;
    this._workingSet = this._workingSet.filter(i =>
      (
        (i.number || '') +
        ' ' +
        (i.customerName || '') +
        ' ' +
        (i.status || '') +
        ' ' +
        (i.id || '')
      )
        .toLowerCase()
        .includes(q)
    );
  }

  private updatePagedInvoices(): void {
    const total = this._workingSet.length;
    this.totalPages = Math.max(1, Math.ceil(total / this.pageSize));
    // clamp current page
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedInvoices = this._workingSet.slice(start, start + this.pageSize);
  }

  // Lightweight sample data used only when no input is provided.
  private getSampleInvoices(): Invoice[] {
    return [
      {
        id: '1',
        number: 'INV-001',
        date: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        customerName: 'Acme Corp',
        total: 1250.5,
        status: 'Pending',
      },
      {
        id: '2',
        number: 'INV-002',
        date: new Date().toISOString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        customerName: 'Contoso Ltd',
        total: 3200,
        status: 'Draft',
      },
    ];
  }
}
