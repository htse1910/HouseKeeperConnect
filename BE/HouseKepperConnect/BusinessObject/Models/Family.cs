using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Family
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string Nickname { get; set; }
        public int JobListed { get; set; }
        public int AccountID { get; set; }

        public virtual Account Account { get; set; }
    }
}