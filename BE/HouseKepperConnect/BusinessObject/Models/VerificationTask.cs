using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class VerificationTask
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TaskID { get; set; }
        [ForeignKey("Account")]
        public int AccountID { get; set; }

        [ForeignKey("IDVerification")]
        public int VerifyID { get; set; }

        [Required]
        public DateTime AssignedDate { get; set; }

        public DateTime? CompletedDate { get; set; } // Ngày hoàn thành (nullable)

        [Required]
        public int Status { get; set; }

        [MaxLength(500)]
        public string? Notes { get; set; }

        public virtual Account Account { get; set; }
        public virtual IDVerification IDVerification { get; set; }
    }
}