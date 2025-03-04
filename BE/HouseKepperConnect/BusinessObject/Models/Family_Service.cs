using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Family_Service
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Family_ServiceID { get; set; }

        [Required]
        public int FamilyID { get; set; }

        [ForeignKey("Service")]
        public int ServiceID { get; set; }

        public virtual Service Service { get; set; }
    }
}