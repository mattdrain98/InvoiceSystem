using InvoiceSystem.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace InvoiceSystem.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CustomerController : ControllerBase
    {
        [HttpGet(Name = "GetCustomers")]
        public IEnumerable<Customer> Get()
        {
            // Return a sample list of customers (replace with real data source as needed)
            return new List<Customer>
            {
                new Customer
                {
                    Id = 1,
                    Name = "John Doe",
                    BillingAddress = "123 Main St",
                    Email = "john.doe@example.com",
                    IsActive = true,
                    Created = DateTime.UtcNow
                },
                new Customer
                {
                    Id = 2,
                    Name = "Jane Smith",
                    BillingAddress = "456 Oak Ave",
                    Email = "jane.smith@example.com",
                    IsActive = false,
                    Created = DateTime.UtcNow
                }
            };
        }
    }
}
