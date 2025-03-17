using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.DTO
{
    public class ReportCreateDTO
    {
        public int BookingID { get; set; }
        public int AccountID { get; set; }
        public string Reason { get; set; }
        
    }
}
