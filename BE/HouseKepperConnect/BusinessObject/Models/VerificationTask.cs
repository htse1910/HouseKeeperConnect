using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.Models
{
    public class VerificationTask
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TaskID { get; set; }

        [ForeignKey("Staff")]
        public int StaffID { get; set; } 

        [ForeignKey("IDVerification")]
        public int VerifyID { get; set; } 

        [Required]
        public DateTime AssignedDate { get; set; }

        public DateTime? CompletedDate { get; set; } // Ngày hoàn thành (nullable)

        [Required]
        public int Status { get; set; }

        [MaxLength(500)]
        public string? Notes { get; set; } 

        public virtual Staff Staff { get; set; }
        public virtual IDVerification IDVerification { get; set; }
    }
}
