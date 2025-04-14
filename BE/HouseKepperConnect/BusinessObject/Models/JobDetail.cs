using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class JobDetail
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int JobDetailID { get; set; }

        [Required]
        public int JobID { get; set; }

        [Required]
        [StringLength(255)]
        public string Location { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Price { get; set; }
        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal PricePerHour { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal HKPrice { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Required]
        public bool IsOffered { get; set; }

        public int? HousekeeperID { get; set; }

        public virtual Job Job { get; set; }
        public virtual Housekeeper Housekeeper { get; set; }
    }
}