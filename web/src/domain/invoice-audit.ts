export type InvoiceAuditEvent = {
  id: string;
  invoiceId: string;
  type:
    | "created"
    | "updated"
    | "status_changed"
    | "pdf_downloaded"
    | "archived";
  x;
  message: string;
  createdAt: string;
};
