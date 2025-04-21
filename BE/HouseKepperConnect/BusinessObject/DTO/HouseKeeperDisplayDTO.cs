using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class HouseKeeperDisplayDTO
    {
        public int HousekeeperID { get; set; }
        public int AccountID { get; set; }
        public string Name { get; set; }
        public int Gender { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string? Phone { get; set; }

        public int? WorkType { get; set; }

        public string LocalProfilePicture { get; set; }
        public string? GoogleProfilePicture { get; set; }

        [RegularExpression("^[0-9]*$", ErrorMessage = "Bank number must be numeric.")]
        public string? BankAccountNumber { get; set; }
        public string? BankAccountName { get; set; }

        public string? Introduction { get; set; }

        public int? VerifyID { get; set; }
        public string Address { get; set; }

        public string FrontPhoto { get; set; }

        public string BackPhoto { get; set; }

        public string FacePhoto { get; set; }
    }
}