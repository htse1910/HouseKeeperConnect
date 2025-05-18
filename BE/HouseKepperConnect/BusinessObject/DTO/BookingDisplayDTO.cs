using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class BookingDisplayDTO
    {
        [Required]
        public int BookingID { get; set; }

        [Required]
        public int JobID { get; set; }
        [Required]
        public string JobName { get; set; }
        
        [Required]
        public decimal TotalPrice { get; set; }
        
        [Required]
        public decimal PricePerHour { get; set; }
        
        [Required]
        public string Description { get; set; }
        
        [Required]
        public string Location { get; set; }
        [Required]
        public string DetailLocation { get; set; }

        [Required]
        public int HousekeeperID { get; set; }

        [Required]
        public int FamilyID { get; set; }
        [Required]
        public string Familyname { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public int Status { get; set; }

        [Required]
        public List<int> ServiceIDs { get; set; }

        [Required]
        public List<int> SlotIDs { get; set; }

        [Required]
        public List<int> DayofWeek { get; set; }
    }
}