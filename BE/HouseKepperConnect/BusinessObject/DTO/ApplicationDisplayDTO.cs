namespace BusinessObject.DTO
{
    public class ApplicationDisplayDTO
    {
        public int ApplicationID { get; set; }
        public string? GoogleProfilePicture { get; set; }
        public string? LocalProfilePicture { get; set; }
        public string Nickname { get; set; }
        public int AccountID { get; set; }
        public int FamilyID { get; set; }
        public string FamilyName { get; set; }
        public int JobID { get; set; }
        public DateTime CreatedDate {get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public List<int> Services { get; set; }
        public decimal Rating { get; set; }
        public int Status { get; set; }
    }
}