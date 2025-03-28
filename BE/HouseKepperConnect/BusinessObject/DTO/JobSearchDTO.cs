using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.DTO
{
    public class JobSearchDto
    {
        public string? Keyword { get; set; }     
        public string? Location { get; set; }    
        public string? JobType { get; set; }      
        public string? SalaryRange { get; set; }  
    }
}
