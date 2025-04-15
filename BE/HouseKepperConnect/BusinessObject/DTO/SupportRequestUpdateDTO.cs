using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.DTO
{
    public class SupportRequestUpdateDTO
    {
        public int RequestID { get; set; }
        public int AccountID { get; set; }
        public string Content { get; set; }
    }
}
