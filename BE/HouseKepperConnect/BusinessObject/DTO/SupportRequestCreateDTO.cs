using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
