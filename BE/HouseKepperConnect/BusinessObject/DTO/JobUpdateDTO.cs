using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTOs
{
    public class JobUpdateDTO
    {
        public int JobID { get; set; }
        public string JobName { get; set; }
        public int AccountID { get; set; }

        // JobDetail fields
        public string Frequency { get; set; }
        public string Location { get; set; }
        public decimal Price { get; set; }
        public int ServiceID { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Description { get; set; }
        public int StartSlot { get; set; }
        public int EndSlot { get; set; }
    }
}
