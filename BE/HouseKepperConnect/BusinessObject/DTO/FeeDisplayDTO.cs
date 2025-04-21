using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class FeeDisplayDTO
    {
        public int FeeID { get; set; }

        [Range(0, 1)]
        public decimal Percent { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}