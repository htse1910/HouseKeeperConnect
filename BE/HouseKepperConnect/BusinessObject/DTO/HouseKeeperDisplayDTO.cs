using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class HouseKeeperDisplayDTO
    {
        public string Name { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string? Phone { get; set; }

        public byte[] LocalProfilePicture { get; set; }

        [RegularExpression("^[0-9]*$", ErrorMessage = "Bank number must be numeric.")]
        public string? BankAccountNumber { get; set; }

        public string? Introduction { get; set; }
        public string Address { get; set; }

        public byte[] FrontPhoto { get; set; }

        public byte[] BackPhoto { get; set; }

        public byte[] FacePhoto { get; set; }
    }
}