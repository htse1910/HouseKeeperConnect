using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.Models
{
    public class Chat
    {
        public int ChatID { get; set; }
        public int FormAccountID { get; set; }
        public int ToAccountID { get; set; }
        public string Content { get; set; }
        public DateTime SendAt { get; set; }
        public Account FromAccount { get; set; }
        public Account ToAccount { get; set; }
    }
}
