using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Chat
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ChatID { get; set; }

        [ForeignKey("FromAccountID")]
        public int FromAccountID { get; set; }

        [ForeignKey("FromAccountID")]
        public int ToAccountID { get; set; }

        public string Content { get; set; }
        public DateTime SendAt { get; set; }
        public virtual Account FromAccount { get; set; }
        public virtual Account ToAccount { get; set; }
    }
}