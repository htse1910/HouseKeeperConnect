using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.DTO
{
    public class ChatDTO
    {
        public int FromAccountId { get; set; }
        public int ToAccountId { get; set; }
        public string Message { get; set; }
    }
}
