namespace BusinessObject.DTO
{
    public class JobDisplayDTO
    {
        public int JobID { get; set; }

        public int FamilyID { get; set; }
        public string JobName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Status { get; set; }
        public int JobType { get; set; }
        public string DetailLocation { get; set; }
        public string Location { get; set; }
        public decimal Price { get; set; }
    }
}