namespace BusinessObject.DTO
{
    public class HousekeeperPendingDTO
    {
        public int HousekeeperID { get; set; }
      
        public int VerifyID { get; set; }
        public string FrontPhoto { get; set; }
        public string BackPhoto { get; set; }
        public string FacePhoto { get; set; }
        public int Status { get; set; }
    }
}