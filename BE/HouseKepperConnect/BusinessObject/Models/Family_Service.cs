using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
