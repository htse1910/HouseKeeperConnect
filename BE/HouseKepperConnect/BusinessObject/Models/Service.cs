using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        public ServiceType ServiceType { get; set; }

        [MaxLength(255)]
        public string Description { get; set; }
    }
}
