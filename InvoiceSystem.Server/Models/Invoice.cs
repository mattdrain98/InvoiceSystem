namespace InvoiceSystem.Server.Models
{
    public class Invoice
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public int InvoiceNumber { get; set; }
        public DateTime IssueDate { get; set;}
        public DateTime DueDate { get; set; }
        public string Status { get; set; }
        public double Subtotal { get; set; }
        public double Tax { set; get; }
        public double Total { get; set; }
    }
}
