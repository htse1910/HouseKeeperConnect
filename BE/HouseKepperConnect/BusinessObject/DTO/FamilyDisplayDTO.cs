namespace BusinessObject.DTO
{
    public class FamilyDisplayDTO
    {
        public int Id { get; set; }
        public string Nickname { get; set; }
        public int JobListed { get; set; }
        public int AccountID { get; set; }
        public int? GenderID { get; set; }
        public string? Introduce { get; set; }
    }
}