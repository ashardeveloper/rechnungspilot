export type InvoiceAuditEvent = {
  id: string;
  invoiceId: string;
  type: "created" | "updated" | "status_changed" | "pdf_downloaded";
  message: string;
  createdAt: string;
};
