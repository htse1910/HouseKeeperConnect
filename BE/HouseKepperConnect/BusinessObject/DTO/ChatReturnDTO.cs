using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.DTO
{
    public class ChatReturnDTO
    {
        public int FromAccountID { get; set; }

        public int ToAccountID { get; set; }

        public string Content { get; set; }
        public DateTime SendAt { get; set; }
    }
}
