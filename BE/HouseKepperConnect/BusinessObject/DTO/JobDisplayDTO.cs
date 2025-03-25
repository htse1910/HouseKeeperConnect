using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.DTO
{
    public class JobDisplayDTO
    {
        public int JobID { get; set; }

        public int FamilyID { get; set; }

        [Required, MaxLength(255)]
        public string JobName { get; set; }

        public int Status { get; set; }

        [Required]
        [StringLength(255)]
        public string Location { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Price { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Required]
        public bool IsOffered { get; set; }
        public int? HousekeeperID { get; set; }

        [Required]
        public List<int> ServiceIDs { get; set; }

        [Required]
        public List<int> SlotIDs { get; set; }

        [Required]
        public List<int> DayofWeek { get; set; }
    }
}
