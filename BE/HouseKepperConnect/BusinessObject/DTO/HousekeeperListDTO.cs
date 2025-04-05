using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class HousekeeperListDTO
    {
        public int HousekeeperID { get; set; }
        public string? Nickname { get; set; }
        public string Address { get; set; }

        [Phone]
        public string? Phone { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        public int Gender { get; set; }
        public int? WorkType { get; set; }
        public decimal? Rating { get; set; }
        public string LocalProfilePicture { get; set; }
    }
}