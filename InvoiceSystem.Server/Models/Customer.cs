namespace InvoiceSystem.Server.Models
{
    public class Customer
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string BillingAddress { get; set; }
        public string Email { get; set;  }
        public bool IsActive { get; set; }
        public DateTime Created { get; set; }
    }
}
