namespace BusinessObject.DTO
{
    public class ApplicationDisplayDTO
    {
        public int ApplicationID { get; set; }
        public string? GoogleProfilePicture { get; set; }
        public string? LocalProfilePicture { get; set; }
        public int AccountID { get; set; }
        public int FamilyID { get; set; }
        public string FamilyName { get; set; }
        public string HKName { get; set; }
        public int JobID { get; set; }
        public string JobName { get; set; }
        public decimal Price { get; set; }
        public DateTime CreatedDate {get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public List<int> Services { get; set; }
        public decimal Rating { get; set; }
        public int ApplicationStatus { get; set; }
        public int JobStatus { get; set; }
    }
}