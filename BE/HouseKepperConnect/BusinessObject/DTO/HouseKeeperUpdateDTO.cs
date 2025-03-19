using Microsoft.AspNetCore.Http;

namespace BusinessObject.DTO
{
    public class HouseKeeperUpdateDTO
    {
        public int AccountID { get; set; }

        public int? Rating { get; set; }
        public string Location { get; set; }

        public bool IsVerified { get; set; }

        public int JobCompleted { get; set; }

        public int JobsApplied { get; set; }

        public IFormFile FrontPhoto { get; set; }

        public IFormFile BackPhoto { get; set; }

        public IFormFile FacePhoto { get; set; }
    }
}