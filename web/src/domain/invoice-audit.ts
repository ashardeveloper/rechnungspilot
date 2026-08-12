export type InvoiceAuditEvent = {
  id: string;
  invoiceId: string;
  type:
    | "created"
    | "updated"
    | "status_changed"
    | "pdf_downloaded"
    | "xrechnung_downloaded"
    | "archived";
  message: string;
  createdAt: string;
};
