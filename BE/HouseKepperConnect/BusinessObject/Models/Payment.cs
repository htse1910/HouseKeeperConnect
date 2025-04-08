using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Payment
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PaymentID { get; set; }

        [Required]
        [ForeignKey("Job")]
        public int JobID { get; set; }

        [Required]
        [ForeignKey("Family")]
        public int FamilyID { get; set; }

        public decimal Amount { get; set; }
        public decimal Commission { get; set; }
        public DateTime PaymentDate { get; set; }
        public string Status { get; set; }

        public virtual Job Job { get; set; }
        public virtual Family Family { get; set; }
    }
}