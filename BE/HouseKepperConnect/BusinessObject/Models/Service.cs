using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Service
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ServiceID { get; set; }

        [Required]
        [MaxLength(100)]
        public string ServiceName { get; set; }

        [Required]
        public decimal Price { get; set; }

        [ForeignKey("ServiceType")]
        public int ServiceTypeID { get; set; }

        [MaxLength(255)]
        public string Description { get; set; }

        public virtual ServiceType ServiceType { get; set; }
    }
}
