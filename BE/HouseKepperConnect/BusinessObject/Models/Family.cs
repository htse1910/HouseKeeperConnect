using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Family
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FamilyID { get; set; }

        public int? JobListed { get; set; }
        public int? TotalApplicant { get; set; }
        public int AccountID { get; set; }

        public virtual Account Account { get; set; }
        public virtual IEnumerable<Rating> Ratings { get; set; }
    }
}