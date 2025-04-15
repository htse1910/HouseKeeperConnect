using Microsoft.AspNetCore.Http;

namespace BusinessObject.DTO
{
    public class SupportRequestCreateDTO
    {
        public int RequestedBy { get; set; }
        public int Type { get; set; }
        public string Content { get; set; }
        public IFormFile? Picture { get; set; }
    }
}