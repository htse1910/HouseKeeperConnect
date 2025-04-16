using Microsoft.AspNetCore.Http;

namespace BusinessObject.DTO
{
    public class WithdrawUpdateDTO
    {
        public int WithdrawID { get; set; }
        public int Status { get; set; }
        public IFormFile Picture { get; set; }
    }
}