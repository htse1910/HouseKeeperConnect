namespace BusinessObject.DTO
{
    public class IDVerificationDisplayDTO
    {
        public int VerifyID { get; set; }
        public string? RealName { get; set; }
        public int? IDNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public int Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}